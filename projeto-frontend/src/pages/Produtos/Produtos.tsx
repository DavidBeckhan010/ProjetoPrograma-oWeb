import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listServices, deleteService } from '@db/database'
import { useAuth } from '../../contexts/AuthContext'
import type { Service } from '../../types'
import NavBar from '../../components/NavBar/NavBar'
import SearchBar from '../../components/SearchBar/SearchBar'
import styles from './Produtos.module.css'

export default function Produtos() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    listServices().then(setServices)
  }, [])

  const handleDelete = async (id: number) => {
    if (!user) return
    const ok = await deleteService(id, user.id)
    if (ok) {
      setServices(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.searchSection}>
        <SearchBar />
      </div>
      {services.length === 0 ? (
        <p className={styles.empty}>Nenhum serviço cadastrado ainda.</p>
      ) : (
        <div className={styles.grid}>
          {services.map(item => (
            <div key={item.id} className={styles.card} onClick={() => navigate(`/produtos/${item.id}`)}>
              <div className={styles.circle} />
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.provider}>por {item.provider_name}</p>
              <p className={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
              <div className={styles.btnRow}>
                <button className={styles.buyBtn} onClick={(e) => { e.stopPropagation(); navigate(`/produtos/${item.id}`) }}>
                  Ver Detalhes
                </button>
                {user?.id === item.provider_id && (
                  <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}>
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
