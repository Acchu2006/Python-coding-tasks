import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function DashboardInsightsPage() {
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero-panel insights-hero">
        <div>
          <span className="section-label">Dashboard insights</span>
          <h1>Your activity at a glance</h1>
          <p className="dashboard-subtitle">
            Get a quick summary of recent login behavior, account changes, and usage patterns that help you stay informed.
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
            <span className="mini-badge">This week</span>
            <h2>Recent session summary</h2>
          </div>
        </div>

        <div className="feature-strip">
          <span>Last login: Today at 09:32</span>
          <span>Active pages viewed: 7</span>
          <span>Security checks passed</span>
        </div>

        <div className="section-header" style={{ marginTop: '1.75rem' }}>
          <div>
            <span className="mini-badge">Usage insights</span>
            <h2>Key takeaways</h2>
          </div>
        </div>

        <div className="quick-info-list">
          <div className="quick-info-item">
            <strong>Regular access</strong>
            <span>{storedUser?.name || 'You'} have logged in consistently and are using your personal dashboard effectively.</span>
          </div>
          <div className="quick-info-item">
            <strong>Account readiness</strong>
            <span>Your account is fully active and ready for any opportunity to manage data or collaborate with your team.</span>
          </div>
          <div className="quick-info-item">
            <strong>Security note</strong>
            <span>For stronger protection, consider updating your password and enabling email alerts when available.</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardInsightsPage
