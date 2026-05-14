import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceById } from '@db/database'
import type { Service } from '../../types'
import NavBar from '../../components/NavBar/NavBar'
import styles from './VerDetalhes.module.css'

export default function VerDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Service | null>(null)

  useEffect(() => {
    if (id) getServiceById(Number(id)).then(setProduct)
  }, [id])

  if (!product) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.detailContainer}>
          <p className={styles.notFound}>Produto não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.detailContainer}>
        <div className={styles.imageSection}>
          <div className={styles.circle} />
        </div>
        <div className={styles.infoSection}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.provider}>Profissional: {product.provider_name}</p>
          <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
          <p className={styles.desc}>{product.description}</p>
          <div className={styles.btnRow}>
            <button
              className={`${styles.btn} ${styles.buyBtn}`}
              onClick={() => navigate('/pagamento', { state: { providerName: product.provider_name, serviceName: product.name } })}
            >
              Comprar
            </button>
            <button
              className={`${styles.btn} ${styles.contactBtn}`}
              onClick={() => navigate('/agenda')}
            >
              Solicitar Orçamento
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
