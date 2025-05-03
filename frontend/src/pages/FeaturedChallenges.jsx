// src/components/FeaturedChallenges.js
import React, { useState, useEffect, useCallback } from 'react';
import { challengesApi } from '../services/api';
import ChallengePopup from './ChallengePopup';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// Import images (assuming paths are correct)
import runningImg from '../assets/E10AF8SV.jpg';
import weightLossImg from '../assets/Dashboard_835_Addressing-the-most-common-weight-loss-myths_12_23.jpeg';
import strengthImg from '../assets/weight-workout.jpg.webp';
// Add other images if needed...

// Keep local data as a potential fallback for display structure if needed,
// but rely on API for actual data and enrollment status.
const fallbackChallengeStructure = [
  { id: 1, title: '30-Day Running Challenge', image: runningImg, category: 'cardio', shortDescription: "Build stamina.", description: "Run daily.", requirements: ["Run", "Track"], participants: [], isFeatured: true },
  // Add other fallback structures if necessary
];


function FeaturedChallenges({ searchQuery, selectedCategory }) {
  const { currentUser } = useAuth(); // Get currentUser from context
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  // No longer need local enrolledChallenges Set - derive from data

  const loadFeaturedChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const data = await challengesApi.getFeaturedChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load featured challenges:', err);
      setError('Could not load featured challenges. Please try again later.');
      // Optionally set challenges to fallback structure for display, but indicate error
      // setChallenges(fallbackChallengeStructure);
      setChallenges([]); // Or clear challenges on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - load once on mount

  useEffect(() => {
    loadFeaturedChallenges();
  }, [loadFeaturedChallenges]); // Run effect when load function changes (which is never in this case, effectively runs once)

  // Filter challenges based on search and category
  const filteredChallenges = challenges.filter((challenge) => {
    const titleMatch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const categoryMatch =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    return titleMatch && categoryMatch;
  });

  const handleViewDetails = (challenge) => {
    setSelectedChallenge(challenge);
  };

  // This function is passed to the popup
  const handleConfirmEnroll = async (challengeToEnroll) => {
    if (!currentUser) {
      console.error("Enrollment attempt failed: No user logged in.");
      // Optionally: redirect to login or show message
      throw new Error("You must be logged in to enroll."); // Throw error to be caught by popup
    }

    try {
      console.log('Attempting enrollment for user:', currentUser._id, 'in challenge:', challengeToEnroll._id);

      // Call the API
      const updatedChallenge = await challengesApi.enrollInChallenge(
        currentUser._id,
        challengeToEnroll._id,
        challengeToEnroll.progressGoal || 100 // Use challenge's goal or default
      );

      console.log('Enrollment successful, API response:', updatedChallenge);

      // Update the state *immutably* by replacing the old challenge
      // with the updated one from the API response
      setChallenges(prevChallenges =>
        prevChallenges.map(c =>
          c._id === updatedChallenge._id ? updatedChallenge : c
        )
      );

      // Close the popup
      setSelectedChallenge(null);

      // Optionally: Trigger a refresh of active challenges if displayed elsewhere
      // refreshActiveChallenges();

    } catch (error) {
      console.error('Enrollment failed in handleConfirmEnroll:', error);
      // Re-throw the error so the popup can display it
      throw error;
    }
  };

  // Helper function to check enrollment status based on fetched data
  const checkIsEnrolled = (challenge) => {
    if (!currentUser || !challenge || !challenge.participants) {
      return false;
    }
    // Check if the currentUser's ID is in the participants array
    return challenge.participants.some(p => p.user && p.user.toString() === currentUser._id);
  };


  if (loading) return <div>Loading featured challenges...</div>;
  // Display error message if loading failed
  if (error) return <div className="error-message">{error}</div>;
  // Display message if no challenges match filters
  if (!loading && filteredChallenges.length === 0) {
     return <div>No featured challenges found matching your criteria.</div>;
  }

  return (
    <div className="featured-challenges">
      <h2>Featured Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => {
          const isEnrolled = checkIsEnrolled(challenge); // Check enrollment status dynamically
          return (
            <div
              className="challenge-card"
              key={challenge._id} // Use MongoDB _id
              onClick={() => handleViewDetails(challenge)} // Open popup on card click
            >
              {/* Use challenge.image - ensure your API returns this */}
              <img src={challenge.image || runningImg} alt={challenge.title} />
              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                {/* Ensure participants is an array before accessing length */}
                <p>{Array.isArray(challenge.participants) ? challenge.participants.length : 0} participants</p>
                <p>{challenge.shortDescription}</p>
                <div className="challenge-hover-content">
                   {/* Button text/state depends on dynamic check */}
                  <button
                    className={`enroll-button ${isEnrolled ? 'enrolled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click when clicking button
                      handleViewDetails(challenge); // Still open popup on button click
                    }}
                    disabled={isEnrolled} // Disable if already enrolled
                  >
                    {isEnrolled ? 'Enrolled' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render Popup */}
      {selectedChallenge && (
        <ChallengePopup
          challenge={selectedChallenge}
          onEnroll={handleConfirmEnroll} // Pass the enrollment handler
          // Pass the dynamically checked enrollment status
          isEnrolled={checkIsEnrolled(selectedChallenge)}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
}

export default FeaturedChallenges;
