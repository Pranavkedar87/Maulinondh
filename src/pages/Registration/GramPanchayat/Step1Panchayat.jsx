import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { Building } from 'lucide-react';

const Step1Panchayat = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/gram-panchayat/step2');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Building size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('gramPanchayat.step1Title') || 'Gram Panchayat Details'}</h2>
        </div>
      </div>
      
      <div className="input-group">
        <label>Gram Panchayat Name *</label>
        <input type="text" className="input" value={data.panchayatName || ''} onChange={e => update({ panchayatName: e.target.value })} required />
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>Taluka *</label>
          <input type="text" className="input" value={data.taluka || ''} onChange={e => update({ taluka: e.target.value })} required />
        </div>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>District *</label>
          <input type="text" className="input" value={data.district || ''} onChange={e => update({ district: e.target.value })} required />
        </div>
      </div>

      <div className="input-group">
        <label>Panchayat Office Address *</label>
        <input type="text" className="input" value={data.officeAddress || ''} onChange={e => update({ officeAddress: e.target.value })} required />
      </div>

      <div className="input-group">
        <label>Pincode</label>
        <input type="text" className="input" value={data.pincode || ''} onChange={e => update({ pincode: e.target.value })} />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>Official Contact Number *</label>
          <input type="tel" className="input" value={data.officialContact || ''} onChange={e => update({ officialContact: e.target.value })} required />
        </div>
        <div className="input-group w-full" style={{ marginBottom: 0 }}>
          <label>Official Email</label>
          <input type="email" className="input" value={data.officialEmail || ''} onChange={e => update({ officialEmail: e.target.value })} />
        </div>
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

export default Step1Panchayat;
