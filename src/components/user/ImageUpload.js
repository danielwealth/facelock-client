import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getFaceDescriptor, areModelsReady } from '../../faceApiHelpers';

export default function ImageUpload({ setView }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMessage('File selected. Enter your key and click Upload.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a file first.');
      return;
    }
    if (!key) {
      setMessage('❌ Please enter your secret key.');
      return;
    }
    if (!areModelsReady()) {
      setMessage('⚠️ Models are still loading, please wait...');
      return;
    }

    setProcessing(true);
    setMessage('⏳ Processing image, please wait...');

    try {
      const detection = await Promise.race([
        getFaceDescriptor(file),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Detection timed out')), 60000)
        ),
      ]);

      if (!detection) {
        setMessage('❌ No face detected. Please upload a clear headshot.');
      } else {
        console.log('Face descriptor:', detection);

        // Step 1: Ask backend for pre-signed PUT URL
        const resp = await fetch(`${process.env.REACT_APP_API_URI}/s3/get-upload-url`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, filetype: file.type }),
        });
        const { uploadUrl, key: s3Key, viewUrl } = await resp.json();

        // Step 2: Upload file directly to S3
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        // Step 3: Save metadata (descriptor + secret key + S3 key) in backend DB
        const saveResp = await fetch(`${process.env.REACT_APP_API_URI}/auth/save-profile-image`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            descriptor: Array.from(detection),
            s3Key,
          }),
        });

        const data = await saveResp.json();

        if (data.success) {
          setMessage('✅ Image locked and uploaded successfully!');
          setPreview(viewUrl); // immediate preview from signed GET URL
          setView('user-dashboard');
        } else {
          setMessage('❌ Upload failed: ' + (data.error || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('Detection/Upload failed:', err);
      setMessage('❌ Error: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Please upload a clear headshot (passport-style photo). 
        Make sure your face is centered, well-lit, and without sunglasses or masks.
      </Text>

      <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />

      {preview && (
        <div style={styles.previewContainer}>
          <img src={preview} alt="Selected preview" style={styles.preview} />
        </div>
      )}

      <input
        type="text"
        placeholder="Enter your secret key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.keyInput}
      />

      <button onClick={handleUpload} disabled={processing}>
        {processing ? 'Processing...' : 'Upload'}
      </button>

      {processing && <div style={styles.spinner}></div>}
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
  keyInput: {
    marginTop: 12,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '200px',
  },
  spinner: {
    marginTop: 12,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: 24,
    height: 24,
    animation: 'spin 1s linear infinite',
  },
});
