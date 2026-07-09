import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api'

function DashboardPage() {
  const navigate = useNavigate()
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])
  const [user, setUser] = useState(storedUser)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [editData, setEditData] = useState({ name: '', email: '', role: 'user' })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(storedUser)
    if (storedUser.role === 'admin') {
      loadUsers()
    }
  }, [storedUser, navigate])

  const loadUsers = async () => {
    setError('')
    setIsLoading(true)
    const toastId = toast.loading('Loading users...')
    try {
      const response = await api.get('/users')
      setUsers(response.data)
      toast.success('✅ User list loaded', { id: toastId })
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load users.'
      setError(message)
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (candidate) => {
    setEditUser(candidate)
    setEditData({ name: candidate.name, email: candidate.email, role: candidate.role })
    setShowModal(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!editUser) return
    setIsLoading(true)
    setError('')
    const toastId = toast.loading('Saving changes...')
    try {
      await api.put(`/users/${editUser.id}`, editData)
      setShowModal(false)
      loadUsers()
      toast.success('✅ User updated successfully', { id: toastId })
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to update user.'
      setError(message)
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setIsLoading(true)
    setError('')
    const toastId = toast.loading('Deleting user...')
    try {
      await api.delete(`/users/${userId}`)
      loadUsers()
      toast.success('✅ User deleted successfully', { id: toastId })
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to delete user.'
      setError(message)
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const adminCount = users.filter((item) => item.role === 'admin').length
  const standardCount = users.length - adminCount

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero-panel">
        <div>
          <span className="section-label">Dashboard</span>
          <h1>Welcome back, {user.name}</h1>
          <p className="dashboard-subtitle">
            {user.role === 'admin'
              ? 'Admin controls and metrics to keep your user system secure and efficient.'
              : 'Your personal dashboard for activity, account status, and quick access.'}
          </p>
        </div>

        <div className="hero-stats">
          <article className="status-card">
            <span className="status-title">Current role</span>
            <strong className="status-value">{user.role}</strong>
            <p className="status-note">Active access level for this session.</p>
          </article>

          <article className="status-card">
            <span className="status-title">Account type</span>
            <strong className="status-value">{user.role === 'admin' ? 'Admin dashboard' : 'User dashboard'}</strong>
            <p className="status-note">Personalized experience based on your permissions.</p>
          </article>

          <article className="status-card">
            <span className="status-title">Live status</span>
            <strong className="status-value status-live">Connected</strong>
            <p className="status-note">Your session is active and ready.</p>
          </article>
        </div>
      </section>

      {error && <div className="alert-box">{error}</div>}

      {user.role === 'user' ? (
        <section className="dashboard-grid user-grid">
          <div className="profile-panel panel-glow">
            <div className="quick-head">
              <div>
                <span className="mini-badge">User profile</span>
                <h2>Hello, {user.name}</h2>
                <p className="hint">Your account is configured to access the user workspace with secure credentials.</p>
              </div>
              <span className="role-pill user">{user.role}</span>
            </div>

            <div className="profile-card">
              <div>
                <p className="field-label">Name</p>
                <strong>{user.name}</strong>
              </div>
              <div>
                <p className="field-label">Email</p>
                <strong>{user.email}</strong>
              </div>
              <div>
                <p className="field-label">Status</p>
                <strong>Active</strong>
              </div>
            </div>

            <div className="section-header">
              <div>
                <h3 className="mini-title">Quick actions</h3>
                <p>Fast links for your daily workflow.</p>
              </div>
            </div>

            <div className="feature-strip">
              <span>View profile</span>
              <span>Change password</span>
              <span>Request support</span>
            </div>
          </div>

          <div className="insight-panel panel-glow">
            <div className="section-header">
              <div>
                <span className="mini-badge">Overview</span>
                <h2>Recent activity</h2>
              </div>
            </div>
            <div className="quick-info-list">
              <div className="quick-info-item">
                <strong>Profile complete</strong>
                <span>Your account is secured with 2FA-ready settings.</span>
              </div>
              <div className="quick-info-item">
                <strong>Next step</strong>
                <span>Explore the dashboard to manage your account details.</span>
              </div>
              <div className="quick-info-item">
                <strong>Support</strong>
                <span>Need help? Reach out to the admin team from the app.</span>
              </div>
            </div>
            <button type="button" className="primary-btn">View account details</button>
          </div>
        </section>
      ) : (
        <section className="dashboard-grid admin-grid">
          <div className="admin-main">
            <div className="admin-summary-cards">
              <article className="status-card large-card">
                <span className="status-title">Total users</span>
                <strong className="status-value">{users.length}</strong>
                <p className="status-note">All registered accounts currently loaded.</p>
              </article>
              <article className="status-card large-card">
                <span className="status-title">Admins</span>
                <strong className="status-value">{adminCount}</strong>
                <p className="status-note">Users with full administrative access.</p>
              </article>
              <article className="status-card large-card">
                <span className="status-title">Standard users</span>
                <strong className="status-value">{standardCount}</strong>
                <p className="status-note">Accounts with regular user permissions.</p>
              </article>
            </div>

            <div className="table-panel panel-glow">
              <div className="section-header">
                <div>
                  <span className="mini-badge">Admin management</span>
                  <h2>User directory</h2>
                </div>
                <button type="button" className="secondary-btn" onClick={loadUsers}>
                  Refresh list
                </button>
              </div>

              <div className="table-wrapper">
                {isLoading ? (
                  <div className="table-loader">Loading user list…</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>
                            <span className={`role-pill ${item.role}`}>{item.role}</span>
                          </td>
                          <td>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="action-buttons">
                            <button type="button" className="ghost-btn" onClick={() => openEditModal(item)}>
                              Edit
                            </button>
                            <button type="button" className="secondary-btn" onClick={() => handleDelete(item.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <aside className="admin-sidebar panel-glow">
            <div className="section-header">
              <div>
                <span className="mini-badge">Command center</span>
                <h2>Admin tools</h2>
              </div>
            </div>
            <div className="quick-info-list">
              <div className="quick-info-item">
                <strong>Audit logs</strong>
                <span>Review recent updates and user changes in one place.</span>
              </div>
              <div className="quick-info-item">
                <strong>System health</strong>
                <span>Watch for active sessions and admin sign-ins.</span>
              </div>
              <div className="quick-info-item">
                <strong>Team actions</strong>
                <span>Approve roles, edit accounts, and dispatch support tasks.</span>
              </div>
            </div>
            <button type="button" className="primary-btn">Create new user</button>
          </aside>
        </section>
      )}

      {showModal && editUser ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h2>Edit user</h2>
            <form className="auth-form" onSubmit={handleSave}>
              <label>
                Name
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Role
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default DashboardPage
