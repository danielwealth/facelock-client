import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';

export default function UserDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>
      <Text style={styles.message}>
        Welcome! You can upload images, view history, and manage your account here.
      </Text>

      <View style={styles.actions}>
        <Button title="Upload Image" onPress={() => console.log("Upload pressed")} />
        <Button title="View History" onPress={() => console.log("History pressed")} />
        <Button title="Manage Account" onPress={() => console.log("Manage pressed")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    gap: 12, // spacing between buttons
  },
});
