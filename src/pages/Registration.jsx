import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Step1Personal from './Registration/Step1Personal';
import Step2Medical from './Registration/Step2Medical';
import Step3Emergency from './Registration/Step3Emergency';
import Step4Wari from './Registration/Step4Wari';
import Review from './Registration/Review';
import Success from './Registration/Success';
import { ChevronLeft, Globe } from 'lucide-react';
import logo from '../assets/logo.png';
import LanguageSelector from '../components/LanguageSelector';

const Registration = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    age: '',
    gender: 'Male',
    mobile: '',
    address: '',
    district: '',
    // Step 2
    bloodGroup: 'Unknown',
    medicalConditions: '',
    medication: '',
    allergies: '',
    additionalMedicalInformation: '',
    photoFile: null,
    photoPreview: null,
    // Step 3
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    secondaryGuardianName: '',
    secondaryGuardianPhone: '',
    // Step 4
    participatingWith: 'family',
    dindiName: '',
    startingLocation: '',
    startingLatitude: null,
    startingLongitude: null,
    startingPlaceId: '',
    destination: 'पंढरपूर'
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const getStepNumber = (pathname) => {
    if (pathname.includes('/step1')) return 1;
    if (pathname.includes('/step2')) return 2;
    if (pathname.includes('/step3')) return 3;
    if (pathname.includes('/step4')) return 4;
    if (pathname.includes('/review')) return 5;
    return 1;
  };

  const currentPath = window.location.pathname;
  const currentStep = getStepNumber(currentPath);

  // Exclude Success page from wizard UI
  if (currentPath.includes('/success')) {
    return <Success formData={formData} />;
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: '#f9fafb' }}>
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'white' }}>
        <div className="brand flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', letterSpacing: '0.5px', color: 'var(--text-main)' }}>{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLangModal(true)} 
            className="btn btn-outline flex items-center gap-2" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '20px', background: 'white', color: 'var(--text-main)' }}
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
          <button 
            onClick={() => navigate('/home')} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}
          >
            {t('registration.cancelBtn')}
          </button>
        </div>
      </header>

      <main className="container pt-8 max-w-3xl mx-auto">
        {/* Step Indicator */}
        {currentStep <= 4 && (
          <div className="step-indicator px-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step} 
                className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <Routes>
            <Route path="/" element={<Navigate to="step1" replace />} />
            <Route path="step1" element={<Step1Personal data={formData} update={updateFormData} />} />
            <Route path="step2" element={<Step2Medical data={formData} update={updateFormData} />} />
            <Route path="step3" element={<Step3Emergency data={formData} update={updateFormData} />} />
            <Route path="step4" element={<Step4Wari data={formData} update={updateFormData} />} />
            <Route path="review" element={<Review data={formData} />} />
          </Routes>
        </div>
      </main>
      
      <LanguageSelector isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </div>
  );
};

export default Registration;
