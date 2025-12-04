import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!image) {
      setStatus('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/user/lock-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // 🔑 ensures session cookie is sent
      });

      const data = await resp.json();
      if (resp.ok) {
        setStatus('Image uploaded and locked successfully');
        console.log('Locked image:', data);
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
      <Text style={styles.heading}>Upload & Lock Image</Text>
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
        style={styles.fileInput}
      />
      <Button title="Lock Image" onPress={handleUpload} />
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fileInput: {
    marginBottom: 12,
  },
  status: {
    marginTop: 12,
    fontSize: 14,
    color: 'blue',
  },
});
