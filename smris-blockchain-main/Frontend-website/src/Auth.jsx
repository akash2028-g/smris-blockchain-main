import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smris-theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smris-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smris-theme', 'light');
    }
  }, [isDarkMode]);

  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    uid: '', 
    password: '',
    role: location.state?.defaultRole || 'patient',
    full_name: '',
    medical_reg_no: '',
    age: '',
    dob: '',
    gender: '',
    govt_id: ''
  });

  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dob') {
      const newAge = calculateAge(value);
      setFormData({ ...formData, dob: value, age: newAge });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    if (selectedRole === 'receptionist' || selectedRole === 'admin') {
      setIsLogin(true);
    }
  };

  const toggleAuthMode = () => {
    if (isLogin && (formData.role === 'receptionist' || formData.role === 'admin')) {
      setFormData({ ...formData, role: 'patient' });
    }
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        let loginEmail = formData.email;

        // ==========================================
        // STAFF LOGIN USING DATABASE RPC
        // ==========================================
        if (formData.role === 'receptionist' || formData.role === 'admin') {
          
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_email_by_uid', { lookup_uid: formData.uid });

          if (rpcError || !rpcData || rpcData.length === 0) {
             throw new Error(`Invalid UID. ${formData.role === 'admin' ? 'Administrator' : 'Receptionist'} not found.`);
          }

          const staffData = rpcData[0];
          console.log("DEBUG - Data from DB:", staffData);

          const actualRole = staffData.found_role || staffData.role;
          const actualStatus = staffData.found_status || staffData.status;
          const actualEmail = staffData.found_email || staffData.email;

          if (actualRole !== formData.role) {
             throw new Error(`This UID does not belong to a ${formData.role}.`);
          }

          // FIXED: Now accepts both 'ACTIVE' and 'APPROVED' from the database
          const statusUpper = String(actualStatus).trim().toUpperCase();
          if (statusUpper !== 'ACTIVE' && statusUpper !== 'APPROVED') {
            throw new Error(`Account locked. Expected 'ACTIVE' or 'APPROVED', but database returned: '${actualStatus}'`);
          }
          
          loginEmail = actualEmail;
        }

        // Standard Auth using the resolved email
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: formData.password,
        });

        if (authError) throw authError;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role !== formData.role && profileData.role !== 'admin') {
            await supabase.auth.signOut(); 
            throw new Error(`Account found, but you are registered as a ${profileData.role}.`);
        }

        switch(profileData.role) {
          case 'patient': navigate('/patient-dashboard'); break;
          case 'doctor': navigate('/doctor-dashboard'); break;
          case 'receptionist': navigate('/receptionist-dashboard'); break;
          case 'admin': navigate('/admin-dashboard'); break;
          default: navigate('/');
        }

      } else {
        // ==========================================
        // REGISTRATION LOGIC
        // ==========================================
        if (formData.role === 'receptionist' || formData.role === 'admin') {
          throw new Error("Staff registration must be performed by an Administrator.");
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email, 
          password: formData.password, 
        });

        if (authError) throw authError;

        const wallet = "0x" + Math.random().toString(16).slice(2, 12) + "..." + Math.random().toString(16).slice(2, 6);

        const profilePayload = {
          id: authData.user.id,
          email: formData.email,
          role: formData.role,
          full_name: formData.full_name,
          wallet_address: wallet,
          status: formData.role === 'patient' ? 'ACTIVE' : 'PENDING', 
          dob: formData.dob, 
          age: parseInt(formData.age), 
          gender: formData.gender,
          ...(formData.role === 'patient' && { govt_id: formData.govt_id }),
          ...(formData.role === 'doctor' && { medical_reg_no: formData.medical_reg_no })
        };

        const { error: profileError } = await supabase.from('profiles').insert([profilePayload]);

        if (profileError) throw profileError;

        if (formData.role === 'doctor') {
            alert(`Doctor registered successfully! Your account is PENDING admin verification.`);
        } else {
            alert(`Patient registered successfully!`);
        }
        
        setFormData({ ...formData, password: '', dob: '', age: '', govt_id: '', medical_reg_no: '' });
        setIsLogin(true); 
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
      alert(`${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColorClass = () => {
    if (formData.role === 'doctor') return 'bg-emerald-500 hover:bg-emerald-600 dark:bg-gradient-to-b dark:from-[#6ffbbe] dark:to-[#00a572] dark:shadow-[0_0_20px_rgba(78,222,163,0.15)]';
    if (formData.role === 'receptionist') return 'bg-indigo-500 hover:bg-indigo-600 dark:bg-gradient-to-b dark:from-[#a5b4fc] dark:to-[#4f46e5] dark:shadow-[0_0_20px_rgba(99,102,241,0.15)]';
    if (formData.role === 'admin') return 'bg-rose-500 hover:bg-rose-600 dark:bg-gradient-to-b dark:from-[#fda4af] dark:to-[#e11d48] dark:shadow-[0_0_20px_rgba(225,29,72,0.15)]';
    return 'bg-cyan-500 hover:bg-cyan-600 dark:bg-gradient-primary dark:ambient-glow-primary';
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] min-h-screen flex flex-col font-['Inter'] overflow-x-hidden relative items-center justify-center py-10 transition-colors duration-300">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-0 dark:opacity-20 transition-opacity duration-300">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="100" id="mesh-pattern" patternUnits="userSpaceOnUse" width="100">
              <circle cx="50" cy="50" fill="#00e5ff" r="1"></circle>
              <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#00e5ff" strokeDasharray="2 8" strokeWidth="0.2"></path>
              <path d="M 0 0 L 100 100 M 100 0 L 0 100" stroke="#00e5ff" strokeWidth="0.1"></path>
            </pattern>
            <radialGradient cx="50%" cy="50%" id="bg-glow" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15"></stop>
              <stop offset="100%" stopColor="#0b1326" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
          <rect className="animate-pulse-slow" fill="url(#bg-glow)" height="100%" width="100%"></rect>
          <rect className="animate-float" fill="url(#mesh-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div onClick={() => navigate('/')} className="absolute top-8 left-8 md:left-12 text-2xl font-bold tracking-tighter text-cyan-600 dark:text-[#00e5ff] uppercase font-['Space_Grotesk'] cursor-pointer z-50 hover:opacity-80 transition-opacity">
        SMRIS
      </div>

      <div className="absolute top-8 right-8 md:right-12 z-50">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-slate-500 bg-transparent border-none outline-none hover:bg-slate-200 dark:text-cyan-400 dark:hover:bg-cyan-400/10 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#131b2e] w-full max-w-[520px] p-8 md:p-10 rounded-2xl z-10 flex flex-col gap-6 relative overflow-hidden mx-4 shadow-xl dark:shadow-2xl transition-colors duration-300 border border-slate-200 dark:border-[#3b494c]">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white mb-2 transition-colors">
            {isLogin ? 'Portal Access' : 'Create Identity'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-[#bac9cc] transition-colors">
            {isLogin ? 'Select your role and login to your dashboard.' : 'Register for your secure Web3 identity.'}
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-[#060e20] rounded-lg p-1 border border-slate-200 dark:border-[#3b494c] transition-colors">
          <button 
            type="button"
            onClick={() => handleRoleChange('patient')}
            className={`flex-1 py-2.5 rounded-md text-[10px] sm:text-xs uppercase tracking-widest transition-all outline-none border-none ${
              formData.role === 'patient' 
              ? 'btn-donate font-bold' 
              : 'bg-transparent text-slate-500 font-medium hover:text-slate-800 dark:text-[#849396] dark:hover:text-[#dae2fd]'
            }`}
          >
            Patient
          </button>
          
          <button 
            type="button"
            onClick={() => handleRoleChange('doctor')}
            className={`flex-1 py-2.5 rounded-md text-[10px] sm:text-xs uppercase tracking-widest transition-all outline-none border-none ${
              formData.role === 'doctor' 
              ? 'btn-donate font-bold' 
              : 'bg-transparent text-slate-500 font-medium hover:text-slate-800 dark:text-[#849396] dark:hover:text-[#dae2fd]'
            }`}
          >
            Doctor
          </button>

          {isLogin && (
            <>
              <button 
                type="button"
                onClick={() => handleRoleChange('receptionist')}
                className={`flex-1 py-2.5 rounded-md text-[10px] sm:text-xs uppercase tracking-widest transition-all outline-none border-none ${
                  formData.role === 'receptionist' 
                  ? 'btn-donate font-bold' 
                  : 'bg-transparent text-slate-500 font-medium hover:text-slate-800 dark:text-[#849396] dark:hover:text-[#dae2fd]'
                }`}
              >
                Receptionist
              </button>

              <button 
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2.5 rounded-md text-[10px] sm:text-xs uppercase tracking-widest transition-all outline-none border-none ${
                  formData.role === 'admin' 
                  ? 'btn-donate font-bold' 
                  : 'bg-transparent text-slate-500 font-medium hover:text-slate-800 dark:text-[#849396] dark:hover:text-[#dae2fd]'
                }`}
              >
                Admin
              </button>
            </>
          )}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {!isLogin && (formData.role === 'patient' || formData.role === 'doctor') && (
            <div className="flex flex-col gap-4 p-4 rounded-lg bg-slate-50 dark:bg-[#060e20]/50 border border-slate-200 dark:border-[#3b494c] transition-colors">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Full Name</label>
                <input type="text" name="full_name" placeholder="e.g. John Doe" value={formData.full_name} onChange={handleChange} required className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded md py-2 px-3 focus:outline-none focus:border-cyan-500 transition-all text-sm" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded md py-2 px-3 focus:outline-none transition-all text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest flex justify-between">Age <span className="text-cyan-500 dark:text-[#00e5ff]/50">(Auto)</span></label>
                  <input type="number" name="age" placeholder="--" value={formData.age} readOnly className="w-full bg-slate-100 dark:bg-[#060e20] border border-slate-200 dark:border-[#3b494c] text-cyan-700 dark:text-[#00e5ff] rounded md py-2 px-3 cursor-not-allowed text-sm font-bold text-center" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded md py-2 px-3 focus:outline-none transition-all text-sm">
                    <option value="" disabled>Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {formData.role === 'doctor' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-emerald-600 dark:text-[#4edea3] uppercase tracking-widest">Medical Registration No.</label>
                  <input type="text" name="medical_reg_no" placeholder="e.g. MED-88392" value={formData.medical_reg_no} onChange={handleChange} required className="w-full bg-white dark:bg-[#131b2e] border border-emerald-300 dark:border-[#4edea3]/50 text-slate-900 dark:text-[#dae2fd] rounded md py-2 px-3 focus:outline-none transition-all text-sm" />
                </div>
              )}

              {formData.role === 'patient' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-cyan-600 dark:text-[#00e5ff] uppercase tracking-widest">Government ID / SSN</label>
                  <input type="text" name="govt_id" placeholder="Secure ID Number" value={formData.govt_id} onChange={handleChange} required className="w-full bg-white dark:bg-[#131b2e] border border-cyan-300 dark:border-[#00e5ff]/50 text-slate-900 dark:text-[#dae2fd] rounded md py-2 px-3 focus:outline-none transition-all text-sm" />
                </div>
              )}
            </div>
          )}

          {isLogin ? (
            (formData.role === 'receptionist' || formData.role === 'admin') ? (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                   {formData.role === 'admin' ? 'Administrator UID' : 'Assigned Receptionist UID'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#849396] text-[18px]">
                     {formData.role === 'admin' ? 'admin_panel_settings' : 'badge'}
                  </span>
                  <input 
                    type="text" 
                    name="uid"
                    value={formData.uid}
                    onChange={handleChange}
                    placeholder={formData.role === 'admin' ? 'e.g. ADM-001' : 'e.g. REC-1049'}
                    required
                    className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded-lg py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all placeholder:text-slate-400 dark:placeholder:text-[#3b494c] text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[11px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#849396] text-[18px]">mail</span>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded-lg py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:focus:ring-[#00e5ff] transition-all placeholder:text-slate-400 dark:placeholder:text-[#3b494c] text-sm"
                  />
                </div>
              </div>
            )
          ) : (
             <div className="flex flex-col gap-2 mt-2">
                <label className="text-[11px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#849396] text-[18px]">mail</span>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded-lg py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:focus:ring-[#00e5ff] transition-all placeholder:text-slate-400 dark:placeholder:text-[#3b494c] text-sm"
                  />
                </div>
              </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-[#bac9cc] uppercase tracking-widest">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#849396] text-[18px]">lock</span>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength="6"
                className="w-full bg-white dark:bg-[#131b2e] border border-slate-300 dark:border-[#3b494c] text-slate-900 dark:text-[#dae2fd] rounded-lg py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:focus:ring-[#00e5ff] transition-all placeholder:text-slate-400 dark:placeholder:text-[#3b494c] text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`font-bold text-sm px-8 py-4 rounded-lg mt-4 flex items-center justify-center gap-2 uppercase tracking-widest transition-all disabled:opacity-50 text-white border-none outline-none ${getRoleColorClass()}`}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Secure Login' : 'Create Identity')}
            {!isLoading && <span className="material-symbols-outlined text-[20px]">{isLogin ? 'login' : 'how_to_reg'}</span>}
          </button>
        </form>

        {(formData.role !== 'receptionist' && formData.role !== 'admin') ? (
          <div className="text-center pt-4 border-t border-slate-200 dark:border-[#3b494c]/50 transition-colors">
            <p className="text-sm text-slate-500 dark:text-[#849396]">
              {isLogin ? "Don't have an account? " : "Already initialized? "}
              <button 
                type="button"
                onClick={toggleAuthMode} 
                className="bg-transparent !border-none !outline-none focus:outline-none focus:ring-0 p-0 m-0 font-bold text-cyan-600 hover:text-cyan-700 dark:text-[#00e5ff] dark:hover:text-white transition-colors"
              >
                {isLogin ? 'Register Here' : 'Login Here'}
              </button>
            </p>
          </div>
        ) : (
          <div className="text-center pt-4 border-t border-slate-200 dark:border-[#3b494c]/50 transition-colors">
             <p className="text-xs text-slate-500 dark:text-[#849396]">
                {formData.role === 'admin' 
                  ? 'Admin credentials are strictly managed by the system.' 
                  : 'Receptionist credentials are generated by the System Administrator.'}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;