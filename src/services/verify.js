// client/src/services/verify.js
import api from './api';
import { getToken } from './auth';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function postDocument(formData, token) {
  const res = await fetch(`${API_BASE}/verify/document`, {
    method: 'POST',
    headers: to

async function getStatus(jobId, token) {
  const res = await fetch(`${API_BASE}/verify/status/${jobId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`Status fetch failed: ${res.statusText}`);
  return res.json();
}

async function getHistory(token) {
  const res = await fetch(`${API_BASE}/verify/history`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`History fetch failed: ${res.statusText}`);
  return res.json();
}
  export async function postDocument(formData, opts = {}) {
  const token = getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.postForm('/verify/document', formData, { authHeaders, retries: 1 });
  return res.data;
}

export async function getHistory() {
  const res = await api.get('/verify/history', { retries: 1 });
  return res.data;
}

export { postDocument, getStatus, getHistory };
