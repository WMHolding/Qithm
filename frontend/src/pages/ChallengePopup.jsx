import React from 'react';
import '../styles/ChallengePopup.css';

function ChallengePopup({ challenge, onEnroll, isEnrolled, onClose }) {
  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleEnroll = (e) => {
    e.stopPropagation();
    onEnroll(challenge);
  };

  return (
    <div className="challenge-modal-overlay" onClick={handleClose}>
      <div className="challenge-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>&times;</button>
        
        <div className="modal-content">
          <img src={challenge.image} alt={challenge.title} className="modal-image" />
          <h2>{challenge.title}</h2>
          <div className="challenge-details">
            <p>{challenge.description}</p>
            <div className="challenge-stats">
              <span>👥 {challenge.participants} participants</span>
              <span>⏰ {challenge.daysLeft} days left</span>
            </div>
            <div className="challenge-requirements">
              <h3>Requirements:</h3>
              <ul>
                {challenge.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {!isEnrolled ? (
            <button 
              className="enroll-button"
              onClick={handleEnroll}
            >
              Enroll in Challenge
            </button>
          ) : (
            <button className="enrolled-button" disabled>
              Already Enrolled
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengePopup;
