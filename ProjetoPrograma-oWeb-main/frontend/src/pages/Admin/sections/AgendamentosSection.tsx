import type { AdminDashboard } from '../../../types'
import styles from './Sections.module.css'

interface Props {
  dashboard: AdminDashboard | null
}

export default function AgendamentosSection({ dashboard }: Props) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionStatsRow}>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Total</span><span className={styles.statCardValue}>{dashboard?.totalAppointments ?? 0}</span></div>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Confirmados</span><span className={styles.statCardValue}>—</span></div>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Pendentes</span><span className={styles.statCardValue}>—</span></div>
        <div className={styles.statCard}><span className={styles.statCardLabel}>Cancelados</span><span className={styles.statCardValue}>—</span></div>
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableCardHeader}>
          <h3 className={styles.tableCardTitle}>Calendário de Agendamentos</h3>
          <div className={styles.tableFilters}>
            <select className={styles.filterSelect}><option value="todos">Todos os prestadores</option></select>
            <select className={styles.filterSelect}><option value="todos">Todos os serviços</option></select>
          </div>
        </div>
        <div className={styles.calendarPlaceholder}>
          <div className={styles.calendarWeek}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <span key={d} className={styles.calWeekDay}>{d}</span>)}
          </div>
          <div className={styles.calendarGrid}>
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3
              return <div key={i} className={`${styles.calDay} ${day <= 0 || day > 31 ? styles.calDayEmpty : ''}`}>
                {day > 0 && day <= 31 ? day : ''}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
