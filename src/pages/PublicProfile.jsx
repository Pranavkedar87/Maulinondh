import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import { User, Heart, Phone, MapPin, Shield, AlertTriangle } from 'lucide-react';

const PublicProfile = () => {
  const { registrationId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [varkari, setVarkari] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVarkari = async () => {
      try {
        // Try by registration_id first
        let { data, error } = await supabase
          .from('varkaris')
          .select('*')
          .eq('registration_id', registrationId)
          .single();

        // Fallback: try by qr_token
        if (!data || error) {
          const result = await supabase
            .from('varkaris')
            .select('*')
            .eq('qr_token', registrationId)
            .single();
          data = result.data;
          error = result.error;
        }

        if (error || !data) {
          setError('Pilgrim record not found.');
        } else {
          setVarkari(data);
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (registrationId) {
      fetchVarkari();
    } else {
      setError('No ID provided.');
      setLoading(false);
    }
  }, [registrationId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !varkari) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
        <img src={logo} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          {error || 'This QR code is not linked to any registered pilgrim.'}
        </p>
        <button className="btn btn-outline" onClick={() => navigate('/home')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary-dark)', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
        <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '50%', border: '2px solid white', background: 'white', marginBottom: '0.5rem' }} />
        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>{t('app.name')}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.2rem' }}>Varkari Safety Profile</div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Pilgrim Photo + Identity */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {varkari.photo_url ? (
            <img
              src={varkari.photo_url}
              alt={varkari.name}
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', margin: '0 auto 1rem auto', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary-light)', border: '3px solid var(--primary)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={40} color="var(--primary-dark)" />
            </div>
          )}
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{varkari.name}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>ID: {varkari.registration_id}</p>
          <span
            style={{
              display: 'inline-block',
              padding: '0.3rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: varkari.status === 'VERIFIED' ? '#bbf7d0' : '#fef08a',
              color: varkari.status === 'VERIFIED' ? '#166534' : '#854d0e'
            }}
          >
            {varkari.status === 'VERIFIED' ? 'Verified' : 'Pending Verification'}
          </span>
        </div>

        {/* Personal Info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <User size={16} /> Personal Information
          </h2>
          <InfoRow label="Age" value={`${varkari.age} years`} />
          <InfoRow label="Gender" value={varkari.gender} />
          <InfoRow label="District" value={varkari.district} />
          <InfoRow label="Address" value={varkari.address} />
        </div>

        {/* Medical Info - Critical for emergency responders */}
        <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--danger)' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--danger)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <Heart size={16} /> Medical Information
          </h2>
          <div style={{ background: '#fef2f2', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--danger)' }}>Blood Group: {varkari.blood_group}</span>
          </div>
          {varkari.medical_conditions && <InfoRow label="Conditions" value={varkari.medical_conditions} />}
          {varkari.medications && <InfoRow label="Medications" value={varkari.medications} />}
          {varkari.allergies && <InfoRow label="Allergies" value={varkari.allergies} />}
          {!varkari.medical_conditions && !varkari.medications && !varkari.allergies && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No medical conditions recorded.</p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary-dark)' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <Phone size={16} /> Emergency Contact
          </h2>
          <InfoRow label="Name" value={`${varkari.guardian_name} (${varkari.guardian_relationship})`} />
          <div style={{ marginTop: '0.5rem' }}>
            <a
              href={`tel:${varkari.guardian_phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-dark)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, justifyContent: 'center' }}
            >
              <Phone size={18} /> Call {varkari.guardian_name}: {varkari.guardian_phone}
            </a>
          </div>
          {varkari.secondary_guardian_name && (
            <div style={{ marginTop: '0.75rem' }}>
              <InfoRow label="Secondary" value={`${varkari.secondary_guardian_name}: ${varkari.secondary_guardian_phone}`} />
              <a
                href={`tel:${varkari.secondary_guardian_phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', color: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <Phone size={16} /> Call Secondary: {varkari.secondary_guardian_phone}
              </a>
            </div>
          )}
        </div>

        {/* Wari Info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <MapPin size={16} /> Wari Information
          </h2>
          <InfoRow label="Participating With" value={varkari.participating_with} />
          {varkari.dindi_name && <InfoRow label="Dindi / Group" value={varkari.dindi_name} />}
          {varkari.starting_location && <InfoRow label="Starting From" value={varkari.starting_location} />}
          <InfoRow label="Destination" value={varkari.destination} />
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Shield size={20} color="var(--primary-dark)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            This profile is part of the <strong>{t('app.name')}</strong> Varkari Safety System.<br />
            Registered: {new Date(varkari.created_at).toLocaleDateString('en-IN')}
          </p>
        </div>

      </div>
    </div>
  );
};

// Helper component
const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
    <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginRight: '1rem' }}>{label}</span>
    <span style={{ fontWeight: 500, color: 'var(--text-main)', textAlign: 'right' }}>{value}</span>
  </div>
);

export default PublicProfile;
