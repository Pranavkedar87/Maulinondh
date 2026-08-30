import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { Users, MapPin, PlusCircle, AlertTriangle, LogOut, ChevronLeft, Search } from 'lucide-react';
import logo from '../assets/logo.png';

const PanchayatDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [panchayat, setPanchayat] = useState(null);
  const [varkaris, setVarkaris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch Panchayat
      const { data: gpData, error: gpError } = await supabase
        .from('gram_panchayats')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (gpError || !gpData) {
        // Not a Gram Panchayat
        navigate('/dashboard');
        return;
      }
      setPanchayat(gpData);

      // Fetch Varkaris
      const { data: vData } = await supabase
        .from('varkaris')
        .select('*')
        .eq('gram_panchayat_user_id', session.user.id);
        
      if (vData) setVarkaris(vData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
  }

  if (!panchayat) return null;

  return (
    <div className="min-h-screen pb-8" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="brand flex items-center gap-2 cursor-pointer" onClick={() => navigate('/panchayat-dashboard')}>
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', letterSpacing: '0.5px', color: 'var(--text-main)' }}>Gram Panchayat Portal</span>
        </div>
        <button 
          onClick={handleLogout}
          className="btn btn-outline flex items-center gap-2" 
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border)', borderRadius: '20px', background: 'white', color: 'var(--text-main)' }}
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="container pt-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
              {panchayat.panchayat_name}
            </h3>
            <div style={{ padding: '0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {panchayat.district} District
            </div>

            <div className="flex flex-col gap-1">
              <TabLink to="/panchayat-dashboard" current={location.pathname} icon={<Users size={18} />} label="Overview" exact />
              <TabLink to="/panchayat-dashboard/varkaris" current={location.pathname} icon={<Users size={18} />} label="Varkaris List" />
              <TabLink to="/panchayat-dashboard/add" current={location.pathname} icon={<PlusCircle size={18} />} label="Add Varkari" />
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <AlertTriangle size={18} /> Sarpanch / Safety
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {panchayat.primary_contact_name}<br/>
                <a href={`tel:${panchayat.primary_contact_number}`} style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                  {panchayat.primary_contact_number}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Overview panchayat={panchayat} varkaris={varkaris} />} />
            <Route path="varkaris" element={<VarkarisList varkaris={varkaris} panchayat={panchayat} />} />
            <Route path="add" element={<AddVarkariForm panchayat={panchayat} onAdded={fetchData} />} />
          </Routes>
        </div>

      </main>
    </div>
  );
};

const TabLink = ({ to, current, icon, label, exact }) => {
  const navigate = useNavigate();
  const isActive = exact ? current === to : current.startsWith(to);
  
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-3 w-full text-left transition-colors"
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: isActive ? 'var(--primary-light)' : 'transparent',
        color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
        fontWeight: isActive ? 'bold' : 'normal',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {icon}
      {label}
    </button>
  );
};

// Overview Sub-component
const Overview = ({ panchayat, varkaris }) => (
  <div className="card">
    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Panchayat Overview</h2>
    
    <div className="flex gap-4 mb-6">
      <div style={{ flex: 1, padding: '1.5rem', background: '#F3F4F6', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{varkaris.length}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registered Varkaris</div>
      </div>
      <div style={{ flex: 1, padding: '1.5rem', background: panchayat.status === 'VERIFIED' ? '#ECFDF5' : '#FEF3C7', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: panchayat.status === 'VERIFIED' ? '#065F46' : '#92400E', marginTop: '0.5rem' }}>
          {panchayat.status}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Panchayat Status</div>
      </div>
    </div>

    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Panchayat Details</h3>
    <div className="grid grid-cols-2 gap-4" style={{ fontSize: '0.95rem' }}>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Gram Panchayat Name</div>
        <div style={{ fontWeight: '500' }}>{panchayat.panchayat_name}</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Location</div>
        <div style={{ fontWeight: '500' }}>{panchayat.taluka}, {panchayat.district}</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Official Contact</div>
        <div style={{ fontWeight: '500' }}>{panchayat.official_contact}</div>
      </div>
    </div>
  </div>
);

// Varkaris List Sub-component
const VarkarisList = ({ varkaris }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = varkaris.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.phone.includes(searchTerm) ||
    v.registration_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Registered Varkaris</h2>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate('/panchayat-dashboard/add')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          <PlusCircle size={18} /> Add Varkari
        </button>
      </div>

      <div className="input-group mb-6 relative">
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          className="input" 
          placeholder="Search by name, mobile, or ID..." 
          style={{ paddingLeft: '2.5rem' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
          <p>No Varkaris found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(v => (
            <div key={v.id} className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-4">
                {v.photo_url ? (
                  <img src={v.photo_url} alt={v.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} color="#9CA3AF" />
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{v.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{v.phone} • {v.registration_id}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: v.status === 'VERIFIED' ? '#10B981' : '#D97706', fontWeight: 'bold' }}>{v.status}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.medical_conditions ? 'Medical Note' : 'Healthy'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Varkari Form Sub-component
const AddVarkariForm = ({ panchayat, onAdded }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let photoUrl = null;

      // Handle Photo Upload
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${panchayat.registration_id}/${fileName}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('varkari-photos')
          .upload(filePath, photoFile);
          
        if (uploadError) {
          throw new Error('Failed to upload photo. Ensure bucket "varkari-photos" exists and is public.');
        }

        const { data: publicUrlData } = supabase.storage.from('varkari-photos').getPublicUrl(filePath);
        photoUrl = publicUrlData.publicUrl;
      }

      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const regId = 'MN-2026-' + randomNum;

      const payload = {
        gram_panchayat_user_id: panchayat.user_id,
        gram_panchayat_id: panchayat.id,
        default_safety_contact_name: panchayat.primary_contact_name, // Sarpanch
        default_safety_contact_phone: panchayat.primary_contact_number, // Sarpanch Phone
        registration_id: regId,
        participating_with: 'gram_panchayat',
        
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        phone: data.phone,
        photo_url: photoUrl,
        
        // Don't ask village, inherit from GP
        address: data.address || panchayat.panchayat_name,
        district: panchayat.district,
        
        blood_group: data.blood_group,
        medical_conditions: data.medical_condition,
        medications: data.medication,
        allergies: data.allergies,
        
        guardian_name: data.guardian_name,
        guardian_relationship: data.guardian_relationship,
        guardian_phone: data.guardian_phone,
        
        status: 'PENDING_VERIFICATION' 
      };

      const { error: dbError } = await supabase.from('varkaris').insert([payload]);
      if (dbError) throw dbError;

      onAdded();
      navigate('/panchayat-dashboard/varkaris');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/panchayat-dashboard/varkaris')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Register New Varkari</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', background: '#FEF2F2', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>1. Varkari Information</h3>
        <div className="input-group">
          <label>Full Name *</label>
          <input type="text" name="name" className="input" required />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Age *</label>
            <input type="number" name="age" className="input" required />
          </div>
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Gender *</label>
            <select name="gender" className="input" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Mobile Number *</label>
          <input type="tel" name="phone" className="input" required />
        </div>
        
        <div className="input-group">
          <label>Photo *</label>
          <input 
            type="file" 
            accept="image/*" 
            className="input" 
            onChange={(e) => setPhotoFile(e.target.files[0])} 
            required 
            style={{ padding: '0.5rem' }}
          />
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary-dark)' }}>2. Medical Information</h3>
        <div className="input-group">
          <label>Blood Group</label>
          <select name="blood_group" className="input">
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div className="input-group">
          <label>Medical Condition</label>
          <select name="medical_condition" className="input">
            <option value="None">None</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Blood Pressure">Blood Pressure</option>
            <option value="Asthma">Asthma</option>
            <option value="Heart Condition">Heart Condition</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="input-group">
          <label>Current Medication</label>
          <input type="text" name="medication" className="input" placeholder="Optional" />
        </div>
        <div className="input-group">
          <label>Allergies</label>
          <input type="text" name="allergies" className="input" placeholder="Optional" />
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', marginTop: '2rem', color: 'var(--primary-dark)' }}>3. Guardian Information</h3>
        <div className="input-group">
          <label>Guardian Name *</label>
          <input type="text" name="guardian_name" className="input" required />
        </div>
        <div className="input-group">
          <label>Guardian Mobile Number *</label>
          <input type="tel" name="guardian_phone" className="input" required />
        </div>
        <div className="input-group">
          <label>Relationship *</label>
          <input type="text" name="guardian_relationship" className="input" required />
        </div>

        <div style={{ background: '#FFFDF5', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#92400E' }}>
          <strong>Note:</strong> Gram Panchayat Name, Village, and Sarpanch Emergency Contact details will be automatically attached to this Varkari record based on your logged-in profile.
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Adding Varkari...' : 'Add Varkari'}
        </button>
      </form>
    </div>
  );
};

export default PanchayatDashboard;
