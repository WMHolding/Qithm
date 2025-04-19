// src/components/ActiveChallenges.js
import React from 'react';
import { challengesData } from './FeaturedChallenges'; // Import the consolidated data
import '../styles/Challenges.css';

function ActiveChallenges({ searchQuery, selectedCategory }) {
  // Filter active (enrolled) challenges
  const filteredChallenges = challengesData.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    const isEnrolled = challenge.status === 'enrolled';
    return matchesSearch && matchesCategory && isEnrolled;
  });

  return (
    <div className="active-challenges">
      <h2>Your Active Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => {
          const progressPercent = (challenge.progress / challenge.progressGoal) * 100;

          return (
            <div className="challenge-card" key={challenge.id}>
              <img 
                src={challenge.image} 
                alt={challenge.title} 
                className="challenge-image"
              />
              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <div className="challenge-stats">
                  <p>Rank: {challenge.rank}</p>
                  <p>Hours left: {challenge.hoursLeft}</p>
                </div>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    Progress: {challenge.progress}/{challenge.progressGoal}
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
