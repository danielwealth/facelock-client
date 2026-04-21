// client/src/components/admin/AdminDashboard.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';

export default function Dashboard({ setRoute }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
      <Text style={styles.subheading}>Manage system and verification tasks:</Text>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('biometric-settings')}>
        <Text style={styles.buttonText}>Biometric Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('biometric-unlock')}>
        <Text style={styles.buttonText}>Biometric Unlock</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('verification-dashboard')}>
        <Text style={styles.buttonText}>Verification Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('status')}>
        <Text style={styles.buttonText}>System Status</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('reset')}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  subheading: { fontSize: 14, marginBottom: 12 },
  button: {
    backgroundColor: '#0b5cff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
