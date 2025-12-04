import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native-web';

export default function ImageViewer() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('Loading images...');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_API_URI}/images/unlocked-images`, {
          credentials: 'include', // 🔑 send cookies/session
        });
        const data = await resp.json();

        const imgArray = Array.isArray(data) ? data : data.images || [];
        setImages(imgArray);
        setStatus(imgArray.length ? '' : 'No images found');
      } catch (err) {
        console.error('Failed to fetch images', err);
        setStatus('Error fetching images');
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      {status ? (
        <Text style={styles.status}>{status}</Text>
      ) : (
        images.map((imgPath, i) => (
          <Image
            key={i}
            source={{ uri: `${process.env.REACT_APP_API_URI}${imgPath}` }}
            style={styles.image}
          />
        ))
      )}
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
  status: {
    fontSize: 16,
    color: 'gray',
  },
});
