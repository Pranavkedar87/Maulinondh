import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const regId = location.state?.regId || 'MN-TL-2026-XXXXXX';

  return (
    <div className="text-center" style={{ padding: '2rem 1rem' }}>
      <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} />
      <h2 style={{ fontSize: '1.5rem', color: 'var(--success)', marginBottom: '1rem' }}>{t('success.title')}</h2>
      
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 'var(--radius-md)', margin: '2rem 0' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('success.regId')}</p>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '1px' }}>{regId}</p>
        <div style={{ display: 'inline-block', background: '#FEF3C7', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '1rem' }}>
          🟡 {t('status.PENDING_VERIFICATION')}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Your Team Leader registration will be reviewed by the administration.
      </p>

      <button className="btn btn-primary w-full" onClick={() => navigate('/dashboard')}>
        {t('success.goDashboard')}
      </button>
    </div>
  );
};
export default Success;
