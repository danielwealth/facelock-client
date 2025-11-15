// client/src/components/LogoutButton.js
import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    alert('Logged out');
    window.location.reload();
  };

  return (
    <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}

export default LogoutButton;
