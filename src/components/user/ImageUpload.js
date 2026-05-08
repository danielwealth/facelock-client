// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import * as faceapi from 'face-api.js';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';
import { getToken } from '../../services/auth';
import { postVerifyDocument } from '../../services/verify';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URI || '';

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage('File selected. Enter your key and click Upload.');
    }
  };

  const handleUpload = async () => {
    if (!file || !key) {
      setMessage('❌ Please select a file and enter your key.');
      return;
    }

    setProcessing(true);
    try {
      // Optional: run face-api descriptor extraction
      if (await areModelsReady()) {
        const descriptor = await getFaceDescriptor(file);
        console.log('Face descriptor:', descriptor);
      }

      // Upload file to backend verification flow
      const formData = new FormData();
      formData.append('document', file, file.name);
      formData.append('documentType', 'id');
      formData.append('userKey', key);

      const token = getToken();
      const res = await postVerifyDocument(formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setMessage(`✅ Upload successful. Job ID: ${res.jobId}`);
      setView('status'); // navigate to status view
    } catch (err) {
      console.error('Upload error:', err);
      setMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Image</Text>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={styles.preview} />}
      <input
        type="text"
        placeholder="Enter key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleUpload} disabled={processing}>
        {processing ? 'Uploading...' : 'Upload'}
      </button>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 18, marginBottom: 12 },
  preview: { maxWidth: 320, maxHeight: 240, borderRadius: 6, marginTop: 8 },
  input: { marginTop: 10, padding: 8, borderRadius: 4, border: '1px solid #ccc' },
  message: { marginTop: 12, fontSize: 14 },
});
