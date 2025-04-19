// src/components/ChallengesPage.js
import React, { useState } from 'react';
import FeaturedChallenges from './FeaturedChallenges';
import ActiveChallenges from './ActiveChallenges';
import Navbar from './Navbar';

import '../styles/Challenges.css';

function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="challenges-page">
            <Navbar />

      {/* Search Bar */}
      <div className="challenges-search">
        <input
          type="text"
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Category Filters */}
      <div className="challenges-category-filters">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => handleCategoryChange('all')}
        >
          All
        </button>
        <button
          className={selectedCategory === 'cardio' ? 'active' : ''}
          onClick={() => handleCategoryChange('cardio')}
        >
          Cardio
        </button>
        <button
          className={selectedCategory === 'strength' ? 'active' : ''}
          onClick={() => handleCategoryChange('strength')}
        >
          Strength
        </button>
      </div>

      {/* Featured Challenges */}
      <FeaturedChallenges
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      {/* Active Challenges */}
      <ActiveChallenges
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}

export default ChallengesPage;
