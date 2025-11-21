// client/src/components/BiometricSettings.tsx
import { View, Text } from 'react-native';
import BiometricUnlock from './BiometricUnlock';

export default function BiometricSettings() {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>
        Biometric Access
      </Text>
      <BiometricUnlock />
    </View>
  );
}
