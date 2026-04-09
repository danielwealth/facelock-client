// client/src/components/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import AdminLogoutButton from './LogoutButton';
import { getHistory } from '../../services/verify'; // expects client/src/services/verify.js

export default function Dashboard({ setView }) {
  const [pendingCount, setPendingCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        // getHistory should return an array of jobs with a `status` and `createdAt`
        const history = await getHistory();
        if (!mounted) return;
        const pending = (history || []).filter(h => h.status === 'pending' || h.status === 'processing').length;
        setPendingCount(pending);
      } catch (e) {
        console.warn('Failed to load verification history', e);
        if (mounted) setErr('Unable to load verification stats');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    // optional: refresh every 30s while dashboard is open
    const interval = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
      <Text style={styles.subheading}>
        Welcome, Admin! Use the tools below to manage the system.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Document Verification</Text>
        <Text>
          Uploads and verification jobs are managed here. Review pending jobs, view results,
          and re-run verification when needed.
        </Text>
        <View style={{ marginTop: 8 }}>
          <Button title="Open Verification Dashboard" onPress={() => setView('admin-settings')} />
        </View>
        <View style={{ marginTop: 8 }}>
          <Text>
            {loading ? 'Loading verification stats...' : err ? err : `Pending jobs: ${pendingCount ?? '—'}`}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biometric Settings</Text>
        <Text>Configure biometric and security options.</Text>
        <Button title="Open Settings" onPress={() => setView('admin-settings')} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Biometric Unlock</Text>
        <Text>Unlock images or users with biometric verification.</Text>
        <Button title="Unlock" onPress={() => setView('admin-unlock')} />
      </View>

      <View style={styles.logout}>
        <AdminLogoutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  subheading: { fontSize: 16, marginBottom: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  logout: { marginTop: 20 },
});
