import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboardPage from './pages/UserDashboardPage'
import UserSettingsPage from './pages/UserSettingsPage'
import DashboardInsightsPage from './pages/DashboardInsightsPage'
import AdminSupportPage from './pages/AdminSupportPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

const routeAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLoginSuccess = (loginData) => {
    const tokenValue = loginData.access_token || loginData.token
    const rawRole = (loginData.role || loginData.user?.role || 'user').toString().toLowerCase()
    const normalizedRole = rawRole === 'admin' || rawRole === 'administrator' || rawRole === 'superadmin' || loginData.is_admin
      ? 'admin'
      : 'user'
    const userInfo = {
      id: loginData.user_id || loginData.user?.id,
      email: loginData.email || loginData.user?.email,
      role: normalizedRole,
      name: loginData.name || loginData.user?.name,
    }
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userInfo))
    setToken(tokenValue)
    setUser(userInfo)
    navigate('/dashboard', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    navigate('/')
  }

  const PageTransition = ({ children }) => (
    <motion.div
      className="page-motion-container"
      variants={routeAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <PageTransition><LoginPage onLoginSuccess={handleLoginSuccess} /></PageTransition>}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <PageTransition><RegisterPage /></PageTransition>}
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard/user"
            element={user ? <PageTransition><UserDashboardPage /></PageTransition> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/user/settings"
            element={user ? <PageTransition><UserSettingsPage /></PageTransition> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/user/insights"
            element={user ? <PageTransition><DashboardInsightsPage /></PageTransition> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/user/support"
            element={user ? <PageTransition><AdminSupportPage /></PageTransition> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/admin"
            element={user ? <PageTransition><AdminDashboardPage /></PageTransition> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '24px',
            padding: '18px 22px',
            color: '#111827',
            background: '#f8fafc',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)',
          },
          success: {
            iconTheme: { primary: '#ffffff', secondary: '#22c55e' },
          },
          error: {
            iconTheme: { primary: '#ffffff', secondary: '#ef4444' },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
    </div>
  )
}

export default App
