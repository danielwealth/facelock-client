import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import { loadModels, getFaceDescriptor } from '../../utils/faceUtils';


export default function ImageUpload() {
  const [status, setStatus] = useState('');
  const [file, setFile] = useState(null);

  // Load face-api models once when component mounts
  useEffect(() => {
    import { loadModels } from '../utils/faceUtils';
  loadModels()
    .then(() => console.log('Models loaded'))
    .catch(err => console.error('Error loading models', err));
}, []);


  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select an image first');
      return;
    }

    try {
      // Extract descriptor from selected image
      const descriptor = await getFaceDescriptor(file);
      if (!descriptor) {
        setStatus('No face detected in image');
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('descriptor', JSON.stringify(descriptor));

      // Send to backend
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/user/lock-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const contentType = resp.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await resp.json();
      } else {
        data = await resp.text();
      }

      if (resp.ok) {
        setStatus(data.message || 'Image uploaded and locked successfully');
      } else {
        setStatus(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('Upload error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload and Lock Image</Text>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button title="Upload" onPress={handleUpload} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    marginTop: 12,
    fontSize: 16,
    color: 'gray',
  },
});
