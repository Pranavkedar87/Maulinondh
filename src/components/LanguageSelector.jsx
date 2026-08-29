import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LANGUAGES = [
  { code: 'en', native: 'English', name: 'English' },
  { code: 'hi', native: 'हिंदी', name: 'Hindi' },
  { code: 'mr', native: 'मराठी', name: 'Marathi' },
];

const LanguageSelector = ({ isOpen, onClose }) => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lang.native.includes(searchTerm)
  );

  const handleSelect = (code) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          display: 'flex', 
          flexDirection: 'column',
          maxHeight: '85vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        
        {/* Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Select Language</h2>
          <button 
            onClick={onClose} 
            style={{ padding: '0.5rem', background: '#f9fafb', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              placeholder="Search language..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 2.5rem', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                outline: 'none',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
          {filteredLanguages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>No languages found.</div>
          ) : (
            filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{ 
                  width: '100%', 
                  textAlign: 'left', 
                  padding: '1rem 1.5rem', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  backgroundColor: language === lang.code ? '#FFFDF5' : 'transparent',
                  border: language === lang.code ? '1px solid var(--primary-light)' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '0.25rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: language === lang.code ? 'var(--primary-dark)' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {lang.native}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {lang.name}
                  </div>
                </div>
                {language === lang.code && (
                  <Check size={20} color="var(--primary)" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
