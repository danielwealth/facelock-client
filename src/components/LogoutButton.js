// client/src/components/LogoutButton.js
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native-web';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URI}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setMessage('Logged out');
      navigate('/login'); // ✅ redirect to login page
    } catch (err) {
      console.error(err);
      setMessage('Logout failed');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" color="#d32f2f" onPress={handleLogout} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  message: {
    marginTop: 8,
  },
});
