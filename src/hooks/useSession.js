// client/src/hooks/useSession.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function useSession() {
  const { sessionExpiry, logout } = useContext(AuthContext);
  const [remainingMs, setRemainingMs] = useState(sessionExpiry ? sessionExpiry - Date.now() : null);

  useEffect(() => {
    if (!sessionExpiry) { setRemainingMs(null); return; }
    const tick = () => setRemainingMs(sessionExpiry - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionExpiry]);

  const minutes = remainingMs ? Math.max(0, Math.floor(remainingMs / 60000)) : null;
  const seconds = remainingMs ? Math.max(0, Math.floor((remainingMs % 60000) / 1000)) : null;

  return { remainingMs, minutes, seconds, logout };
}
