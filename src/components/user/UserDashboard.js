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
  const token = getToken();

  // Poll backend for status every 5 seconds if jobId exists
  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    let interval;

    const checkStatus = async () => {
      try {
        const res = await getVerificationStatus(jobId, token);
        if (isMounted) {
          setVerificationResult(res);

          // Stop polling once job is no longer pending
          if (res.status !== 'pending') {
            clearInterval(interval);
            setJobId(null); // reset jobId once complete
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError('Unable to fetch verification status');
        clearInterval(interval);
      }
    };

    // Run immediately, then every 5s
    checkStatus();
    interval = setInterval(checkStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, token]);

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

      {verificationResult && (
        <View style={styles.statusPanel}>
          <Text style={styles.statusHeading}>Verification Status</Text>
          <Text style={styles.statusText}>
            {verificationResult.status === 'pending' && '⏳ Pending'}
            {verificationResult.status === 'verified' && '✅ Verified'}
            {verificationResult.status === 'rejected' && '❌ Rejected'}
            {verificationResult.status === 'error' && '⚠️ Error'}
          </Text>
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
  statusPanel: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
  },
  statusHeading: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  statusText: { fontSize: 14 },
  errorPanel: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#ffe5e5',
  },
  errorText: { color: '#d00', fontSize: 14 },
});
