import { registerUser, loginUser } from './api.js';

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('login-error');
        
        try {
            const data = await loginUser({
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            });
            
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data.user_id);
            
            window.location.href = 'dashboard.html';
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.hidden = false;
        }
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('register-error');
        
        try {
            await registerUser({
                name: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                role: document.getElementById('register-role').value
            });
            
            alert('Registration successful! Please login.');
            window.location.reload();
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.hidden = false;
        }
    });
}