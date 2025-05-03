// src/components/ActiveChallenges.js
import React, { useState, useEffect, useCallback } from 'react';
import { challengesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import '../styles/ActiveChallenges.css'; // Ensure CSS path is correct

function ActiveChallenges({ searchQuery, selectedCategory }) {
  const { currentUser } = useAuth(); // Get current user
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserChallenges = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      // Don't set an error, just show message or nothing if user isn't logged in
      setChallenges([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await challengesApi.getUserChallenges(currentUser._id); // Use current user's ID
      setChallenges(data);
    } catch (err) {
      setError('Failed to load your active challenges');
      console.error(err);
      setChallenges([]); // Clear challenges on error
    } finally {
      setLoading(false);
    }
  }, [currentUser]); // Reload challenges if the user changes

  useEffect(() => {
    loadUserChallenges();
  }, [loadUserChallenges]);

  // Filter active challenges based on search and category
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Show message or component based on login status
  if (!currentUser) {
    return (
       <div className="active-challenges">
         <h2>Your Active Challenges</h2>
         <p>Please log in to see your active challenges.</p>
       </div>
    );
  }

  if (loading) return <div>Loading your active challenges...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!loading && filteredChallenges.length === 0) {
     return (
       <div className="active-challenges">
         <h2>Your Active Challenges</h2>
         <p>You haven't joined any challenges yet, or none match the current filter.</p>
       </div>
     );
  }

  return (
    <div className="active-challenges">
      <h2>Your Active Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => {
          // Find the participant data for the *current* user
          const participant = challenge.participants.find(
             // Compare user ID strings for safety
            p => p.user && p.user.toString() === currentUser._id
          );

          // Handle cases where participant data might be missing (shouldn't happen for active challenges, but good practice)
          if (!participant) {
            console.warn(`Participant data not found for user ${currentUser._id} in active challenge ${challenge._id}`);
            return null; // Skip rendering this card if data is inconsistent
          }

          // Calculate progress safely
          const progressPercent = participant.progressGoal > 0
            ? (participant.progress / participant.progressGoal) * 100
            : 0;

          return (
            <div className="challenge-card active-card" key={challenge._id}>
              <img
                src={challenge.image || '/path/to/default/image.jpg'} // Provide fallback image
                alt={challenge.title}
                className="challenge-image"
              />
              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <div className="challenge-stats">
                  {/* Display participant-specific data */}
                  <p>Status: <span className={`status-${participant.status}`}>{participant.status}</span></p>
                  <p>Streak: {participant.streak || 0} days</p>
                </div>
                <div className="challenge-progress">
                  <div className="progress-bar-container"> {/* Added container for better styling */}
                    <div
                      className="progress-bar-fill" // Renamed class for clarity
                      style={{ width: `${Math.min(progressPercent, 100)}%` }} // Cap at 100%
                    />
                  </div>
                  <p className="progress-text">
                    Progress: {participant.progress} / {participant.progressGoal}
                  </p>
                </div>
                 {/* Optionally add short description or category */}
                 <div className="challenge-details">
                   <p className="description">{challenge.shortDescription}</p>
                   <div className="category-tag">{challenge.category}</div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveChallenges;
