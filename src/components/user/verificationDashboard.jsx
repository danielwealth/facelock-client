// client/src/components/user/VerificationDashboard.jsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import UploadDocument from './UploadDocument';
import VerificationStatus from './VerificationStatus';
import VerificationHistory from './VerificationHistory';

export default function VerificationDashboard({ setView, isAdmin }) {
  const [currentJob, setCurrentJob] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Document Verification</Text>

      <UploadDocument
        onUploaded={(job) => {
          // job expected shape: { jobId, status, ... }
          setCurrentJob(job);
        }}
      />

      {currentJob ? (
        <View style={styles.currentJob}>
          <VerificationStatus job={currentJob} onClose={() => setCurrentJob(null)} />
        </View>
      ) : (
        <Text style={styles.hint}>No active verification job. Upload a document to start.</Text>
      )}

      <VerificationHistory onOpenJob={(job) => setCurrentJob(job)} />

      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={() => setView(isAdmin ? 'admin-dashboard' : 'user-dashboard')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, maxWidth: 900 },
  heading: { fontSize: 20, marginBottom: 12, fontWeight: '600' },
  hint: { color: '#666', marginBottom: 12 },
  currentJob: { marginTop: 12, marginBottom: 12 },
  footer: { marginTop: 16 },
});
