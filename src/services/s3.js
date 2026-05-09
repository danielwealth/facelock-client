// client/src/services/s3.js
const API_BASE = process.env.REACT_APP_API_URI || '';

/**
 * Request a presigned S3 upload URL from the backend
 * @param {Object} params - { filename, filetype, category }
 * @returns {Promise<Object>} { success, uploadUrl, key, viewUrl }
 */
export async function getUploadUrl({ filename, filetype, category }) {
  const res = await fetch(`${API_BASE}/s3/get-upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, filetype, category }),
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get upload URL');
  }
  return data;
}
