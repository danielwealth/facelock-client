// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Step 1: Select file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('File selected. Click Upload to continue.');
  };

  // Step 2: Click Upload to run detection
  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    if (!areModelsReady()) {
      setMessage('Models are still loading, please wait...');
      return;
    }

    try {
      const descriptor = await getFaceDescriptor(file);
      console.log('Face descriptor:', descriptor); // long vector in console
      setMessage('✅ Face detected successfully!');
      setView('user-dashboard'); // navigate to dashboard after success
    } catch (err) {
      console.error('Detection failed:', err);
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  message: { marginTop: 12 },
});
