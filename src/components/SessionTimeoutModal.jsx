// client/src/components/SessionTimeoutModal.jsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import auth from 'services/auth';

export default function SessionTimeoutModal({ visible, remainingMs, onClose }) {
  if (!visible) return null;
  const seconds = Math.max(0, Math.floor(remainingMs / 1000));
  return (
    <div style={styles.overlay} role="dialog" aria-live="polite">
      <div style={styles.modal}>
        <h3>Session expiring soon</h3>
        <p>Your session will expire in {seconds} seconds. Would you like to extend it?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={async () => { try { await auth.refreshToken(); onClose(); } catch { await auth.logout(); } }}>Extend session</button>
          <button onClick={async () => { await auth.logout(); }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' },
  modal: { background: '#fff', padding: 20, borderRadius: 8, maxWidth: 420 },
};
