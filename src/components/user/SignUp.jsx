// client/src/components/user/SignUp.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../../services/auth'; // relative import

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  const handleSignUp = async () => {
    if (loading) return;
    setStatus('');
    if (!email || !password) {
      setStatus('Please enter both email and password');
      return;
    }

    setLoading(true);
    console.trace('handleSignUp invoked');
    try {
      const res = await userRegister(email.trim(), password);
      console.log('userRegister response', res);

      if (res && (res.success || res.user)) {
        setStatus('✅ Signup successful');
        if (navigate) navigate('/login');
        return;
      }

      const err = res && (res.error || res.message) ? (res.error || res.message) : 'Signup failed';
      const lower = String(err).toLowerCase();
      setStatus(lower.includes('login') ? 'Signup failed' : String(err));
    } catch (err) {
      console.error('Signup error', err);
      setStatus(err?.message || 'Error during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={{ marginTop: 8 }}>
        <Button title={loading ? 'Registering...' : 'Register'} onPress={handleSignUp} disabled={loading} />
      </View>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, maxWidth: 480 },
  heading: { fontSize: 20, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, width: '100%' },
  status: { marginTop: 12 },
});
