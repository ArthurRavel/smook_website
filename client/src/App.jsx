import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Carte from './pages/Carte'
import Admin from './pages/Admin'
import Login from './pages/Login'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname])
  return null
}

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
          <ScrollToTop />
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
