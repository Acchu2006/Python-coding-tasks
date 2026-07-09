import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function UserSettingsPage() {
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero-panel settings-hero">
        <div>
          <span className="section-label">Account settings</span>
          <h1>Manage your profile and security</h1>
          <p className="dashboard-subtitle">
            Keep your account details up to date, review login options, and adjust your security preferences for a safer experience.
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
            <span className="mini-badge">Profile snapshot</span>
            <h2>Your information</h2>
          </div>
        </div>

        <div className="profile-card">
          <div>
            <p className="field-label">Name</p>
            <strong>{storedUser?.name || 'Unknown'}</strong>
          </div>
          <div>
            <p className="field-label">Email</p>
            <strong>{storedUser?.email || 'Unknown'}</strong>
          </div>
          <div>
            <p className="field-label">Role</p>
            <strong>{storedUser?.role || 'User'}</strong>
          </div>
          <div>
            <p className="field-label">Account status</p>
            <strong>Active</strong>
          </div>
        </div>

        <div className="section-header">
          <div>
            <span className="mini-badge">Update options</span>
            <h2>What you can do</h2>
          </div>
        </div>

        <div className="feature-strip">
          <span>Change your password securely</span>
          <span>Enable email notifications</span>
          <span>Review privacy preferences</span>
        </div>

        <div className="dashboard-subtitle" style={{ marginTop: '1.5rem' }}>
          Once your backend supports account management, these options will become interactive and let you update personal settings instantly.
        </div>
      </section>
    </main>
  )
}

export default UserSettingsPage
