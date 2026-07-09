import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api'

function AdminDashboardPage() {
  const storedUser = useMemo(() => {
    const item = localStorage.getItem('user')
    return item ? JSON.parse(item) : null
  }, [])

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (storedUser?.role === 'admin') {
      loadUsers()
    }
  }, [storedUser])

  const loadUsers = async () => {
    setError('')
    setIsLoading(true)
    const toastId = toast.loading('Fetching users...')
    try {
      const response = await api.get('/users')
      setUsers(response.data)
      toast.success('✅ Loaded users successfully', { id: toastId })
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to load users.'
      setError(message)
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  if (!storedUser) {
    return <Navigate to="/login" replace />
  }

  if (storedUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="dashboard-page admin-dashboard-page">
      <section className="dashboard-hero-panel admin-hero">
        <div>
          <span className="section-label">Admin dashboard</span>
          <h1>Admin workspace for {storedUser.name}</h1>
          <p className="dashboard-subtitle">
            Monitor users, manage roles, and take action with confidence. This page is built for admins who operate the system.
          </p>
        </div>

        <div className="hero-stats">
          <article className="status-card">
            <span className="status-title">Users loaded</span>
            <strong className="status-value">{users.length}</strong>
            <p className="status-note">Currently visible from the backend.</p>
          </article>
          <article className="status-card">
            <span className="status-title">Admin</span>
            <strong className="status-value">{storedUser.name}</strong>
            <p className="status-note">Your administrator identity.</p>
          </article>
          <article className="status-card">
            <span className="status-title">Refresh</span>
            <strong className="status-value">{isLoading ? 'Loading…' : 'Ready'}</strong>
            <p className="status-note">Pull fresh user data anytime.</p>
          </article>
        </div>
      </section>

      {error && <div className="alert-box">{error}</div>}

      <section className="admin-grid panel-glow">
        <div className="admin-summary-cards">
          <article className="status-card large-card">
            <span className="status-title">Admin</span>
            <strong className="status-value">{storedUser.name}</strong>
            <p className="status-note">Logged in as system administrator.</p>
          </article>
          <article className="status-card large-card">
            <span className="status-title">Email</span>
            <strong className="status-value">{storedUser.email}</strong>
            <p className="status-note">Contact account on file.</p>
          </article>
          <article className="status-card large-card">
            <span className="status-title">Role</span>
            <strong className="status-value">Admin</strong>
            <p className="status-note">Full platform permissions.</p>
          </article>
        </div>

        <div className="table-panel panel-glow">
          <div className="section-header">
            <div>
              <span className="mini-badge">User directory</span>
              <h2>All users</h2>
            </div>
            <button type="button" className="secondary-btn" onClick={loadUsers}>
              Refresh data
            </button>
          </div>

          <div className="table-wrapper">
            {isLoading ? (
              <div className="table-loader">
                <div className="spinner" />
                Loading users…
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboardPage
