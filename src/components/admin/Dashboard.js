import React, { useState } from 'react';
import AdminLogin from './components/admin/LoginForm';
import Dashboard from './components/admin/Dashboard';
import UserSignUp from './components/user/SignUp';
import UserLogin from './components/user/Login';
import ResetPassword from './components/user/ResetPassword';

export default function App() {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch (view) {
      case 'admin-login': return <AdminLogin />;
      case 'admin-dashboard': return <Dashboard />;
      case 'signup': return <UserSignUp />;
      case 'login': return <UserLogin />;
      case 'reset': return <ResetPassword />;
      default: return <h2>Welcome! Choose a portal above.</h2>;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Portal Dashboard</h1>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setView('admin-login')}>Admin Login</button>
        <button onClick={() => setView('signup')}>User Sign Up</button>
        <button onClick={() => setView('login')}>User Login</button>
        <button onClick={() => setView('reset')}>Reset Password</button>
      </nav>
      {renderView()}
    </div>
  );
}
