// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';

export default function ImageUpload({ setView }) {
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0]; // ✅ actual File object
    if (!file) return;

    if (!areModelsReady()) {
      setMessage("Models are still loading, please wait...");
      return;
    }

    try {
      const descriptor = await getFaceDescriptor(file);
      console.log("Face descriptor:", descriptor);
      setMessage("Face detected successfully!");
      setView('user-dashboard'); // ✅ go to dashboard after success
    } catch (err) {
      console.error("Detection failed:", err);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <input type="file" accept="image/jpeg,image/png" onChange={handleUpload} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  message: { marginTop: 12 },
});
