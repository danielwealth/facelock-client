// client/src/services/verify.js
const API_BASE = process.env.REACT_APP_API_URL || '';

async function postDocument(formData, token) {
  const res = await fetch(`${API_BASE}/verify/document`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  return res.json();
}

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

export { postDocument, getStatus, getHistory };
