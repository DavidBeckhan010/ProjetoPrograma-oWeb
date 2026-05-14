import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './NavBar.module.css'

const navItems = [
  { id: 'hub', label: 'Início', route: '/hub' },
  { id: 'produtos', label: 'Produtos', route: '/produtos' },
  { id: 'agenda', label: 'Agenda', route: '/agenda' },
  { id: 'quem-somos', label: 'Sobre', route: '/quem-somos' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isPrestador, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <button className={styles.logo} onClick={() => navigate('/hub')}>
          ConectServ
        </button>
        <div className={styles.links}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.route
            return (
              <button
                key={item.id}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                onClick={() => navigate(item.route)}
              >
                {item.label}
              </button>
            )
          })}
          {isPrestador && (
            <button
              className={`${styles.link} ${location.pathname === '/cadastrar-servico' ? styles.linkActive : ''}`}
              onClick={() => navigate('/cadastrar-servico')}
            >
              Cadastrar Serviço
            </button>
          )}
          {user ? (
            <button className={styles.link} onClick={handleLogout}>
              Sair
            </button>
          ) : (
            <button className={styles.link} onClick={() => navigate('/')}>
              Entrar
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
