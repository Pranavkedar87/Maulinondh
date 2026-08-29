import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { CheckCircle, Key, User } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const regId = location.state?.regId || 'MN-TL-2026-XXXXXX';
  const password = location.state?.generatedPassword || '******';

  return (
    <div className="text-center" style={{ padding: '2rem 1rem' }}>
      <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} />
      <h2 style={{ fontSize: '1.5rem', color: 'var(--success)', marginBottom: '1rem' }}>Team Leader Registered!</h2>
      
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 'var(--radius-md)', margin: '2rem 0', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Your Login Credentials</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Please save these credentials securely. You will need them to log into the Team Leader Dashboard.
        </p>
        
        <div className="flex flex-col gap-3 text-left bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 border-b pb-2">
            <User size={20} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User ID (Registration ID)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', userSelect: 'all' }}>{regId}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Key size={20} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', userSelect: 'all', letterSpacing: '2px' }}>{password}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        You can now log in using these credentials to manage your team.
      </p>

      <button className="btn btn-primary w-full" onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  );
};
export default Success;
