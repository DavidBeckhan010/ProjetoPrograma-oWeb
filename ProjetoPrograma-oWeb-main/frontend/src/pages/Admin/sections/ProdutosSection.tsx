import type { Service } from '../../../types'
import styles from './Sections.module.css'

interface Props {
  services: Service[]
}

export default function ProdutosSection({ services }: Props) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3 className={styles.tableCardTitle}>Serviços Cadastrados</h3>
          <div className={styles.tableFilters}>
            <input className={styles.searchInput} type="text" placeholder="Buscar serviço..." />
            <select className={styles.filterSelect}>
              <option value="todas">Todas as categorias</option>
            </select>
          </div>
        </div>
        <div className={styles.prodGrid}>
          {services.length === 0 ? (
            <p className={styles.emptyText}>Nenhum serviço cadastrado.</p>
          ) : services.map((s) => (
            <div key={s.id} className={styles.prodCard}>
              <div className={styles.prodCardTop}>
                <div className={styles.prodAvatar}>{s.name.charAt(0).toUpperCase()}</div>
                <div className={styles.prodInfo}>
                  <span className={styles.prodName}>{s.name}</span>
                  <span className={styles.prodCategory}>{s.category}</span>
                </div>
              </div>
              <div className={styles.prodPrice}>R$ {s.price.toFixed(2)}</div>
              <div className={styles.prodActions}>
                <button className={styles.smallBtn}>Editar</button>
                <button className={`${styles.smallBtn} ${styles.smallBtnDanger}`}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
