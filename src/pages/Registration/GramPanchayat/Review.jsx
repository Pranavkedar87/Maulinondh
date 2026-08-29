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
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id || null;

      // Generate a unique registration ID MN-GP-2026-XXXXXX
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const regId = 'MN-GP-2026-' + randomNum;

      const payload = {
        user_id: userId,
        registration_id: regId,
        panchayat_name: data.panchayatName || '',
        village_name: data.villageName || '',
        taluka: data.taluka || '',
        district: data.district || '',
        office_address: data.officeAddress || '',
        pincode: data.pincode || '',
        official_contact: data.officialContact || '',
        official_email: data.officialEmail || '',
        registration_id_gov: data.govId || '',
        primary_contact_name: data.primaryName || '',
        primary_designation: data.primaryDesignation || '',
        primary_contact_number: data.primaryPhone || '',
        primary_email: data.primaryEmail || '',
        alternate_contact_name: data.altName || '',
        alternate_contact_number: data.altPhone || '',
        wari_route: data.route || '',
        starting_point: data.startPoint || '',
        major_checkpoint: data.checkpoint || '',
        destination: data.destination || '',
        medical_facility: data.medical || false,
        drinking_water: data.water || false,
        toilet_facility: data.toilet || false,
        emergency_control_room: data.controlRoom || '',
        status: 'PENDING_VERIFICATION'
      };

      const { error: dbError } = await supabase
        .from('gram_panchayats')
        .insert([payload]);

      if (dbError) throw dbError;
      navigate('/register/gram-panchayat/success', { state: { regId } });
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
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('gramPanchayat.step1Title')}</h3>
        <p><strong>Name:</strong> {data.panchayatName}</p>
        <p><strong>Village:</strong> {data.villageName}, {data.taluka}, {data.district}</p>
        <p><strong>Contact:</strong> {data.officialContact}</p>
      </div>

      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('gramPanchayat.step2Title')}</h3>
        <p><strong>Primary:</strong> {data.primaryName} ({data.primaryPhone})</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="confirm" required />
        <label htmlFor="confirm" style={{ margin: 0 }}>{t('registration.confirmCheckbox')}</label>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/gram-panchayat/step3')}>
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
