import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listServices } from '@db/database'
import type { Service } from '../../types'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Hub.module.css'

const banners = [
  { id: 1, title: 'Encontre Profissionais de Confiança', subtitle: 'Diversas categorias para atender você', gradient: 'linear-gradient(135deg, #085DFA, #5C95FF)' },
  { id: 2, title: 'Solicite um Orçamento Grátis', subtitle: 'Receba propostas em minutos', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 3, title: 'Profissionais Qualificados', subtitle: 'Avaliados por outros clientes', gradient: 'linear-gradient(135deg, #015F39, #00a86b)' },
]

export default function Hub() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [featured, setFeatured] = useState<Service[]>([])

  useEffect(() => {
    listServices().then(all => setFeatured(all.slice(0, 4)))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.page}>
      <NavBar />
      <div className={styles.container}>

        <section className={styles.carouselSection}>
          <div className={styles.carousel}>
            <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
              {banners.map(b => (
                <div key={b.id} className={styles.slide} style={{ background: b.gradient }}>
                  <h3 className={styles.slideTitle}>{b.title}</h3>
                  <p className={styles.slideSub}>{b.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.dots}>
            {banners.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </section>

        <section className={styles.placeholderSection}>
          <div className={styles.placeholderRow}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.placeholderCircle} />
            ))}
          </div>
        </section>

        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Serviços em Destaque</h2>
          {featured.length === 0 ? (
            <p className={styles.empty}>Nenhum serviço cadastrado ainda.</p>
          ) : (
            <div className={styles.featGrid}>
              {featured.map(p => (
                <div key={p.id} className={styles.featCard} onClick={() => navigate(`/produtos/${p.id}`)}>
                  <div className={styles.featCircle} />
                  <p className={styles.featName}>{p.name}</p>
                  <p className={styles.featPrice}>R$ {p.price.toFixed(2)}</p>
                  <p className={styles.featProvider}>{p.provider_name}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
