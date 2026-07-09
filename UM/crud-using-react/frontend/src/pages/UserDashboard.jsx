function UserDashboard({ profile, editData, setEditData, editMode, setEditMode, handleProfileUpdate, isBusy, message, handleLogout, token }) {
  if (!profile) {
    return (
      <main className="app-shell">
        <section className="panel state-card">
          <h2>Loading your account...</h2>
          <p className="hint">Preparing your personal dashboard with your details.</p>
          <div className="spinner" />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-card dashboard-hero">
        <div className="hero-badge">Personal dashboard</div>
        <h1>Welcome back, {profile.name}</h1>
        <p className="hero-copy">Review your account details, update your profile, and keep your user settings in one polished space.</p>
        <div className="status-row">
          <div className="status-pill">
            <span className="status-dot" />
            Account ready
          </div>
          <div className="mini-chip">{profile.role.toUpperCase()}</div>
        </div>
        <div className="stats-grid">
          <div className="metric-card">
            <span className="metric-label">Role</span>
            <strong>{profile.role}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Email</span>
            <strong>{profile.email}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Member since</span>
            <strong>{new Date(profile.created_at).toLocaleDateString()}</strong>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="section-header">
            <div>
              <h2>My profile</h2>
              <p>Your account information is shown here.</p>
            </div>
            <button type="button" className="ghost-btn" onClick={() => setEditMode((value) => !value)}>
              {editMode ? 'Cancel' : 'Edit profile'}
            </button>
          </div>

          {editMode ? (
            <form className="inline-form" onSubmit={handleProfileUpdate}>
              <input
                value={editData.name}
                onChange={(event) => setEditData({ ...editData, name: event.target.value })}
                placeholder="Name"
                required
              />
              <input
                value={editData.email}
                onChange={(event) => setEditData({ ...editData, email: event.target.value })}
                placeholder="Email"
                required
              />
              <button type="submit" className="primary-btn small-btn">
                {isBusy ? 'Saving...' : 'Save'}
              </button>
            </form>
          ) : (
            <div className="profile-card">
              <div>
                <strong>{profile.name}</strong>
                <p>{profile.email}</p>
              </div>
              <span className={`role-pill ${profile.role}`}>{profile.role}</span>
            </div>
          )}

          {message && <p className="message">{message}</p>}
        </div>

        <div className="panel panel-highlight">
          <h2>Account overview</h2>
          <div className="quick-info-list">
            <div className="quick-info-item">
              <strong>Name</strong>
              <span>{profile.name}</span>
            </div>
            <div className="quick-info-item">
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>
            <div className="quick-info-item">
              <strong>Role</strong>
              <span>{profile.role}</span>
            </div>
          </div>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
          {token ? <p className="hint">Signed in with a secure session.</p> : null}
        </div>
      </section>
    </main>
  )
}

export default UserDashboard
