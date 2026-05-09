// client/src/components/user/VerificationStatus.jsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import { getVerificationStatus } from '../../services/verify';

export default function VerificationStatus({ job, onClose }) {
  const [status, setStatus] = useState(job?.status || 'pending');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function pollOnce() {
      if (!job?.jobId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getVerificationStatus(job.jobId);
        if (!mountedRef.current) return;
        setStatus(res?.status || 'unknown');
        if (res?.status === 'done' || res?.status === 'failed') {
          setResult(res);
          stopPolling();
        } else {
          setResult(null);
        }
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err?.message || 'Status check failed');
        stopPolling();
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    function startPolling() {
      pollOnce(); // immediate
      stopPolling();
      intervalRef.current = setInterval(pollOnce, 3000);
    }

    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    startPolling();

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [job?.jobId]);

  const handleRefresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getVerificationStatus(job.jobId);
      setStatus(res?.status || status);
      if (res?.status === 'done' || res?.status === 'failed') {
        setResult(res);
      }
    } catch (err) {
      setError(err?.message || 'Refresh failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(job.jobId);
      setInfo('Job ID copied to clipboard');
      setTimeout(() => setInfo(null), 2000);
    } catch {
      setError('Unable to copy Job ID');
      setTimeout(() => setError(null), 2000);
    }
  };

  const documentUrl = result?.documentUrl || job?.documentUrl || null;
  const outcome = result?.outcome || result?.result || null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Job</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Job ID:</Text>
        <Text style={styles.value}>{job.jobId}</Text>
        <View style={{ marginLeft: 8 }}>
          <Button title="Copy" onPress={handleCopyId} />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      {loading && <Text style={styles.info}>Checking status…</Text>}
      {info && <Text style={styles.info}>{info}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {result && result.status === 'done' && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Outcome</Text>
          <Text style={styles.resultValue}>{outcome || 'Completed'}</Text>

          {documentUrl ? (
            <View style={{ marginTop: 8 }}>
              <a href={documentUrl} target="_blank" rel="noreferrer" style={styles.link}>
                Open document
              </a>
            </View>
          ) : (
            <Text style={styles.info}>No document URL available</Text>
          )}
        </View>
      )}

      {result && result.status === 'failed' && (
        <View style={styles.result}>
          <Text style={styles.error}>Verification failed</Text>
          {result.error && <Text style={styles.error}>{result.error}</Text>}
        </View>
      )}

      <View style={styles.actions}>
        <Button title="Refresh" onPress={handleRefresh} />
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { border: '1px solid #ddd', padding: 12, marginTop: 12, borderRadius: 6, maxWidth: 900 },
  title: { fontWeight: '700', marginBottom: 8 },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  label: { fontWeight: '600' },
  value: { color: '#333' },
  info: { color: '#666', marginBottom: 8 },
  error: { color: 'red', marginBottom: 8 },
  result: { marginTop: 8 },
  resultLabel: { fontWeight: '600' },
  resultValue: { marginTop: 4 },
  link: { color: '#1a73e8', textDecoration: 'none' },
  actions: { display: 'flex', gap: 8, marginTop: 12, flexDirection: 'row' },
});
