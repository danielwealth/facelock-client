// client/src/components/user/VerifyForm.jsx
{ "compilerOptions": { "baseUrl": "src" } }

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { postVerifyDocument } from '../../services/verify';
import { getToken } from 'services/auth';

export default function VerifyForm({ token: propToken }) {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = propToken || getToken();

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setStatus(null);

    if (f && f.type.startsWith('image/')) {
      try {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      } catch {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setStatus(null);

    if (!file || !key) {
      setStatus({ error: 'File and secret key are required' });
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('document', file);
      form.append('key', key);

      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await postVerifyDocument(form, opts);

      setStatus({ success: true, data: res });
      setFile(null);
      setKey('');
      setPreviewUrl(null);
    } catch (err) {
      setStatus({
        error: err?.message || 'Verification failed',
        details: err?.details || null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={styles.form}>
      <label style={styles.label}>
        Document
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      </label>

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img src={previewUrl} alt="preview" style={styles.preview} />
        </div>
      )}

      <TextInput
        placeholder="Secret key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.input}
        type="password"
      />

      <div style={{ marginTop: 8 }}>
        <Button title={loading ? 'Verifying...' : 'Verify'} onPress={(e) => submit(e)} disabled={loading} />
      </div>

      {status && status.error && <div style={styles.error}>{status.error}</div>}
      {status && status.success && (
        <div style={styles.ok}>
          <strong>Verified</strong>
          <pre style={styles.pre}>{JSON.stringify(status.data, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

const styles = StyleSheet.create({
  form: { maxWidth: 720, padding: 8 },
  label: { display: 'block', marginBottom: 8 },
  input: { width: '100%', padding: 8, marginTop: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  preview: { maxWidth: 320, maxHeight: 240, borderRadius: 6 },
  error: { color: 'red', marginTop: 12 },
  ok: { color: '#0a7', marginTop: 12 },
  pre: { background: '#f6f6f6', padding: 8, borderRadius: 4, overflowX: 'auto' },
});
