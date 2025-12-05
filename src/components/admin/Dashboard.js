import React from 'react';

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <p style={styles.subheading}>
        Welcome, Admin! Use the tools below to manage the system.
      </p>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>User Management</h3>
          <p>View and manage registered users.</p>
          <button style={styles.button}>Go to Users</button>
        </div>

        <div style={styles.card}>
          <h3>Image Controls</h3>
          <p>Upload, lock, or unlock images.</p>
          <button style={styles.button}>Manage Images</button>
        </div>

        <div style={styles.card}>
          <h3>Match History</h3>
          <p>Review biometric match logs.</p>
          <button style={styles.button}>View History</button>
        </div>

        <div style={styles.card}>
          <h3>Settings</h3>
          <p>Configure biometric and security options.</p>
          <button style={styles.button}>Open Settings</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 20,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    flex: '1 1 200px',
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 10,
    padding: '8px 12px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};
