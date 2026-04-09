// client/src/App.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import { loadModels } from './faceApiHelpers';
import * as tf from '@tensorflow/tfjs';

// Components (existing)
import AdminLogin from './components/admin/LoginForm';
import Dashboard from './components/admin/Dashboard';
import UserDashboard from './components/user/UserDashboard';
import UserLogin from './components/user/Login';
import RegisterForm from './components/user/RegisterForm';
import ImageUpload from './components/user/ImageUpload';
import ImageViewer from './components/user/ImageViewer';
import MatchHistory from './components/user/MatchHistory';
import ResetPassword from './components/user/ResetPassword';
import BiometricSettings from './components/admin/BiometricSettings';
import BiometricUnlock from './components/admin/BiometricUnlock';

// New Document Verification components
import VerificationDashboard from './components/user/VerificationDashboard';

export default function App() {
  const [view, setView] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // TensorFlow backend preference
  useEffect(() => {
    tf.setBackend('webgl').then(() => {
      console.log('✅ TensorFlow backend set to WebGL');
    }).catch(() => {
      tf.setBackend('cpu');
    });
    loadModels();
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setView('admin-dashboard');
  };

  const handleUserLoginSuccess = () => {
    setIsUserAuthenticated(true);
    setView('user-dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'admin-login':
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case 'admin-dashboard':
        return isAdminAuthenticated ? <Dashboard setView={setView} /> : <Text>Please log in as admin first</Text>;
      case 'login':
        return <UserLogin onLoginSuccess={handleUserLoginSuccess} />;
      case 'register':
        return <RegisterForm setView={setView} />;
      case 'user-dashboard':
        return isUserAuthenticated ? <UserDashboard setView={setView} /> : <Text>Please log in as user first</Text>;
      case 'upload':
        return <ImageUpload setView={setView} />;
      case 'viewer':
        return <ImageViewer />;
      case 'history':
        return <MatchHistory />;
      case 'reset':
        return <ResetPassword />;
      case 'admin-settings':
        return <BiometricSettings />;
      case 'admin-unlock':
        return <BiometricUnlock />;
      case 'document-verification':
        return <VerificationDashboard setView={setView} isAdmin={isAdminAuthenticated} />;
      default:
        return <Text>Welcome! Choose a portal above.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Ohidans FacelockApp Portal Dashboard</Text>
      <View style={styles.nav}>
        <Button title="Admin Login" onPress={() => setView('admin-login')} />
        <Button title="Admin Dashboard" onPress={() => setView('admin-dashboard')} />
        <Button title="User Login" onPress={() => setView('login')} />
        <Button title="Register Form" onPress={() => setView('register')} />
        <Button title="User Dashboard" onPress={() => setView('user-dashboard')} />
        <Button title="Upload Image" onPress={() => setView('upload')} />
        <Button title="Image Viewer" onPress={() => setView('viewer')} />
        <Button title="Match History" onPress={() => setView('history')} />
        <Button title="Reset Password" onPress={() => setView('reset')} />
        <Button title="Document Verification" onPress={() => setView('document-verification')} />
      </View>
      {renderView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
  nav: { marginBottom: 20, gap: 8 },
});
