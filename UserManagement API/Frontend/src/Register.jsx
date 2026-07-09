import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user', position: 'Team Member'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        <div className="auth-header bg-cyan text-white">
          <h3 className="mb-0">Create your account</h3>
          <p className="small opacity-75">Register as a user or admin with role-based access.</p>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" 
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" 
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" 
                value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Position</label>
              <input type="text" name="position" className="form-control"
                value={formData.position} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" 
                value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <small className="text-muted d-block">
                Admins have full access to manage users.
              </small>
            </div>
            <button type="submit" className="btn btn-cyan w-100 py-2">Register</button>
          </form>
          <p className="mt-4 text-center text-muted">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;