import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user: propUser, onLogout }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(propUser)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasShadow, setHasShadow] = useState(false)

  useEffect(() => {
    if (propUser) {
      setUser(propUser)
      return
    }
    const storedUser = localStorage.getItem('user')
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }, [propUser])

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      return
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <header className={`navbar ${hasShadow ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-brand">
        <span className="logo-mark">UH</span>
        <div>
          <Link to="/" className="navbar-title">
            User Management
          </Link>
          <p>Secure user management</p>
        </div>
      </div>

      <button className="navbar-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {user ? (
          <>
            <span className="navbar-greeting">Hi, {user.name}</span>
            <button type="button" className="navbar-button secondary-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button ghost-btn">
              Login
            </Link>
            <Link to="/register" className="navbar-button primary-btn">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
