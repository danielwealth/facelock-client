// client/src/services/verify.js
import { getToken } from './auth';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function handleResponse(res) {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(payload.error || payload.message || 'Request failed');
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/**
 * Upload a document for verification.
 * formData: FormData instance containing the file under key 'document'
 * opts: optional object { token: '...', headers: { ... } }
 */
export async function postDocument(formData, opts = {}) {
  const token = opts.token || getToken();
  const headers = opts.headers || {};
  const res = await fetch(`${API_BASE}/verify/document`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    body: formData,
  });
  return handleResponse(res);
}

/**
 * Alternative endpoint used elsewhere: postVerifyDocument
 */
export async function postVerifyDocument(formData, opts = {}) {
  const token = opts.token || getToken();
  const headers = opts.headers || {};
  const res = await fetch(`${API_BASE}/verify-identity`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    body: formData,
  });
  return handleResponse(res);
}

/**
 * Get verification job status.
 */
export async function getStatus(jobId, opts = {}) {
  const token = opts.token || getToken();
  const res = await fetch(`${API_BASE}/verify/status/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return handleResponse(res);
}

/**
 * Get verification history for the current user.
 */
export async function getHistory(opts = {}) {
  const token = opts.token || getToken();
  const res = await fetch(`${API_BASE}/verify/history`, {
    method: 'GET',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return handleResponse(res);
}

export default {
  postDocument,
  postVerifyDocument,
  getStatus,
  getHistory,
};
