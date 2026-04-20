// client/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/user/RegisterForm';
import LoginForm from './components/user/LoginForm';
// other imports…

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native-web';
import * as tf from '@tensorflow/tfjs';
import { loadModels } from './faceApiHelpers';

// Import your existing components (relative paths)
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
import VerificationDashboard from './components/user/VerificationDashboard';

const API_BASE = (process.env.REACT_APP_API_URI || process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

function StatusCard({ title, state, detail, action }) {
  const color = state === 'ok' ? '#1e7e34' : state === 'warn' ? '#856404' : '#842029';
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardStatus}>{state === 'ok' ? 'Operational' : state === 'warn' ? 'Degraded' : 'Down'}</Text>
      {detail ? <Text style={styles.cardDetail}>{detail}</Text> : null}
      {action ? <View style={{ marginTop: 8 }}>{action}</View> : null}
    </View>
  );
}

export default function App() {
  const [route, setRoute] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const [apiHealth, setApiHealth] = useState({ state: 'unknown', detail: '' });
  const [dbHealth, setDbHealth] = useState({ state: 'unknown', detail: '' });
  const [modelStatus, setModelStatus] = useState({ state: 'loading', detail: 'Initializing models' });
  const [checking, setChecking] = useState(false);

  // TensorFlow backend + model loading
  useEffect(() => {
    (async () => {
      try {
        await tf.setBackend('webgl');
      } catch {
        await tf.setBackend('cpu');
      }
      try {
        await loadModels();
        setModelStatus({ state: 'ok', detail: 'Face models loaded' });
      } catch (err) {
        console.error('Model load failed', err);
        setModelStatus({ state: 'down', detail: 'Failed to load models' });
      }
    })();
  }, []);

  // Health check function
  const checkHealth = async () => {
    setChecking(true);
    if (!API_BASE) {
      setApiHealth({ state: 'down', detail: 'API base not configured' });
      setDbHealth({ state: 'unknown', detail: '' });
      setChecking(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      const text = await res.text().catch(() => null);

      if (res.ok) {
        setApiHealth({ state: 'ok', detail: 'API reachable' });
      } else {
        setApiHealth({ state: 'down', detail: `HTTP ${res.status}` });
      }

      try {
        const json = JSON.parse(text || '{}');
        if (json.db === 'ok') setDbHealth({ state: 'ok', detail: 'MongoDB connected' });
        else if (json.db === 'degraded') setDbHealth({ state: 'warn', detail: 'DB degraded' });
        else setDbHealth({ state: 'down', detail: 'DB not connected' });
      } catch {
        setDbHealth(prev => prev.state === 'unknown' ? { state: 'unknown', detail: '' } : prev);
      }
    } catch (err) {
      console.error('Health check failed', err);
      setApiHealth({ state: 'down', detail: err?.message || 'Network error' });
      setDbHealth({ state: 'unknown', detail: '' });
    } finally {
      setChecking(false);
    }
  };

  // Defer initial health check to avoid synchronous setState inside effect
  useEffect(() => {
    const t = setTimeout(() => {
      checkHealth();
    }, 0);

    const id = setInterval(checkHealth, 30_000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  // Simple router mapping
  const renderRoute = () => {
    switch (route) {
      case 'admin-login':
        return <AdminLogin onLoginSuccess={() => { setIsAdminAuthenticated(true); setRoute('admin-dashboard'); }} />;
      case 'admin-dashboard':
        return isAdminAuthenticated ? <Dashboard setRoute={setRoute} /> : <Text style={styles.notice}>Please log in as admin</Text>;
      case 'login':
        return <UserLogin onLoginSuccess={() => { setIsUserAuthenticated(true); setRoute('user-dashboard'); }} />;
      case 'register':
        return <RegisterForm setRoute={setRoute} />;
      case 'user-dashboard':
        return isUserAuthenticated ? <UserDashboard setRoute={setRoute} /> : <Text style={styles.notice}>Please log in as user</Text>;
      case 'upload':
        return <ImageUpload setRoute={setRoute} />;
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
        return <VerificationDashboard setRoute={setRoute} isAdmin={isAdminAuthenticated} />;
      default:
        return <Home setRoute={setRoute} />;
    }
  };

  return (
    <View style={styles.app}>
      <View style={styles.header}>
        <Text style={styles.brand}>Ohidan&apos;s FacelockApp Portal</Text>
        <View style={styles.headerRight}>
          <Text style={styles.apiText}>{API_BASE ? `API: ${API_BASE}` : 'API not configured'}</Text>
          <TouchableOpacity style={styles.headerButton} onPress={checkHealth} disabled={checking}>
            {checking ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.headerButtonText}>Refresh</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sidebar}>
          <Text style={styles.navHeading}>Navigation</Text>

          <ScrollView style={styles.navList}>
            <NavButton label="Home" onPress={() => setRoute('home')} />
            <NavButton label="Admin Login" onPress={() => setRoute('admin-login')} />
            <NavButton label="Admin Dashboard" onPress={() => setRoute('admin-dashboard')} />
            <NavButton label="User Login" onPress={() => setRoute('login')} />
            <NavButton label="Register" onPress={() => setRoute('register')} />
            <NavButton label="User Dashboard" onPress={() => setRoute('user-dashboard')} />
            <NavButton label="Upload Image" onPress={() => setRoute('upload')} />
            <NavButton label="Image Viewer" onPress={() => setRoute('viewer')} />
            <NavButton label="Match History" onPress={() => setRoute('history')} />
            <NavButton label="Document Verification" onPress={() => setRoute('document-verification')} />
            <NavButton label="Biometric Settings" onPress={() => setRoute('admin-settings')} />
          </ScrollView>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.navHeading}>Status</Text>
            <StatusCard title="API" state={apiHealth.state} detail={apiHealth.detail} action={
              <TouchableOpacity style={styles.smallBtn} onPress={checkHealth}><Text style={styles.smallBtnText}>Ping</Text></TouchableOpacity>
            } />
            <StatusCard title="Database" state={dbHealth.state} detail={dbHealth.detail} />
            <StatusCard title="Face Models" state={modelStatus.state} detail={modelStatus.detail} />
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {renderRoute()}
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Ohidan — FacelockApp</Text>
      </View>
    </View>
  );
}

/* Small presentational components */
function NavButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <Text style={styles.navButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Home({ setRoute }) {
  return (
    <View>
      <Text style={styles.pageTitle}>Welcome to the Portal</Text>
      <Text style={styles.lead}>Use the navigation to access admin and user features. Health and model status are shown in the sidebar.</Text>
      <View style={{ marginTop: 12 }}>
        <Button title="Get Started" onPress={() => setRoute('login')} />
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  app: { flex: 1, minHeight: '100vh', backgroundColor: '#f4f6f8', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#0b5cff' },
  brand: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerRight: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 },
  apiText: { color: '#fff', fontSize: 12 },
  headerButton: { backgroundColor: '#0747d1', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  headerButtonText: { color: '#fff', fontWeight: '600' },

  body: { display: 'flex', flexDirection: 'row', gap: 16, padding: 16, alignItems: 'flex-start' },
  sidebar: { width: 280, backgroundColor: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  navHeading: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  navList: { maxHeight: 420 },
  navButton: { paddingVertical: 8, paddingHorizontal: 6, borderRadius: 6, marginBottom: 6 },
  navButtonText: { color: '#0b5cff', fontWeight: '600' },

  content: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 8, minHeight: 480, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },

  footer: { padding: 12, textAlign: 'center', marginTop: 'auto' },
  footerText: { color: '#666', fontSize: 12 },

  card: { borderLeftWidth: 6, padding: 10, marginBottom: 10, borderRadius: 6, backgroundColor: '#fff' },
  cardTitle: { fontSize: 13, fontWeight: '700' },
  cardStatus: { fontSize: 12, marginTop: 4 },
  cardDetail: { fontSize: 12, color: '#444', marginTop: 6 },

  pageTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  lead: { fontSize: 14, color: '#333' },

  smallBtn: { backgroundColor: '#0b5cff', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  smallBtnText: { color: '#fff', fontWeight: '600' },

  notice: { color: '#b02a37', fontWeight: '600' },
});
