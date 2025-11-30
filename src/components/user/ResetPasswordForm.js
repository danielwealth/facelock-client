// client/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native-web';

export default function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password');
      return;
    }

    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setMessage('Password updated');
      } else {
        setMessage(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error resetting password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <Button title="Reset Password" onPress={handleReset} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  message: {
    marginTop: 12,
  },
});
