// client/src/components/user/RegisterForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';
import { useNavigate } from 'react-router-dom';
import { userRegister } from 'services/auth'; // ensure correct relative path

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleRegister = async () => {
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await userRegister(email.trim(), password);
      if (res && (res.success || res.user)) {
        setMessage('✅ Registered successfully');
        navigate('/login');
      } else {
        const err = res && (res.error || res.message) ? (res.error || res.message) : 'Registration failed';
        setMessage(err);
      }
    } catch (err) {
      console.error('Registration error', err);
      setMessage(err?.message || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={{ marginTop: 8 }}>
        <Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, width: '100%' },
  message: { marginTop: 12 },
});
