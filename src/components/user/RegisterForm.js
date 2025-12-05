// client/src/components/RegisterForm.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native-web';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';


export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (resp.ok) {
        setMessage('Registered!');
        navigate('/login'); // redirect after success
      } else {
        const errText = await resp.text();
        console.error("Registration failed:", errText);
        setMessage('Registration failed');
      }
    } catch (err) {
      console.error("Error registering:", err);
      setMessage('Error registering');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
