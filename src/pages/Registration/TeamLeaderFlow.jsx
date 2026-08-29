import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Step1Leader from './TeamLeader/Step1Leader';
import Step2Team from './TeamLeader/Step2Team';
import Step3Emergency from './TeamLeader/Step3Emergency';
import Step4Details from './TeamLeader/Step4Details';
import Review from './TeamLeader/Review';
import Success from './TeamLeader/Success';

const TeamLeaderFlow = () => {
  const [formData, setFormData] = useState({});
  const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
  const location = useLocation();
  const getStepNumber = (pathname) => {
    if (pathname.includes('/step1')) return 1;
    if (pathname.includes('/step2')) return 2;
    if (pathname.includes('/step3')) return 3;
    if (pathname.includes('/review')) return 4;
    return 1;
  };
  const currentStep = getStepNumber(location.pathname);

  if (location.pathname.includes('/success')) {
    return <Success />;
  }

  return (
    <>
      {currentStep <= 3 && (
        <div className="step-indicator px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              {step}
            </div>
          ))}
        </div>
      )}
      <div className="card">
        <Routes>
          <Route path="/" element={<Navigate to="step1" replace />} />
          <Route path="step1" element={<Step1Leader data={formData} update={updateFormData} />} />
          <Route path="step2" element={<Step2Team data={formData} update={updateFormData} />} />
          <Route path="step3" element={<Step3Emergency data={formData} update={updateFormData} />} />
          <Route path="review" element={<Review data={formData} />} />
        </Routes>
      </div>
    </>
  );
};
export default TeamLeaderFlow;
