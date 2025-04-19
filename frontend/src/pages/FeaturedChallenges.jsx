// src/components/FeaturedChallenges.js
import React, { useState } from 'react';

// Import all challenge images
import runningImg from '../assets/E10AF8SV.jpg';
import weightLossImg from '../assets/Dashboard_835_Addressing-the-most-common-weight-loss-myths_12_23.jpeg';
import strengthImg from '../assets/weight-workout.jpg.webp';
import WorkoutStreak from '../assets/image.jpg';
import TenKSteps from '../assets/maxresdefault.jpg';
import ChallengePopup from './ChallengePopup';

// Consolidated challenges data
export const challengesData = [
  {
    id: 1,
    title: '30-Day Running Challenge',
    image: runningImg,
    participants: 250,
    daysLeft: 12,
    category: 'cardio',
    shortDescription: "Build your running stamina with daily goals and tracking.",
    description: "Join our 30-day running challenge to improve your cardiovascular health and endurance. Track your daily runs and compete with other participants.",
    requirements: [
      "Complete daily running goals",
      "Track your progress using a fitness app", 
      "Share your achievements with the community"
    ],
    progress: 0,
    progressGoal: 100,
    rank: "0/250",
    hoursLeft: 288, // 12 days * 24 hours
    isFeatured: true,
    status: 'open' // can be 'open', 'enrolled', 'completed'
  },
  {
    id: 2,
    title: 'Weight Loss Warriors',
    image: weightLossImg,
    participants: 375,
    daysLeft: 10,
    category: 'cardio',
    shortDescription: "Join fellow warriors on a weight loss journey.",
    description: "A supportive community challenge focused on sustainable weight loss through healthy eating and exercise.",
    requirements: [
      "Log your meals daily",
      "Exercise 3-4 times per week",
      "Participate in weekly weigh-ins"
    ],
    progress: 0,
    progressGoal: 100,
    rank: "0/375",
    hoursLeft: 240, // 10 days * 24 hours
    isFeatured: true,
    status: 'open'
  },
  {
    id: 3,
    title: 'Strength Training 101',
    image: strengthImg,
    participants: 175,
    daysLeft: 8,
    category: 'strength',
    shortDescription: "Master fundamental strength training exercises.",
    description: "Learn proper form and technique for key strength training exercises. Perfect for beginners!",
    requirements: [
      "Complete 3 strength workouts per week",
      "Watch technique tutorials",
      "Track your progress with photos"
    ],
    progress: 0,
    progressGoal: 100,
    rank: "0/175",
    hoursLeft: 192, // 8 days * 24 hours
    isFeatured: true,
    status: 'open'
  },
  {
    id: 4,
    title: '10K Steps Daily',
    image: TenKSteps,
    participants: 120,
    daysLeft: 30,
    category: 'cardio',
    shortDescription: "Walk your way to better health with daily step goals.",
    description: "Join the 10K steps challenge to improve your daily activity levels and overall health.",
    requirements: [
      "Track daily steps",
      "Reach 10,000 steps daily",
      "Share your walking routes"
    ],
    progress: 7500,
    progressGoal: 10000,
    rank: "57/120",
    hoursLeft: 4,
    isFeatured: false,
    status: 'enrolled'
  },
  {
    id: 5,
    title: 'Weekly Workout Streak',
    image: WorkoutStreak,
    participants: 85,
    daysLeft: 7,
    category: 'strength',
    shortDescription: "Maintain your workout consistency for a full week.",
    description: "Build a consistent workout habit by completing daily exercises for a full week.",
    requirements: [
      "Work out every day",
      "Log your exercises",
      "Maintain streak for 7 days"
    ],
    progress: 4,
    progressGoal: 7,
    rank: "12/85",
    hoursLeft: 72,
    isFeatured: false,
    status: 'enrolled'
  }
];

function FeaturedChallenges({ searchQuery, selectedCategory }) {
  const [enrolledChallenges, setEnrolledChallenges] = useState(new Set());
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Filter featured challenges
  const filteredChallenges = challengesData.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    const isFeatured = challenge.isFeatured;
    return matchesSearch && matchesCategory && isFeatured;
  });

  const handleEnroll = (challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleConfirmEnroll = (challenge) => {
    setEnrolledChallenges(prev => {
      const newSet = new Set(prev);
      newSet.add(challenge.id);
      return newSet;
    });
    setSelectedChallenge(null);
  };

  const handleClosePopup = () => {
    setSelectedChallenge(null);
  };

  return (
    <div className="featured-challenges">
      <h2>Featured Challenges</h2>
      <div className="challenge-cards">
        {filteredChallenges.map((challenge) => (
          <div 
            className="challenge-card" 
            key={challenge.id}
            onClick={() => handleEnroll(challenge)}
          >
            <img src={challenge.image} alt={challenge.title} />
            <div className="challenge-info">
              <h3>{challenge.title}</h3>
              <p>{challenge.participants} participants</p>
              <p>{challenge.daysLeft} days left</p>
              <div className="challenge-hover-content">
                <p>{challenge.shortDescription}</p>
                <button 
                  className={`enroll-button ${enrolledChallenges.has(challenge.id) ? 'enrolled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(challenge);
                  }}
                >
                  {enrolledChallenges.has(challenge.id) ? 'Enrolled' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedChallenge && (
        <ChallengePopup 
          challenge={selectedChallenge}
          onEnroll={handleConfirmEnroll}
          isEnrolled={enrolledChallenges.has(selectedChallenge.id)}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default FeaturedChallenges;
