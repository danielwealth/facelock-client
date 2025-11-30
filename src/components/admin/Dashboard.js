// client/src/components/Dashboard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import ImageViewer from './ImageViewer';
import MatchHistory from './MatchHistory';
import BiometricSettings from './BiometricSettings';
import LogoutButton from './LogoutButton';
import ImageUpload from './ImageUpload';  // 👈 add this

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to FaceLock Vault
      </Text>
      <BiometricSettings />
      <ImageUpload />       {/* 👈 now users can register images */}
      <ImageViewer />
      <MatchHistory />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
