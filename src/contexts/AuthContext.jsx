// client/src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import auth from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(auth.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.getToken());
  const [sessionExpiry, setSessionExpiry] = useState(() => {
    const t = auth.getToken();
    if (!t) return null;
    try {
      const p = JSON.parse(atob(t.split('.')[1]));
      return p.exp ? p.exp * 1000 : null;
    } catch { return null; }
  });

  useEffect(() => {
    auth.setAuthChangeHandler((evt) => {
      if (evt.loggedOut) {
        setToken(null);
        setIsAuthenticated(false);
        setSessionExpiry(null);
      } else if (evt.loggedIn || evt.refreshed) {
        const newToken = auth.getToken();
        setToken(newToken);
        setIsAuthenticated(!!newToken);
        if (newToken) {
          try {
            const p = JSON.parse(atob(newToken.split('.')[1]));
            setSessionExpiry(p.exp ? p.exp * 1000 : null);
          } catch { setSessionExpiry(null); }
        }
      }
    });
    // schedule refresh if token exists
    if (token) auth.setToken(token);
    return () => auth.setAuthChangeHandler(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, sessionExpiry, setToken: auth.setToken, logout: auth.logout }}>
      {children}
    </AuthContext.Provider>
  );
}
