import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';

export default function Dashboard({ setView }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
      <Text style={styles.subheading}>
        Welcome, Admin! Use the tools below to manage the system.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biometric Settings</Text>
        <Text>Configure biometric and security options.</Text>
        <Button title="Open Settings" onPress={() => setView('admin-settings')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biometric Unlock</Text>
        <Text>Unlock images or users with biometric verification.</Text>
        <Button title="Unlock" onPress={() => setView('admin-unlock')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  subheading: { fontSize: 16, marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
});
