// client/src/components/ResetPasswordForm.js
import React, { useState } from 'react';
function ResetPasswordForm({ token }) {
  const [newPassword, setNewPassword] = useState('');
  const handleReset = async () => {
    await fetch(`https://facelockserver.onrender.com/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    alert('Password updated');
  };
  return (
    <div>
      <input type="password" onChange={e => setNewPassword(e.target.value)} />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}
export default ResetPasswordForm;
