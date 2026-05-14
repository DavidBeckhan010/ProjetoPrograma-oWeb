import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Pagamento.module.css'

export default function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { providerName?: string; serviceName?: string } | null
  const [cardNumber, setCardNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/pagamento-realizado', { state })
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.card}>
        <h2 className={styles.formTitle}>DADOS DE PAGAMENTO</h2>
        <div className={styles.formGrid}>
          <div className={styles.leftCol}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>NÚMERO DO CARTÃO</span>
              <input className={styles.fieldInput} value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>NOME DO TITULAR</span>
              <input className={styles.fieldInput} value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>DATA DE EXPIRAÇÃO</span>
                <input className={styles.fieldInput} value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/AA" />
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>CVV</span>
                <input className={styles.fieldInput} value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" />
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>TIPO DE CARTÃO</span>
              <div style={{display:'flex', gap:'var(--space-md)', alignItems:'center'}}>
                <span>Crédito</span><span>Débito</span>
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>PARCELAMENTO</span>
              <select className={styles.selectField}>
                <option>1x de R$ 89,90</option>
                <option>2x de R$ 44,95</option>
                <option>3x de R$ 29,97</option>
              </select>
            </div>
          </div>
          <div className={styles.rightCol}>
            <div className={styles.cardPreview}>
              <div className={styles.cardPreviewChip} />
              <span className={styles.cardPreviewNumber}>**** **** **** 0000</span>
              <span className={styles.cardPreviewName}>NOME DO TITULAR</span>
              <span className={styles.cardPreviewExpiry}>MM/AA</span>
            </div>
            <div className={styles.brands}>
              <span className={styles.brand}>VISA</span>
              <span className={styles.brand}>MC</span>
              <span className={styles.brand}>AMEX</span>
              <span className={styles.brand}>ELO</span>
            </div>
          </div>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.submitBtn} type="submit" onClick={handleSubmit}>PAGAR</button>
          <button className={styles.pixBtn} type="button" onClick={() => navigate('/pix', { state })}>Pagar com PIX</button>
        </div>
        <div className={styles.bottomInfo}>
          <div>
            <p className={styles.bottomText}>Pagamento 100% seguro</p>
            <p className={styles.bottomSubtext}>Seus dados estão protegidos</p>
          </div>
          <span className={styles.bottomTotal}>Total: R$ 89,90</span>
        </div>
      </div>
    </div>
  )
}
