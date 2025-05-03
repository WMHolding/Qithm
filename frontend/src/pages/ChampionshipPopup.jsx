import React, { useState } from 'react';
import '../styles/ChampionshipPopup.css';

function ChampionshipPopup({ championship, onEnroll, isEnrolled, onClose }) {
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleEnroll = async (e) => {
    e.stopPropagation();
    try {
      setEnrolling(true);
      setError(null);
      await onEnroll(championship);
    } catch (err) {
      setError('Failed to enroll in championship');
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="championship-modal-overlay" onClick={handleClose}>
      <div className="championship-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>&times;</button>
        
        <div className="modal-content">
          <h2>{championship.name}</h2>
          
          <div className="championship-details">
            <div className="dates">
              <p>Start Date: {new Date(championship.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(championship.endDate).toLocaleDateString()}</p>
            </div>

            <div className="description">
              <h3>About this Championship</h3>
              <p>{championship.description}</p>
            </div>

            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className={`status-badge ${championship.status}`}>
                  {championship.status}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Participants</span>
                <span>{championship.participants.length}</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {!isEnrolled ? (
              <button 
                className="enroll-button"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Join Championship'}
              </button>
            ) : (
              <button className="enrolled-button" disabled>
                Already Enrolled
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChampionshipPopup; 