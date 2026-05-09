import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import Webcam from 'react-webcam';
import { getUploadUrl } from '../../services/s3';
import { postVerifyDocument } from '../../services/verify';

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

      // Pass job result up to parent (UserDashboard handles polling)
      if (onUploaded) onUploaded(job);

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
      <Webcam
  audio={false} ref={webcamRef} screenshotFormat="image/png" style={styles.webcam}/>

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
          <Text>✅ Verification started</Text>
          <pre style={styles.pre}>{JSON.stringify(status.data, null, 2)}</pre>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  preview: {
    width: '100%',          // scale to screen width
    maxHeight: 240,
    borderRadius: 8,
    marginTop: 12,
    objectFit: 'contain',
  },
  webcam: {
    width: '100%',          // responsive webcam
    maxWidth: 400,          // cap size on larger screens
    aspectRatio: 4/3,       // maintain aspect ratio
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#0b5cff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 14,
    width: '100%',          // full width on mobile
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  },
  ok: {
    marginTop: 16,
    alignItems: 'center',
  },
  pre: {
    backgroundColor: '#f6f6f6',
    padding: 10,
    borderRadius: 6,
    overflowX: 'auto',
    width: '100%',
    fontSize: 13,
  },
});

