// client/src/components/LogoutButton.js
import React from 'react';
import { View, Button, Text } from 'react-native-web';

export default function LogoutButton() {
  const [message, setMessage] = React.useState('');

  const handleLogout = async () => {
    try {
      await fetch('https://facelockserver.onrender.com/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setMessage('Logged out');
      // Instead of window.location.reload, use React Router navigation
      // e.g. with useNavigate hook: navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage('Logout failed');
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <Button title="Logout" color="#d32f2f" onPress={handleLogout} />
      {message ? <Text style={{ marginTop: 8 }}>{message}</Text> : null}
    </View>
  );
}
