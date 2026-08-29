import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, User, Building, Users } from 'lucide-react';
import logo from '../assets/logo.png';
import LanguageSelector from '../components/LanguageSelector';

import VarkariFlow from './Registration/VarkariFlow';
import GramPanchayatFlow from './Registration/GramPanchayatFlow';
import TeamLeaderFlow from './Registration/TeamLeaderFlow';

const RegistrationSelector = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="card text-center">
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '2rem' }}>
        {t('registrationType.title') || 'Choose Registration Type'}
      </h2>
      
      <div className="flex flex-col gap-4">
        <button 
          className="btn btn-outline flex items-center justify-between" 
          style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '12px' }}
          onClick={() => navigate('/register/varkari')}
        >
          <div className="flex items-center gap-4">
            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
              <User size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{t('registrationType.varkariTitle') || 'Varkari'}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('registrationType.varkariDesc') || 'Register yourself or family member'}</p>
            </div>
          </div>
          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>→</span>
        </button>

        <button 
          className="btn btn-outline flex items-center justify-between" 
          style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '12px' }}
          onClick={() => navigate('/register/gram-panchayat')}
        >
          <div className="flex items-center gap-4">
            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
              <Building size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{t('registrationType.gpTitle') || 'Gram Panchayat'}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('registrationType.gpDesc') || 'Register local authority'}</p>
            </div>
          </div>
          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>→</span>
        </button>

        <button 
          className="btn btn-outline flex items-center justify-between" 
          style={{ padding: '1.5rem', textAlign: 'left', borderRadius: '12px' }}
          onClick={() => navigate('/register/team-leader')}
        >
          <div className="flex items-center gap-4">
            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
              <Users size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{t('registrationType.tlTitle') || 'Team Leader'}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t('registrationType.tlDesc') || 'Register Dindi / Varkari team'}</p>
            </div>
          </div>
          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>→</span>
        </button>
      </div>
    </div>
  );
};

const Registration = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showLangModal, React_useState] = React.useState(false);
  
  return (
    <div className="min-h-screen pb-8" style={{ background: '#f9fafb' }}>
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div className="brand flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', letterSpacing: '0.5px', color: 'var(--text-main)' }}>{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => React_useState(true)} 
            className="btn btn-outline flex items-center gap-2" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '20px', background: 'white', color: 'var(--text-main)' }}
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
          <button 
            onClick={() => navigate('/home')} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}
          >
            {t('registration.cancelBtn')}
          </button>
        </div>
      </header>

      <main className="container pt-8 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<RegistrationSelector />} />
          <Route path="varkari/*" element={<VarkariFlow />} />
          <Route path="gram-panchayat/*" element={<GramPanchayatFlow />} />
          <Route path="team-leader/*" element={<TeamLeaderFlow />} />
        </Routes>
      </main>
      
      <LanguageSelector isOpen={showLangModal} onClose={() => React_useState(false)} />
    </div>
  );
};

export default Registration;
