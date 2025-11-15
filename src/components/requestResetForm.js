// client/src/components/RequestResetForm.js
function RequestResetForm() {
  const [email, setEmail] = useState('');
  const handleRequest = async () => {
    await fetch('http://localhost:5000/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    alert('Reset link sent');
  };
  return (
    <div>
      <input type="email" onChange={e => setEmail(e.target.value)} />
      <button onClick={handleRequest}>Request Reset</button>
    </div>
  );
}
