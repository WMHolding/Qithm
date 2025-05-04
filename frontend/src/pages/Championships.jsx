// src/pages/Championships.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import FeaturedChampionships from './FeaturedChampionships';
import ActiveChampionships from './ActiveChampionships';
import '../styles/Championships.css';

const statuses = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

export default function ChampionshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  return (
    <div className="championships-container">
      <Navbar />
      
      <div className="championships-dashboard">
        <div className="championships-content">
          {/* Header with Search and Filters */}
          <div className="championships-header">
            <div className="header-content">
              <div className="search-and-filters">
                <div className="championships-search">
                  <input
                    type="text"
                    placeholder="Search championships..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="championships-filters">
                  {statuses.map(s => (
                    <button
                      key={s.key}
                      className={selectedStatus === s.key ? 'active' : ''}
                      onClick={() => setSelectedStatus(s.key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Championships Sections */}
          <div className="championships-sections">
            <FeaturedChampionships
              searchQuery={searchQuery}
              selectedStatus={selectedStatus}
            />
            <ActiveChampionships
              searchQuery={searchQuery}
              selectedStatus={selectedStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

