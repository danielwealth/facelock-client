// client/src/components/user/ImageUpload.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import * as faceapi from 'face-api.js';

export default function ImageUpload({ setView }) {
  const [modelsReady, setModelsReady] = useState(false);

  useEffect(() => {
    async function initModels() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setModelsReady(true);
    }
    initModels();
  }, []);

  const handleUpload = async () => {
    try {
      console.log("Upload clicked");
      // your upload logic here (e.g. getFaceDescriptor, send to server)
      // After success:
      setView('user-dashboard'); // ✅ switch to dashboard
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, !modelsReady && styles.disabled]}
        onPress={handleUpload}
        disabled={!modelsReady}
      >
        <Text style={styles.buttonText}>
          {modelsReady ? "Upload Image" : "Loading models..."}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  disabled: { backgroundColor: '#999' },
});
