// client/src/components/VerificationHistory.jsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-web';
import { getHistory } from '../services/verify';

export default function VerificationHistory({ onOpenJob }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getHistory();
        if (!mounted) return;
        setHistory(res || []);
      } catch (e) {
        setErr(e.message || 'Failed to load history');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <Text>Loading history...</Text>;
  if (err) return <Text style={{ color: 'red' }}>{err}</Text>;
  if (!history.length) return <Text>No verifications yet</Text>;

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontWeight: 'bold' }}>Verification History</Text>
      <ul>
        {history.map(h => (
          <li key={h.jobId} style={{ marginBottom: 8 }}>
            <div>
              <strong>{h.jobId}</strong> — {h.status} — {new Date(h.createdAt).toLocaleString()}
              <div>
                <button onClick={() => onOpenJob(h)}>Open</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </View>
  );
}
