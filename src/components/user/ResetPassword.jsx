import React, { useState } from 'react';

export default function ResetPassword() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');

  const requestReset = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
        credentials: 'include',
      });
      const data = await resp.json();
      setStatus(data.message || 'Reset request failed');
      setStep(2);
    } catch (err) {
      setStatus('Error requesting reset');
    }
  };

  const verifyReset = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URI}/auth/verify-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, newPassword }),
        credentials: 'include',
      });
      const data = await resp.json();
      setStatus(data.message || 'Verification failed');
    } catch (err) {
      setStatus('Error verifying reset');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {step === 1 && (
        <>
          <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          <button onClick={requestReset}>Send Reset Code</button>
        </>
      )}
      {step === 2 && (
        <>
          <input placeholder="Reset Code" value={code} onChange={e => setCode(e.target.value)} />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button onClick={verifyReset}>Verify & Reset</button>
        </>
      )}
      <p>{status}</p>
    </div>
  );
}
