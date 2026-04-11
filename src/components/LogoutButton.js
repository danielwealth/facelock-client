// client/src/components/LogoutButton.js

import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native-web';
import { logout as clearLocalAuth } from 'services/auth';

export default function LogoutButton({ setView }) {
  const [message, setMessage] = useState('');
  const API_BASE = process.env.REACT_APP_API_URL || '';

  const handleLogout = async () => {
    setMessage('');
    try {
      // Attempt server logout (cookie based sessions supported)
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => { /* ignore network errors, still clear local state */ });

      // Clear local token/storage
      try { clearLocalAuth(); } catch (e) { /* ignore */ }

      setMessage('Logged out');
      if (typeof setView === 'function') setView('login');
    } catch (err) {
      console.error('Logout error', err);
      setMessage('Logout failed');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" color="#d32f2f" onPress={handleLogout} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  message: { marginTop: 8 },
});
