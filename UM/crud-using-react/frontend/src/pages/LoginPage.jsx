import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const fieldStatus = useMemo(
    () => ({
      email: emailRegex.test(formData.email),
      password: formData.password.length >= 8,
    }),
    [formData.email, formData.password]
  )

  const validate = () => {
    const nextErrors = {}
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!emailRegex.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      toast.error('❌ Please fix the highlighted fields.')
      return
    }
    setIsLoading(true)
    const toastId = toast.loading('Signing in...')
    try {
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password,
      })
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(response.data)
      } else {
        const { access_token, email, role, name, user_id } = response.data
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify({ id: user_id, email, role, name }))
        navigate('/dashboard')
      }
      toast.success('✅ Logged in successfully!', { id: toastId })
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setErrors({ form: message })
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-branding">
        <div className="auth-branding-content">
          <div className="brand-badge">
            <ShieldCheck className="brand-icon" />
            <span>User Management</span>
          </div>
          <h1>Welcome back to User Management</h1>
          <p>Manage your users with confidence in a secure, polished admin experience.</p>
          <div className="feature-list">
            {[
              'Secure JWT authentication',
              'Role-aware dashboards',
              'Realtime-ready user insights',
            ].map((item) => (
              <div key={item} className="feature-item">
                <CheckCircle2 className="feature-icon" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="auth-panel auth-form-panel fade-section visible">
        <div className="auth-header">
          <span className="section-label">Sign in</span>
          <h2>Sign in to your account</h2>
          <p className="section-subtitle">Enter your credentials to access your dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="alert-box" role="alert">
              <AlertCircle className="alert-icon" />
              {errors.form}
            </div>
          )}

          <div className="field-group">
            <label htmlFor="login-email" className="field-label">
              Email
            </label>
            <div className={`input-group ${errors.email ? 'invalid' : fieldStatus.email ? 'valid' : ''}`}>
              <Mail className="input-icon" />
              <input
                id="login-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
            </div>
            {errors.email && <p id="login-email-error" className="error-text">{errors.email}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="login-password" className="field-label">
              Password
            </label>
            <div className={`input-group ${errors.password ? 'invalid' : fieldStatus.password ? 'valid' : ''}`}>
              <Lock className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />
              <button
                type="button"
                className="visibility-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p id="login-password-error" className="error-text">{errors.password}</p>}
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => handleChange('remember', e.target.checked)}
              />
              Remember me
            </label>
            <Link to="#" className="link-secondary">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="primary-btn auth-submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
            <ArrowRight className="button-icon" />
          </button>

          <div className="form-footer">
            <p>
              Don’t have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
