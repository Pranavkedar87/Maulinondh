import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Users } from 'lucide-react';

const Step2Authority = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/gram-panchayat/review');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Users size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('gramPanchayat.step2Title') || 'Sarpanch / Safety Contact'}</h2>
        </div>
      </div>
      
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
        This contact will automatically be used as the Default Safety Contact for all Varkaris registered under your Panchayat.
      </p>

      <div className="input-group">
        <label>Sarpanch Name *</label>
        <input type="text" className="input" value={data.sarpanchName || ''} onChange={e => update({ sarpanchName: e.target.value })} required />
      </div>

      <div className="input-group">
        <label>Sarpanch Mobile Number *</label>
        <input type="tel" className="input" value={data.sarpanchMobile || ''} onChange={e => update({ sarpanchMobile: e.target.value })} required />
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/gram-panchayat/step1')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step2Authority;
