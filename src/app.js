import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import dashboard from './components/dashboard';
import imageUpload from './components/imageUpload';
import imageViewer from './components/imageViewer';
import biometricUnlock from './components/biometricUnlock';
import biometricSettings from './components/biometricSettings';
import loginForm from './components/loginForm';
import logoutButton from './components/logoutButton';
import matchHistory from './components/matchHistory';
import registerForm from './components/registerForm';
import requestResetForm from './components/requestResetForm';
import resetPasswordForm from './components/resetPasswordForm';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<dashboard />}/>
      <Route path="/" element={<imageUpload/>} />
      <Route path="/" element={<imageViewer/>} />
      <Route path="/" element={<biometricUnlock />}/>
      <Route path="/" element={<biometricSettings/>} />
      <Route path="/" element={<loginForm />}/>
      <Route path="/" element={<logoutButton />}/>
      <Route path="/" element={<matchHistory />}/>
      <Route path="/" element={<registerForm />}/>
      <Route path="/" element={<requestResetForm />}/>
      <Route path="/" element={<resetPasswordForm />}/>
  </Routes>
  </Router>
  );
}

export default App;
