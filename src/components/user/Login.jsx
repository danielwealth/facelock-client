
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // ✅ send email, not username
        credentials: 'include', // 🔑 ensures session cookie is stored
      });
      const data = await resp.json();
      setStatus(data.message || 'Login failed');
    } catch (err) {
      setStatus('Error during login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{status}</p>
    </div>
  );
}
