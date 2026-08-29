import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { supabase } from '../../../services/supabase';
import { Camera, User, Heart, Phone, MapPin, CheckCircle } from 'lucide-react';

const Review = ({ data }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) return;
    setLoading(true);
    setError(null);

    try {
      // Create user in Auth (Demo implementation for dummy phone mapping)
      // Usually would be OTP, but following requirements:
      const email = `${data.mobile}@maulinondh.com`;
      const password = `Mauli@${data.mobile}`; // simple generated password for prototype

      let userId = null;

      // Attempt to sign up or sign in if already exists
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError && authError.message.includes('already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (signInData.user) userId = signInData.user.id;
      } else if (authError) {
        throw new Error(`Supabase Auth Error: ${authError.message}`);
      } else if (authData?.user) {
        userId = authData.user.id;
      }

      if (!userId) {
        throw new Error("Could not authenticate user. Please check your Supabase .env.local configuration.");
      }

      // Generate Registration ID
      const timestamp = new Date().getTime().toString().slice(-4);
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const regId = `MN-2026-${timestamp}${randomPart}`;

      // Handle Photo Upload — try Supabase Storage first, fall back to base64
      let photoUrl = null;
      if (data.photoFile) {
        try {
          const fileExt = data.photoFile.name.split('.').pop() || 'jpg';
          const fileName = `${userId}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('varkari-photos')
            .upload(fileName, data.photoFile, { upsert: true });

          if (uploadError) {
            console.warn('Storage upload failed, using base64 fallback:', uploadError.message);
            // Fallback: store base64 directly in photo_url
            photoUrl = data.photoPreview; // already base64 from webcam or FileReader
          } else {
            const { data: publicUrlData } = supabase.storage
              .from('varkari-photos')
              .getPublicUrl(fileName);
            photoUrl = publicUrlData.publicUrl;
          }
        } catch (uploadErr) {
          console.warn('Photo handling error, using base64 fallback:', uploadErr);
          photoUrl = data.photoPreview;
        }
      }

      // Insert Varkari Record
      const { error: insertError } = await supabase.from('varkaris').insert({
        user_id: userId,
        registration_id: regId,
        name: data.fullName,
        age: parseInt(data.age),
        gender: data.gender,
        phone: data.mobile,
        address: data.address,
        district: data.district,
        blood_group: data.bloodGroup,
        medical_conditions: data.medicalConditions,
        medications: data.medication,
        allergies: data.allergies,
        additional_medical_information: data.additionalMedicalInformation,
        guardian_name: data.guardianName,
        guardian_relationship: data.guardianRelationship,
        guardian_phone: data.guardianPhone,
        secondary_guardian_name: data.secondaryGuardianName,
        secondary_guardian_phone: data.secondaryGuardianPhone,
        participating_with: data.participatingWith,
        dindi_name: data.dindiName,
        starting_location: data.startingLocation,
        starting_latitude: data.startingLatitude,
        starting_longitude: data.startingLongitude,
        starting_place_id: data.startingPlaceId,
        destination: data.destination,
        photo_url: photoUrl,
        status: 'PENDING_VERIFICATION'
      });

      if (insertError) throw insertError;

      // Navigate to success
      navigate('/register/success', { state: { regId } });

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center">{t('registration.confirmTitle')}</h2>
      
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 mb-6">
        
        {data.photoPreview && (
          <div className="card text-center flex flex-col items-center justify-center">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2 justify-center" style={{ color: 'var(--primary-dark)' }}>
              <Camera size={16} /> {t('review.photo')}
            </h3>
            <img src={data.photoPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm" style={{ border: '3px solid var(--primary)' }} />
          </div>
        )}

        <div className="card">
          <h3 className="font-bold text-sm mb-3 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--primary-dark)', borderColor: 'var(--primary-light)' }}>
            <User size={16} /> {t('review.personal')}
          </h3>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.name')}:</span> {data.fullName}</p>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.ageGender')}:</span> {data.age} / {data.gender}</p>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.mobile')}:</span> {data.mobile}</p>
          <p className="text-sm"><span style={{ color: 'var(--text-muted)' }}>{t('review.location')}:</span> {data.address}, {data.district}</p>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--primary-dark)', borderColor: 'var(--primary-light)' }}>
            <Heart size={16} /> {t('review.medical')}
          </h3>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.bloodGroup')}:</span> {data.bloodGroup}</p>
          {data.medicalConditions && <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.condition')}:</span> {data.medicalConditions}</p>}
          {data.medication && <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.medication')}:</span> {data.medication}</p>}
          {data.allergies && <p className="text-sm"><span style={{ color: 'var(--text-muted)' }}>{t('review.allergies')}:</span> {data.allergies}</p>}
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--primary-dark)', borderColor: 'var(--primary-light)' }}>
            <Phone size={16} /> {t('review.emergency')}
          </h3>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.name')}:</span> {data.guardianName} ({data.guardianRelationship})</p>
          <p className="text-sm"><span style={{ color: 'var(--text-muted)' }}>{t('review.phone')}:</span> {data.guardianPhone}</p>
        </div>

        <div className="card">
          <h3 className="font-bold text-sm mb-3 border-b pb-2 flex items-center gap-2" style={{ color: 'var(--primary-dark)', borderColor: 'var(--primary-light)' }}>
            <MapPin size={16} /> {t('review.wari')}
          </h3>
          <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.type')}:</span> {data.participatingWith}</p>
          {data.dindiName && <p className="text-sm mb-1"><span style={{ color: 'var(--text-muted)' }}>{t('review.dindi')}:</span> {data.dindiName}</p>}
          <p className="text-sm"><span style={{ color: 'var(--text-muted)' }}>{t('review.route')}:</span> {data.startingLocation} to {data.destination}</p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>
        <label className="flex items-start gap-2 mb-6 cursor-pointer p-2 border rounded" style={{ borderColor: 'var(--border)' }}>
          <input 
            type="checkbox" 
            className="mt-1"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            required
          />
          <span className="text-sm font-medium">{t('registration.confirmCheckbox')}</span>
        </label>

        <div className="flex flex-col gap-3 mt-6">
          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            disabled={!confirmed || loading}
          >
            {loading ? t('review.processing') : <><CheckCircle size={18} /> {t('registration.submitBtn')}</>}
          </button>
          <button type="button" className="btn btn-outline w-full" onClick={() => navigate('/register/varkari/step4')} disabled={loading}>
            ← {t('review.editInfo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Review;
