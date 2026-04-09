// client/src/components/VerificationStatus.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native-web';
import { getStatus } from '../services/verify';

export default function VerificationStatus({ job, onClose }) {
  const [status, setStatus] = useState(job.status || 'pending');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let interval = null;

    async function poll() {
      try {
        const res = await getStatus(job.jobId);
        if (cancelled) return;
        setStatus(res.status);
        if (res.status === 'done' || res.status === 'failed') {
          setResult(res);
          clearInterval(interval);
        }
      } catch (err) {
        setError(err.message || 'Status check failed');
        clearInterval(interval);
      }
    }

    // initial poll then every 3s
    poll();
    interval = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [job.jobId]);

  return (
    <View style={{ border: '1px solid #ddd', padding: 12, marginTop: 12 }}>
      <Text>Job ID: {job.jobId}</Text>
      <Text>Status: {status}</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {result && result.status === 'done' && (
        <View style={{ marginTop: 8 }}>
          <Text>Result: {result.outcome}</Text>
          <a href={result.documentUrl} target="_blank" rel="noreferrer">Open document</a>
        </View>
      )}
      <div style={{ marginTop: 8 }}>
        <button onClick={onClose}>Close</button>
      </div>
    </View>
  );
}
