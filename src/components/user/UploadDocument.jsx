// client/src/components/user/UploadDocument.js

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import Webcam from 'react-webcam';
import { postVerifyDocument } from '../../services/verify';
import { getToken } from '../../services/auth';

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const webcamRef = useRef(null);
  const token = getToken();

  // Handle ID file selection
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
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setStatus({ error: '❌ Could not capture selfie' });
      return;
    }
    const blob = await fetch(imageSrc).then(res => res.blob());
    setSelfie(blob);
    setSelfiePreview(imageSrc);
    setStatus({ success: true, data: '📸 Selfie captured!' });
  };

  // Submit both ID + selfie
  const submit = async () => {
    if (!file || !selfie) {
      setStatus({ error: '❌ Both ID document and selfie are required' });
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('document', file, file.name);
      form.append('documentType', 'id'); // distinguish type
      form.append('selfie', selfie, 'selfie.png');
      form.append('selfieType', 'selfie'); // distinguish type

      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await postVerifyDocument(form, opts);

      setStatus({ success: true, data: res });
      if (onUploaded) onUploaded(res);

      // Reset state
      setFile(null);
      setSelfie(null);
      setPreviewUrl(null);
      setSelfiePreview(null);
    } catch (err) {
      setStatus({ error: err?.message || 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload ID & Capture Selfie</Text>

      {/* ID Upload */}
      <label style={styles.label}>
        ID Document
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      </label>
      {previewUrl && <img src={previewUrl} alt="ID preview" style={styles.preview} />}

      {/* Webcam Selfie */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={320}
        height={240}
      />
      <TouchableOpacity style={styles.button} onPress={captureSelfie}>
        <Text style={styles.buttonText}>Capture Selfie</Text>
      </TouchableOpacity>
      {selfiePreview && <img src={selfiePreview} alt="Selfie preview" style={styles.preview} />}

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>

      {/* Status messages */}
      {status?.error && <Text style={styles.error}>{status.error}</Text>}
      {status?.success && (
        <View style={styles.ok}>
          <Text>✅ Verification started</Text>
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
  preview: { maxWidth: 320, maxHeight: 240, borderRadius: 6, marginTop: 8 },
  button: { backgroundColor: '#0b5cff', padding: 10, marginTop: 10, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  error: { color: 'red', marginTop: 12 },
  ok: { color: '#0a7', marginTop: 12 },
  pre: { background: '#f6f6f6', padding: 8, borderRadius: 4, overflowX: 'auto' },
});
