import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import Webcam from 'react-webcam';
import { getUploadUrl } from '../../services/s3';
import { postVerifyDocument, getVerificationStatus } from '../../services/verify';

export default function UploadDocument({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setStatus(null);
    setPreviewUrl(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  };

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

  async function uploadToS3(uploadUrl, file) {
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
  }

  const submit = async () => {
    if (!file || !selfie) {
      setStatus({ error: '❌ Both ID document and selfie are required' });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get presigned URLs
      const idUpload = await getUploadUrl({ filename: file.name, filetype: file.type, category: 'id' });
      const selfieUpload = await getUploadUrl({ filename: 'selfie.png', filetype: 'image/png', category: 'selfie' });

      // Step 2: Upload files to S3
      await uploadToS3(idUpload.uploadUrl, file);
      await uploadToS3(selfieUpload.uploadUrl, selfie);

      // Step 3: Start verification job
      const job = await postVerifyDocument({ idKey: idUpload.key, selfieKey: selfieUpload.key });
      setStatus({ success: true, data: job });

      if (onUploaded) onUploaded(job);

      // Step 4: Poll for job status
      const interval = setInterval(async () => {
        try {
          const result = await getVerificationStatus(job.jobId);
          setStatus({ success: true, data: result });

          if (result.status !== 'pending') {
            clearInterval(interval);
          }
        } catch (pollErr) {
          clearInterval(interval);
          setStatus({ error: pollErr.message || 'Failed to fetch status' });
        }
      }, 5000);

      // Reset form
      setFile(null);
      setSelfie(null);
      setPreviewUrl(null);
      setSelfiePreview(null);
    } catch (err) {
      console.error('Upload error:', err);
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
      {previewUrl && <img src={previewUrl} alt="ID preview" style={styles.preview} />}
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" width={320} height={240} />
      <TouchableOpacity style={styles.button} onPress={captureSelfie}>
        <Text style={styles.buttonText}>Capture Selfie</Text>
      </TouchableOpacity>
      {selfiePreview && <img src={selfiePreview} alt="Selfie preview" style={styles.preview} />}
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
      {status?.error && <Text style={styles.error}>{status.error}</Text>}
      {status?.success && (
        <View style={styles.ok}>
          <Text>✅ Verification status</Text>
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
