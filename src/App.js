import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ImageUpload from './components/ImageUpload';
import ImageViewer from './components/ImageViewer';
import BiometricUnlock from './components/BiometricUnlock.jsx';
import BiometricSettings from './components/BiometricSettings';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import MatchHistory from './components/MatchHistory';
import RegisterForm from './components/RegisterForm';
import RequestResetForm from './components/RequestResetForm';
import ResetPasswordForm from './components/ResetPasswordForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<ImageUpload />} />
        <Route path="/viewer" element={<ImageViewer />} />
        <Route path="/unlock" element={<BiometricUnlock />} />
        <Route path="/settings" element={<BiometricSettings />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/history" element={<MatchHistory />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/request-reset" element={<RequestResetForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </Router>
  );
}

export default App;
