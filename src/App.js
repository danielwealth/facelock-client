import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/admin/Dashboard';
import ImageUpload from './components/user/ImageUpload';
import ImageViewer from './components/user/ImageViewer';
import BiometricUnlock from './components/admin/BiometricUnlock.tsx';
import BiometricSettings from './components/admin/BiometricSettings';
import LoginForm from './components/admin/LoginForm';
import LogoutButton from './components/LogoutButton';
import MatchHistory from './components/user/MatchHistory';
import RegisterForm from './components/user/RegisterForm';
import RequestResetForm from './components/user/RequestResetForm';
import ResetPasswordForm from './components/user/ResetPasswordForm';
import SignUp from './components/user/SignUp';
import Login from './components/user/Login';
import ResetPassword from './components/user/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
  {/* Admin */}
  <Route path="/admin/dashboard" element={<Dashboard />} />
  <Route path="/admin/unlock" element={<BiometricUnlock />} />
  <Route path="/admin/settings" element={<BiometricSettings />} />
  <Route path="/admin/login" element={<LoginForm />} />
  <Route path="/admin/reset-password" element={<ResetPasswordForm />} />

  {/* User */}
  <Route path="/signup" element={<SignUp />} />
  <Route path="/login" element={<Login />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/upload" element={<ImageUpload />} />
  <Route path="/viewer" element={<ImageViewer />} />
  <Route path="/history" element={<MatchHistory />} />
  <Route path="/register" element={<RegisterForm />} />
  <Route path="/request-reset" element={<RequestResetForm />} />

  {/* Shared */}
  <Route path="/logout" element={<LogoutButton />} />
</Routes>

    </Router>
  );
}

export default App;
