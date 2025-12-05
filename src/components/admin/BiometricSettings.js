// client/src/components/BiometricSettings.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import BiometricUnlock from './BiometricUnlock';

export default function BiometricSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Access</Text>
      <BiometricUnlock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});
