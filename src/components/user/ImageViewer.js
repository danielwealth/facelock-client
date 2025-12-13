import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native-web';

export default function ImageViewer() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('Loading image...');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_API_URI}/unlock/unlocked-image`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          // If your unlock route requires a key, send it here:
          // body: JSON.stringify({ key: enteredKey }),
        });
        const data = await resp.json();

        if (data.success && data.image) {
          setImage(data.image);
          setStatus('');
        } else {
          setStatus(data.error || 'No image found');
        }
      } catch (err) {
        console.error('Failed to fetch image', err);
        setStatus('Error fetching image');
      }
    };

    fetchImage();
  }, []);

  return (
    <View style={styles.container}>
      {status ? (
        <Text style={styles.status}>{status}</Text>
      ) : (
        <Image source={{ uri: image }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  status: {
    fontSize: 16,
    color: 'gray',
  },
});
