import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { supabase } from '../../../services/supabase';

const Review = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate a unique registration ID MN-GP-2026-XXXXXX
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const regId = 'MN-GP-2026-' + randomNum;
      const generatedPassword = regId; // Set password to be the same as the ID
      const email = `${regId.toLowerCase()}@maulinondh.com`;

      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: generatedPassword,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;

      const payload = {
        user_id: userId,
        registration_id: regId,
        generated_password: generatedPassword,
        panchayat_name: data.panchayatName || '',
        village_name: data.panchayatName || '', // Village name mapped from panchayat name
        taluka: data.taluka || '',
        district: data.district || '',
        office_address: data.officeAddress || '',
        pincode: data.pincode || '',
        official_contact: data.officialContact || '',
        official_email: data.officialEmail || '',
        primary_contact_name: data.sarpanchName || '',
        primary_designation: 'Sarpanch',
        primary_contact_number: data.sarpanchMobile || '',
        status: 'PENDING_VERIFICATION'
      };

      const { error: dbError } = await supabase
        .from('gram_panchayats')
        .insert([payload]);

      if (dbError) throw dbError;
      
      // Navigate to success and pass credentials
      navigate('/register/gram-panchayat/success', { state: { regId, generatedPassword } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{t('registration.confirmTitle')}</h2>
      
      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Gram Panchayat Details</h3>
        <p><strong>Name:</strong> {data.panchayatName}</p>
        <p><strong>Location:</strong> {data.taluka}, {data.district}</p>
        <p><strong>Contact:</strong> {data.officialContact}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Sarpanch Details</h3>
        <p><strong>Name:</strong> {data.sarpanchName}</p>
        <p><strong>Mobile:</strong> {data.sarpanchMobile}</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="confirm" required />
        <label htmlFor="confirm" style={{ margin: 0 }}>{t('registration.confirmCheckbox')}</label>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/gram-panchayat/step2')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('review.processing') : t('registration.submitBtn')}
        </button>
      </div>
    </form>
  );
};
export default Review;
