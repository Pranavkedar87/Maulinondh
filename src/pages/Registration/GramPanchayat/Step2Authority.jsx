import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step2Authority = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/gram-panchayat/step3');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          {tPrefix.includes('gramPanchayat') ? <Building size={28} color="var(--primary)" /> : <Users size={28} color="var(--primary)" />}
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('gramPanchayat.step2Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('gramPanchayat.primaryName')}</label>
        <input type="text" className="input" value={data.primaryName || ''} onChange={e => update({ primaryName: e.target.value })} required />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.primaryDesignation')}</label>
        <select className="input" value={data.primaryDesignation || 'sarpanch'} onChange={e => update({ primaryDesignation: e.target.value })}>
          <option value="sarpanch">{t('gramPanchayat.designations.sarpanch')}</option>
          <option value="gramSevak">{t('gramPanchayat.designations.gramSevak')}</option>
          <option value="officer">{t('gramPanchayat.designations.officer')}</option>
          <option value="rep">{t('gramPanchayat.designations.rep')}</option>
          <option value="other">{t('gramPanchayat.designations.other')}</option>
        </select>
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.primaryPhone')}</label>
        <input type="tel" className="input" value={data.primaryPhone || ''} onChange={e => update({ primaryPhone: e.target.value })} required />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.primaryEmail')}</label>
        <input type="email" className="input" value={data.primaryEmail || ''} onChange={e => update({ primaryEmail: e.target.value })} />
      </div>
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('gramPanchayat.altName')} (Optional)</h3>
      <div className="input-group">
        <label>{t('gramPanchayat.altName')}</label>
        <input type="text" className="input" value={data.altName || ''} onChange={e => update({ altName: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.altPhone')}</label>
        <input type="tel" className="input" value={data.altPhone || ''} onChange={e => update({ altPhone: e.target.value })} />
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
