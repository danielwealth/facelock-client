// client/src/components/user/UserDashboard.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';

export default function UserDashboard({ setRoute }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>
      <Text style={styles.subheading}>
        Please complete your identity verification by uploading your ID and capturing a selfie.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setRoute('document-verification')}
      >
        <Text style={styles.buttonText}>Start Document Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  subheading: { fontSize: 14, marginBottom: 20, color: '#555' },
  button: {
    backgroundColor: '#0b5cff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
