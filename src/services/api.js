// client/src/services/api.js
const API_BASE = process.env.REACT_APP_API_URL || '';

/**
 * Normalize fetch responses into { ok, status, data, error }
 */
async function parseResponse(resp) {
  const status = resp.status;
  let data = null;
  try {
    data = await resp.json();
  } catch {
    // non-json body
    try {
      data = await resp.text();
    } catch {
      data = null;
    }
  }

  if (!resp.ok) {
    const message = (data && (data.error || data.message)) || resp.statusText || 'Request failed';
    const err = new Error(message);
    err.status = status;
    err.payload = data;
    throw err;
  }

  return { ok: true, status, data };
}

/**
 * Simple timeout wrapper for fetch
 */
function fetchWithTimeout(url, opts = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const merged = { ...opts, signal: controller.signal };
  return fetch(url, merged).finally(() => clearTimeout(id));
}

/**
 * Build headers merging JSON defaults and optional auth headers
 */
function buildHeaders(headers = {}, json = true, authHeaders = {}) {
  const base = json ? { 'Content-Type': 'application/json' } : {};
  return { ...base, ...authHeaders, ...headers };
}

/**
 * Generic request helper with optional retries for idempotent methods
 */
async function request(path, { method = 'GET', headers = {}, body = null, json = true, credentials = 'include', timeout = 15000, retries = 0, authHeaders = {} } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const opts = {
    method,
    headers: buildHeaders(headers, json, authHeaders),
    credentials,
  };

  if (body !== null) {
    opts.body = body;
  }

  let attempt = 0;
  while (true) {
    try {
      const resp = await fetchWithTimeout(url, opts, timeout);
      return await parseResponse(resp);
    } catch (err) {
      // AbortError or network error
      attempt += 1;
      const isAbort = err.name === 'AbortError';
      const isNetwork = !err.status;
      if ((attempt > retries) || (!isNetwork && !isAbort)) {
        throw err;
      }
      // small backoff
      await new Promise(r => setTimeout(r, 200 * attempt));
    }
  }
}

/**
 * Convenience helpers
 */
async function get(path, opts = {}) {
  return request(path, { ...opts, method: 'GET' });
}

async function post(path, data, opts = {}) {
  const body = opts.json === false ? data : JSON.stringify(data);
  return request(path, { ...opts, method: 'POST', body, json: opts.json !== false });
}

async function postForm(path, formData, opts = {}) {
  // For FormData, do not set Content-Type; browser will set boundary
  const authHeaders = opts.authHeaders || {};
  return request(path, { ...opts, method: 'POST', body: formData, json: false, headers: opts.headers || {}, authHeaders });
}

export default {
  request,
  get,
  post,
  postForm,
  API_BASE,
};
