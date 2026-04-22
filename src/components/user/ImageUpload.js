// client/src/components/user/ImageUpload.js

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';
import { postDocumentWithDescriptor } from '../../services/verify';
import { getToken } from 'services/auth';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URI || '';

  const handleUpload = async () => {
  if (!file) {
    setMessage('❌ Please select a file first.');
    return;
  }
  if (!key) {
    setMessage('❌ Please enter your secret key.');
    return;
  }
  if (!areModelsReady()) {
    setMessage('⚠️ Models are still loading, please wait...');
    return;
  }

  setProcessing(true);
  setMessage('⏳ Processing image, please wait...');

  try {
    // 1) Convert file to image element for descriptor extraction
    let descriptor = null;
    try {
      const img = await faceapi.bufferToImage(file);
      descriptor = await Promise.race([
        getFaceDescriptor(img),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Detection timed out')), 60000)
        ),
      ]);
    } catch (dErr) {
      console.warn('Descriptor extraction failed:', dErr);
      setMessage('⚠️ No face descriptor extracted. Uploading without descriptor.');
    }

    // 2) Get pre-signed S3 upload URL
    const token = getToken();
    const presignResp = await fetch(`${API_BASE}/s3/get-upload-url`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ filename: file.name, filetype: file.type }),
    });

    if (!presignResp.ok) {
      throw new Error(`Failed to get upload URL: ${await presignResp.text()}`);
    }

    const { uploadUrl, key: s3Key, viewUrl } = await presignResp.json();

    // 3) Upload file to S3
    const putResp = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!putResp.ok) {
      throw new Error(`S3 upload failed: ${await putResp.text()}`);
    }

    // 4) Save metadata + descriptor
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);
    formData.append('s3Key', s3Key);
    formData.append('filename', file.name);
    formData.append('mimeType', file.type);
    if (descriptor) {
      formData.append('descriptor', JSON.stringify(Array.from(descriptor)));
    }

    let job;
    try {
      job = await postDocumentWithDescriptor(formData, token);
    } catch (err) {
      console.warn('postDocumentWithDescriptor failed, falling back to metadata save', err);
      const saveResp = await fetch(`${API_BASE}/auth/save-profile-image`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!saveResp.ok) {
        throw new Error(`Save metadata failed: ${await saveResp.text()}`);
      }
      job = await saveResp.json();
    }

    // 5) Handle response
    if (job && (job.success || job.jobId)) {
      setMessage('✅ Image locked and uploaded successfully!');
      if (viewUrl) setPreview(viewUrl);
      setView('user-dashboard');
    } else {
      throw new Error(job?.error || 'Unknown server response');
    }
  } catch (err) {
    console.error('Detection/Upload failed:', err);
    setMessage('❌ Error: ' + (err.message || 'Upload failed'));
  } finally {
    setProcessing(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Please upload a clear headshot (passport-style photo).
        Make sure your face is centered, well-lit, and without sunglasses or masks.
      </Text>

      <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />

      {preview && (
        <div style={styles.previewContainer}>
          <img src={preview} alt="Selected preview" style={styles.preview} />
        </div>
      )}

      <input
        type="text"
        placeholder="Enter your secret key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.keyInput}
      />

      <button onClick={handleUpload} disabled={processing}>
        {processing ? 'Processing...' : 'Upload'}
      </button>

      {processing && <div style={styles.spinner}></div>}
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  instructions: { marginBottom: 12, fontWeight: 'bold' },
  message: { marginTop: 12 },
  previewContainer: { marginTop: 12 },
  preview: { width: 200, height: 'auto', border: '1px solid #ccc' },
  keyInput: {
    marginTop: 12,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '200px',
  },
  spinner: {
    marginTop: 12,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: 24,
    height: 24,
    animation: 'spin 1s linear infinite',
  },
});
