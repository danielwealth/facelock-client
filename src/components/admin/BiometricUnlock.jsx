// client/src/components/BiometricUnlock.jsx
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native-web';
import { startAuthentication } from '@simplewebauthn/browser';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function BiometricUnlock() {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchJson(url, opts = {}) {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
  }

  const authenticate = async () => {
    setLoading(true);
    setMessage('');
    try {
      // 1) Get authentication options from server
      const options = await fetchJson(`${API_BASE}/biometric/generate-authentication-options`, {
        credentials: 'include',
      });

      // 2) Run browser WebAuthn flow
      const authResp = await startAuthentication(options);

      // 3) Verify assertion with server
      const verify = await fetchJson(`${API_BASE}/biometric/verify-authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(authResp),
      });

      if (!verify || !verify.success) {
        setMessage('Access denied');
        setImages([]);
        return;
      }

      // 4) On success, optionally store token and fetch unlocked images
      if (verify.token) {
        try { localStorage.setItem('token', verify.token); } catch (e) { /* ignore */ }
      }

      // Fetch unlocked images (server should require auth)
      const unlocked = await fetchJson(`${API_BASE}/unlocked-images`, {
        headers: verify.token ? { Authorization: `Bearer ${verify.token}` } : undefined,
        credentials: 'include',
      });

      setImages(Array.isArray(unlocked) ? unlocked : []);
      setMessage('Access granted');
    } catch (err) {
      console.error('Biometric auth error', err);
      setMessage(err instanceof Error ? err.message : 'Authentication failed');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title={loading ? 'Authenticating...' : 'Authenticate'} onPress={authenticate} disabled={loading} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.imageItem}>{item}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>No unlocked images</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  message: { marginTop: 10 },
  imageItem: { marginTop: 8, color: '#111' },
  empty: { marginTop: 8, color: '#666' },
});
