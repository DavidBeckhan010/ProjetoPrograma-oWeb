import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import styles from './PagamentoRealizado.module.css'

export default function PagamentoRealizado() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { providerName?: string; serviceName?: string } | null

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.center}>
        <div className={styles.icon}>
          <span className={styles.checkmark}>✓</span>
        </div>
        <h2 className={styles.title}>Pagamento Realizado</h2>
        <p className={styles.sub}>Seu pagamento foi confirmado com sucesso!</p>
        {state?.providerName && (
          <button className={styles.chatBtn} onClick={() => navigate('/chat', { state: { providerName: state.providerName } })}>
            Falar com {state.providerName}
          </button>
        )}
        <button className={styles.btn} onClick={() => navigate('/hub')}>VOLTAR AO INÍCIO</button>
      </div>
    </div>
  )
}
