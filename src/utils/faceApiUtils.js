// client/src/utils/faceApiUtils.js
import * as faceapi from 'face-api.js';

/**
 * Ensure models are loaded once
 */
let modelsLoaded = false;
async function ensureModelsLoaded() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
  }
}

/**
 * Extract a 128‑d face descriptor from an image file
 */
export async function getFaceDescriptor(imageFile) {
  await ensureModelsLoaded();

  const img = await faceapi.bufferToImage(imageFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection?.descriptor || null;
}

/**
 * Compare a new descriptor against stored ones
 */
export function compareDescriptors(newDescriptor, storedDescriptor, threshold = 0.6) {
  const distance = Math.sqrt(
    newDescriptor.reduce((sum, val, i) => sum + Math.pow(val - storedDescriptor[i], 2), 0)
  );
  return distance < threshold;
}
