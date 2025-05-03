// src/components/ActiveChallenges.js
import React, { useState, useEffect } from 'react';
import { challengesApi } from '../services/api';
import '../styles/ActiveChallenges.css';

function ActiveChallenges({ searchQuery, selectedCategory }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserChallenges();
  }, []);

  const loadUserChallenges = async () => {
    try {
      setLoading(true);
      // Replace with actual user ID from your auth system
      const userId = 'current_user_id';
      const data = await challengesApi.getUserChallenges(userId);
      setChallenges(data);
    } catch (err) {
      setError('Failed to load your active challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter active challenges
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div>Loading your active challenges...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="active-challenges">
      <h2>Your Active Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => {
          const participant = challenge.participants.find(p => p.user === 'current_user_id');
          const progressPercent = (participant.progress / participant.progressGoal) * 100;

          return (
            <div className="challenge-card" key={challenge._id}>
              <img
                src={challenge.image}
                alt={challenge.title}
                className="challenge-image"
              />
              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <div className="challenge-stats">
                  <p>Status: {participant.status}</p>
                  <p>Streak: {participant.streak} days</p>
                </div>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    Progress: {participant.progress}/{participant.progressGoal}
                  </p>
                </div>
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
