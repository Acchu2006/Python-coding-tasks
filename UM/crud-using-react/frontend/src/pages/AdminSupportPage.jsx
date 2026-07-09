import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function AdminSupportPage() {
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero-panel support-hero">
        <div>
          <span className="section-label">Admin support</span>
          <h1>Get help when you need it</h1>
          <p className="dashboard-subtitle">
            Find contact details, support guidelines, and a quick summary of how to escalate issues to your administrator.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard/user" className="secondary-cta">
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="panel-glow">
        <div className="section-header">
          <div>
            <span className="mini-badge">Support contacts</span>
            <h2>Who can help</h2>
          </div>
        </div>

        <div className="quick-info-list">
          <div className="quick-info-item">
            <strong>Primary admin</strong>
            <span>{storedUser?.email || 'your email'}@example.com</span>
          </div>
          <div className="quick-info-item">
            <strong>Support hours</strong>
            <span>Weekdays, 9:00 AM - 6:00 PM</span>
          </div>
          <div className="quick-info-item">
            <strong>Response time</strong>
            <span>Most requests are answered within 2 business hours.</span>
          </div>
        </div>

        <div className="section-header" style={{ marginTop: '1.75rem' }}>
          <div>
            <span className="mini-badge">Support tips</span>
            <h2>What to include</h2>
          </div>
        </div>

        <div className="feature-strip">
          <span>Describe the issue clearly</span>
          <span>Include relevant screenshots or errors</span>
          <span>Share your user ID for faster help</span>
        </div>
      </section>
    </main>
  )
}

export default AdminSupportPage
