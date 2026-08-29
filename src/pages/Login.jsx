import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { Shield, ChevronLeft, Globe } from 'lucide-react';
import logo from '../assets/logo.png';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Format mobile for Supabase if needed (e.g., adding +91 if not present, though assuming standard email/password mock for now)
    // Actually, user requested Mobile + Password. We will use a dummy email mapping for this prototype or standard phone auth.
    // Assuming standard email mapping for hackathon: mobile@maulinondh.com
    const email = `${mobile}@maulinondh.com`;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-color pb-8">
      <header className="header" style={{ justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/home')} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="brand cursor-pointer flex items-center gap-2" onClick={() => navigate('/home')}>
            <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            {t('app.name')}
          </div>
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

      <main className="container flex-grow flex flex-col items-center justify-center pt-8 pb-12">
        <div className="w-full" style={{ maxWidth: '420px' }}>
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)', border: 'none' }}>
            <div className="text-center mb-8 flex flex-col items-center">
              <img src={logo} alt="Maulinondh Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1.25rem' }} />
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>{t('login.title')}</h2>
            </div>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>{t('login.mobile')}</label>
                <input 
                  type="tel" 
                  className="input" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  required 
                />
              </div>

              <div className="input-group">
                <label>{t('login.password')}</label>
                <input 
                  type="password" 
                  className="input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="flex items-center justify-between mb-6" style={{ fontSize: '0.875rem' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  {t('login.rememberMe')}
                </label>
                <a href="#" className="text-primary">{t('login.forgotPassword')}</a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mb-4"
                disabled={loading}
              >
                {loading ? '...' : t('login.loginBtn')}
              </button>

              <div className="text-center">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('/register'); }}
                  style={{ fontSize: '0.9rem' }}
                >
                  {t('login.newUser')}
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <LanguageSelector isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};

export default Login;
