import React, { useState } from 'react';
import AdminLogin from './components/admin/LoginForm';
import Dashboard from './components/admin/Dashboard';
import UserDashboard from './components/user/UserDashboard';
import UserSignUp from './components/user/SignUp';
import UserLogin from './components/user/Login';
import ResetPassword from './components/user/ResetPassword';

export default function App() {
  const [view, setView] = useState('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setView('admin-dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'admin-login':
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      case 'admin-dashboard':
        return isAdminAuthenticated ? (
          <Dashboard />
        ) : (
          <h2>Please log in as admin first</h2>
        );
      case 'signup':
        return <UserSignUp />;
      case 'login':
        return <UserLogin />;
      case 'reset':
        return <ResetPassword />;
      default:
        return <h2>Welcome! Choose a portal above.</h2>;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Ohidans FacelockApp Portal Dashboard</h1>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setView('admin-login')}>Admin Login</button>
        <button onClick={() => setView('admin-dashboard')}>Admin Dashboard</button>
        <button onClick={() => setView('signup')}>User Sign Up</button>
        <button onClick={() => setView('login')}>User Login</button>
        <button onClick={() => setView('reset')}>Reset Password</button>
      </nav>
      {renderView()}
    </div>
  );
}
