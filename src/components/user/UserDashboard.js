// client/src/components/user/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import LogoutButton from '../LogoutButton';
import { getToken } from '../../services/auth';

export default function UserDashboard({ setView }) {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const parts = token.split('.');
      if (parts.length < 2) return;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setUserEmail(payload?.email || payload?.sub || null);
    } catch (err) {
      // ignore decode errors — token may not be a JWT or may not contain email
      setUserEmail(null);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>

      {userEmail ? (
        <Text style={styles.welcome}>Signed in as <Text style={{ fontWeight: '700' }}>{userEmail}</Text></Text>
      ) : (
        <Text style={styles.message}>
          Welcome! You can upload images, view history, and manage your account here.
        </Text>
      )}

      <View style={styles.actions}>
        <Button title="Upload Image" onPress={() => setView('upload')} />
        <Button title="Image Viewer" onPress={() => setView('viewer')} />
        <Button title="Match History" onPress={() => setView('history')} />
      </View>

      <View style={styles.logout}>
        <LogoutButton setView={setView} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  welcome: { fontSize: 16, marginBottom: 16 },
  message: { fontSize: 16, marginBottom: 20 },
  actions: { gap: 12, marginBottom: 20 },
  logout: { marginTop: 20 },
});
