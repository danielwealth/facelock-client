import * as faceapi from 'face-api.js';
async function getFaceEmbedding(imageFile) {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

  const img = await faceapi.bufferToImage(imageFile);
  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

  return detections?.descriptor; // 128-d vector
}

const handleLogin = async () => {
  const resp = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json();
  localStorage.setItem('token', data.token);
  window.location.href = '/dashboard';
};
const token = localStorage.getItem('token');
const resp = await fetch('http://localhost:5000/unlocked-images', {
  headers: { Authorization: `Bearer ${token}` },
});




export async function getFaceDescriptor(imageFile) {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

  const img = await faceapi.bufferToImage(imageFile);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection?.descriptor;
}
async function findMatchingUser(newDescriptor, threshold = 0.6) {
  const allDescriptors = await FaceDescriptor.find();
  for (const record of allDescriptors) {
    const distance = Math.sqrt(
      newDescriptor.reduce((sum, val, i) => sum + Math.pow(val - record.descriptor[i], 2), 0)
    );
    if (distance < threshold) {
      return record.userId;
    }
  }
  return null;
}
function RequestOTPForm() {
  const [phone, setPhone] = useState('');
  const handleRequest = async () => {
    await fetch('http://localhost:5000/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    alert('OTP sent to your phone');
  };
  return (
    <div>
      <input type="tel" onChange={e => setPhone(e.target.value)} />
      <button onClick={handleRequest}>Request OTP</button>
    </div>
  );
}

