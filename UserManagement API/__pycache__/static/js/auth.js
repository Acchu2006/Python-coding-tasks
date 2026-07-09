// ==========================================================
// Logic for templates/index.html (login + register)
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  // If already logged in, skip straight to the dashboard.
  if (getToken()) {
    window.location.href = "dashboard.html";
    return;
  }

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginError = document.getElementById("login-error");
  const registerError = document.getElementById("register-error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError(loginError);

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      const data = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.access_token);
      window.location.href = "dashboard.html";
    } catch (err) {
      showError(loginError, err.message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError(registerError);

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;

    try {
      await apiRequest("/register", {
        method: "POST",
        body: { name, email, password, role },
      });
      // Auto-login right after successful registration
      const data = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.access_token);
      window.location.href = "dashboard.html";
    } catch (err) {
      showError(registerError, err.message);
    }
  });
});

function showError(el, message) {
  el.textContent = message;
  el.hidden = false;
}
function hideError(el) {
  el.hidden = true;
  el.textContent = "";
}
