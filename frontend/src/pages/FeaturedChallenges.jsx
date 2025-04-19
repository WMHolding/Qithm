// src/components/FeaturedChallenges.js
import React from 'react';

// Import images as modules from the src/assets folder
import runningImg from '../assets/E10AF8SV.jpg';
import weightLossImg from '../assets/Dashboard_835_Addressing-the-most-common-weight-loss-myths_12_23.jpeg';
import strengthImg from '../assets/weight-workout.jpg.webp';

// Sample data for featured challenges with image references using the imported modules
const featuredData = [
  {
    id: 1,
    title: '30-Day Running Challenge',
    image: runningImg,
    participants: 250,
    daysLeft: 12,
    category: 'cardio',
  },
  {
    id: 2,
    title: 'Weight Loss Warriors',
    image: weightLossImg,
    participants: 375,
    daysLeft: 10,
    category: 'cardio',
  },
  {
    id: 3,
    title: 'Strength Training 101',
    image: strengthImg,
    participants: 175,
    daysLeft: 8,
    category: 'strength',
  },
];

function FeaturedChallenges({ searchQuery, selectedCategory }) {
  // Filter challenges based on the search query and selected category.
  const filteredChallenges = featuredData.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="featured-challenges">
      <h2>Featured Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => (
          <div className="challenge-card" key={challenge.id}>
            <img src={challenge.image} alt={challenge.title} />
            <div className="challenge-info">
              <h3>{challenge.title}</h3>
              <p>{challenge.participants} participants</p>
              <p>{challenge.daysLeft} days left</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedChallenges;
