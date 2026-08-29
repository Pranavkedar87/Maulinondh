import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

const Step4Wari = ({ data, update }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setGoogleLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (googleLoaded && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry', 'place_id'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          update({
            startingLocation: place.formatted_address,
            startingLatitude: place.geometry.location.lat(),
            startingLongitude: place.geometry.location.lng(),
            startingPlaceId: place.place_id
          });
        }
      });
    }
  }, [googleLoaded, update]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/varkari/review');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-4 text-center">{t('registration.wari.title')}</h2>
      
      <div className="input-group">
        <label>{t('registration.wari.participatingWith')}</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
          {['family', 'dindi', 'group', 'alone'].map((type) => (
            <label 
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.8rem',
                border: '1px solid',
                borderRadius: '8px',
                cursor: 'pointer',
                borderColor: data.participatingWith === type ? 'var(--primary)' : 'var(--border)',
                background: data.participatingWith === type ? 'var(--primary-light)' : 'white',
                transition: 'all 0.2s',
                fontWeight: data.participatingWith === type ? '600' : '500'
              }}
            >
              <input 
                type="radio" 
                name="participatingWith"
                value={type}
                checked={data.participatingWith === type}
                onChange={(e) => update({ participatingWith: e.target.value })}
                className="hidden"
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '0.95rem', color: data.participatingWith === type ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                {t(`registration.wari.types.${type}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {(data.participatingWith === 'dindi' || data.participatingWith === 'group') && (
        <div className="input-group">
          <label>{t('registration.wari.dindiName')}</label>
          <input 
            type="text" 
            className="input" 
            value={data.dindiName}
            onChange={(e) => update({ dindiName: e.target.value })}
            required={data.participatingWith === 'dindi' || data.participatingWith === 'group'}
          />
        </div>
      )}

      <div className="input-group">
        <label>{t('registration.wari.startingLocation')}</label>
        <input 
          ref={autocompleteRef}
          type="text" 
          className="input" 
          value={data.startingLocation}
          onChange={(e) => update({ startingLocation: e.target.value })}
          placeholder="e.g. Alandi, Pune"
          required 
        />
        {!googleLoaded && (
          <small style={{ color: 'var(--text-muted)' }}>{t('registration.wari.startingLocationHint')}</small>
        )}
      </div>

      <div className="input-group">
        <label>{t('registration.wari.destination')}</label>
        <input 
          type="text" 
          className="input" 
          value={data.destination}
          onChange={(e) => update({ destination: e.target.value })}
          required 
        />
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/register/varkari/step3')}>
          ← {t('registration.prevBtn')}
        </button>
        <button type="submit" className="btn btn-primary">
          {t('registration.nextBtn')} →
        </button>
      </div>
    </form>
  );
};

export default Step4Wari;
