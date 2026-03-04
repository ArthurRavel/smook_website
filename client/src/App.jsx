import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Carte from './pages/Carte'
import Admin from './pages/Admin'
import Login from './pages/Login'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('smookToken')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/carte" element={<Carte />} />
            </Routes>
          </main>
          <Footer />
        </>
      } />
    </Routes>
  )
}

export default App
