import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Step1Personal from './Varkari/Step1Personal';
import Step2Medical from './Varkari/Step2Medical';
import Step3Emergency from './Varkari/Step3Emergency';
import Step4Wari from './Varkari/Step4Wari';
import Review from './Varkari/Review';
import Success from './Varkari/Success';

const VarkariFlow = () => {
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', mobile: '', address: '', district: '',
    bloodGroup: 'Unknown', medicalConditions: '', medication: '', allergies: '', additionalMedicalInformation: '', photoFile: null, photoPreview: null,
    guardianName: '', guardianRelationship: 'Father', guardianPhone: '', secondaryGuardianName: '', secondaryGuardianPhone: '',
    participatingWith: 'family', dindiName: '', startingLocation: '', startingLatitude: null, startingLongitude: null, startingPlaceId: '', destination: 'पंढरपूर'
  });

  const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
  const location = useLocation();
  const getStepNumber = (pathname) => {
    if (pathname.includes('/step1')) return 1;
    if (pathname.includes('/step2')) return 2;
    if (pathname.includes('/step3')) return 3;
    if (pathname.includes('/step4')) return 4;
    if (pathname.includes('/review')) return 5;
    return 1;
  };
  const currentStep = getStepNumber(location.pathname);

  if (location.pathname.includes('/success')) {
    return <Success formData={formData} />;
  }

  return (
    <>
      {currentStep <= 4 && (
        <div className="step-indicator px-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
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
    </>
  );
};
export default VarkariFlow;
