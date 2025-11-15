// client/src/components/Dashboard.js
import React from 'react';
import ImageViewer from './ImageViewer';
import MatchHistory from './MatchHistory';
import BiometricSettings from './BiometricSettings';
import LogoutButton from './LogoutButton';

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to FaceLock Vault</h1>
      <BiometricSettings />
      <ImageViewer />
      <MatchHistory />
      <LogoutButton />
    </div>
  );
}

export default Dashboard;
