import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
    console.log("✅ Face-api.js models loaded");
  }
}

async function ensureModels() {
  if (!modelsLoaded) {
    await loadModels();
  }
}

// 🔧 Resize helper built into getFaceDescriptor
async function resizeImage(file, maxWidth = 600) {
  const img = await faceapi.bufferToImage(file);
  await new Promise(resolve => { img.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scale = maxWidth / img.width;
  canvas.width = maxWidth;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

// ✅ Main detection function with resize
export async function getFaceDescriptor(imageFile) {
  await ensureModels();

  const resizedImg = await resizeImage(imageFile);

  const detection = await faceapi
    .detectSingleFace(resizedImg)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("No face detected in image");
  return detection.descriptor;
}
