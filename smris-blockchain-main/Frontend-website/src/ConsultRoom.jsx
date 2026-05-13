import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const ConsultRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'patient';

  // --- MEDIA STATES & REFS ---
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // --- INITIALIZE WEBCAM ---
  useEffect(() => {
    let stream;
    
    const startWebcam = async () => {
      try {
        // Ask the browser for Camera and Mic permissions
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        
        // Connect the live stream to our <video> HTML tag
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Could not access camera. Please make sure you have granted browser permissions.");
      }
    };

    startWebcam();

    // CLEANUP: Turn off the camera light when leaving the room
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- BUTTON HANDLERS ---
  const toggleMute = () => {
    if (mediaStream) {
      // Find the audio track and flip its enabled status
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (mediaStream) {
      // Find the video track and flip its enabled status
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleEndConsultation = () => {
    // Stop all tracks immediately before navigating away
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    navigate('/dashboard', { state: location.state });
  };

  const requestRecordAccess = () => {
    alert("Request sent to patient's wallet to decrypt medical history.");
  };

  return (
    <div className="home-container" style={{ alignItems: 'center', paddingTop: '3rem' }}>
      <div className="fade-in-down" style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="project-title" style={{ fontSize: '2.5rem', margin: 0 }}>Live Consultation</h2>
          <p style={{ color: '#61dafb', margin: '5px 0 0 0', fontWeight: 'bold' }}>
            {role === 'doctor' ? '🟢 Consulting as Doctor' : '🟢 Connected as Patient'}
          </p>
        </div>
        <button 
          className="secondary-btn" 
          onClick={handleEndConsultation} 
          style={{ borderColor: '#ff6b6b', color: '#ff6b6b', padding: '10px 20px' }}
        >
          End Consultation
        </button>
      </div>

      <div className="fade-in-up" style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '1200px', height: '65vh' }}>
        
        {/* --- VIDEO AREA --- */}
        <div style={{ flex: 2, backgroundColor: '#0d1117', borderRadius: '12px', border: '1px solid #30363d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* THE ACTUAL VIDEO FEED */}
          <div style={{ flex: 1, backgroundColor: '#010409', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            
            {isCameraOff ? (
               <p style={{ color: '#888', fontSize: '1.2rem', zIndex: 10 }}>📷 Camera Paused</p>
            ) : null}

            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted // We mute the local video so you don't hear your own echo!
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraOff ? 'none' : 'block', transform: 'scaleX(-1)' }} 
            />
            
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '20px', color: '#fff', zIndex: 10 }}>
              {role === 'doctor' ? 'Your Feed (Doctor)' : 'Your Feed (Patient)'}
            </div>
          </div>

          {/* MEDIA CONTROLS */}
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid #30363d' }}>
             <button 
                className="secondary-btn" 
                onClick={toggleMute}
                style={{ padding: '10px 20px', borderColor: isMuted ? '#ff6b6b' : '#30363d', color: isMuted ? '#ff6b6b' : '#e6edf3' }}
              >
                {isMuted ? '🔇 Unmute' : '🎤 Mute'}
             </button>
             
             <button 
                className="secondary-btn" 
                onClick={toggleCamera}
                style={{ padding: '10px 20px', borderColor: isCameraOff ? '#ff6b6b' : '#30363d', color: isCameraOff ? '#ff6b6b' : '#e6edf3' }}
              >
                {isCameraOff ? '📹 Turn Camera On' : '📹 Turn Camera Off'}
             </button>

             {role === 'doctor' && (
               <button className="primary-btn" onClick={requestRecordAccess} style={{ padding: '10px 20px' }}>
                 📄 Request Record Access
               </button>
             )}
          </div>
        </div>

        {/* --- CHAT & LOGS AREA --- */}
        <div style={{ flex: 1, backgroundColor: '#0d1117', borderRadius: '12px', border: '1px solid #30363d', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#e6edf3', marginTop: 0, borderBottom: '1px solid #30363d', paddingBottom: '10px' }}>Encrypted Chat</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', padding: '10px 0' }}>
             <div style={{ alignSelf: 'center', background: 'rgba(97, 218, 251, 0.1)', color: '#61dafb', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', marginBottom: '10px' }}>
                End-to-End Encrypted Session Started
             </div>
             <div style={{ alignSelf: 'flex-start', background: '#161b22', padding: '10px 15px', borderRadius: '10px', color: '#e6edf3', maxWidth: '80%' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>System</p>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Blockchain identity verified successfully.</p>
             </div>
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <input type="text" className="dark-input" placeholder="Secure message..." style={{ flex: 1, marginBottom: 0 }} />
            <button className="primary-btn" style={{ padding: '0 20px' }}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConsultRoom;