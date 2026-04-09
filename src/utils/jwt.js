// client/src/utils/jwt.js
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function getExpiry(token) {
  const p = decodeJwt(token);
  if (!p || !p.exp) return null;
  // exp is seconds since epoch
  return p.exp * 1000;
}
