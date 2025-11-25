// client/src/components/BiometricUnlock.tsx
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native-web';
import { startAuthentication } from '@simplewebauthn/browser';

export default function BiometricUnlock.tsx() {
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const authenticate = async () => {
    try {
      // Use REACT_APP_ prefix for frontend env vars
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/generate-authentication-options`);
      const options = await resp.json();

      const authResp = await startAuthentication(options);

      const verifyResp = await fetch(`${process.env.REACT_APP_API_URI}/verify-authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResp),
      });

      const result = await verifyResp.json();
      if (result.success) {
        const imagesResp = await fetch(`${process.env.REACT_APP_API_URI}/unlocked-images`);
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
    <View style={styles.container}>
      <Button title="Authenticate" onPress={authenticate} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  message: {
    marginTop: 10,
  },
});
