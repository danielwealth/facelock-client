// presignAndVerify.js
import axios from 'axios';

async function presignAndUpload(file, secretKey, token) {
  // 1) Ask server for presigned URL and target key
  const presign = await axios.post('/presign-upload', { filename: file.name, contentType: file.type }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  const { url, key: s3Key } = presign.data;

  // 2) Upload directly to S3
  await axios.put(url, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (p) => console.log('progress', Math.round((p.loaded / p.total) * 100))
  });

  // 3) Notify server to run verification using s3Key
  const verify = await axios.post('/verify-identity', { key: secretKey, s3Key }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  return verify.data;
}
