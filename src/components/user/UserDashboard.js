// client/src/components/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native-web';
import UploadDocument from './UploadDocument';
import { getVerificationStatus } from '../../services/verify';
import { getToken } from '../../services/auth';

export default function UserDashboard() {
  const [route, setRoute] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // track polling state
  const token = getToken();

  // Poll backend for status with exponential backoff
  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    let delay = 10000; // start at 10s
    let interval;

    const checkStatus = async () => {
      try {
        setLoading(true);
        const res = await getVerificationStatus(jobId, token);
        if (isMounted) {
          setVerificationResult(res);

          if (res.status !== 'pending') {
            clearInterval(interval);
            setJobId(null);
            setLoading(false);
          } else {
            // backoff: increase delay up to 30s
            delay = Math.min(delay * 2, 30000);
            clearInterval(interval);
            interval = setInterval(checkStatus, delay);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError('Unable to fetch verification status');
        clearInterval(interval);
        setLoading(false);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, delay);

    return () => {
      isMounted = false;
      clearInterval(interval);
      setLoading(false);
    };
  }, [jobId, token]);

  // Manual refresh button
  const refreshStatus = async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      const res = await getVerificationStatus(jobId, token);
      setVerificationResult(res);
      if (res.status !== 'pending') {
        setJobId(null);
      }
    } catch (err) {
      console.error('Manual refresh error:', err);
      setError('Unable to fetch verification status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Dashboard</Text>

      {!route && (
        <>
          <Text style={styles.subheading}>
            Please complete your identity verification by uploading your ID document and capturing a selfie.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setRoute('document-verification')}
          >
            <Text style={styles.buttonText}>Start Document Verification</Text>
          </TouchableOpacity>
        </>
      )}

      {route === 'document-verification' && (
        <UploadDocument
          onUploaded={(res) => {
            setVerificationResult(res);
            if (res.jobId) setJobId(res.jobId);
          }}
        />
      )}

      {loading && (
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      )}

      {verificationResult && (
        <View style={styles.statusPanel}>
          <Text style={styles.statusHeading}>Verification Status</Text>
          <Text style={styles.statusText}>
            {verificationResult.status === 'pending' && '⏳ Pending'}
            {verificationResult.status === 'verified' && '✅ Verified'}
            {verificationResult.status === 'rejected' && '❌ Rejected'}
            {verificationResult.status === 'error' && '⚠️ Error'}
          </Text>
          {verificationResult.status === 'pending' && (
            <TouchableOpacity style={styles.refreshButton} onPress={refreshStatus}>
              <Text style={styles.refreshText}>Refresh Status</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {error && (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  subheading: { fontSize: 14, marginBottom: 20, color: '#555' },
  button: {
    backgroundColor: '#0b5cff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0b5cff',
    // simple animation effect
    animation: 'progressAnim 2s infinite linear',
  },
  statusPanel: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  statusHeading: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  statusText: { fontSize: 14 },
  refreshButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  refreshText: { fontSize: 14, color: '#0b5cff', fontWeight: '600' },
  errorPanel: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#ffe5e5',
  },
  errorText: { color: '#d00', fontSize: 14 },
});
