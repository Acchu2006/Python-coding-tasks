function AdminDashboard({ profile, users, isBusy, message, handleLogout, handleRoleChange, handleDeleteUser, token }) {
  if (!profile) {
    return (
      <main className="app-shell">
        <section className="panel state-card">
          <h2>Loading admin workspace...</h2>
          <p className="hint">Preparing your administration view and user list.</p>
          <div className="spinner" />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-card dashboard-hero">
        <div className="hero-badge">Admin workspace</div>
        <h1>Administrator overview</h1>
        <p className="hero-copy">Manage all users, monitor account roles, and control access from a structured admin interface.</p>
        <div className="status-row">
          <div className="status-pill">
            <span className="status-dot" />
            Monitoring accounts
          </div>
          <div className="mini-chip">{profile.role.toUpperCase()}</div>
        </div>
        <div className="stats-grid">
          <div className="metric-card">
            <span className="metric-label">Total users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Admin count</span>
            <strong>{users.filter((user) => user.role === 'admin').length}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Your account</span>
            <strong>{profile.email}</strong>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="panel">
          <div className="section-header">
            <div>
              <h2>Your profile</h2>
              <p>Administrator access details.</p>
            </div>
          </div>
          <div className="profile-card">
            <div>
              <strong>{profile.name}</strong>
              <p>{profile.email}</p>
            </div>
            <span className="role-pill admin">{profile.role}</span>
          </div>
        </div>

        <div className="panel panel-highlight">
          <h2>Control center</h2>
          <div className="quick-info-list">
            <div className="quick-info-item">
              <strong>Admin account</strong>
              <span>{profile.name} has full access to the system.</span>
            </div>
            <div className="quick-info-item">
              <strong>Registered users</strong>
              <span>{users.length} profiles available in the workspace.</span>
            </div>
          </div>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
          {token ? <p className="hint">Secure admin session active.</p> : null}
        </div>
      </section>

      <section className="panel users-panel">
        <div className="section-header">
          <div>
            <h2>All registered users</h2>
            <p>Manage roles and review user access.</p>
          </div>
        </div>

        {isBusy ? (
          <div className="state-card compact">
            <div className="spinner" />
            <p className="hint">Loading user records...</p>
          </div>
        ) : (
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} className="user-list-item">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <div className="user-actions">
                  <select value={user.role} onChange={(event) => handleRoleChange(user.id, event.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="button" className="ghost-btn" onClick={() => handleDeleteUser(user.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  )
}

export default AdminDashboard
