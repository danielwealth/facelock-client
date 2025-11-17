import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ImageUpload from './components/imageUpload';
import ImageViewer from './components/imageViewer';
import BiometricUnlock from './components/biometricUnlock';
import BiometricSettings from './components/biometricSettings';
import LoginForm from './components/loginForm';
import LogoutButton from './components/logoutButton';
import MatchHistory from './components/matchHistory';
import RegisterForm from './components/registerForm';
import RequestResetForm from './components/requestResetForm';
import ResetPasswordForm from './components/resetPasswordForm';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/" element={<ImageUpload/>} />
      <Route path="/" element={<ImageViewer/>} />
      <Route path="/" element={<BiometricUnlock />}/>
      <Route path="/" element={<BiometricSettings/>} />
      <Route path="/" element={<LoginForm />}/>
      <Route path="/" element={<LogoutButton />}/>
      <Route path="/" element={<MatchHistory />}/>
      <Route path="/" element={<RegisterForm />}/>
      <Route path="/" element={<RequestResetForm />}/>
      <Route path="/" element={<ResetPasswordForm />}/>
  </Routes>
  </Router>
  );
}

export default App;
