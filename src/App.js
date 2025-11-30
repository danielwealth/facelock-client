import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/admin/Dashboard';
import ImageUpload from './components/user/ImageUpload';
import ImageViewer from './components/user/ImageViewer';
import BiometricUnlock from './components/amdin/BiometricUnlock.tsx';
import BiometricSettings from './components/admin/BiometricSettings';
import LoginForm from './components/LoginForm';
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/viewer" element={<ImageViewer />} />
        <Route path="/unlock" element={<BiometricUnlock.tsx />} />
        <Route path="/settings" element={<BiometricSettings />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/history" element={<MatchHistory />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/request-reset" element={<RequestResetForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
