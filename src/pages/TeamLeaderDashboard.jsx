import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';
import { Users, MapPin, PlusCircle, AlertTriangle, LogOut, ChevronLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const TeamLeaderDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [leader, setLeader] = useState(null);
  const [members, setMembers] = useState([]);
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

      // Fetch Leader
      const { data: tlData, error: tlError } = await supabase
        .from('team_leaders')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (tlError || !tlData) {
        // Not a team leader
        navigate('/dashboard');
        return;
      }
      setLeader(tlData);

      // Fetch Members
      const { data: memData } = await supabase
        .from('varkaris')
        .select('*')
        .eq('team_leader_user_id', session.user.id);
        
      if (memData) setMembers(memData);

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

  if (!leader) return null;

  return (
    <div className="min-h-screen pb-8" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header className="header" style={{ justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="brand flex items-center gap-2 cursor-pointer" onClick={() => navigate('/team-leader-dashboard')}>
          <img src={logo} alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', letterSpacing: '0.5px', color: 'var(--text-main)' }}>Team Leader Portal</span>
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
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', padding: '0 0.5rem' }}>
              {leader.team_name}
            </h3>
            <div className="flex flex-col gap-1">
              <TabLink to="/team-leader-dashboard" current={location.pathname} icon={<Users size={18} />} label="Overview" exact />
              <TabLink to="/team-leader-dashboard/members" current={location.pathname} icon={<Users size={18} />} label="Team Members" />
              <TabLink to="/team-leader-dashboard/map" current={location.pathname} icon={<MapPin size={18} />} label="Member Locations" />
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <AlertTriangle size={18} /> Emergency Contact
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {leader.emergency_contact_name || leader.full_name}<br/>
                <a href={`tel:${leader.emergency_contact_number || leader.mobile_number}`} style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                  {leader.emergency_contact_number || leader.mobile_number}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Overview leader={leader} members={members} />} />
            <Route path="members" element={<MembersList members={members} leader={leader} />} />
            <Route path="add-member" element={<AddMemberForm leader={leader} onAdded={fetchData} />} />
            <Route path="map" element={<LocationsMap members={members} />} />
          </Routes>
        </div>

      </main>
    </div>
  );
};

// Simple TabLink component
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
const Overview = ({ leader, members }) => (
  <div className="card">
    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Dashboard Overview</h2>
    
    <div className="flex gap-4 mb-6">
      <div style={{ flex: 1, padding: '1.5rem', background: '#F3F4F6', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{members.length}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Registered Members</div>
      </div>
      <div style={{ flex: 1, padding: '1.5rem', background: '#F3F4F6', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>{leader.team_size || '-'}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Expected Size</div>
      </div>
    </div>

    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Team Leader Profile</h3>
    <div className="grid grid-cols-2 gap-4" style={{ fontSize: '0.95rem' }}>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Name</div>
        <div style={{ fontWeight: '500' }}>{leader.full_name}</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Mobile</div>
        <div style={{ fontWeight: '500' }}>{leader.mobile_number}</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Route</div>
        <div style={{ fontWeight: '500' }}>{leader.wari_route || 'Not specified'}</div>
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)' }}>Status</div>
        <div style={{ fontWeight: '500', color: 'var(--primary-dark)' }}>{leader.status}</div>
      </div>
    </div>
  </div>
);

// Members List Sub-component
const MembersList = ({ members, leader }) => {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Team Members</h2>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => navigate('/team-leader-dashboard/add-member')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          <PlusCircle size={18} /> Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
          <p>No team members registered yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map(m => (
            <div key={m.id} className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{m.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.age} yrs • {m.gender} • {m.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 'bold' }}>{m.status}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.blood_group}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Member Form Sub-component
const AddMemberForm = ({ leader, onAdded }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const regId = 'MN-2026-' + randomNum;

      const payload = {
        team_leader_user_id: leader.user_id,
        team_leader_id: leader.id,
        registration_id: regId,
        participating_with: 'dindi',
        dindi_name: leader.team_name,
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        district: data.district,
        blood_group: data.blood_group,
        guardian_name: leader.full_name, // Default guardian to TL
        guardian_relationship: 'Team Leader',
        guardian_phone: leader.mobile_number,
        status: 'VERIFIED' // Auto-verify since added by TL
      };

      const { error: dbError } = await supabase.from('varkaris').insert([payload]);
      if (dbError) throw dbError;

      onAdded();
      navigate('/team-leader-dashboard/members');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/team-leader-dashboard/members')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Register Team Member</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="name" className="input" required />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Age</label>
            <input type="number" name="age" className="input" required />
          </div>
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Gender</label>
            <select name="gender" className="input" required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Mobile Number</label>
            <input type="tel" name="phone" className="input" required />
          </div>
          <div className="input-group w-full" style={{ marginBottom: 0 }}>
            <label>Blood Group</label>
            <select name="blood_group" className="input" required>
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
        </div>
        <div className="input-group">
          <label>Address</label>
          <input type="text" name="address" className="input" required />
        </div>
        <div className="input-group">
          <label>District</label>
          <input type="text" name="district" className="input" required />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </div>
  );
};

// Locations Map Sub-component
const LocationsMap = ({ members }) => {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Live Locations</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Track your team members' current whereabouts along the route. Location data is updated automatically via the mobile app.
      </p>

      <div style={{ height: '400px', background: '#E5E7EB', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(#9CA3AF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {members.length === 0 ? (
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#6B7280' }}>
            <MapPin size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>No members registered.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
            {/* Mock map markers for demo purposes */}
            {members.map((m, i) => (
              <div 
                key={m.id} 
                style={{ 
                  position: 'absolute', 
                  top: `${20 + (i * 15) % 60}%`, 
                  left: `${30 + (i * 25) % 40}%`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{ background: 'var(--primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  {m.name.split(' ')[0]}
                </div>
                <div style={{ width: '16px', height: '16px', background: 'var(--primary-dark)', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
