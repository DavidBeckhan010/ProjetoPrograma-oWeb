import initSqlJs, { type Database } from 'sql.js'

const STORAGE_KEY = 'conectserv_db'
let dbInstance: Database | null = null

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function save() {
  if (!dbInstance) return
  const data = dbInstance.export()
  const binary = new Uint8Array(data)
  const stored = Array.from(binary).map(b => String.fromCharCode(b)).join('')
  localStorage.setItem(STORAGE_KEY, stored)
}

function load(): Uint8Array | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  return new Uint8Array(stored.split('').map(c => c.charCodeAt(0)))
}

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance

  const SQL = await initSqlJs({
    locateFile: () => `/sql-wasm.wasm`,
  })

  const saved = load()
  dbInstance = saved ? new SQL.Database(saved) : new SQL.Database()

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'cliente'
    );
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      category TEXT DEFAULT '',
      provider_id INTEGER NOT NULL,
      FOREIGN KEY (provider_id) REFERENCES users(id)
    );
  `)

  save()
  return dbInstance
}

export async function createUser(name: string, email: string, password: string, role: string) {
  const db = await getDb()
  const existing = db.exec('SELECT id FROM users WHERE email = ?', [email])
  if (existing[0]?.values.length) return null
  const hash = await hashPassword(password)
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, role])
  save()
  const result = db.exec('SELECT id, name, email, role FROM users WHERE email = ?', [email])
  const row: unknown[] | undefined = result[0]?.values[0]
  if (!row) return null
  return { id: row[0] as number, name: row[1] as string, email: row[2] as string, role: row[3] as 'cliente' | 'prestador' }
}

export async function loginUser(email: string, password: string) {
  const db = await getDb()
  const hash = await hashPassword(password)
  const result = db.exec('SELECT id, name, email, role FROM users WHERE email = ? AND password = ?', [email, hash])
  const row: unknown[] | undefined = result[0]?.values[0]
  if (!row) return null
  return { id: row[0] as number, name: row[1] as string, email: row[2] as string, role: row[3] as 'cliente' | 'prestador' }
}

export async function listServices() {
  const db = await getDb()
  const result = db.exec(
    `SELECT s.id, s.name, s.description, s.price, s.category, s.provider_id, u.name as provider_name
     FROM services s
     JOIN users u ON u.id = s.provider_id
     ORDER BY s.id DESC`
  )
  return (result[0]?.values ?? []).map((row: unknown[]) => ({
    id: row[0] as number,
    name: row[1] as string,
    description: row[2] as string,
    price: row[3] as number,
    category: row[4] as string,
    provider_id: row[5] as number,
    provider_name: row[6] as string,
  }))
}

export async function listServicesByProvider(providerId: number) {
  const db = await getDb()
  const result = db.exec(
    `SELECT s.id, s.name, s.description, s.price, s.category, s.provider_id, u.name as provider_name
     FROM services s
     JOIN users u ON u.id = s.provider_id
     WHERE s.provider_id = ?
     ORDER BY s.id DESC`,
    [providerId]
  )
  return (result[0]?.values ?? []).map((row: unknown[]) => ({
    id: row[0] as number,
    name: row[1] as string,
    description: row[2] as string,
    price: row[3] as number,
    category: row[4] as string,
    provider_id: row[5] as number,
    provider_name: row[6] as string,
  }))
}

export async function getServiceById(id: number) {
  const services = await listServices()
  return services.find((s: { id: number }) => s.id === id) ?? null
}

export async function createService(name: string, description: string, price: number, category: string, providerId: number) {
  const db = await getDb()
  db.run('INSERT INTO services (name, description, price, category, provider_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, category, providerId])
  save()
  const result = db.exec('SELECT last_insert_rowid()')
  const newId = result[0]?.values[0]?.[0] as number
  return getServiceById(newId)
}

export async function deleteService(id: number, providerId: number) {
  const db = await getDb()
  const result = db.exec('SELECT id FROM services WHERE id = ? AND provider_id = ?', [id, providerId])
  if (!result[0]?.values.length) return false
  db.run('DELETE FROM services WHERE id = ?', [id])
  save()
  return true
}
