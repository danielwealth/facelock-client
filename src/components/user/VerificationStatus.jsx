// client/src/components/user/VerificationStatus.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native-web';
import { getVerificationStatus } from '../../services/verify';

export default function VerificationStatus({ job, onClose }) {
  const [status, setStatus] = useState(job);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId;

    async function poll() {
      if (!job?.jobId) return;
      setLoading(true);
      try {
        const res = await getVerificationStatus(job.jobId);
        setStatus(res);
        // stop polling if job is finished
        if (res.status === 'done' || res.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Status check failed', err);
        setStatus({ error: err?.message || 'Error checking status' });
        clearInterval(intervalId);
      } finally {
        setLoading(false);
      }
    }

    // initial poll
    poll();
    // poll every 5 seconds
    intervalId = setInterval(poll, 5000);

    return () => clearInterval(intervalId);
  }, [job]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verification Status</Text>

      {loading && <ActivityIndicator size="small" color="#0b5cff" />}

      {status?.error && <Text style={styles.error}>{status.error}</Text>}

      {status?.status && (
        <View style={styles.block}>
          <Text style={styles.label}>Job ID:</Text>
          <Text style={styles.value}>{job.jobId}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{status.status}</Text>

          {status.match !== undefined && (
            <>
              <Text style={styles.label}>Match:</Text>
              <Text style={styles.value}>{status.match ? '✅ Yes' : '❌ No'}</Text>
            </>
          )}

          {status.confidence !== undefined && (
            <>
              <Text style={styles.label}>Confidence:</Text>
              <Text style={styles.value}>{(status.confidence * 100).toFixed(1)}%</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  heading: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  block: { marginTop: 8 },
  label: { fontWeight: '600', marginTop: 4 },
  value: { marginLeft: 4 },
  error: { color: 'red', marginTop: 8 },
  footer: { marginTop: 12 },
});
