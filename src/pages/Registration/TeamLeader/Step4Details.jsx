import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step4Details = ({ data, update }) => {
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
          {tPrefix.includes('gramPanchayat') ? <Building size={28} color="var(--primary)" /> : <Users size={28} color="var(--primary)" />}
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('teamLeader.step4Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('teamLeader.coordName')}</label>
        <input type="text" className="input" value={data.coordName || ''} onChange={e => update({ coordName: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.coordPhone')}</label>
        <input type="tel" className="input" value={data.coordPhone || ''} onChange={e => update({ coordPhone: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.meetingPoint')}</label>
        <input type="text" className="input" value={data.meetingPoint || ''} onChange={e => update({ meetingPoint: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.communication')}</label>
        <input type="text" className="input" value={data.communication || ''} onChange={e => update({ communication: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('teamLeader.notes')}</label>
        <textarea className="input" value={data.notes || ''} onChange={e => update({ notes: e.target.value })} />
      </div>


      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/team-leader/step3')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step4Details;
