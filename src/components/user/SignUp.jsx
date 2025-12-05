
import React, { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSignUp = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // match User.js schema
      });
      const data = await resp.json();
      setStatus(data.message || 'Signup failed');
    } catch (err) {
      setStatus('Error during signup');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <button onClick={handleSignUp}>Register</button>
      <p>{status}</p>
    </div>
  );
}
