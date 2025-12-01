import React, { useState } from 'react';

export default function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setStatus('Logged in!');
        if (onLoginSuccess) onLoginSuccess(); // ✅ notify App.js
      } else {
        const data = await resp.json().catch(() => ({}));
        setStatus(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error logging in');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>User Login</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        style={{ display: 'block', marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        style={{ display: 'block', marginBottom: 12, padding: 8 }}
      />
      <button onClick={handleLogin}>Login</button>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
