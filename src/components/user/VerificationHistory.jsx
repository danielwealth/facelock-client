// client/src/components/user/VerificationHistory.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native-web';
import { getVerificationHistory } from '../../services/verify';

export default function VerificationHistory({ onOpenJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const res = await getVerificationHistory();
        // backend may return { jobs: [...] } or just an array
        setJobs(res.jobs || res || []);
      } catch (err) {
        console.error('History fetch failed', err);
        setError(err?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verification History</Text>

      {loading && <ActivityIndicator size="small" color="#0b5cff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {jobs.length === 0 && !loading && !error && (
        <Text style={styles.hint}>No past verification jobs found.</Text>
      )}

      {jobs.map((job) => (
        <View key={job.jobId} style={styles.job}>
          <Text style={styles.jobText}>
            Job {job.jobId} — Status: {job.status}
          </Text>
          {job.match !== undefined && (
            <Text style={styles.jobText}>
              Match: {job.match ? '✅ Yes' : '❌ No'} (Confidence: {Math.round(job.confidence * 100)}%)
            </Text>
          )}
          <Button title="View" onPress={() => onOpenJob(job)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  heading: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  hint: { color: '#666', marginBottom: 8 },
  error: { color: 'red', marginBottom: 8 },
  job: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 8 },
  jobText: { fontSize: 13, marginBottom: 4 },
});
