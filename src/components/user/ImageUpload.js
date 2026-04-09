// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';
import { postDocumentWithDescriptor } from '../services/verify';
import { getToken } from '../services/auth';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || '';

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage('File selected. Enter your key and click Upload.');
    }
  };

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
      // 1) compute face descriptor (with timeout)
      let descriptor = null;
      try {
        descriptor = await Promise.race([
          getFaceDescriptor(file),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Detection timed out')), 60000)
          ),
        ]);
      } catch (dErr) {
        console.warn('Descriptor extraction failed:', dErr);
        // allow upload without descriptor but inform user
        setMessage('⚠️ No face descriptor extracted. Uploading without descriptor.');
      }

      // 2) Ask backend for pre-signed PUT URL (server should validate auth)
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
        const text = await presignResp.text().catch(() => presignResp.statusText);
        throw new Error(`Failed to get upload URL: ${text}`);
      }

      const { uploadUrl, key: s3Key, viewUrl } = await presignResp.json();

      if (!uploadUrl || !s3Key) {
        throw new Error('Invalid upload URL response from server');
      }

      // 3) Upload file directly to S3 (PUT)
      const putResp = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!putResp.ok) {
        const text = await putResp.text().catch(() => putResp.statusText);
        throw new Error(`S3 upload failed: ${text}`);
      }

      // 4) Save metadata and descriptor on backend (or use verification endpoint)
      // Use postDocumentWithDescriptor to create a verification job if desired.
      // If your backend expects a separate save endpoint, adapt accordingly.
      const job = await postDocumentWithDescriptor(file, descriptor, token)
        .catch(async (err) => {
          // If postDocumentWithDescriptor fails, attempt to save metadata directly
          console.warn('postDocumentWithDescriptor failed, falling back to metadata save', err);
          const saveResp = await fetch(`${API_BASE}/auth/save-profile-image`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              key,
              descriptor: descriptor ? Array.from(descriptor) : null,
              s3Key,
            }),
          });
          if (!saveResp.ok) {
            const text = await saveResp.text().catch(() => saveResp.statusText);
            throw new Error(`Save metadata failed: ${text}`);
          }
          return saveResp.json();
        });

      // 5) Handle response
      if (job && (job.success || job.jobId)) {
        setMessage('✅ Image locked and uploaded successfully!');
        if (viewUrl) setPreview(viewUrl);
        // navigate back to user dashboard or show job status
        setView('user-dashboard');
      } else {
        const errMsg = job && job.error ? job.error : 'Unknown server response';
        throw new Error(errMsg);
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
