// client/src/services/verify.js
import { getToken } from './auth';

const API_BASE = process.env.REACT_APP_API_URI || '';

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
 * Start document verification (ID + selfie).
 * Expects JSON body with { idKey, selfieKey } referencing S3 uploads.
 */
export async function postVerifyDocument(data, opts = {}) {
  const token = opts.token || getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}/verify/document`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Get verification job status by jobId.
 */
export async function getVerificationStatus(jobId, opts = {}) {
  if (!jobId) throw new Error('jobId is required');
  const token = opts.token || getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}/verify/document/status/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });
  return handleResponse(res);
}

/**
 * Get verification history for the current user.
 */
export async function getVerificationHistory(opts = {}) {
  const token = opts.token || getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}/verify/history`, {
    method: 'GET',
    credentials: 'include',
    headers,
  });
  return handleResponse(res);
}

export default {
  postVerifyDocument,
  getVerificationStatus,
  getVerificationHistory,
};
