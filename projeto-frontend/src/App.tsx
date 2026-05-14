import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login/Login'
import Hub from './pages/Hub/Hub'
import Produtos from './pages/Produtos/Produtos'
import VerDetalhes from './pages/VerDetalhes/VerDetalhes'
import Chat from './pages/Chat/Chat'
import Agenda from './pages/Agenda/Agenda'
import PIX from './pages/PIX/PIX'
import Pagamento from './pages/Pagamento/Pagamento'
import PagamentoRealizado from './pages/PagamentoRealizado/PagamentoRealizado'
import QuemSomos from './pages/QuemSomos/QuemSomos'
import CadastroServico from './pages/CadastroServico/CadastroServico'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id" element={<VerDetalhes />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/pix" element={<PIX />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pagamento-realizado" element={<PagamentoRealizado />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/cadastrar-servico" element={<CadastroServico />} />
      </Routes>
    </AuthProvider>
  )
}
