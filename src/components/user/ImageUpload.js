// client/src/components/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native-web';

export default function ImageUpload() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  // Step 1: Login to establish session
  const handleLogin = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // 🔑 ensures cookie is stored
      });
      const data = await resp.json();
      if (resp.ok) {
        setStatus('Logged in successfully');
      } else {
        setStatus(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setStatus('Login error');
    }
  };

  // Step 2: Upload image using session
  const handleUpload = async () => {
    if (!image) {
      console.warn('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/images/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // 🔑 sends cookie back
      });
      const data = await resp.json();
      if (resp.ok) {
        setStatus('Image uploaded and locked successfully');
        console.log('Uploaded:', data);
      } else {
        setStatus(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('Upload error');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Login first:</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
      />
      <Button title="Login" onPress={handleLogin} />

      <Text style={{ marginTop: 16, marginBottom: 8 }}>Select an image:</Text>
      <View style={{ marginBottom: 12 }}>
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: 12 }}
        />
      </View>

      <Button title="Lock Image" onPress={handleUpload} />

      {status && <Text style={{ marginTop: 16 }}>{status}</Text>}
    </View>
  );
}
