// client/src/components/user/UploadDocument.jsx
import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import Webcam from 'react-webcam';
import { postVerifyDocument } from '../../services/verify';
import { getToken } from '../../services/auth';

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const webcamRef = useRef(null);
  const token = getToken();

  // Handle ID file upload
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

  // Capture selfie from webcam
  const captureSelfie = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    const blob = await fetch(imageSrc).then(res => res.blob());
    setSelfie(blob);
  };

  // Submit both ID and selfie
  const submit = async () => {
    if (!file || !selfie) {
      setStatus({ error: 'Both ID document and selfie are required' });
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('document', file);
      form.append('selfie', selfie, 'selfie.png');

      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await postVerifyDocument(form, opts);

      setStatus({ success: true, data: res });
      if (onUploaded) onUploaded(res); // pass job back to dashboard
      setFile(null);
      setSelfie(null);
      setPreviewUrl(null);
    } catch (err) {
      setStatus({ error: err?.message || 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload ID & Capture Selfie</Text>

      <label style={styles.label}>
        ID Document
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      </label>

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img src={previewUrl} alt="preview" style={styles.preview} />
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={320}
          height={240}
        />
        <Button title="Capture Selfie" onPress={captureSelfie} />
      </div>

      <div style={{ marginTop: 12 }}>
        <Button title={loading ? 'Submitting...' : 'Submit'} onPress={submit} disabled={loading} />
      </div>

      {status?.error && <Text style={styles.error}>{status.error}</Text>}
      {status?.success && (
        <View style={styles.ok}>
          <Text>Verification started</Text>
          <pre style={styles.pre}>{JSON.stringify(status.data, null, 2)}</pre>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 18, marginBottom: 12 },
  label: { display: 'block', marginBottom: 8 },
  preview: { maxWidth: 320, maxHeight: 240, borderRadius: 6 },
  error: { color: 'red', marginTop: 12 },
  ok: { color: '#0a7', marginTop: 12 },
  pre: { background: '#f6f6f6', padding: 8, borderRadius: 4, overflowX: 'auto' },
});
