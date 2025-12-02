import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native-web';
import AdminLogin from './components/admin/LoginForm';
import Dashboard from './components/admin/Dashboard';
import UserDashboard from './components/user/UserDashboard';
import UserSignUp from './components/user/SignUp';
import UserLogin from './components/user/Login';
import ResetPassword from './components/user/ResetPassword';

export default function App() {
  const [view, setView] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

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
        return isAdminAuthenticated ? (
          <Dashboard />
        ) : (
          <Text>Please log in as admin first</Text>
        );
      case 'signup':
        return <UserSignUp />;
      case 'login':
        return <UserLogin onLoginSuccess={handleUserLoginSuccess} />;
      case 'user-dashboard':
        return isUserAuthenticated ? (
          <UserDashboard />
        ) : (
          <Text>Please log in as user first</Text>
        );
      case 'reset':
        return <ResetPassword />;
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
        <Button title="User Sign Up" onPress={() => setView('signup')} />
        <Button title="User Login" onPress={() => setView('login')} />
        <Button title="User Dashboard" onPress={() => setView('user-dashboard')} />
        <Button title="Reset Password" onPress={() => setView('reset')} />
      </View>
      {renderView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  nav: {
    marginBottom: 20,
  },
});
