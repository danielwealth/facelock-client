// client/src/components/admin/LoginForm.js
{ "compilerOptions": { "baseUrl": "src" } }

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { adminLogin } from 'services/auth';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage('');
    setLoading(true);
    try {
      const data = await adminLogin(email.trim(), password);
      setMessage('✅ Admin login successful');
      // optional: you can inspect data.role or data.user here
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.error('Admin login error', err);
      setMessage(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Login</Text>
      <TextInput
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        placeholder="Admin Password"
        secureTextEntry
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <div style={{ marginTop: 8 }}>
        <Button title={loading ? 'Signing in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      </div>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, width: '100%' },
  message: { marginTop: 12, color: 'red' },
});
