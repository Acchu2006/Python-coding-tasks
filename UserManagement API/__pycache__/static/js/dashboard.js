// ==========================================================
// Logic for templates/dashboard.html
// ==========================================================

let claims = null; // { user_id, email, role, exp } decoded from JWT

document.addEventListener("DOMContentLoaded", async () => {
  claims = getCurrentUserClaims();

  if (!claims) {
    // No valid token, bounce back to login
    window.location.href = "index.html";
    return;
  }

  document.getElementById("who-role").textContent = claims.role;
  document.getElementById("logout-btn").addEventListener("click", logout);

  await loadMyProfile();

  if (claims.role === "admin") {
    document.getElementById("admin-section").hidden = false;
    await loadAllUsers();
  }

  document.getElementById("profile-form").addEventListener("submit", handleProfileSave);
});

function logout() {
  clearToken();
  window.location.href = "index.html";
}

// ---------------- My profile ----------------
async function loadMyProfile() {
  const errEl = document.getElementById("profile-error");
  errEl.hidden = true;
  try {
    const user = await apiRequest(`/users/${claims.user_id}`, { auth: true });
    document.getElementById("who-username").textContent = user.name;
    document.getElementById("profile-name").value = user.name;
    document.getElementById("profile-email").value = user.email;
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
  }
}

async function handleProfileSave(e) {
  e.preventDefault();
  const errEl = document.getElementById("profile-error");
  const okEl = document.getElementById("profile-success");
  errEl.hidden = true;
  okEl.hidden = true;

  const name = document.getElementById("profile-name").value.trim();
  const email = document.getElementById("profile-email").value.trim();

  try {
    await apiRequest("/users/me", {
      method: "PUT",
      auth: true,
      body: { name, email },
    });
    okEl.textContent = "Profile updated.";
    okEl.hidden = false;
    document.getElementById("who-username").textContent = name;
    if (claims.role === "admin") loadAllUsers(); // reflect name/email change in table too
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
  }
}

// ---------------- Admin: all users table ----------------
async function loadAllUsers() {
  const errEl = document.getElementById("users-error");
  errEl.hidden = true;
  try {
    const users = await apiRequest("/users", { auth: true });
    renderUsersTable(users);
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";

  for (const u of users) {
    const tr = document.createElement("tr");
    const isAdminRow = u.role === "admin";

    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="role-pill ${u.role}">${u.role}</span></td>
      <td class="row-actions"></td>
    `;

    const actionsCell = tr.querySelector(".row-actions");

    if (isAdminRow) {
      const note = document.createElement("span");
      note.className = "muted";
      note.textContent = u.id === claims.user_id ? "edit via profile above" : "admin (locked)";
      actionsCell.appendChild(note);
    } else {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-ghost btn-icon";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => openEditModal(u));
      actionsCell.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-ghost btn-icon";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => handleDeleteUser(u));
      actionsCell.appendChild(delBtn);
    }

    tbody.appendChild(tr);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------- Edit modal (admin editing a non-admin user) ----------------
const modalBackdrop = document.getElementById("modal-backdrop");
const editForm = document.getElementById("edit-user-form");

function openEditModal(user) {
  document.getElementById("modal-title").textContent = `Edit ${user.name}`;
  document.getElementById("edit-user-id").value = user.id;
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;
  document.getElementById("edit-role").value = user.role;
  document.getElementById("modal-error").hidden = true;
  modalBackdrop.hidden = false;
}

document.getElementById("modal-cancel").addEventListener("click", () => {
  modalBackdrop.hidden = true;
});
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) modalBackdrop.hidden = true;
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("modal-error");
  errEl.hidden = true;

  const id = document.getElementById("edit-user-id").value;
  const payload = {
    name: document.getElementById("edit-name").value.trim(),
    email: document.getElementById("edit-email").value.trim(),
    role: document.getElementById("edit-role").value,
  };

  try {
    await apiRequest(`/admin/users/${id}`, {
      method: "PUT",
      auth: true,
      body: payload,
    });
    modalBackdrop.hidden = true;
    loadAllUsers();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
  }
});

// ---------------- Delete ----------------
async function handleDeleteUser(user) {
  if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
  const errEl = document.getElementById("users-error");
  errEl.hidden = true;
  try {
    await apiRequest(`/users/${user.id}`, { method: "DELETE", auth: true });
    loadAllUsers();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
  }
}
