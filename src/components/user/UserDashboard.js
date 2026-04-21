// client/src/components/user/UserDashboard.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';

export default function UserDashboard({ setRoute }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>
      <Text style={styles.subheading}>Choose an action:</Text>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('upload')}>
        <Text style={styles.buttonText}>Upload Document</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('viewer')}>
        <Text style={styles.buttonText}>View Uploaded Images</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('history')}>
        <Text style={styles.buttonText}>Verification History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setRoute('document-verification')}>
        <Text style={styles.buttonText}>Start Document Verification</Text>
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
