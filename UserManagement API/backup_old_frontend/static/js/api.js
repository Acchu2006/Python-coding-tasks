const API_BASE = 'http://localhost:8000';

function getToken() {
    return localStorage.getItem('token');
}

async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Request failed');
    }

    return response.json();
}

export async function registerUser(data) {
    return apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function loginUser(data) {
    return apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function getAllUsers() {
    return apiRequest('/users');
}

export async function updateUser(id, data) {
    return apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export async function deleteUser(id) {
    return apiRequest(`/users/${id}`, {
        method: 'DELETE'
    });
}

export async function updateMyProfile(data) {
    return apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

export async function getUserById(id) {
    return apiRequest(`/users/${id}`);
}