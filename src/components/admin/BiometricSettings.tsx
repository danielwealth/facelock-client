// client/src/components/admin/BiometricSettings.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import BiometricUnlock from './BiometricUnlock';
import VerificationDashboard from '../VerificationDashboard';

export default function BiometricSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access & Document Verification</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biometric Unlock</Text>
        <BiometricUnlock />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Verification</Text>
        <VerificationDashboard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
    padding: 8,
    border: '1px solid #e6e6e6',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
});
