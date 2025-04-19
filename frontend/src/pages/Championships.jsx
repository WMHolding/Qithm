// src/components/ChampionshipsPage.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import '../styles/Championships.css';
import SpringEndurance from '../assets/spring-endurance.webp';
import StrengthShowdown from '../assets/strength-showdown.jpeg';
import SummerFitness from '../assets/summer-fitness.webp';
import CardioClash from '../assets/cardio-clash.jpg';
const championshipsData = [
  {
    id: 1,
    name: 'Summer Fitness Championship',
    startDate: 'May 10, 2025',
    endDate: 'May 20, 2025',
    participants: 120,
    image: SummerFitness,
    status: 'upcoming',
  },
  {
    id: 2,
    name: 'Autumn Strength Showdown',
    startDate: 'Oct 1, 2025',
    endDate: 'Oct 10, 2025',
    participants: 85,
    image: StrengthShowdown,
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Winter Cardio Clash',
    startDate: 'Dec 15, 2024',
    endDate: 'Dec 22, 2024',
    participants: 150,
    image: CardioClash,
    status: 'completed',
  },
  {
    id: 4,
    name: 'Spring Endurance Cup',
    startDate: 'Mar 5, 2025',
    endDate: 'Mar 15, 2025',
    participants: 200,
    image: SpringEndurance,
    status: 'ongoing',
  },
];

const statuses = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

export default function ChampionshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filtered = championshipsData.filter(c => {
    const matchesStatus =
      selectedStatus === 'all' ? true : c.status === selectedStatus;
    const matchesText = c.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesText;
  });

  return (
    <div className="championships-container">
      <Navbar />

      {/* Header */}
      <header className="championships-header">
        <div className="section-container">
          <h1 className="championships-title">Championships</h1>
          <div className="championships-controls">
            <input
              className="championships-search"
              type="text"
              placeholder="Search championships..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="championships-filters">
              {statuses.map(s => (
                <button
                  key={s.key}
                  className={
                    selectedStatus === s.key ? 'active' : undefined
                  }
                  onClick={() => setSelectedStatus(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="championships-grid">
        {filtered.map(c => (
          <div key={c.id} className="championship-card">
            <div className="card-header">
              <img src={c.image} alt={c.name} />
              <div className="card-overlay">
                <button>
                  View Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="card-body">
              <h3>
                <Trophy size={20} /> {c.name}
              </h3>
              <p>
                <Calendar size={16} /> {c.startDate} – {c.endDate}
              </p>
              <p>
                <Users size={16} /> {c.participants} participants
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No championships found.</p>
        )}
      </section>
    </div>
  );
}
