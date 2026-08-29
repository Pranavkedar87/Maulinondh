import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Heart, MapPin, Phone, Globe, ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.png';
import LanguageSelector from '../components/LanguageSelector';

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const quotes = t('home.quotes') || [];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quotes]);

  return (
    <div className="min-h-screen pb-12" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div className="brand flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '0.5px' }}>{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLangModal(true)} 
            className="btn btn-outline flex items-center gap-2" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '20px', background: 'white', color: 'var(--text-main)' }}
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
        </div>
      </header>

      <main className="container pt-10 px-4 max-w-3xl mx-auto">
        <div className="card" style={{ padding: '0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          
          {/* Top Banner (Like Varithon Blue Header) */}
          <div style={{ background: 'var(--primary-dark)', padding: '2.5rem 2rem', textAlign: 'center', color: 'white' }}>
            <img src={logo} alt="Maulinondh Visual" style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto 1rem auto', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))', border: '3px solid white', borderRadius: '50%', background: 'white' }} />
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800', color: 'white', letterSpacing: '1px' }}>
              {t('app.name')}
            </h1>
            <p style={{ fontSize: '1.1rem', fontWeight: '500', opacity: 0.9, maxWidth: '400px', margin: '0 auto' }}>
              {t('app.coreMessage1')} {t('app.coreMessage2')}
            </p>
          </div>

          <div style={{ padding: '2.5rem 2rem' }}>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-10">
              <button className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem', minWidth: '180px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }} onClick={() => navigate('/register')}>
                {t('home.registerBtn')}
              </button>
              <button className="btn btn-outline" style={{ padding: '0.8rem 2.5rem', fontSize: '1.1rem', minWidth: '180px', borderRadius: '8px', background: 'white', borderColor: 'var(--border)', color: 'var(--text-main)', fontWeight: '600' }} onClick={() => navigate('/login')}>
                {t('home.loginBtn')}
              </button>
            </div>

            {/* Quote Section */}
            <div className="mb-10 text-center" style={{ padding: '1.5rem', background: '#FFFDF5', border: '1px solid var(--primary-light)', borderRadius: '12px' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.5rem', lineHeight: '1', verticalAlign: 'middle' }}>"</span>
              <span style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--primary-dark)', fontWeight: '500', margin: '0 0.5rem' }}>{quotes[currentQuoteIndex]}</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.5rem', lineHeight: '1', verticalAlign: 'middle' }}>"</span>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--primary-dark)' }}>
                  <Shield size={20} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{t('home.features.regTitle')}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{t('home.features.regDesc')}</p>
              </div>
              
              <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--primary-dark)' }}>
                  <Heart size={20} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{t('home.features.medTitle')}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{t('home.features.medDesc')}</p>
              </div>

              <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--primary-dark)' }}>
                  <MapPin size={20} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{t('home.features.safeTitle')}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{t('home.features.safeDesc')}</p>
              </div>

              <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'white' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--primary-dark)' }}>
                  <Phone size={20} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{t('home.features.helpTitle')}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{t('home.features.helpDesc')}</p>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      <LanguageSelector isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};

export default Home;
