// ImageUpload.js
import React, { useState } from 'react';
import { View, Text } from 'react-native-web';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [passcode, setPasscode] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('passcode', passcode);

    await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div className="p-4">
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <input type="password" placeholder="Enter passcode" onChange={e => setPasscode(e.target.value)} />
      <button onClick={handleUpload}>Lock Image</button>
    </div>
  );
}

export default ImageUpload;
