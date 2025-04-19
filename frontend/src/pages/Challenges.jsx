// src/components/ChallengesPage.js
import React, { useState } from 'react';
import FeaturedChallenges from './FeaturedChallenges';
import ActiveChallenges from './ActiveChallenges';
import Navbar from './Navbar';
import { Search } from 'lucide-react'; // Import the search icon

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
    <div className="challenges-view-container">
      <Navbar />
      <div className="challenges-dashboard">
        <div className="challenges-content">
          {/* Header with Search and Filters */}
          <div className="challenges-header">
            <div className="header-content">
              <div className="search-and-filters">
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
              </div>
            </div>
          </div>

          {/* Challenges Sections */}
          <div className="challenges-sections">
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
        </div>
      </div>
    </div>
  );
}

export default ChallengesPage;
