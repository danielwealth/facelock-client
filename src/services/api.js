// client/src/services/api.js
import auth from './auth';

const API_BASE = process.env.REACT_APP_API_URI || '';

async function parseResponse(resp) {
  const status = resp.status;
  let data = null;
  try { data = await resp.json(); } catch { data = null; }
  if (!resp.ok) {
    const message = (data && (data.error || data.message)) || resp.statusText || 'Request failed';
    const err = new Error(message);
    err.status = status;
    err.payload = data;
    throw err;
  }
  return data;
}

async function request(path, opts = {}, retryOn401 = true) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const token = auth.getToken();
  const headers = { ...(opts.headers || {}) };
  if (token && !opts.skipAuth) headers.Authorization = `Bearer ${token}`;

  const fetchOpts = {
    method: opts.method || 'GET',
    headers,
    credentials: opts.credentials || 'include',
    body: opts.body || null,
  };

  try {
    const resp = await fetch(url, fetchOpts);
    return await parseResponse(resp);
  } catch (err) {
    // If 401 and retry allowed, attempt refresh once then retry original request
    if (err.status === 401 && retryOn401) {
      try {
        await auth.refreshToken();
        const newToken = auth.getToken();
        if (newToken) {
          fetchOpts.headers = { ...(fetchOpts.headers || {}), Authorization: `Bearer ${newToken}` };
        }
        const retryResp = await fetch(url, fetchOpts);
        return await parseResponse(retryResp);
      } catch (refreshErr) {
        // refresh failed -> force logout
        await auth.logout();
        throw refreshErr;
      }
    }
    throw err;
  }
}

export async function get(path, opts = {}) { return request(path, { ...opts, method: 'GET' }); }
export async function post(path, data, opts = {}) {
  const body = opts.json === false ? data : JSON.stringify(data);
  const headers = opts.json === false ? (opts.headers || {}) : { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  return request(path, { ...opts, method: 'POST', body, headers });
}
export async function postForm(path, formData, opts = {}) {
  // do not set Content-Type for FormData
  const headers = opts.headers || {};
  return request(path, { ...opts, method: 'POST', body: formData, headers, skipJsonParse: false });
}

export default { get, post, postForm, API_BASE };
