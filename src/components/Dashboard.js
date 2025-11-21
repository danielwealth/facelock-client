// client/src/components/Dashboard.js
import React from 'react';
import { View, Text } from 'react-native-web';
import ImageViewer from './ImageViewer';
import MatchHistory from './MatchHistory';
import BiometricSettings from './BiometricSettings';
import LogoutButton from './LogoutButton';

export default function Dashboard() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Welcome to FaceLock Vault
      </Text>
      <BiometricSettings />
      <ImageViewer />
      <MatchHistory />
      <LogoutButton />
    </View>
  );
}
