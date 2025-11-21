// client/src/components/RequestResetForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function RequestResetForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = async () => {
    try {
      const resp = await fetch('https://facelockserver.onrender.com/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (resp.ok) {
        setMessage('Reset link sent');
      } else {
        setMessage('Failed to send reset link');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error sending reset link');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Request Reset" onPress={handleRequest} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}

