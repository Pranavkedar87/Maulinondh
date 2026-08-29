import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { User, QrCode, FileText, Globe, Shield, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import logo from '../assets/logo.png';
import LanguageSelector from '../components/LanguageSelector';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  const [user, setUser] = useState(null);
  const [varkariData, setVarkariData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Unauthenticated -> for demo we might just show dummy data if they skipped login
          // but for real app, redirect to login
          navigate('/login');
          return;
        }
        setUser(session.user);

        // Fetch varkari profile
        const { data, error } = await supabase
          .from('varkaris')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (data) {
          setVarkariData(data);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Safety Dashboard...</div>;
  }

  // If user is authenticated but has no varkari profile in DB
  if (!varkariData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--bg-color)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>No Profile Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          We could not find a pilgrim registration linked to this mobile number. Please complete your registration first.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/register')}
        >
          Register Now
        </button>
        <button 
          className="btn btn-outline mt-4"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  const varkari = varkariData;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING_VERIFICATION':
        return <span className="status-badge status-pending">{t('status.PENDING_VERIFICATION')}</span>;
      case 'VERIFIED':
        return <span className="status-badge status-verified">{t('status.VERIFIED')}</span>;
      case 'ACTION_REQUIRED':
        return <span className="status-badge status-action">{t('status.ACTION_REQUIRED')}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg-color)' }}>
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <div className="brand flex items-center gap-2">
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          {t('app.name')}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLangModal(true)} 
            className="btn btn-outline flex items-center gap-1" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '12px', background: 'white', color: 'var(--text-main)' }}
          >
            <Globe size={14} />
            {language.toUpperCase()}
          </button>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '12px', background: 'white' }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/');
            }}
          >
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      <main className="container pt-6">
        <div className="mb-6 flex items-center gap-3">
          {varkari.photo_url && (
            <img
              src={varkari.photo_url}
              alt={varkari.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', flexShrink: 0 }}
            />
          )}
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
            {t('dashboard.greeting').replace('{name}', varkari.name)}
          </h1>
        </div>

        {/* Status Card */}
        <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary-dark)' }}>
          <div className="flex items-center justify-between mb-2">
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Shield size={18} /> {t('dashboard.status')}
            </h2>
            {getStatusBadge(varkari.status)}
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            {varkari.status === 'PENDING_VERIFICATION' 
              ? t('dashboard.statusPendingDesc')
              : t('dashboard.statusVerifiedDesc')}
          </p>
        </div>

        {/* QR Band Status Card */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <QrCode size={18} /> {t('dashboard.qrStatus')}
          </h2>
          <div style={{ padding: '1rem', background: '#FFFDF5', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {varkari.qr_token ? (
              <>
                <ShieldCheck size={20} color="#166534" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 500, color: '#166534', display: 'block' }}>{t('dashboard.qrIssued')}</span>
                  <a
                    href={`/Maulinondh/profile/${varkari.registration_id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', textDecoration: 'underline', marginTop: '0.25rem', display: 'inline-block' }}
                  >
                    View Public Profile &rarr;
                  </a>
                </div>
              </>
            ) : (
              <><Clock size={20} color="#854d0e" /> <span style={{ fontWeight: 500, color: '#854d0e' }}>{t('dashboard.qrPending')}</span></>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
              <User size={18} /> {t('dashboard.profile')}
            </h2>
            <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'white' }}>
              {t('dashboard.edit')}
            </button>
          </div>
          
          <div className="flex flex-col gap-3" style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--primary-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.profileName')}</span>
              <span className="font-medium">{varkari.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--primary-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.profileAge')}</span>
              <span className="font-medium">{varkari.age} / {varkari.blood_group}</span>
            </div>
            <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--primary-light)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.profileMobile')}</span>
              <span className="font-medium">{varkari.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.profileAddress')}</span>
              <span className="font-medium">{varkari.address}</span>
            </div>
          </div>
        </div>

        {/* Emergency Help Card */}
        <div className="card" style={{ border: '1px solid var(--danger)' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--danger)' }}>
            <AlertTriangle size={18} /> {t('dashboard.emergencyHelpTitle')}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {t('dashboard.emergencyDesc')}
          </p>
          <button 
            className="btn w-full flex items-center justify-center gap-2"
            style={{ padding: '1rem', fontSize: '1.1rem', background: 'var(--danger)', color: 'white', border: 'none' }}
          >
            <AlertTriangle size={20} /> {t('dashboard.emergencyBtn')}
          </button>
        </div>
      </main>

      <LanguageSelector isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};

export default Dashboard;
