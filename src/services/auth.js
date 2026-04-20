// client/src/services/auth.js
import api from './api';
import { getExpiry } from '../utils/jwt';

const API_BASE = process.env.REACT_APP_API_URI || process.env.REACT_APP_API_URL || '';
const REFRESH_BUFFER_MS = 60 * 1000; // refresh 60s before expiry

function setTokenLocal(token) {
  try {
    localStorage.setItem('token', token);
  } catch (err) {
    console.warn('Failed to set token in localStorage', err);
  }
}

function getTokenLocal() {
  try {
    return localStorage.getItem('token');
  } catch (err) {
    console.warn('Failed to get token from localStorage', err);
    return null;
  }
}

function clearTokenLocal() {
  try {
    localStorage.removeItem('token');
  } catch (err) {
    console.warn('Failed to clear token from localStorage', err);
  }
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
    } catch (err) {
      console.error('Token refresh failed', err);
      if (typeof onAuthChange === 'function') onAuthChange({ loggedOut: true });
    }
  }, msUntilRefresh);
}

export function setAuthChangeHandler(fn) {
  onAuthChange = fn;
}

export async function userLogin(email, password) {
  const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/auth/login` : '/auth/login';
  const res = await fetch(url, {
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
  const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/auth/refresh` : '/auth/refresh';
  const res = await fetch(url, {
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
    const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/auth/logout` : '/auth/logout';
    await fetch(url, { method: 'POST', credentials: 'include' }).catch((err) => {
      console.warn('Logout request failed', err);
    });
  } finally {
    clearTokenLocal();
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    if (typeof onAuthChange === 'function') onAuthChange({ loggedOut: true });
  }
}

export function getToken() {
  return getTokenLocal();
}
export function setToken(token) {
  setTokenLocal(token);
  scheduleRefresh(token);
}

// alias named export
export async function adminLogin(email, password) {
  return userLogin(email, password);
}

// registration
export async function userRegister(email, password) {
  if (!API_BASE) {
    console.error('userRegister: API_BASE not configured (REACT_APP_API_URI or REACT_APP_API_URL)');
    return { success: false, error: 'API base URL not configured' };
  }

  const url = `${API_BASE.replace(/\/$/, '')}/auth/register`;
  console.log('userRegister posting to', url);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const payload = await res.json().catch(() => null);
        return { success: false, error: payload?.error || payload?.message || `HTTP ${res.status}` };
      }
      const text = await res.text().catch(() => null);
      console.error('userRegister non-json error response:', text?.slice?.(0, 300));
      return { success: false, error: `Server returned ${res.status} ${res.statusText}` };
    }

    if (contentType.includes('application/json')) {
      const payload = await res.json().catch(() => null);
      return { success: true, user: payload?.user || payload };
    }

    const text = await res.text().catch(() => null);
    console.warn('Unexpected server response', text);
    return { success: false, error: 'Unexpected server response' };
  } catch (err) {
    console.error('userRegister network error', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

export default {
  userLogin,
  userRegister,
  adminLogin,
  refreshToken,
  logout,
  getToken,
  setToken,
  setAuthChangeHandler,
};
