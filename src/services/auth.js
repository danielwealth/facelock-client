// client/src/services/auth.js
import api from './api';
import { getExpiry } from '../utils/jwt';

const API_BASE = process.env.REACT_APP_API_URL || '';
const REFRESH_BUFFER_MS = 60 * 1000; // refresh 60s before expiry

function setTokenLocal(token) {
  try { localStorage.setItem('token', token); } catch {}
}

function getTokenLocal() {
  try { return localStorage.getItem('token'); } catch { return null; }
}

function clearTokenLocal() {
  try { localStorage.removeItem('token'); } catch {}
}

let refreshTimer = null;
let onAuthChange = null; // callback to notify UI

function scheduleRefresh(token) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  const expiry = getExpiry(token);
  if (!expiry) return;
  const now = Date.now();
  const msUntilRefresh = Math.max(1000, expiry - now - REFRESH_BUFFER_MS);
  refreshTimer = setTimeout(async () => {
    try {
      await refreshToken();
    } catch {
      // refresh failed; let request interceptor or UI handle logout
      if (typeof onAuthChange === 'function') onAuthChange({ loggedOut: true });
    }
  }, msUntilRefresh);
}

export function setAuthChangeHandler(fn) { onAuthChange = fn; }

export async function userLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(payload.error || payload.message || 'Login failed');
    err.status = res.status;
    throw err;
  }
  if (payload.token) {
    setTokenLocal(payload.token);
    scheduleRefresh(payload.token);
    if (typeof onAuthChange === 'function') onAuthChange({ loggedIn: true, token: payload.token });
  }
  return payload;
}

export async function refreshToken() {
  // call backend refresh endpoint
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(payload.error || payload.message || 'Refresh failed');
    err.status = res.status;
    throw err;
  }
  if (payload.token) {
    setTokenLocal(payload.token);
    scheduleRefresh(payload.token);
    if (typeof onAuthChange === 'function') onAuthChange({ refreshed: true, token: payload.token });
  }
  return payload;
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
  } finally {
    clearTokenLocal();
    if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null; }
    if (typeof onAuthChange === 'function') onAuthChange({ loggedOut: true });
  }
}

export function getToken() { return getTokenLocal(); }
export function setToken(token) { setTokenLocal(token); scheduleRefresh(token); }

// client/src/services/auth.js

// alias named export
export async function adminLogin(email, password) {
  return userLogin(email, password);
}
// near other exports in client/src/services/auth.js
export async function userRegister(email, password) {
  // If registration is same as login, call userLogin or implement registration logic here.
  return userRegister(email, password);
}


// ...existing exports...

export default {
  userLogin,
  userRegister,
  adminLogin,          // add here
  refreshToken,
  logout,
  getToken,
  setToken,
  setAuthChangeHandler,
};

