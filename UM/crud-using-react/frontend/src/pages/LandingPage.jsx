import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function LandingPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [animatedCounts, setAnimatedCounts] = useState({ total_users: 0, admin_count: 0 })

  useEffect(() => {
    const items = document.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const animateNumber = (key, target) => {
      let start = 0
      const duration = 900
      const startTime = performance.now()

      const step = (time) => {
        const progress = Math.min((time - startTime) / duration, 1)
        setAnimatedCounts((prev) => ({
          ...prev,
          [key]: Math.round(progress * target),
        }))
        if (progress < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    }

    if (!isLoading && stats) {
      animateNumber('total_users', stats.total_users || 0)
      animateNumber('admin_count', stats.admin_count || 0)
    }
  }, [isLoading, stats])

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/api/stats')
        setStats(response.data)
      } catch (err) {
        setError('Unable to load live stats right now.')
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  const handleRegister = () => {
    navigate('/register')
    setMenuOpen(false)
  }

  const handleLogin = () => {
    navigate('/login')
    setMenuOpen(false)
  }

  const statCards = isLoading ? (
    <div className="mockup-grid skeleton-grid">
      {[1, 2, 3].map((item) => (
        <div key={item} className="mockup-card skeleton-card" />
      ))}
    </div>
  ) : (
    <div className="mockup-grid">
      <div className="mockup-card">
        <strong>{animatedCounts.total_users}</strong>
        <span>Users</span>
      </div>
      <div className="mockup-card">
        <strong>{stats?.uptime}</strong>
        <span>Uptime</span>
      </div>
      <div className="mockup-card">
        <strong>{animatedCounts.admin_count}</strong>
        <span>Admins</span>
      </div>
    </div>
  )

  return (
    <main className="landing-page">
      <header className="landing-header fade-section">
        <div className="brand">
          <span className="brand-mark">KM</span>
          <div>
            <strong>KMedTech</strong>
            <span>Full-stack user management</span>
          </div>
        </div>

        <nav className={`landing-nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <button type="button" className="nav-link" onClick={handleRegister}>
            Get Started
          </button>
          <button type="button" className="nav-link" onClick={handleLogin}>
            View Demo
          </button>
          <a className="nav-link" href="#features">
            Features
          </a>
          <a className="nav-link" href="#tech-stack">
            Tech
          </a>
        </nav>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <section className="hero-section fade-section">
        <div className="hero-copy-block">
          <span className="hero-tag">Built for teams, trusted by developers</span>
          <h1>Manage Users with Confidence</h1>
          <p>
            A production-ready CRUD system with JWT authentication, role-based access, and real-time-ready UI built with React
            and FastAPI.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-cta" onClick={handleRegister} aria-label="Get started free">
              Get Started Free
            </button>
            <button type="button" className="secondary-cta" onClick={handleLogin} aria-label="View demo page">
              View Demo
            </button>
          </div>

          <div className="trust-badges">
            <span>Open Source</span>
            <span>TypeScript Ready</span>
            <span>MySQL Powered</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-mockup" aria-label="Dashboard preview">
            <div className="mockup-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="mockup-panel">
              <div className="mockup-header">
                <div className="mockup-chip" />
                <div className="mockup-status">Active users</div>
              </div>
              {statCards}
              <div className="mockup-table">
                <div className="mockup-row header">
                  <span>Name</span>
                  <span>Role</span>
                  <span>Joined</span>
                </div>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="mockup-row loading-row skeleton-row" />
                  ))
                ) : stats?.recent_users?.length ? (
                  stats.recent_users.map((user, index) => (
                    <div
                      key={user.id}
                      className="mockup-row reveal-item"
                      style={{ animationDelay: `${index * 50 + 120}ms` }}
                    >
                      <span>{user.name}</span>
                      <span>
                        <span className={`pill ${user.role === 'admin' ? 'admin' : 'user'}`}>{user.role}</span>
                      </span>
                      <span>{user.joined_date}</span>
                    </div>
                  ))
                ) : (
                  <div className="mockup-row loading-row">
                    <span>No users registered yet. Be the first!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section fade-section">
        <div className="section-header">
          <div>
            <span className="section-label">Core features</span>
            <h2>Everything your team needs to manage user systems securely.</h2>
          </div>
          <p>Fast, secure, and intuitive features designed for production-ready user management.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card" tabIndex="0" aria-label="Lightning fast user experience">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Built with Vite and FastAPI for sub-second load times and responsive workflows.</p>
          </article>
          <article className="feature-card" tabIndex="0" aria-label="Enterprise-grade security">
            <div className="feature-icon">🔐</div>
            <h3>Enterprise Security</h3>
            <p>JWT tokens, bcrypt hashing, and role-based permissions keep access safe and auditable.</p>
          </article>
          <article className="feature-card" tabIndex="0" aria-label="Full CRUD operations">
            <div className="feature-icon">📊</div>
            <h3>Full CRUD Operations</h3>
            <p>Create, read, update, and delete users with an intuitive interface and clear workflows.</p>
          </article>
        </div>
      </section>

      <section className="steps-section fade-section">
        <div className="step-row">
          <div className="step-text">
            <span className="step-badge">1</span>
            <h3>Register Account</h3>
            <p>Sign up quickly and choose a secure password with email-based authentication.</p>
          </div>
          <div className="step-visual">
            <div className="step-box">Registration form</div>
          </div>
        </div>

        <div className="step-row reverse">
          <div className="step-visual">
            <div className="step-box">Role selection</div>
          </div>
          <div className="step-text">
            <span className="step-badge">2</span>
            <h3>Choose Role</h3>
            <p>Select admin or user access to control what each account can see and manage.</p>
          </div>
        </div>

        <div className="step-row">
          <div className="step-text">
            <span className="step-badge">3</span>
            <h3>Access Dashboard</h3>
            <p>Open a role-based dashboard built for clarity and quick decision-making.</p>
          </div>
          <div className="step-visual">
            <div className="step-box">Dashboard overview</div>
          </div>
        </div>

        <div className="code-preview">
          <div className="code-header">
            <span>API</span>
            <span>users</span>
          </div>
          <pre aria-label="Code sample showing the API endpoint">
            <code>{`GET /api/users
Authorization: Bearer <token>

POST /api/register
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "password": "••••••••",
  "role": "admin"
}`}</code>
          </pre>
        </div>
      </section>

      <section id="tech-stack" className="tech-section fade-section">
        <div className="section-header">
          <span className="section-label">Powered by Modern Technologies</span>
          <h2>Built with a modern full-stack toolkit.</h2>
        </div>

        <div className="tech-grid" role="list">
          {['React', 'FastAPI', 'MySQL', 'Tailwind CSS', 'JWT', 'Python'].map((tech) => (
            <div key={tech} className="tech-chip" tabIndex="0" role="listitem">
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section id="live-preview" className="live-preview-section fade-section">
        <div className="preview-copy">
          <span className="section-label">See it in action</span>
          <h2>Live dashboard preview</h2>
          <p>Explore an interface built for managing users, roles, and secure sessions in one polished workspace.</p>
          <button type="button" className="play-card" aria-label="Play demo video">
            <span />
            View preview
          </button>
        </div>

        <div className="preview-frame" aria-label="Live preview of the dashboard">
          <div className="preview-toolbar">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="preview-panel">
            <div className="preview-header">
              <div />
              <div className="toggle-pill">Dark mode</div>
            </div>
            <div className="preview-screen">
              <div className="preview-card">Dashboard interface</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer fade-section">
        <div>
          <p>Built with ❤️ by KMedTech</p>
          <p>© 2024</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub Repo</a>
          <a href="#">Documentation</a>
          <a href="#">API Docs</a>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage
