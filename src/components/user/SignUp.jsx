// client/src/components/user/SignUp.jsx
{ "compilerOptions": { "baseUrl": "src" } }


import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { useNavigate } from 'react-router-dom';
import { userRegister } from 'services/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setStatus('');
    if (!email || !password) {
      setStatus('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await userRegister(email.trim(), password);
      if (res && (res.success || res.user)) {
        setStatus('✅ Signup successful');
        navigate('/login');
      } else {
        const err = res && (res.error || res.message) ? (res.error || res.message) : 'Signup failed';
        setStatus(err);
      }
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
        type="email"
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
        <Button title={loading ? 'Registering...' : 'Register'} onPress={handleSignUp} disabled={loading} />
      </div>

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
