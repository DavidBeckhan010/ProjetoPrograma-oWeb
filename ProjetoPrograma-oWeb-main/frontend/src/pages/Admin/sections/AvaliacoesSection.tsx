import styles from './Sections.module.css'

export default function AvaliacoesSection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionStatsRow}>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Média Geral</span><span className={styles.statCardValue}>⭐ —</span></div>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Total</span><span className={styles.statCardValue}>—</span></div>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Denunciadas</span><span className={styles.statCardValue}>0</span></div>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3 className={styles.tableCardTitle}>Avaliações</h3>
          <div className={styles.tableFilters}>
            <select className={styles.filterSelect}><option value="todas">Todas as notas</option></select>
            <select className={styles.filterSelect}><option value="todos">Todos os serviços</option></select>
          </div>
        </div>
        <div className={styles.profTable}>
          <div className={styles.profTableHeader}><span>Cliente</span><span>Serviço</span><span>Nota</span><span>Comentário</span><span>Data</span></div>
          <p className={styles.emptyText}>Nenhuma avaliação registrada.</p>
        </div>
      </div>
    </div>
  )
}
