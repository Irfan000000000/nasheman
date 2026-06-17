import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSessions } from './SessionContext';
import AcademicSessionContext from './AcademicSessionContext';

export default function SessionNavbar() {
  const { user } = useAuth();
  const { getSessions } = useSessions();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { academicSession, setAcademicSession } = useContext(AcademicSessionContext);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const userName = user ? user.user.username : "";
      const campus_name = user ? user.user.campus_name : "";
      console.log("Fetched user name from context:", userName);
    }
  }, [isMounted, user]);

  useEffect(() => {
    const defaultSession = getSessions.find((session) => session.status === "On");
    if (defaultSession) {
      setAcademicSession(defaultSession.id);
    }
  }, [getSessions, setAcademicSession]);

  // Close panel on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (!user) return null;

  const username = (user && user.user.username) || '';
  const campus = (user && user.user.campus_name) || '';
  const selectedSession = getSessions.find((s) => String(s.id) === String(academicSession));

  return (
    <div className={`session-mini ${isOpen ? 'is-open' : ''}`} ref={wrapperRef}>
      {isOpen && (
        <div className="session-mini__panel" role="menu">
          <div className="session-mini__row">
            <i className="fas fa-user session-mini__row-icon"></i>
            <div className="session-mini__row-body">
              <span className="session-mini__row-label">User</span>
              <span className="session-mini__row-value" title={username}>{username}</span>
            </div>
          </div>

          <div className="session-mini__row">
            <i className="fas fa-school session-mini__row-icon"></i>
            <div className="session-mini__row-body">
              <span className="session-mini__row-label">Campus</span>
              <span className="session-mini__row-value" title={campus}>{campus}</span>
            </div>
          </div>

          <div className="session-mini__row session-mini__row--select">
            <i className="fas fa-calendar-alt session-mini__row-icon"></i>
            <div className="session-mini__row-body">
              <span className="session-mini__row-label">Session</span>
              <select
                name="session_id"
                id="session_id"
                className="session-mini__select"
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
              >
                <option value="">Select Session</option>
                {getSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.session_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="session-mini__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label="Session information"
      >
        <span className="session-mini__avatar">
          <i className="fas fa-user-circle"></i>
        </span>
        <span className="session-mini__trigger-text">
          <span className="session-mini__trigger-name" title={username}>
            {username || 'User'}
          </span>
          <span className="session-mini__trigger-sub" title={selectedSession ? selectedSession.session_name : campus}>
            {selectedSession ? selectedSession.session_name : campus}
          </span>
        </span>
        <i className={`fas fa-chevron-up session-mini__chevron ${isOpen ? 'is-flipped' : ''}`}></i>
      </button>
    </div>
  );
}
