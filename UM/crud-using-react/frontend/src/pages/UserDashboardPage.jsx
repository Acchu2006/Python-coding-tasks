import { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

function UserDashboardPage() {
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])

  if (!storedUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="dashboard-page user-dashboard-page">
      <section className="dashboard-hero-panel">
        <div>
          <span className="section-label">Welcome</span>
          <h1>Good to see you, {storedUser.name}</h1>
          <p className="dashboard-subtitle">
            This is your personal workspace. Review your profile details, account role, and quick actions for a smooth experience.
          </p>
        </div>

        <div className="hero-stats">
          <article className="status-card">
            <span className="status-title">Your role</span>
            <strong className="status-value">{storedUser.role}</strong>
            <p className="status-note">Access level applies throughout the app.</p>
          </article>
          <article className="status-card">
            <span className="status-title">Signed in as</span>
            <strong className="status-value">{storedUser.email}</strong>
            <p className="status-note">Secure session is active.</p>
          </article>
          <article className="status-card">
            <span className="status-title">Profile</span>
            <strong className="status-value">User</strong>
            <p className="status-note">Your account is ready for daily tasks.</p>
          </article>
        </div>
      </section>

      <section className="panel-glow">
        <div className="quick-head">
          <div>
            <span className="mini-badge">Profile summary</span>
            <h2>Account details</h2>
          </div>
          <span className="role-pill user">{storedUser.role}</span>
        </div>

        <div className="profile-card">
          <div>
            <p className="field-label">Name</p>
            <strong>{storedUser.name}</strong>
          </div>
          <div>
            <p className="field-label">Email</p>
            <strong>{storedUser.email}</strong>
          </div>
          <div>
            <p className="field-label">User ID</p>
            <strong>{storedUser.id || 'N/A'}</strong>
          </div>
          <div>
            <p className="field-label">Role</p>
            <strong>{storedUser.role}</strong>
          </div>
        </div>

        <div className="section-header">
          <div>
            <span className="mini-badge">Next steps</span>
            <h3 className="mini-title">Keep your account secure</h3>
          </div>
        </div>
        <div className="feature-strip">
          <a href="/dashboard/user/settings" className="feature-link">Review account settings</a>
          <a href="/dashboard/user/insights" className="feature-link">Check dashboard insights</a>
          <a href="/dashboard/user/support" className="feature-link">Reach out to admin support</a>
        </div>
      </section>

      <section className="panel-glow">
        <div className="section-header">
          <div>
            <span className="mini-badge">User tips</span>
            <h2>Make the most of your account</h2>
          </div>
        </div>
        <div className="quick-info-list">
          <div className="quick-info-item">
            <strong>Keep your email updated</strong>
            <span>Use your current email to receive security and notification updates.</span>
          </div>
          <div className="quick-info-item">
            <strong>Check your role settings</strong>
            <span>If you need admin access, request it from your system administrator.</span>
          </div>
          <div className="quick-info-item">
            <strong>Stay productive</strong>
            <span>Use this page as a central place for your user account details.</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default UserDashboardPage
