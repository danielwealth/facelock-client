import * as faceapi from 'face-api.js';

let modelsLoaded = false;

// ✅ Load models once globally
export async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
    console.log("✅ Face-api.js models loaded");
  }
}

// ✅ Exported check for UI guards
export function areModelsReady() {
  return modelsLoaded;
}

async function ensureModels() {
  if (!modelsLoaded) {
    await loadModels();
  }
}

// ✅ Force conversion of File/Blob → HTMLImageElement
async function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// ✅ Resize helper (returns a canvas if needed)
function resizeImage(img, maxWidth = 600) {
  console.log("Original image size:", img.width, img.height);

  if (img.width <= maxWidth) return img;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scale = maxWidth / img.width;
  canvas.width = maxWidth;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  console.log("Resized image size:", canvas.width, canvas.height);
  return canvas; // ✅ pass canvas directly to detection
}

// ✅ Main detection function
export async function getFaceDescriptor(file) {
  await ensureModels();

  // Always start from a proper HTMLImageElement
  const img = await fileToImage(file);

  // Resize if necessary
  const input = resizeImage(img);

  console.log("Detection input type:", input.constructor.name); 
  // Should log "HTMLImageElement" or "HTMLCanvasElement"

  const detection = await faceapi
    .detectSingleFace(input)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("No face detected in image");
  return detection.descriptor;
}
