// client/src/components/user/VerificationHistory.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import { getHistory } from '../services/verify';

export default function VerificationHistory({ onOpenJob }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await getHistory();
        if (!mounted) return;
        setHistory(Array.isArray(res) ? res : []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || 'Failed to load history');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading history...</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{err}</Text>
        <div style={{ marginTop: 8 }}>
          <Button title="Retry" onPress={() => {
            setLoading(true);
            setErr(null);
            // trigger effect reload by toggling loading (simple approach)
            (async () => {
              try {
                const res = await getHistory();
                setHistory(Array.isArray(res) ? res : []);
              } catch (e) {
                setErr(e?.message || 'Failed to load history');
              } finally {
                setLoading(false);
              }
            })();
          }} />
        </div>
      </View>
    );
  }

  if (!history.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No verifications yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verification History</Text>
      <ul style={styles.list}>
        {history.map((h) => {
          const created = h.createdAt ? new Date(h.createdAt).toLocaleString() : '—';
          return (
            <li key={h.jobId} style={styles.item}>
              <div style={styles.itemRow}>
                <div style={styles.itemMain}>
                  <Text style={styles.jobId}>{h.jobId}</Text>
                  <Text style={styles.meta}> — {h.status} — {created}</Text>
                </div>
                <div style={styles.itemActions}>
                  <Button title="Open" onPress={() => onOpenJob && onOpenJob(h)} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12, maxWidth: 900, padding: 8 },
  heading: { fontWeight: '700', marginBottom: 8 },
  loading: { color: '#666' },
  error: { color: 'red' },
  empty: { color: '#666' },
  list: { paddingLeft: 16, marginTop: 8 },
  item: { marginBottom: 10, listStyle: 'none' },
  itemRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  itemMain: { display: 'flex', alignItems: 'center', gap: 8 },
  jobId: { fontWeight: '700' },
  meta: { color: '#444', marginLeft: 6 },
  itemActions: {},
});
