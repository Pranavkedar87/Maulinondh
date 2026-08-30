import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Step1Panchayat from './GramPanchayat/Step1Panchayat';
import Step2Authority from './GramPanchayat/Step2Authority';
import Review from './GramPanchayat/Review';
import Success from './GramPanchayat/Success';

const GramPanchayatFlow = () => {
  const [formData, setFormData] = useState({});
  const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
  const location = useLocation();
  const getStepNumber = (pathname) => {
    if (pathname.includes('/step1')) return 1;
    if (pathname.includes('/step2')) return 2;
    if (pathname.includes('/review')) return 3;
    return 1;
  };
  const currentStep = getStepNumber(location.pathname);

  if (location.pathname.includes('/success')) {
    return <Success />;
  }

  return (
    <>
      {currentStep <= 2 && (
        <div className="step-indicator px-4">
          {[1, 2].map((step) => (
            <div key={step} className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              {step}
            </div>
          ))}
        </div>
      )}
      <div className="card">
        <Routes>
          <Route path="/" element={<Navigate to="step1" replace />} />
          <Route path="step1" element={<Step1Panchayat data={formData} update={updateFormData} />} />
          <Route path="step2" element={<Step2Authority data={formData} update={updateFormData} />} />
          <Route path="review" element={<Review data={formData} />} />
        </Routes>
      </div>
    </>
  );
};
export default GramPanchayatFlow;
