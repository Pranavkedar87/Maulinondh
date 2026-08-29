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
      // Generate a unique registration ID MN-TL-2026-XXXXXX
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const regId = 'MN-TL-2026-' + randomNum;
      const generatedPassword = Math.random().toString(36).slice(-6).toUpperCase();
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
        full_name: data.fullName || '',
        mobile_number: data.mobile || '',
        email: data.email || '',
        age: parseInt(data.age) || null,
        address: data.address || '',
        village: data.village || '',
        district: data.district || '',
        team_name: data.teamName || '',
        team_id: data.teamId || '',
        team_size: parseInt(data.teamSize) || null,
        starting_location: data.startLocation || '',
        destination: data.destination || '',
        wari_route: data.route || '',
        dindi_identifier: data.identifier || '',
        group_description: data.description || '',
        emergency_contact_name: data.emerName || '',
        emergency_contact_number: data.emerPhone || '',
        alternate_contact_name: data.altName || '',
        alternate_contact_number: data.altPhone || '',
        status: 'PENDING_VERIFICATION'
      };

      const { error: dbError } = await supabase
        .from('team_leaders')
        .insert([payload]);

      if (dbError) throw dbError;
      
      // Navigate to success and pass credentials to show to user
      navigate('/register/team-leader/success', { state: { regId, generatedPassword } });
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
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('teamLeader.step1Title')}</h3>
        <p><strong>Name:</strong> {data.fullName}</p>
        <p><strong>Mobile:</strong> {data.mobile}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('teamLeader.step2Title')}</h3>
        <p><strong>Team Name:</strong> {data.teamName}</p>
        <p><strong>Team Size:</strong> {data.teamSize}</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="confirm" required />
        <label htmlFor="confirm" style={{ margin: 0 }}>{t('registration.confirmCheckbox')}</label>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/team-leader/step3')}>
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
