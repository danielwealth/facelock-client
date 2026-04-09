// client/src/components/UploadDocument.jsx
import React, { useState } from 'react';
import { View, Text, Button, Input } from 'react-native-web';
import { postDocument } from '../services/verify';

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
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
      const result = await postDocument(fd);
      // expected result: { jobId, status, ... }
      onUploaded(result);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      <div style={{ marginTop: 8 }}>
        <button onClick={handleUpload} disabled={loading}>{loading ? 'Uploading...' : 'Upload for Verification'}</button>
      </div>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
