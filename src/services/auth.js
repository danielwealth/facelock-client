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

  // expected payload: { token, user, role, ... }
  if (payload.token) {
    try { localStorage.setItem('token', payload.token); } catch (e) { /* ignore storage errors */ }
  }
  return payload;
}
// client/src/services/auth.js (append)
async function userLogin(email, password) {
  return adminLogin(email, password); // reuse same logic if backend uses same endpoint
}


function getToken() {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
}

function logout() {
  try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
  // optionally call server logout endpoint if you have one
  // fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(()=>{});
}

export { adminLogin, userLogin, getToken, logout };
