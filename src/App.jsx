import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import PublicProfile from './pages/PublicProfile';

function App() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/home" replace />} 
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register/*" element={<Registration />} />
        {/* Public QR scan profile — no login required */}
        <Route path="/profile/:registrationId" element={<PublicProfile />} />
        <Route path="/scan/:registrationId" element={<PublicProfile />} />
      </Routes>
    </div>
  );
}

export default App;
