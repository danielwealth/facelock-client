// client/src/face-api.js
import * as faceapi from 'face-api.js';

// Track model load state
let modelsLoaded = false;

/**
 * Load face-api models from /models (served by your static assets)
 */
export async function loadModels() {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  modelsLoaded = true;
  console.log('✅ Face-api.js models loaded');
}

/**
 * Ensure models are loaded before any detection
 */
async function ensureModels() {
  if (!modelsLoaded) await loadModels();
}

/**
 * Convert a File/Blob to an HTMLImageElement and wait for load
 */
async function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get 128-d face embedding (descriptor) for an image File/Blob
 * @param {File|Blob|HTMLImageElement} input - file or already loaded image element
 * @returns {Float32Array} descriptor
 */
export async function getFaceEmbedding(input) {
  await ensureModels();

  let img;
  if (input instanceof HTMLImageElement) {
    img = input;
  } else {
    img = await fileToImage(input);
  }

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error('No face detected in image');
  return detection.descriptor; // Float32Array
}

/**
 * Alias for embedding (keeps your previous naming)
 */
export async function getFaceDescriptor(input) {
  return getFaceEmbedding(input);
}

/**
 * Compute Euclidean distance between two descriptors (Float32Array or Array)
 */
export function descriptorDistance(a, b) {
  if (!a || !b || a.length !== b.length) {
    throw new Error('Descriptors must be same length arrays');
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * Find best match from a list of candidate descriptors.
 * @param {Float32Array} probe - descriptor to match
 * @param {Array<{ userId: string, descriptor: number[] }>} candidates - list from backend
 * @param {number} threshold - distance threshold (default 0.6)
 * @returns { { userId: string, distance: number } | null }
 */
export function findBestMatch(probe, candidates = [], threshold = 0.6) {
  if (!probe || !candidates || !candidates.length) return null;
  let best = null;
  for (const c of candidates) {
    const dist = descriptorDistance(probe, c.descriptor);
    if (dist < threshold && (!best || dist < best.distance)) {
      best = { userId: c.userId, distance: dist };
    }
  }
  return best;
}
