// uploadDirect.js
async function uploadDocument(file, secretKey, token) {
  const form = new FormData();
  form.append('document', file);
  form.append('key', secretKey);

  const res = await fetch('/verify-identity', {
    method: 'POST',
    credentials: 'include', // if using cookies
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form
  });

  const body = await res.json().catch(() => ({ success: false, error: 'Invalid JSON' }));
  return { status: res.status, body };
}

// Usage
// const result = await uploadDocument(fileInput.files[0], 'user-secret', authToken);
