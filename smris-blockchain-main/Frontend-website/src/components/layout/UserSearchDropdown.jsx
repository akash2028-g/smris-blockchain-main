import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient'; // Make sure this path points to your actual supabase setup

export default function UserSearchDropdown({ role, value, onChange, placeholder, icon, colorHex }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Sync external value changes
  useEffect(() => { setQuery(value); }, [value]);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Supabase Search Logic (Debounced)
  useEffect(() => {
    if (query.length < 2 || !isOpen) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      
      // Search by either full_name OR uid
      const { data, error } = await supabase
        .from('profiles')
        .select('uid, full_name')
        .eq('role', role)
        .or(`full_name.ilike.%${query}%,uid.ilike.%${query}%`)
        .limit(5);

      // ---> PUT IT RIGHT HERE <---
      console.log("Supabase Response:", data, "Error:", error);

      if (!error && data) setResults(data);
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(() => { fetchUsers(); }, 300); // 300ms delay prevents spamming DB
    return () => clearTimeout(delayDebounceFn);
  }, [query, role, isOpen]);

  const handleSelect = (user) => {
    setQuery(user.uid);
    onChange(user.uid); // Pass the UID back to the parent
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <span className="material-symbols-outlined" style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        fontSize: 18, color: `rgba(${colorHex}, 0.55)`, zIndex: 2
      }}>
        {icon}
      </span>
      
      <input
        type="text"
        className="terminal-input"
        style={{ borderColor: isOpen ? `rgba(${colorHex}, 0.5)` : (query ? `rgba(${colorHex}, 0.3)` : undefined) }}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required
      />

      {/* THE DROPDOWN MENU */}
      {isOpen && query.length >= 2 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
          background: 'rgba(4,8,18,0.95)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden'
        }}>
          {isLoading ? (
            <div style={{ padding: 14, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>Searching Ledger...</div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div
                key={user.uid}
                onClick={() => handleSelect(user)}
                style={{
                  padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(99,102,241,0.1)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user.full_name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: `rgb(${colorHex})`, background: `rgba(${colorHex}, 0.1)`, padding: '2px 6px', borderRadius: 4 }}>
                  {user.uid}
                </span>
              </div>
            ))
          ) : (
             <div style={{ padding: 14, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>No exact matches found</div>
          )}
        </div>
      )}
    </div>
  );
}