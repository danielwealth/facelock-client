// client/src/components/ImageUpload.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native-web';

export default function ImageUpload() {
  const [passcode, setPasscode] = useState('');
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    if (!image) {
      console.warn('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('passcode', passcode);

    await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Select an image:</Text>
      {/* For web, you can still use an <input type="file"> wrapped in a View */}
      <input
        type="file"
        onChange={e => setImage(e.target.files[0])}
        style={{ marginBottom: 12 }}
      />

      <TextInput
        secureTextEntry
        placeholder="Enter passcode"
        value={passcode}
        onChangeText={setPasscode}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 12,
        }}
      />

      <Button title="Lock Image" onPress={handleUpload} />
    </View>
  );
}
export default ImageUpload;
