// client/src/components/user/UploadDocument.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { postDocument } from '../../services/verify';
import { getToken } from '../../services/auth';

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (err) {
          console.warn('Failed to revoke object URL', err);
        }
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const f = e?.target?.files?.[0] || null;
    setError(null);
    setFile(f);

    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (err) {
        console.warn('Failed to revoke old preview URL', err);
      }
      setPreviewUrl(null);
    }

    if (f && f.type && f.type.startsWith('image/')) {
      try {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      } catch (err) {
        console.error('Failed to create preview URL', err);
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please choose a file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('document', file);

      const token = getToken();
      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const result = await postDocument(fd, opts);

      if (!result || result.error) {
        throw new Error(result?.error || 'Upload failed');
      }

      if (typeof onUploaded === 'function') {
        onUploaded(result);
      }
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        style={styles.input}
      />

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxWidth: 240, borderRadius: 6 }}
          />
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload for Verification'}
        </button>
      </div>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  input: { width: '100%' },
  error: { color: 'red', marginTop: 8 },
});
