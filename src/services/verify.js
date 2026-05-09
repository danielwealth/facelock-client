// client/src/services/verify.js
import { getToken } from './auth';

const API_BASE = process.env.REACT_APP_API_URI || '';

async function handleResponse(res) {
  const text = await res.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
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
 * Expects JSON with { idKey, selfieKey } from S3 presigned uploads.
 */
export async function postVerifyDocument({ idKey, selfieKey }, opts = {}) {
  if (!idKey || !selfieKey) {
    throw new Error('Both idKey and selfieKey are required');
  }
  const token = opts.token || getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/verify/document`, {
    method: 'POST',
    credentials: 'include',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ idKey, selfieKey }),
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
  const res = await fetch(`${API_BASE}/verify/status/${encodeURIComponent(jobId)}`, {
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
