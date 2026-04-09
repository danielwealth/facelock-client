// client/src/services/auth.js
const API_BASE = process.env.REACT_APP_API_URL || '';

/**
 * Safely write a token to localStorage
 */
function setToken(token) {
  try {
    if (token) localStorage.setItem('token', token);
  } catch (e) {
    // ignore storage errors (private mode, quota, etc.)
  }
}

/**
 * Safely read token from localStorage
 */
function getToken() {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
}

/**
 * Remove token from localStorage
 */
function clearToken() {
  try {
    localStorage.removeItem('token');
  } catch (e) {
    // ignore
  }
}

/**
 * Build Authorization headers when token exists
 */
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Admin login
 * On success stores token if returned by server and returns payload.
 */
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

  if (payload.token) setToken(payload.token);
  return payload;
}

/**
 * User registration
 */
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

/**
 * User login (non-admin)
 * Stores token if returned by server and returns payload.
 */
async function userLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
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

  if (payload.token) setToken(payload.token);
  return payload;
}

/**
 * Logout: attempt server logout then clear local token
 */
async function logout() {
  try {
    // best-effort server logout (cookies); ignore network errors
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  } catch {
    // ignore
  } finally {
    clearToken();
  }
}

/**
 * Convenience: return headers merged with auth when needed
 */
function getAuthHeaders(additional = {}) {
  return { 'Content-Type': 'application/json', ...authHeaders(), ...additional };
}

export {
  adminLogin,
  userRegister,
  userLogin,
  getToken,
  setToken,
  clearToken,
  logout,
  getAuthHeaders,
};
