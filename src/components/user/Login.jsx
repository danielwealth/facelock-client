// client/src/components/user/Login.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { adminLogin } from '../../services/auth'; // reuse adminLogin or create userLogin

export default function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage('');
    setLoading(true);
    try {
      const data = await adminLogin(email.trim(), password); // backend should accept same endpoint for users
      setMessage('✅ Login successful');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.error('User login error', err);
      setMessage(err?.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        placeholder="Password"
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
