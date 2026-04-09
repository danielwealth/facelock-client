// client/src/components/user/RegisterForm.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native-web';
import { userRegister } from '../../services/auth';

export default function RegisterForm({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await userRegister(email.trim(), password);
      if (res && (res.success || res.user)) {
        setMessage('✅ Registered successfully');
        setView('login');
      } else {
        const err = res && res.error ? res.error : 'Registration failed';
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

      <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  message: { marginTop: 12 },
});
