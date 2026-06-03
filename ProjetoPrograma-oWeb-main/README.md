# ConectServ

## Pré-requisitos

- Node.js instalado

---

## Backend

### 1. Entrar na pasta do backend

```bash
cd backend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo .env

Dentro da pasta `backend`, crie um arquivo chamado `.env` com o conteúdo abaixo:

```env
PORT=3333
DATABASE_URL=./database.sqlite
JWT_SECRET=conectserv_secret_dev_123
JWT_EXPIRES_IN=1d
```

### 4. Gerar as migrations do banco

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Rodando backend

```bash
npm run dev
```

O backend roda em `http://localhost:3333`.

---

## Frontend

### 1. Entrar na pasta do frontend

```bash
cd frontend
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Rodando frontend

```bash
npm run dev
```

O frontend roda em `http://localhost:5173` e se comunica com o backend em `http://localhost:3333`.
