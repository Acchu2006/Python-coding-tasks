import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', agree: false })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const fieldStatus = useMemo(
    () => ({
      name: /^[A-Za-z\s]+$/.test(formData.name) && formData.name.trim().length >= 2,
      email: emailRegex.test(formData.email),
      password: formData.password.length >= 8,
    }),
    [formData.name, formData.email, formData.password]
  )

  const strength = useMemo(() => {
    if (formData.password.length >= 12) return 'strong'
    if (formData.password.length >= 8) return 'medium'
    return 'weak'
  }, [formData.password])

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) {
      nextErrors.name = 'Full name is required.'
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      nextErrors.name = 'Name can only include letters and spaces.'
    }
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
    if (!formData.agree) {
      nextErrors.agree = 'You must accept terms and conditions.'
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
    const toastId = toast.loading('Creating account...')
    try {
      await api.post('/register', formData)
      setSuccess('Account created successfully. Redirecting to login…')
      toast.success('✅ User registered successfully!', { id: toastId })
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed. Please try again.'
      setErrors({ form: message })
      toast.error(`❌ ${message}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-branding auth-branding-right">
        <div className="auth-branding-content">
          <div className="brand-badge">
            <ShieldCheck className="brand-icon" />
            <span>Create account</span>
          </div>
          <h1>Get started with User Management</h1>
          <p>Build your secure user management workspace with role controls and fast onboarding.</p>
          <div className="feature-list">
            {[
              'Secure signup flow',
              'Admin and user roles',
              'Complete account control',
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
          <span className="section-label">Create account</span>
          <h2>Create your User Management account</h2>
          <p className="section-subtitle">Register to start managing users and access the admin dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="alert-box" role="alert">
              <AlertCircle className="alert-icon" />
              {errors.form}
            </div>
          )}
          {success && <div className="success-box">{success}</div>}

          <div className="field-group">
            <label htmlFor="register-name" className="field-label">
              Full Name
            </label>
            <div className={`input-group ${errors.name ? 'invalid' : fieldStatus.name ? 'valid' : ''}`}>
              <User className="input-icon" />
              <input
                id="register-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'register-name-error' : undefined}
              />
            </div>
            {errors.name && <p id="register-name-error" className="error-text">{errors.name}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="register-email" className="field-label">
              Email
            </label>
            <div className={`input-group ${errors.email ? 'invalid' : fieldStatus.email ? 'valid' : ''}`}>
              <Mail className="input-icon" />
              <input
                id="register-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
              />
            </div>
            {errors.email && <p id="register-email-error" className="error-text">{errors.email}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="register-password" className="field-label">
              Password
            </label>
            <div className={`input-group ${errors.password ? 'invalid' : fieldStatus.password ? 'valid' : ''}`}>
              <Lock className="input-icon" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Create a password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
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
            {errors.password && <p id="register-password-error" className="error-text">{errors.password}</p>}
            <div className="password-strength">
              <div className={`strength-bar ${strength}`} />
              <span className="strength-label">{strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong'}</span>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="register-role" className="field-label">
              Role
            </label>
            <div className={`input-group select-group ${errors.role ? 'invalid' : ''}`}>
              <ShieldCheck className="input-icon" />
              <select
                id="register-role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                aria-invalid={!!errors.role}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row terms-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.agree}
                onChange={(e) => handleChange('agree', e.target.checked)}
              />
              I agree to the <a href="#" className="link-secondary">Terms & Conditions</a>
            </label>
            {errors.agree && <p className="error-text">{errors.agree}</p>}
          </div>

          <button type="submit" className="primary-btn auth-submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create Account'}
            <ArrowRight className="button-icon" />
          </button>

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage
