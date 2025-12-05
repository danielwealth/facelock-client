// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage('File selected. Click Upload to continue.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    if (!areModelsReady()) {
      setMessage('Models are still loading, please wait...');
      return;
    }

    setProcessing(true);
    setMessage('Image is processing, please wait...');

    try {
      const descriptor = await getFaceDescriptor(file);
      console.log('Face descriptor:', descriptor);
      setMessage('✅ Image locked successfully!');
      setView('user-dashboard');
    } catch (err) {
      console.error('Detection failed:', err);
      setMessage('❌ Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Instructions for users */}
      <Text style={styles.instructions}>
        Please upload a clear headshot (passport-style photo). 
        Make sure your face is centered, well-lit, and without sunglasses or masks.
      </Text>

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />

      {preview && (
        <div style={styles.previewContainer}>
          <img src={preview} alt="Selected preview" style={styles.preview} />
        </div>
      )}

      <button onClick={handleUpload} disabled={processing}>
        {processing ? 'Processing...' : 'Upload'}
      </button>

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  instructions: { marginBottom: 12, fontWeight: 'bold' },
  message: { marginTop: 12 },
  previewContainer: { marginTop: 12 },
  preview: { width: 200, height: 'auto', border: '1px solid #ccc' },
});
