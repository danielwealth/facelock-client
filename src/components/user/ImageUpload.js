// client/src/components/user/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  // Step 1: Select file
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // ✅ show thumbnail
      setMessage('File selected. Click Upload to continue.');
    }
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

    setProcessing(true);
    setMessage('Image is processing, please wait...');

    try {
      const descriptor = await getFaceDescriptor(file);
      console.log('Face descriptor:', descriptor); // long vector in console
      setMessage('✅ Image locked successfully!');
      setView('user-dashboard'); // navigate to dashboard after success
    } catch (err) {
      console.error('Detection failed:', err);
      setMessage('❌ Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
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
  message: { marginTop: 12 },
  previewContainer: { marginTop: 12 },
  preview: { width: 200, height: 'auto', border: '1px solid #ccc' },
});
