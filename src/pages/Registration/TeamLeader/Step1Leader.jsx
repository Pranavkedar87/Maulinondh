import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step1Leader = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/team-leader/step2');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          {tPrefix.includes('gramPanchayat') ? <Building size={28} color="var(--primary)" /> : <Users size={28} color="var(--primary)" />}
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('teamLeader.step1Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('teamLeader.fullName')}</label>
        <input type="text" className="input" value={data.fullName || ''} onChange={e => update({ fullName: e.target.value })} required />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.mobile')}</label>
        <input type="tel" className="input" value={data.mobile || ''} onChange={e => update({ mobile: e.target.value })} required />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.email')}</label>
        <input type="email" className="input" value={data.email || ''} onChange={e => update({ email: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.age')}</label>
        <input type="number" className="input" value={data.age || ''} onChange={e => update({ age: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.village')}</label>
        <input type="text" className="input" value={data.village || ''} onChange={e => update({ village: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.district')}</label>
        <input type="text" className="input" value={data.district || ''} onChange={e => update({ district: e.target.value })} />
      </div>


      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step1Leader;
