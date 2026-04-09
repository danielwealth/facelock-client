// client/src/components/VerificationDashboard.jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native-web';
import UploadDocument from './UploadDocument';
import VerificationStatus from './VerificationStatus';
import VerificationHistory from './VerificationHistory';

export default function VerificationDashboard({ setView, isAdmin }) {
  const [currentJob, setCurrentJob] = useState(null);

  return (
    <View>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Document Verification</Text>
      <UploadDocument onUploaded={(job) => setCurrentJob(job)} />
      {currentJob && <VerificationStatus job={currentJob} onClose={() => setCurrentJob(null)} />}
      <VerificationHistory onOpenJob={(job) => setCurrentJob(job)} />
      <View style={{ marginTop: 12 }}>
        <Button title="Back" onPress={() => setView(isAdmin ? 'admin-dashboard' : 'user-dashboard')} />
      </View>
    </View>
  );
}
