// client/src/components/ImageViewer.js
import React, { useEffect, useState } from 'react';

function ImageViewer() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const resp = await fetch('http://localhost:5000/unlocked-images', {
        credentials: 'include', // send cookies/session
      });
      const data = await resp.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {images.map((imgPath, i) => (
        <img key={i} src={`http://localhost:5000/${imgPath}`} alt={`Unlocked ${i}`} className="rounded shadow" />
      ))}
    </div>
  );
}

export default ImageViewer;
