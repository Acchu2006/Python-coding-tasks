import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from './services/api';

function UserDashboard() {
  const [profile, setProfile] = useState({ name: '', email: '', position: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
      return;
    }

    if (role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const response = await getMyProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile(profile);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage('Update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-page user-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-cyan px-4">
        <span className="navbar-brand">User Dashboard</span>
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm ms-auto">
          Logout
        </button>
      </nav>

      <main className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-panel p-4 rounded-4 shadow-sm bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4>Welcome, {profile.name}</h4>
                  <p className="text-muted">Manage only your personal account details.</p>
                </div>
              </div>

              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Position</label>
                  <input
                    className="form-control"
                    name="position"
                    value={profile.position || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn btn-cyan px-4">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
