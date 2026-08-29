import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import logo from '../../../assets/logo.png';
import { Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';
import LanguageSelector from '../../../components/LanguageSelector';

const Success = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLangModal, setShowLangModal] = useState(false);
  const regId = location.state?.regId || 'MN-2026-XXXXXX';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-color)' }}>
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <div className="brand flex items-center gap-2">
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          {t('app.name')}
        </div>
        <button 
          onClick={() => setShowLangModal(true)} 
          className="btn btn-outline flex items-center gap-2" 
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '20px', background: 'white', color: 'var(--text-main)' }}
        >
          <Globe size={16} />
          {language.toUpperCase()}
        </button>
      </header>

      <main className="container pt-12 pb-8 flex-1 flex flex-col items-center justify-center text-center">
        <div className="card w-full max-w-md" style={{ padding: '2.5rem 1.5rem', border: '2px solid var(--primary-light)' }}>
          <div className="mb-6 flex justify-center">
            <div 
              style={{ 
                width: '80px', 
                height: '80px', 
                background: '#dcfce7', // green light
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                border: '4px solid #bbf7d0'
              }}
            >
              ✓
            </div>
          </div>
          
          <h2 className="mb-2 flex items-center justify-center gap-2" style={{ color: 'var(--secondary)', fontSize: '1.75rem' }}>
            <CheckCircle2 size={28} /> {t('success.title')}
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{t('success.message')}</p>

          <div className="p-4 rounded-xl mb-6 border" style={{ background: '#FFFDF5', borderColor: 'var(--primary-light)' }}>
            <p className="text-sm text-gray-500 mb-1">{t('success.regId')}</p>
            <p className="font-mono text-2xl font-bold tracking-wider" style={{ color: 'var(--primary-dark)' }}>{regId}</p>
          </div>

          <p className="text-sm mb-4" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
            {t('success.verification')}
          </p>

          <div className="p-4 rounded-xl text-sm mb-8 text-left flex items-start gap-3" style={{ background: 'var(--primary-light)', color: 'var(--text-main)' }}>
            <ShieldAlert size={24} color="var(--primary-dark)" />
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('success.noticeTitle')}</p>
              <p style={{ opacity: 0.9 }}>{t('success.noticeDesc')}</p>
            </div>
          </div>

          <button 
            className="btn btn-primary w-full"
            style={{ padding: '1rem', fontSize: '1.1rem' }}
            onClick={() => navigate('/dashboard')}
          >
            {t('success.goDashboard')} →
          </button>
        </div>
      </main>

      <LanguageSelector isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};

export default Success;
