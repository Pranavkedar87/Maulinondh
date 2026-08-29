import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step3Emergency = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/team-leader/review');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Users size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('teamLeader.step3Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('teamLeader.emerName')}</label>
        <input type="text" className="input" value={data.emerName || ''} onChange={e => update({ emerName: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.emerPhone')}</label>
        <input type="tel" className="input" value={data.emerPhone || ''} onChange={e => update({ emerPhone: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.altName')}</label>
        <input type="text" className="input" value={data.altName || ''} onChange={e => update({ altName: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.altPhone')}</label>
        <input type="tel" className="input" value={data.altPhone || ''} onChange={e => update({ altPhone: e.target.value })} />
      </div>


      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/team-leader/step2')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step3Emergency;
