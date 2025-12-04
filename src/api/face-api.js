import * as faceapi from 'face-api.js';
import React, { useState } from 'react';

// Load models once
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
}

export async function getFaceDescriptor(imageFile) {
  await loadModels();
  const img = await faceapi.bufferToImage(imageFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection?.descriptor;
}

export async function handleLogin(email, password) {
  const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json();
  if (resp.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  }
  return data;
}

export async function fetchUnlockedImages() {
  const token = localStorage.getItem('token');
  const resp = await fetch(`${process.env.REACT_APP_API_URI}/images/unlocked-images`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.json();
}

export async function findMatchingUser(newDescriptor, threshold = 0.6) {
  // Replace with API call to backend that returns all descriptors
  const allDescriptors = await fetch(`${process.env.REACT_APP_API_URI}/users/descriptors`).then(r => r.json());
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

export function RequestOTPForm() {
  const [phone, setPhone] = useState('');
  const handleRequest = async () => {
    await fetch(`${process.env.REACT_APP_API_URI}/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    alert('OTP sent to your phone');
  };
  return (
    <div>
      <input type="tel" onChange={e => setPhone(e.target.value)} />
      <button onClick={handleRequest}>Request OTP</button>
    </div>
  );
}
