import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield } from 'lucide-react';

const Step1Personal = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/step2');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Shield size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('registration.personal.title')}</h2>
        </div>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>{t('registration.personal.subtitle')}</p>
      </div>
      
      <div className="input-group">
        <label>{t('registration.personal.fullName')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          required 
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>{t('registration.personal.age')}</label>
          <input 
            type="number" 
            className="input" 
            value={data.age}
            onChange={(e) => update({ age: e.target.value })}
            required 
            min="1"
            max="120"
          />
        </div>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>{t('registration.personal.gender')}</label>
          <select 
            className="input"
            value={data.gender}
            onChange={(e) => update({ gender: e.target.value })}
          >
            <option value="Male">{t('registration.personal.genders.male')}</option>
            <option value="Female">{t('registration.personal.genders.female')}</option>
            <option value="Other">{t('registration.personal.genders.other')}</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>{t('registration.personal.mobile')}</label>
        <input 
          type="tel" 
          className="input" 
          value={data.mobile}
          onChange={(e) => update({ mobile: e.target.value })}
          placeholder="+91"
          required 
        />
      </div>

      <div className="input-group">
        <label>{t('registration.personal.district')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.district}
          onChange={(e) => update({ district: e.target.value })}
          required 
        />
      </div>

      <div className="input-group">
        <label>{t('registration.personal.village')}</label>
        <textarea 
          className="input" 
          rows="2"
          value={data.address}
          onChange={(e) => update({ address: e.target.value })}
          required 
        />
      </div>

      <div className="flex justify-between mt-6">
        <div></div>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step1Personal;
