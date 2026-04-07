// VerifyForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function VerifyForm({ token }) {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file || !key) return setStatus({ error: 'File and key required' });
    setLoading(true);
    try {
      const form = new FormData();
      form.append('document', file);
      form.append('key', key);
      const res = await axios.post('/verify-identity', form, {
        headers: { 'Content-Type': 'multipart/form-data', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      setStatus({ success: true, data: res.data });
    } catch (err) {
      setStatus({ error: err.response?.data?.error || err.message, details: err.response?.data });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
      <input type="password" placeholder="Secret key" value={key} onChange={e => setKey(e.target.value)} />
      <button type="submit" disabled={loading}>Verify</button>
      {status && status.error && <div className="error">{status.error}</div>}
      {status && status.success && <div className="ok">Verified: {JSON.stringify(status.data)}</div>}
    </form>
  );
}
