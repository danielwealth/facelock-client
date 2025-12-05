// client/src/components/user/ImageUpload.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native-web';
import * as faceapi from 'face-api.js';

export default function ImageUpload() {
  const [modelsReady, setModelsReady] = useState(false);

  useEffect(() => {
    async function initModels() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      console.log("✅ Models loaded:");
      console.log("ssdMobilenetv1:", faceapi.nets.ssdMobilenetv1.isLoaded);
      console.log("faceLandmark68Net:", faceapi.nets.faceLandmark68Net.isLoaded);
      console.log("faceRecognitionNet:", faceapi.nets.faceRecognitionNet.isLoaded);

      setModelsReady(true);
    }
    initModels();
  }, []);

  const handleUpload = async () => {
    // your upload logic here
    console.log("Upload clicked");
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
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#999',
  },
});
