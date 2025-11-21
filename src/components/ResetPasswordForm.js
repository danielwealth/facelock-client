// client/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      const resp = await fetch(`https://facelockserver.onrender.com/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (resp.ok) {
        setMessage('Password updated');
      } else {
        setMessage('Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error resetting password');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Reset Password" onPress={handleReset} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}
// client/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      const resp = await fetch(`https://facelockserver.onrender.com/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (resp.ok) {
        setMessage('Password updated');
      } else {
        setMessage('Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error resetting password');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Reset Password" onPress={handleReset} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}
// client/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      const resp = await fetch(`https://facelockserver.onrender.com/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (resp.ok) {
        setMessage('Password updated');
      } else {
        setMessage('Failed to update password');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error resetting password');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Reset Password" onPress={handleReset} />
      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}
export default ResetPasswordForm;
