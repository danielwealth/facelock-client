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
      const data = await resp.json();

      if (resp.ok) {
        setStatus('Logged in!');
        if (onLoginSuccess) onLoginSuccess(); // ✅ tell App.js that login succeeded
      } else {
        setStatus(data.error || 'Login failed');
      }
    } catch (err) {
      setStatus('Error logging in');
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <p>{status}</p>
    </div>
  );
}
