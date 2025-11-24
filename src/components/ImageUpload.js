// client/src/components/ImageUpload.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native-web';

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

    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      console.log('Uploaded:', data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>Select an image:</Text>

      {/* RN-Web doesn't have file picker, so we embed HTML input */}
      <View style={{ marginBottom: 12 }}>
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          style={{ marginBottom: 12 }}
        />
      </View>

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
