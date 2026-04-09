// client/src/services/auth.js
const API_BASE = process.env.REACT_APP_API_URL || '';

async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = payload.error || payload.message || res.statusText || 'Login failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  if (payload.token) {
    try { localStorage.setItem('token', payload.token); } catch (e) {}
  }
  return payload;
}

async function userRegister(email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = payload.error || payload.message || res.statusText || 'Registration failed';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload;
}

function getToken() {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
}

function logout() {
  try { localStorage.removeItem('token'); } catch (e) {}
}

export { adminLogin, userRegister, getToken, logout };
