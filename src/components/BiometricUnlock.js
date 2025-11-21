import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native-web';
import { startAuthentication } from '@simplewebauthn/browser'; // adjust import if needed

export default function BiometricAuth() {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const authenticate = async () => {
    try {
      const resp = await fetch('https://facelockserver.onrender.com/generate-authentication-options');
      const options = await resp.json();

      const authResp = await startAuthentication(options);

      const verifyResp = await fetch('https://facelockserver.onrender.com/verify-authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResp),
      });

      const result = await verifyResp.json();
      if (result.success) {
        const imagesResp = await fetch('https://facelockserver.onrender.com/unlocked-images');
        const unlocked = await imagesResp.json();
        setImages(unlocked);
        setMessage('Access granted');
      } else {
        setMessage('Access denied');
      }
    } catch (err) {
      console.error(err);
      setMessage('Authentication failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Authenticate" onPress={authenticate} />
      {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
}

