// client/src/faceApiHelpers.js
import * as faceapi from 'face-api.js';

let modelsReady = false;

export async function loadModels() {
  if (!modelsReady) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsReady = true;
    console.log("✅ Models loaded");
  }
}

export function areModelsReady() {
  return modelsReady;
}

export async function getFaceDescriptor(imageFile) {
  await loadModels(); // ensure models are ready

  const img = await faceapi.bufferToImage(imageFile);
  await new Promise(resolve => { img.onload = resolve; }); // wait for load

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("No face detected in image");
  return detection.descriptor;
}
