import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  // Placeholder data
  const consultingDoctors = [
    { id: 'DR-1104', name: 'Dr. S. Hastings', specialty: 'General Practice' },
    { id: 'DR-8821', name: 'Dr. M. Vance', specialty: 'Cardiology' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] font-['Inter'] transition-colors duration-300">
      
      {/* Patient Top Navbar */}
      <nav className="bg-white dark:bg-[#131b2e] border-b border-slate-200 dark:border-[#3b494c] px-8 h-16 flex justify-between items-center transition-colors duration-300">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-100 dark:bg-[#00e5ff]/20 rounded-full flex items-center justify-center text-cyan-600 dark:text-[#00e5ff] font-bold">
               EV
            </div>
            <div>
               <h1 className="font-bold text-sm dark:text-white">Eleanor Vance</h1>
               <div className="text-xs text-slate-500 font-mono">UID: PT-8492</div>
            </div>
         </div>
         <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-cyan-600 dark:text-[#849396] dark:hover:text-[#00e5ff] transition-colors flex items-center gap-1">
            Logout <span className="material-symbols-outlined text-[16px]">logout</span>
         </button>
      </nav>

      <main className="max-w-5xl mx-auto p-8 flex flex-col gap-8">
         
         {/* Vault Status Hero */}
         <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-[#00363d] dark:to-[#060e20] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg border border-transparent dark:border-[#00e5ff]/30">
            <div className="relative z-10">
               <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-2">Personal Health Vault</h2>
               <p className="text-cyan-100 dark:text-[#bac9cc] max-w-md">Your records are cryptographically secured. Only you and your actively authorized doctors have access.</p>
            </div>
            {/* Decorative background icon */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-10 text-[200px] text-white/10 dark:text-[#00e5ff]/5 pointer-events-none">lock</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Authorized Doctors */}
            <div className="md:col-span-1 flex flex-col gap-4">
               <h3 className="text-sm font-bold text-slate-400 dark:text-[#849396] uppercase tracking-widest px-2">Active Consultations</h3>
               
               {consultingDoctors.map(doc => (
                  <div key={doc.id} className="bg-white dark:bg-[#131b2e] dark:glass-panel border border-slate-200 dark:border-[#3b494c] rounded-xl p-4 flex items-center justify-between shadow-sm dark:shadow-none">
                     <div>
                        <div className="font-bold text-sm dark:text-white">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.specialty}</div>
                     </div>
                     <span className="material-symbols-outlined text-cyan-600 dark:text-[#00e5ff]">verified</span>
                  </div>
               ))}
            </div>

            {/* Right Column: Medical History/Documents */}
            <div className="md:col-span-2 flex flex-col gap-4">
               <h3 className="text-sm font-bold text-slate-400 dark:text-[#849396] uppercase tracking-widest px-2">Timeline & Documents</h3>
               
               <div className="bg-white dark:bg-[#131b2e] dark:glass-panel border border-slate-200 dark:border-[#3b494c] rounded-xl shadow-sm dark:shadow-none overflow-hidden">
                  
                  {/* Sample Document Row */}
                  <div className="p-4 border-b border-slate-100 dark:border-[#3b494c] hover:bg-slate-50 dark:hover:bg-[#060e20] transition-colors flex justify-between items-center cursor-pointer">
                     <div className="flex gap-4 items-center">
                        <div className="bg-slate-100 dark:bg-[#0b1326] p-2 rounded text-slate-500 dark:text-[#849396]">
                           <span className="material-symbols-outlined">vaccines</span>
                        </div>
                        <div>
                           <div className="font-bold text-sm dark:text-[#dae2fd]">Prescription: Amoxicillin</div>
                           <div className="text-xs text-slate-500">Issued by Dr. S. Hastings</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs font-bold text-cyan-600 dark:text-[#00e5ff]">View PDF</div>
                        <div className="text-[10px] text-slate-400 mt-1">Oct 25, 2026</div>
                     </div>
                  </div>

                  {/* Sample Document Row 2 */}
                  <div className="p-4 hover:bg-slate-50 dark:hover:bg-[#060e20] transition-colors flex justify-between items-center cursor-pointer">
                     <div className="flex gap-4 items-center">
                        <div className="bg-slate-100 dark:bg-[#0b1326] p-2 rounded text-slate-500 dark:text-[#849396]">
                           <span className="material-symbols-outlined">biotech</span>
                        </div>
                        <div>
                           <div className="font-bold text-sm dark:text-[#dae2fd]">Complete Blood Count (CBC)</div>
                           <div className="text-xs text-slate-500">Uploaded by Reception Desk</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-xs font-bold text-cyan-600 dark:text-[#00e5ff]">View PDF</div>
                        <div className="text-[10px] text-slate-400 mt-1">Oct 24, 2026</div>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </main>
    </div>
  );
};

export default PatientDashboard;