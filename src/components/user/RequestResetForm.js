// client/src/components/user/ResetPassword.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native-web';
import { getToken } from '../services/auth';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function ResetPassword() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function requestReset() {
    if (!phoneNumber) {
      setStatus('Please enter your phone number');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const resp = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setStatus(data.error || data.message || 'Failed to request reset');
        return;
      }
      setStatus(data.message || 'Reset code sent. Check your phone.');
      setStep(2);
    } catch (err) {
      console.error('requestReset error', err);
      setStatus('Network error while requesting reset');
    } finally {
      setLoading(false);
    }
  }

  async function verifyReset() {
    if (!code || !newPassword) {
      setStatus('Please enter the code and a new password');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const token = getToken();
      const resp = await fetch(`${API_BASE}/auth/verify-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ code, newPassword }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setStatus(data.error || data.message || 'Verification failed');
        return;
      }
      setStatus(data.message || 'Password reset successful. You can now log in.');
      setStep(1);
      setPhoneNumber('');
      setCode('');
      setNewPassword('');
    } catch (err) {
      console.error('verifyReset error', err);
      setStatus('Network error while verifying reset');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>

      {step === 1 && (
        <>
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.input}
          />
          <div style={{ marginTop: 8 }}>
            <Button title={loading ? 'Sending...' : 'Send Reset Code'} onPress={requestReset} disabled={loading} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            placeholder="Reset Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <div style={{ marginTop: 8 }}>
            <Button title={loading ? 'Verifying...' : 'Verify & Reset'} onPress={verifyReset} disabled={loading} />
          </div>
        </>
      )}

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, maxWidth: 420 },
  heading: { fontSize: 20, marginBottom: 12 },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  status: { marginTop: 12, color: '#333' },
});
