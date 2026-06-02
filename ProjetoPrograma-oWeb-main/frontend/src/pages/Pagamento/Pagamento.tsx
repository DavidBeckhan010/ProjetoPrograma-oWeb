import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CreditCard, User, Calendar, Lock, ShieldCheck,
  LoaderCircle, Zap, ChevronDown, Shield, Wallet, FileText, Smartphone,
} from 'lucide-react'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Pagamento.module.css'

type PaymentMethod = 'cartao' | 'pix' | 'paypal' | 'boleto' | 'picpay'

const brands = [
  { id: 'visa', label: 'Visa', prefix: '4' },
  { id: 'mc', label: 'MC', prefix: '5' },
  { id: 'amex', label: 'Amex', prefix: '34' },
  { id: 'elo', label: 'Elo', prefix: '636368' },
]

const installments = [
  { value: '1', label: '1x de R$ 89,90 (sem juros)' },
  { value: '2', label: '2x de R$ 44,95 (sem juros)' },
  { value: '3', label: '3x de R$ 29,97 (sem juros)' },
]

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function detectBrand(number: string) {
  const clean = number.replace(/\s/g, '')
  for (const b of brands) {
    if (clean.startsWith(b.prefix)) return b.id
  }
  return null
}

const methodOptions: { id: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { id: 'cartao', label: 'Cartão', icon: CreditCard, desc: 'Crédito ou débito' },
  { id: 'pix', label: 'PIX', icon: Zap, desc: 'Pagamento instantâneo' },
  { id: 'picpay', label: 'PicPay', icon: Smartphone, desc: 'Carteira digital' },
  { id: 'paypal', label: 'PayPal', icon: Wallet, desc: 'Conta PayPal' },
  { id: 'boleto', label: 'Boleto', icon: FileText, desc: 'Boleto bancário' },
]

export default function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as Record<string, unknown> | null
  const [method, setMethod] = useState<PaymentMethod>('cartao')
  const [cardNumber, setCardNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit')
  const [installment, setInstallment] = useState('1')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const detectedBrand = detectBrand(cardNumber)

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
    setErrors(prev => ({ ...prev, card: false }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
    setExpiry(val)
    setErrors(prev => ({ ...prev, expiry: false }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
    setErrors(prev => ({ ...prev, cvv: false }))
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, boolean> = {}
    if (cardNumber.replace(/\s/g, '').length < 13) newErrors.card = true
    if (!name.trim()) newErrors.name = true
    if (expiry.length < 5) newErrors.expiry = true
    if (cvv.length < 3) newErrors.cvv = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    navigate('/pagamento-realizado', { state: { ...state, paymentMethod: 'Cartão' } })
  }, [cardNumber, name, expiry, cvv, navigate, state])

  const handleMethodAction = useCallback(() => {
    const target: Record<PaymentMethod, string> = {
      cartao: '',
      pix: '/pix',
      picpay: '/picpay',
      paypal: '/paypal',
      boleto: '/boleto',
    }
    const path = target[method]
    if (path) navigate(path, { state })
  }, [method, navigate, state])

  return (
    <div className={styles.page}>
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <div className={styles.bgCircle3} />
      <NavBar />
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Left — Form */}
          <div className={styles.leftCol}>
            <div className={styles.header}>
              <div className={styles.headerIcon}>
                <CreditCard size={20} />
              </div>
              <div>
                <h1 className={styles.headerTitle}>Dados de pagamento</h1>
                <p className={styles.headerSub}>Preencha os dados para finalizar sua compra com segurança.</p>
              </div>
            </div>

            {/* Method selector */}
            <div className={styles.methodGrid}>
              {methodOptions.map(m => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`${styles.methodCard} ${method === m.id ? styles.methodCardActive : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <Icon size={20} className={styles.methodIcon} />
                    <span className={styles.methodLabel}>{m.label}</span>
                    <span className={styles.methodDesc}>{m.desc}</span>
                  </button>
                )
              })}
            </div>

            {/* Card form — only for cartão */}
            {method === 'cartao' && (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label}>Número do cartão</label>
                  <div className={`${styles.inputWrapper} ${errors.card ? styles.inputError : ''}`}>
                    <CreditCard size={18} className={styles.inputIcon} />
                    <input
                      className={styles.input}
                      value={cardNumber}
                      onChange={handleCardChange}
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Nome do titular</label>
                  <div className={`${styles.inputWrapper} ${errors.name ? styles.inputError : ''}`}>
                    <User size={18} className={styles.inputIcon} />
                    <input
                      className={styles.input}
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: false })) }}
                      placeholder="Seu nome completo"
                      autoComplete="cc-name"
                    />
                  </div>
                </div>

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Data de expiração</label>
                    <div className={`${styles.inputWrapper} ${errors.expiry ? styles.inputError : ''}`}>
                      <Calendar size={18} className={styles.inputIcon} />
                      <input
                        className={styles.input}
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/AA"
                        autoComplete="cc-exp"
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>CVV</label>
                    <div className={`${styles.inputWrapper} ${errors.cvv ? styles.inputError : ''}`}>
                      <Lock size={18} className={styles.inputIcon} />
                      <input
                        className={styles.input}
                        value={cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Tipo de cartão</label>
                  <div className={styles.segmented}>
                    <button type="button" className={`${styles.segOption} ${cardType === 'credit' ? styles.segActive : ''}`} onClick={() => setCardType('credit')}>
                      <CreditCard size={15} /> Crédito
                    </button>
                    <button type="button" className={`${styles.segOption} ${cardType === 'debit' ? styles.segActive : ''}`} onClick={() => setCardType('debit')}>
                      <CreditCard size={15} /> Débito
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Parcelamento</label>
                  <div className={styles.selectWrapper}>
                    <select className={styles.select} value={installment} onChange={e => setInstallment(e.target.value)}>
                      {installments.map(inst => (
                        <option key={inst.value} value={inst.value}>{inst.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className={styles.selectIcon} />
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.submitBtn} type="submit" disabled={loading}>
                    {loading ? (
                      <><LoaderCircle size={18} className={styles.spinner} /> Processando...</>
                    ) : (
                      <><Shield size={18} /> PAGAR</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Other methods — info + action */}
            {method !== 'cartao' && (
              <div className={styles.otherMethodBox}>
                <div className={styles.otherMethodIcon}>
                  {method === 'pix' && <Zap size={28} />}
                  {method === 'picpay' && <Smartphone size={28} />}
                  {method === 'paypal' && <Wallet size={28} />}
                  {method === 'boleto' && <FileText size={28} />}
                </div>
                <h3 className={styles.otherMethodTitle}>
                  {method === 'pix' ? 'Pagamento via PIX' : method === 'picpay' ? 'Pagamento via PicPay' : method === 'paypal' ? 'Pagamento via PayPal' : 'Boleto Bancário'}
                </h3>
                <p className={styles.otherMethodDesc}>
                  {method === 'pix' && 'Pagamento instantâneo e seguro. O código PIX é gerado na hora.'}
                  {method === 'picpay' && 'Redirecionamento para o ambiente seguro do PicPay.'}
                  {method === 'paypal' && 'Redirecionamento para o ambiente seguro do PayPal.'}
                  {method === 'boleto' && 'Gere o boleto e pague em qualquer banco ou casa lotérica.'}
                </p>
                <button className={styles.otherMethodBtn} onClick={handleMethodAction}>
                  {method === 'boleto' ? 'Gerar Boleto' : `Pagar com ${methodOptions.find(m => m.id === method)?.label}`}
                </button>
              </div>
            )}

            {/* Security card */}
            <div className={styles.securityCard}>
              <ShieldCheck size={22} className={styles.securityIcon} />
              <div>
                <strong className={styles.securityTitle}>Pagamento 100% seguro</strong>
                <p className={styles.securityText}>
                  Seus dados estão protegidos com criptografia de ponta a ponta.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Card preview + summary */}
          <div className={styles.rightCol}>
            <div className={styles.cardPreview}>
              <div className={styles.cardShine} />
              <div className={styles.cardChip} />
              <span className={styles.cardNumber}>
                {cardNumber || '•••• •••• •••• ••••'}
              </span>
              <div className={styles.cardBottom}>
                <div>
                  <span className={styles.cardLabel}>Titular</span>
                  <span className={styles.cardValue}>{name || 'Seu nome'}</span>
                </div>
                <div>
                  <span className={styles.cardLabel}>Validade</span>
                  <span className={styles.cardValue}>{expiry || 'MM/AA'}</span>
                </div>
              </div>
            </div>

            <div className={styles.brandsRow}>
              {brands.map(b => (
                <span key={b.id} className={`${styles.brand} ${detectedBrand === b.id ? styles.brandActive : ''}`}>
                  {b.label}
                </span>
              ))}
            </div>

            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Resumo do Pagamento</h3>
              <div className={styles.summaryRow}>
                <span>Valor da compra</span>
                <span>R$ 89,90</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>R$ 89,90</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
