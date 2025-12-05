// client/src/api.js
import * as faceapi from 'face-api.js';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native-web';

// Load models once
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
}

// Extract face descriptor
export async function getFaceDescriptor(imageFile) {
  await loadModels();
  const img = await faceapi.bufferToImage(imageFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor; // 128-d vector
}

// Login handler
export async function handleLogin(email, password) {
  const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = await resp.json();
  if (resp.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  }
  return data;
}

// Fetch unlocked images
export async function fetchUnlockedImages() {
  const token = localStorage.getItem('token');
  const resp = await fetch(`${process.env.REACT_APP_API_URI}/images/unlocked-images`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  return resp.json();
}

// Match user descriptor against stored ones
export async function findMatchingUser(newDescriptor, threshold = 0.6) {
  const resp = await fetch(`${process.env.REACT_APP_API_URI}/users/descriptors`, {
    credentials: 'include',
  });
  const allDescriptors = await resp.json();

  for (const record of allDescriptors) {
    const distance = Math.sqrt(
      newDescriptor.reduce((sum, val, i) => sum + Math.pow(val - record.descriptor[i], 2), 0)
    );
    if (distance < threshold) {
      return record.userId;
    }
  }
  return null;
}

// OTP Request Form using React Native Web primitives
export function RequestOTPForm() {
  const [phone, setPhone] = useState('');

  const handleRequest = async () => {
    await fetch(`${process.env.REACT_APP_API_URI}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
      credentials: 'include',
    });
    alert('OTP sent to your phone');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <Button title="Request OTP" onPress={handleRequest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
});
