// client/src/components/admin/BiometricAccess.js
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import * as faceapi from 'face-api.js';
import { findMatchingUser } from '../api';

export default function BiometricAccess({ setView }) {
  const videoRef = useRef();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load models once and start webcam
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]).then(startCamera);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Camera error:', err);
      setMessage('Unable to access webcam');
    }
  };

  const handleAuthenticate = async () => {
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage('No face detected');
        return;
      }

      // Compare descriptor against stored ones
      const match = await findMatchingUser(detection.descriptor);

      if (match) {
        // match should include userId and role from backend
        const { userId, role } = match;

        setMessage(`✅ Authentication successful for ${role}`);
        if (role === 'admin') {
          setView('admin-dashboard');
        } else {
          setView('user-dashboard');
        }
      } else {
        setMessage('❌ Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Biometric Access</Text>
      <video ref={videoRef} autoPlay muted width="320" height="240" />
      <Button title="Authenticate" onPress={handleAuthenticate} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  message: { marginTop: 12, fontSize: 16 },
});
