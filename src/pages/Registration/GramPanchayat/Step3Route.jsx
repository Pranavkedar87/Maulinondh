import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Shield, Building, Users } from 'lucide-react';

const Step3Route = ({ data, update }) => {
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
          <Building size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('gramPanchayat.step3Title')}</h2>
        </div>
      </div>
      
      
      <div className="input-group">
        <label>{t('gramPanchayat.route')}</label>
        <input type="text" className="input" value={data.route || ''} onChange={e => update({ route: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.startPoint')}</label>
        <input type="text" className="input" value={data.startPoint || ''} onChange={e => update({ startPoint: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.checkpoint')}</label>
        <input type="text" className="input" value={data.checkpoint || ''} onChange={e => update({ checkpoint: e.target.value })} />
      </div>
      <div className="input-group">
        <label>{t('gramPanchayat.destination')}</label>
        <input type="text" className="input" value={data.destination || 'Pandharpur'} onChange={e => update({ destination: e.target.value })} />
      </div>
      
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{t('gramPanchayat.facilities')}</h3>
      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="medical" checked={data.medical || false} onChange={e => update({ medical: e.target.checked })} />
        <label htmlFor="medical" style={{ margin: 0 }}>{t('gramPanchayat.medical')}</label>
      </div>
      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="water" checked={data.water || false} onChange={e => update({ water: e.target.checked })} />
        <label htmlFor="water" style={{ margin: 0 }}>{t('gramPanchayat.water')}</label>
      </div>
      <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="toilet" checked={data.toilet || false} onChange={e => update({ toilet: e.target.checked })} />
        <label htmlFor="toilet" style={{ margin: 0 }}>{t('gramPanchayat.toilet')}</label>
      </div>
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>{t('gramPanchayat.controlRoom')}</label>
        <input type="text" className="input" value={data.controlRoom || ''} onChange={e => update({ controlRoom: e.target.value })} />
      </div>


      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/gram-panchayat/step2')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step3Route;
