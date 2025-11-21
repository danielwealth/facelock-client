// client/src/components/LoginForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const resp = await fetch('https://facelockserver.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (resp.ok) {
        setMessage('Logged in!');
        // Instead of window.location.href, use React Router navigation
        // e.g. with useNavigate hook in react-router-dom
        // navigate('/dashboard');
      } else {
        setMessage('Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error logging in');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}
export default LoginForm;
