import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';

export default function UserDashboard({ setView }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>
      <Text style={styles.message}>
        Welcome! You can upload images, view history, and manage your account here.
      </Text>

      <View style={styles.actions}>
        <Button title="Upload Image" onPress={() => setView('upload')} />
        <Button title="Image Viewer" onPress={() => setView('viewer')} />
        <Button title="Match History" onPress={() => setView('history')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  message: { fontSize: 16, marginBottom: 20 },
  actions: { gap: 12 },
});
