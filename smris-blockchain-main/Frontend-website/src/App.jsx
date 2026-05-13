import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Existing Components
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import VRoom from './VRoom';
import ConsultRoom from './ConsultRoom';
import Security from './Security';
import Protocol from './Protocol';


// New Role-Based Dashboard Components
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import AdminDashboard from './AdminDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';

import './App.css';

function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />
      <Route path="/security" element={<Security />} />
      <Route path="/protocol" element={<Protocol />} />

      
      {/* Auth Pages */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Existing Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vroom" element={<VRoom />} />
      <Route path="/consult" element={<ConsultRoom />} />
      
      {/* New Role-Based Dashboards */}
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
      
    </Routes>
  );
}

export default App;