import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import styles from './PIX.module.css'

export default function PIX() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { providerName?: string; serviceName?: string } | null
  const chavePix = '00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000'

  const copiarChave = () => {
    navigator.clipboard.writeText(chavePix)
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.card}>
        <h2 className={styles.title}>Pagamento via PIX</h2>
        <div className={styles.qrCode} />
        <div className={styles.arrow} />
        <span className={styles.pixLabel}>Chave PIX</span>
        <div className={styles.pixRow}>
          <input className={styles.pixInput} value={chavePix} readOnly />
          <button className={styles.copyBtn} onClick={copiarChave}>Copiar</button>
        </div>
        <p className={styles.hint}>Escaneie ou copie a chave PIX para pagar</p>
        <p className={styles.footer}>Após a confirmação do pagamento, seus serviços serão agendados automaticamente.</p>
        <button className={styles.payBtn} onClick={() => navigate('/pagamento-realizado', { state })}>Já paguei</button>
      </div>
    </div>
  )
}
