import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createService } from '@db/database'
import { useAuth } from '../../contexts/AuthContext'
import NavBar from '../../components/NavBar/NavBar'
import styles from './CadastroServico.module.css'

export default function CadastroServico() {
  const navigate = useNavigate()
  const { user, isPrestador } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  if (!user || !isPrestador) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.container}>
          <p className={styles.error}>Apenas prestadores de serviço podem cadastrar serviços.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !price) {
      setError('Nome e preço são obrigatórios')
      return
    }
    await createService(name, description, Number(price), category, user.id)
    navigate('/produtos')
  }

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Cadastrar Serviço</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Nome do Serviço *</label>
            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Consultoria Financeira" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva seu serviço..." rows={4} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Preço (R$) *</label>
            <input className={styles.input} type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="89,90" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Categoria</label>
            <input className={styles.input} value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Consultoria, Aulas, Reparos" />
          </div>
          <button className={styles.submitBtn} type="submit">Cadastrar Serviço</button>
        </form>
      </div>
    </div>
  )
}
