import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, RefreshCw, X, Upload, Heart } from 'lucide-react';

const Step2Medical = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

  const handleCapture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    update({ photoPreview: imageSrc });
    setShowCamera(false);
    // Convert base64 to file for actual upload later
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        update({ photoFile: file });
      });
  }, [webcamRef, update]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      update({ photoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        update({ photoPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/step3');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ background: 'var(--primary-dark)', margin: '-1.5rem -1.5rem 2rem -1.5rem', padding: '2rem 1.5rem', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', color: 'white' }}>
        <div className="flex items-center gap-3 mb-2">
          <Heart size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>{t('registration.medical.title')}</h2>
        </div>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>{t('registration.medical.subtitle')}</p>
      </div>
      
      {/* Photo Section */}
      <div className="mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <Camera size={18} /> {t('registration.medical.photoTitle')}
        </h3>
        
        <div className="flex flex-col items-center">
          {data.photoPreview ? (
            <div className="relative mb-6" style={{ width: '220px', height: '220px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src={data.photoPreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
              <button 
                type="button"
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50 transition"
                onClick={() => update({ photoPreview: null, photoFile: null })}
              >
                <X size={20} color="var(--danger)" />
              </button>
            </div>
          ) : showCamera ? (
            <div className="mb-6 relative" style={{ width: '100%', maxWidth: '300px' }}>
              {cameraError ? (
                <div className="p-4 text-center text-red-500 text-sm border border-red-300 rounded bg-white">
                  {t('registration.medical.cameraError')}
                </div>
              ) : (
                <div style={{ border: '4px solid white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{ facingMode: "user" }}
                    onUserMediaError={() => setCameraError(true)}
                  />
                </div>
              )}
              {!cameraError && (
                <button 
                  type="button"
                  className="btn btn-primary mt-4 w-full flex items-center justify-center gap-2"
                  onClick={handleCapture}
                >
                  <Camera size={18} /> {t('registration.medical.capture')}
                </button>
              )}
              <button 
                type="button"
                className="btn btn-outline mt-2 w-full bg-white flex items-center justify-center gap-2"
                onClick={() => setShowCamera(false)}
              >
                {t('registration.medical.cancel')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm text-center">
              <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#F3F4F6', border: '2px solid #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Camera size={48} color="#9CA3AF" style={{ opacity: '0.8', marginBottom: '0.5rem' }} />
                <span style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500' }}>{t('registration.medical.noPhoto')}</span>
              </div>
              
              <div className="flex flex-row gap-3 w-full justify-center">
                <button 
                  type="button"
                  className="btn btn-primary flex items-center justify-center gap-2"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}
                  onClick={() => { setShowCamera(true); setCameraError(false); }}
                >
                  <Camera size={18} /> {t('registration.medical.openCamera')}
                </button>
                
                <label className="btn btn-outline cursor-pointer flex justify-center items-center gap-2 bg-white" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', margin: 0 }}>
                  <Upload size={18} /> {t('registration.medical.uploadImage')}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    style={{ display: 'none' }}
                    onChange={handleFileUpload} 
                  />
                </label>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', lineHeight: '1.4' }}>
                {t('registration.medical.photoHint')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="input-group">
        <label>{t('registration.medical.bloodGroup')}</label>
        <select 
          className="input"
          value={data.bloodGroup}
          onChange={(e) => update({ bloodGroup: e.target.value })}
          required
        >
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>{t('registration.medical.conditions')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.medicalConditions}
          onChange={(e) => update({ medicalConditions: e.target.value })}
          placeholder={t('registration.medical.conditionsPlaceholder')}
        />
      </div>

      <div className="input-group">
        <label>{t('registration.medical.medication')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.medication}
          onChange={(e) => update({ medication: e.target.value })}
          placeholder={t('registration.medical.medicationPlaceholder')}
        />
      </div>

      <div className="input-group">
        <label>{t('registration.medical.allergies')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.allergies}
          onChange={(e) => update({ allergies: e.target.value })}
          placeholder={t('registration.medical.allergiesPlaceholder')}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/step1')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step2Medical;
