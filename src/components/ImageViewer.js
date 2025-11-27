// client/src/components/ImageViewer.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native-web';

export default function ImageViewer() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_API_URI}/images/unlocked-images`, {
          credentials: 'include', // send cookies/session
        });
        const data = await resp.json();
        setImages(data);
      } catch (err) {
        console.error('Failed to fetch images', err);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      {images.map((imgPath, i) => (
        <Image
          key={i}
          source={{ uri: `${process.env.REACT_APP_API_URI}${imgPath}` }}
          style={styles.image}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
