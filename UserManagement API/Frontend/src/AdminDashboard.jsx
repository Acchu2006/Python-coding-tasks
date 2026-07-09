import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, getMyProfile, updateUser } from './services/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', position: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', role: 'user', position: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
      return;
    }

    if (role !== 'admin') {
      navigate('/user/dashboard');
      return;
    }

    loadUsers();
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

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setUpdatedUser({
      name: user.name,
      email: user.email,
      role: user.role,
      position: user.position || '',
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setUpdatedUser({ name: '', email: '', role: 'user', position: '' });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, updatedUser);
      loadUsers();
      cancelEdit();
      alert('User updated successfully');
    } catch (error) {
      alert('Update failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-page admin-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-indigo px-4">
        <span className="navbar-brand">Admin Dashboard</span>
        <div className="ms-auto d-flex align-items-center gap-3 text-white">
          <div>
            <div className="small opacity-75">Signed in as</div>
            <strong>{profile.name}</strong>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </nav>

      <main className="container mt-5">
        <section className="mb-4 profile-card p-4 rounded-4 shadow-sm bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4>Admin Info</h4>
              <p className="text-muted">Manage users and review account details.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="profile-box p-3 rounded-4 bg-indigo text-white">
                <h5>{profile.name}</h5>
                <p className="mb-1">{profile.email}</p>
                <p>{profile.position}</p>
              </div>
            </div>
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-3">
                <div className="info-chip">Role: ADMIN</div>
                <div className="info-chip">Users: {users.length}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">User Management</h4>
              <small className="text-muted">Edit any account or remove user profiles.</small>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.position || '-'}</td>
                    <td>
                      <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(user)}>
                        Edit
                      </button>
                      {user.role !== 'admin' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingUser && (
            <div className="mt-4 user-edit-card p-4 rounded-4 bg-light">
              <h5>Edit: {editingUser.name}</h5>
              <form onSubmit={saveUser} className="row g-3 mt-2">
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={updatedUser.name}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Position</label>
                  <input
                    className="form-control"
                    value={updatedUser.position}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, position: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={updatedUser.role}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-12 d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Save changes</button>
                  <button className="btn btn-outline-secondary" type="button" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
