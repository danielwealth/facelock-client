// client/src/components/RegisterForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const resp = await fetch('https://facelockserver.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (resp.ok) {
        setMessage('Registered!');
      } else {
        setMessage('Registration failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error registering');
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
      <Button title="Register" onPress={handleRegister} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}
