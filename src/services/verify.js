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
 * Upload a document (simple FormData upload).
 * formData: FormData instance
 * opts: { token?: string, headers?: object }
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
 * Upload a document together with a JSON descriptor.
 * descriptor: plain object (will be sent as a JSON part)
 * formData: FormData instance (file parts)
 * opts: { token?: string, headers?: object }
 *
 * This appends a JSON blob named "descriptor" to the FormData so the server
 * receives both file parts and a structured descriptor in one request.
 */
export async function postDocumentWithDescriptor(descriptor, formData, opts = {}) {
  if (!formData || !(formData instanceof FormData)) {
    throw new Error('formData must be a FormData instance');
  }

  // append descriptor as a JSON blob
  const descriptorBlob = new Blob([JSON.stringify(descriptor || {})], { type: 'application/json' });
  formData.append('descriptor', descriptorBlob);

  const token = opts.token || getToken();
  const headers = opts.headers || {};
  const res = await fetch(`${API_BASE}/verify/document-with-descriptor`, {
    method: 'POST',
    credentials: 'include',
    headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    body: formData,
  });
  return handleResponse(res);
}

/**
 * Alternative upload endpoint used elsewhere in the codebase.
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
  if (!jobId) throw new Error('jobId is required');
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
  postDocumentWithDescriptor,
  postVerifyDocument,
  getStatus,
  getHistory,
};
