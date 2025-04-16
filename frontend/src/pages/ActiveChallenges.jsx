// src/components/ActiveChallenges.js
import React from 'react';

// Sample data for user's active challenges
const activeData = [
  {
    id: 1,
    title: '10K Steps Daily',
    progress: 7500,
    progressGoal: 10000,
    rank: '57/120',
    hoursLeft: 4,
    category: 'cardio',
  },
  {
    id: 2,
    title: 'Weekly Workout Streak',
    progress: 4,
    progressGoal: 7,
    rank: '12/85',
    hoursLeft: 3,
    category: 'strength',
  },
];

function ActiveChallenges({ searchQuery, selectedCategory }) {
  const filteredChallenges = activeData.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="active-challenges">
      <h2>Your Active Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => {
          const progressPercent = (challenge.progress / challenge.progressGoal) * 100;

          return (
            <div className="challenge-card" key={challenge.id}>
              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <p>Rank: {challenge.rank}</p>
                <p>Hours left: {challenge.hoursLeft}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p>
                  Progress: {challenge.progress}/{challenge.progressGoal}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveChallenges;
