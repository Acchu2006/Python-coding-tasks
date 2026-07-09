// ==========================================================
// Shared API helper for both index.html (login/register) and
// dashboard.html. Matches the real backend routes exactly:
//   POST /register            { name, email, password, role }
//   POST /login                { email, password }
//   GET  /users                 (admin only)
//   GET  /users/{id}            (self or admin)
//   PUT  /users/me              { name?, email? }
//   PUT  /admin/users/{id}      { name?, email?, role? } (admin only)
//   DELETE /users/{id}          (admin only, cannot delete another admin)
// ==========================================================

const API_BASE = "http://127.0.0.1:8000";

// Auth uses a Bearer token (HTTPBearer on the backend), so we just attach
// "Authorization: Bearer <token>" manually - no OAuth2 form encoding needed.
async function apiRequest(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    /* some responses may have no body */
  }

  if (!res.ok) {
    const message = (data && data.detail) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ---------------- Token storage ----------------
// sessionStorage so it survives navigating between index.html and
// dashboard.html, but clears when the tab is closed.
function setToken(token) {
  sessionStorage.setItem("access_token", token);
}
function getToken() {
  return sessionStorage.getItem("access_token");
}
function clearToken() {
  sessionStorage.removeItem("access_token");
}

// The login response only contains { message, access_token, token_type, role }.
// user_id and email live inside the JWT payload itself, so we decode it
// client-side (no signature check needed here, just reading the claims).
function decodeToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function getCurrentUserClaims() {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
