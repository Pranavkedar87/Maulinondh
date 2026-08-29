import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step2Team = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/team-leader/step3');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Users size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('teamLeader.step2Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('teamLeader.teamName')}</label>
        <input type="text" className="input" value={data.teamName || ''} onChange={e => update({ teamName: e.target.value })} required />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.teamId')}</label>
        <input type="text" className="input" value={data.teamId || ''} onChange={e => update({ teamId: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.teamSize')}</label>
        <input type="number" className="input" value={data.teamSize || ''} onChange={e => update({ teamSize: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.startLocation')}</label>
        <input type="text" className="input" value={data.startLocation || ''} onChange={e => update({ startLocation: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.destination')}</label>
        <input type="text" className="input" value={data.destination || 'Pandharpur'} onChange={e => update({ destination: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.route')}</label>
        <input type="text" className="input" value={data.route || ''} onChange={e => update({ route: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.identifier')}</label>
        <input type="text" className="input" value={data.identifier || ''} onChange={e => update({ identifier: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.description')}</label>
        <textarea className="input" value={data.description || ''} onChange={e => update({ description: e.target.value })} />
      </div>


      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/team-leader/step1')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step2Team;
