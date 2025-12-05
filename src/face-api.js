// client/src/faceApiHelpers.js
import * as faceapi from 'face-api.js';
import React, { useState, useEffect } from 'react';

// Track model load state
let modelsLoaded = false;

export async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
    console.log("✅ Face-api.js models loaded");
  }
}

// Ensure models are ready before detection
async function ensureModels() {
  if (!modelsLoaded) {
    await loadModels();
  }
}

// Get 128-d embedding for an image
export async function getFaceEmbedding(imageFile) {
  await ensureModels();
  const img = await faceapi.bufferToImage(imageFile);
  await new Promise(resolve => { img.onload = resolve; }); // wait for load

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("No face detected in image");
  return detection.descriptor;
}

// Alias for embedding
export async function getFaceDescriptor(imageFile) {
  return getFaceEmbedding(imageFile);
}

// Compare descriptors to find matching user
export async function findMatchingUser(newDescriptor, threshold = 0.6) {
  const allDescriptors = await FaceDescriptor.find(); // assumes backend model
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

// Login helper
export async function handleLogin(email, password) {
  try {
    const resp = await fetch('https://facelockserver.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!resp.ok) throw new Error("Login failed");
    const data = await resp.json();
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  } catch (err) {
    console.error("Login error:", err);
  }
}

// Fetch unlocked images
export async function fetchUnlockedImages() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No token found");
  const resp = await fetch('https://facelockserver.onrender.com/unlocked-images', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error("Failed to fetch unlocked images");
  return resp.json();
}

// OTP request form component
export function RequestOTPForm() {
  const [phone, setPhone] = useState('');

  const handleRequest = async () => {
    try {
      await fetch('https://facelockserver.onrender.com/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      alert('OTP sent to your phone');
    } catch (err) {
      console.error("OTP request failed:", err);
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleRequest}>Request OTP</button>
    </div>
  );
}
