import { getAllUsers, updateUser, deleteUser, updateMyProfile, getUserById } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('who-username').textContent = `User #${userId}`;
    document.getElementById('who-role').textContent = userRole.toUpperCase();
    document.getElementById('who-role').className = `badge bg-${userRole === 'admin' ? 'danger' : 'primary'}`;
    
    if (userRole === 'admin') {
        document.getElementById('admin-section').hidden = false;
        await loadUsers();
    }
    
    await loadUserProfile();
    
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

async function loadUsers() {
    try {
        const users = await getAllUsers();
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}">${user.role}</span></td>
                <td>
                    ${user.role !== 'admin' ? `
                        <button class="btn btn-sm btn-primary me-2" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.role}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUserById(${user.id})">Delete</button>
                    ` : '<span class="text-muted">-</span>'}
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('users-error').textContent = error.message;
        document.getElementById('users-error').hidden = false;
    }
}

async function loadUserProfile() {
    try {
        const userId = localStorage.getItem('userId');
        const user = await getUserById(userId);
        
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await updateMyProfile({
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value
            });
            const successEl = document.getElementById('profile-success');
            successEl.textContent = 'Profile updated successfully!';
            successEl.hidden = false;
            setTimeout(() => successEl.hidden = true, 3000);
        } catch (error) {
            document.getElementById('profile-error').textContent = error.message;
            document.getElementById('profile-error').hidden = false;
        }
    });
}

window.editUser = function(id, name, email, role) {
    document.getElementById('edit-user-id').value = id;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-role').value = role;
    document.getElementById('modal-backdrop').hidden = false;
};

const editForm = document.getElementById('edit-user-form');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-user-id').value;
        try {
            await updateUser(id, {
                name: document.getElementById('edit-name').value,
                email: document.getElementById('edit-email').value,
                role: document.getElementById('edit-role').value
            });
            document.getElementById('modal-backdrop').hidden = true;
            await loadUsers();
        } catch (error) {
            document.getElementById('modal-error').textContent = error.message;
            document.getElementById('modal-error').hidden = false;
        }
    });
}

document.getElementById('modal-cancel')?.addEventListener('click', () => {
    document.getElementById('modal-backdrop').hidden = true;
});

window.deleteUserById = async function(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteUser(id);
            await loadUsers();
        } catch (error) {
            alert('Failed to delete: ' + error.message);
        }
    }
};