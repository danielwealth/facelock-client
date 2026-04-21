// client/src/components/admin/BiometricAccess.js
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import * as faceapi from 'face-api.js';
import { loadModels } from '../../faceApiHelpers';

const API_BASE = process.env.REACT_APP_API_URI || '';

export default function BiometricAccess({ setView }) {
  const videoRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        await loadModels();
        if (!mounted) return;
        await startCamera();
      } catch (err) {
        console.error('Model or camera init error:', err);
        setMessage('Unable to initialize biometric access');
      }
    }
    init();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // some browsers require play() to start video
        await videoRef.current.play().catch(() => {});
      }
      setMessage('');
    } catch (err) {
      console.error('Camera error:', err);
      setMessage('Unable to access webcam');
    }
  };

  const stopCamera = () => {
    try {
      const stream = videoRef.current?.srcObject;
      if (stream && stream.getTracks) {
        stream.getTracks().forEach(t => t.stop());
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (e) {
      // ignore
    }
  };

  async function captureDescriptorFromVideo() {
    if (!videoRef.current) throw new Error('Video not ready');
    // detect on the current video frame
    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!detection) throw new Error('No face detected');
    return detection.descriptor; // Float32Array
  }

  const handleAuthenticate = async () => {
    setLoading(true);
    setMessage('Authenticating...');
    try {
      const descriptor = await captureDescriptorFromVideo();

      // send descriptor to backend for secure matching
      const body = { descriptor: Array.from(descriptor) };
      const resp = await fetch(`${API_BASE}/auth/biometric`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include' // optional: include cookies if your auth uses them
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => resp.statusText);
        throw new Error(text || 'Authentication failed');
      }

      const data = await resp.json();
      // expected response: { userId, role, token? }
      if (data && data.userId) {
        setMessage(`✅ Authentication successful for ${data.role || data.userId}`);
        // store token if provided
        if (data.token) localStorage.setItem('token', data.token);
        // route based on role
        if (data.role === 'admin') {
          setView('admin-dashboard');
        } else {
          setView('user-dashboard');
        }
      } else {
        setMessage('❌ Authentication failed');
      }
    } catch (err) {
      console.error('Biometric auth error:', err);
      setMessage('Error: ' + (err.message || 'Authentication error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Biometric Access</Text>
      <video ref={videoRef} autoPlay muted width="320" height="240" style={{ borderRadius: 6, background: '#000' }} />
      <div style={{ marginTop: 12 }}>
        <Button title={loading ? 'Authenticating...' : 'Authenticate'} onPress={handleAuthenticate} disabled={loading} />
        <Button title="Back" onPress={() => setView('admin-dashboard')} />
      </div>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  message: { marginTop: 12, fontSize: 16 },
});
