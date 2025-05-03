// src/components/ChallengePopup.js
import React, { useState } from 'react';
import '../styles/ChallengePopup.css'; // Ensure CSS path is correct

function ChallengePopup({ challenge, onEnroll, isEnrolled, onClose }) {
  const [isLoading, setIsLoading] = useState(false); // For showing loading state during enroll API call
  const [error, setError] = useState(null);

  const handleClose = (e) => {
    // Prevent closing if click was inside the modal content while loading
    if (e.target === e.currentTarget && !isLoading) {
       onClose();
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation(); // Prevent clicks inside the modal from closing it
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    if (isEnrolled || isLoading) return; // Prevent multiple clicks or enrolling if already enrolled

    setIsLoading(true);
    setError(null);
    try {
      await onEnroll(challenge); // Call the function passed from FeaturedChallenges
      // No need to manually close here, parent component (FeaturedChallenges) handles it on success
    } catch (err) {
      // Display the error message from the thrown error
      setError(err.message || 'Failed to enroll in challenge. Please try again.');
      console.error("Enrollment error caught in popup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate duration - ensure dates are valid
  const calculateDuration = () => {
    if (challenge.startDate && challenge.endDate) {
      const start = new Date(challenge.startDate);
      const end = new Date(challenge.endDate);
      if (!isNaN(start) && !isNaN(end)) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
      }
    }
    return 'N/A'; // Fallback if dates are invalid or missing
  };

  return (
    <div className="challenge-modal-overlay" onClick={handleClose}>
      {/* Stop propagation on modal content clicks */}
      <div className="challenge-modal" onClick={handleModalContentClick}>
        <button className="close-button" onClick={onClose} disabled={isLoading}>&times;</button>

        <div className="modal-content">
          {/* Use challenge.image, provide fallback */}
          <img src={challenge.image || '/path/to/default/image.jpg'} alt={challenge.title} className="modal-image" />
          <h2>{challenge.title}</h2>
          <div className="challenge-details">
            <p>{challenge.description}</p>
            <div className="challenge-stats">
              {/* Check participants array */}
              <span>👥 {Array.isArray(challenge.participants) ? challenge.participants.length : 0} participants</span>
              <span>⏰ Duration: {calculateDuration()}</span>
            </div>
            <div className="challenge-requirements">
              <h3>Requirements:</h3>
              {/* Check requirements array */}
              {Array.isArray(challenge.requirements) && challenge.requirements.length > 0 ? (
                <ul>
                  {challenge.requirements.map((req, index) => (
                    <li key={index}>✓ {req}</li> // Added checkmark for style
                  ))}
                </ul>
              ) : (
                 <p>No specific requirements listed.</p>
              )}
            </div>
          </div>

          {/* Display enrollment error */}
          {error && <div className="error-message">{error}</div>}

          {/* Button state depends on props and loading status */}
          <button
            className={`enroll-button ${isEnrolled ? 'enrolled-button' : ''}`}
            onClick={handleEnrollClick}
            disabled={isEnrolled || isLoading} // Disable if enrolled or API call is in progress
          >
            {isLoading ? 'Enrolling...' : (isEnrolled ? 'Already Enrolled' : 'Enroll in Challenge')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengePopup;
