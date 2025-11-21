// client/src/components/RequestResetForm.js
import { View, Text } from 'react-native-web';
import { View, Text, TouchableOpacity } from 'react-native';
function RequestResetForm() {
  const [email, setEmail] = useState('');
  const handleRequest = async () => {
    await fetch('https://facelockserver.onrender.com/request-reset', {
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
