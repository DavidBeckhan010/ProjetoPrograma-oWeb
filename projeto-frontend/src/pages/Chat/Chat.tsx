import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Chat.module.css'

interface Message {
  id: number
  text: string
  isSender: boolean
}

const INITIAL: Message[] = [
  { id: 1, text: 'Olá! Em que posso ajudar?', isSender: false },
  { id: 2, text: 'Gostaria de saber mais sobre o serviço.', isSender: true },
  { id: 3, text: 'Claro! Pode me perguntar o que precisar.', isSender: false },
  { id: 4, text: 'Qual o prazo médio de entrega?', isSender: true },
  { id: 5, text: 'Em média 3 dias úteis.', isSender: false },
  { id: 6, text: 'Perfeito, obrigado!', isSender: true },
  { id: 7, text: 'Disponha!', isSender: false },
]

export default function Chat() {
  const location = useLocation()
  const state = location.state as { providerName?: string } | null
  const providerName = state?.providerName

  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const nextId = useRef(8)

  const handleSend = () => {
    if (!input.trim()) return
    const msg: Message = { id: nextId.current++, text: input, isSender: true }
    setMessages((prev) => [...prev, msg])
    setInput('')
  }

  if (!providerName) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Nenhuma conversa ativa.</p>
          <p className={styles.emptySub}>O chat é liberado após a confirmação do pagamento.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <span className={styles.providerName}>{providerName}</span>
        </div>
        <div className={styles.messagesArea}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.row} ${msg.isSender ? styles.senderRow : styles.receiverRow}`}
            >
              <div className={`${styles.bubble} ${msg.isSender ? styles.sent : styles.received}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.inputArea}>
          <input
            className={styles.inputField}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendBtn} onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
