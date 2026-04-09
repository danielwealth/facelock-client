// client/src/components/user/ImageViewer.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { getToken } from '../../services/auth';

export default function ImageViewer() {
  const [key, setKey] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState('Enter your secret key to unlock');
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || '';

  const handleUnlock = async () => {
    if (!key) {
      setStatus('❌ Please enter your secret key.');
      return;
    }

    setLoading(true);
    setStatus('⏳ Unlocking image...');

    try {
      const token = getToken();
      const resp = await fetch(`${API_BASE}/unlock/unlocked-image`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ key }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data.error || data.message || resp.statusText || 'Unlock request failed';
        setStatus('❌ Unlock failed: ' + msg);
        setImageUrl(null);
        return;
      }

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setStatus('✅ Image unlocked');
      } else {
        setStatus('❌ Unlock failed: ' + (data.error || 'Unknown error'));
        setImageUrl(null);
      }
    } catch (err) {
      console.error('Failed to unlock image', err);
      setStatus('❌ Error unlocking image: ' + (err.message || 'Network error'));
      setImageUrl(null);
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

      <div style={{ marginTop: 8 }}>
        <button onClick={handleUnlock} disabled={loading}>
          {loading ? 'Processing...' : 'Unlock'}
        </button>
      </div>

      {imageUrl && (
        <div style={styles.imageContainer}>
          <img src={imageUrl} alt="Unlocked" style={styles.image} />
        </div>
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
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
    objectFit: 'cover',
  },
});
