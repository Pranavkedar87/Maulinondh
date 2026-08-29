import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Step3Emergency = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/step4');
  };

  const relationships = [
    { key: 'father', label: t('registration.emergency.relationships.father') },
    { key: 'mother', label: t('registration.emergency.relationships.mother') },
    { key: 'son', label: t('registration.emergency.relationships.son') },
    { key: 'daughter', label: t('registration.emergency.relationships.daughter') },
    { key: 'brother', label: t('registration.emergency.relationships.brother') },
    { key: 'sister', label: t('registration.emergency.relationships.sister') },
    { key: 'husband', label: t('registration.emergency.relationships.husband') },
    { key: 'wife', label: t('registration.emergency.relationships.wife') },
    { key: 'relative', label: t('registration.emergency.relationships.relative') },
    { key: 'other', label: t('registration.emergency.relationships.other') },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center">{t('registration.emergency.title')}</h2>
      
      <div className="input-group">
        <label>{t('registration.emergency.name')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.guardianName}
          onChange={(e) => update({ guardianName: e.target.value })}
          required 
        />
      </div>

      <div className="input-group">
        <label>{t('registration.emergency.relationship')}</label>
        <select 
          className="input"
          value={data.guardianRelationship}
          onChange={(e) => update({ guardianRelationship: e.target.value })}
          required
        >
          {relationships.map(rel => (
            <option key={rel.key} value={rel.key}>{rel.label}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>{t('registration.emergency.phone')}</label>
        <input 
          type="tel" 
          className="input" 
          value={data.guardianPhone}
          onChange={(e) => update({ guardianPhone: e.target.value })}
          required 
        />
      </div>

      <hr className="my-6 border" style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

      <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{t('registration.emergency.secondaryTitle')}</h3>

      <div className="input-group">
        <label>{t('registration.emergency.secondaryName')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.secondaryGuardianName}
          onChange={(e) => update({ secondaryGuardianName: e.target.value })}
        />
      </div>

      <div className="input-group">
        <label>{t('registration.emergency.secondaryPhone')}</label>
        <input 
          type="tel" 
          className="input" 
          value={data.secondaryGuardianPhone}
          onChange={(e) => update({ secondaryGuardianPhone: e.target.value })}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/step2')}>
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
