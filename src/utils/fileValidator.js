// client/src/utils/fileValidator.js
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const DEFAULT_ALLOWED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export function validateFile(file, { maxBytes = DEFAULT_MAX_BYTES, allowedTypes = DEFAULT_ALLOWED } = {}) {
  if (!file) return { ok: false, error: 'No file provided' };

  if (file.size > maxBytes) {
    return { ok: false, error: `File is too large. Max ${Math.round(maxBytes / 1024 / 1024)} MB allowed.` };
  }

  if (allowedTypes && allowedTypes.length && !allowedTypes.includes(file.type)) {
    // allow extension fallback if type is empty (some browsers)
    const ext = (file.name || '').split('.').pop()?.toLowerCase();
    const extAllowed = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };
    if (!ext || !allowedTypes.includes(extAllowed[ext])) {
      return { ok: false, error: 'Unsupported file type. Allowed: jpg, png, webp, pdf.' };
    }
  }

  return { ok: true };
}
