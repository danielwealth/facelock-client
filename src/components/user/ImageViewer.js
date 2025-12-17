import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native-web';

export default function ImageViewer() {
  const [key, setKey] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState('Enter your secret key to unlock');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!key) {
      setStatus('❌ Please enter your secret key.');
      return;
    }

    setLoading(true);
    setStatus('⏳ Unlocking image...');

    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/unlock/unlocked-image`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }), // send secret key
      });

      const data = await resp.json();
      console.log('Unlock response:', data);

      // ✅ match backend response property name
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setStatus('✅ Image unlocked');
      } else {
        setStatus('❌ Unlock failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to unlock image', err);
      setStatus('❌ Error unlocking image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>{status}</Text>

      <input
        type="text"
        placeholder="Enter your secret key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={styles.keyInput}
      />

      <button onClick={handleUnlock} disabled={loading}>
        {loading ? 'Processing...' : 'Unlock'}
      </button>

      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
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
  instructions: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyInput: {
    marginTop: 12,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: 4,
    width: '200px',
  },
  imageContainer: {
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
