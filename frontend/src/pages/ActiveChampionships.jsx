import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';
import { championshipsApi } from '../services/championshipsApi';
import { useAuth } from '../contexts/AuthContext';

export default function ActiveChampionships({ searchQuery, selectedStatus }) {
  const { currentUser } = useAuth();
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadActiveChampionships();
    }
  }, [currentUser]);

  const loadActiveChampionships = async () => {
    try {
      setLoading(true);
      const data = await championshipsApi.getUserChampionships(currentUser._id);
      setChampionships(data);
    } catch (err) {
      setError('Failed to load active championships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = championships.filter(c => {
    const matchesStatus =
      selectedStatus === 'all' ? true : c.status === selectedStatus;
    const matchesText = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesText;
  });

  if (loading) return <div>Loading active championships...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="active-championships">
      <h2>Your Active Championships</h2>
      <div className="championships-grid">
        {filtered.map((championship) => (
          <div key={championship._id} className="championship-card">
            <div className="card-header">
              <img src={championship.image} alt={championship.name} />
            </div>
            <div className="card-body">
              <h3><Trophy size={20} /> {championship.name}</h3>
              <p>
                <Calendar size={16} /> {new Date(championship.startDate).toLocaleDateString()} – {new Date(championship.endDate).toLocaleDateString()}
              </p>
              <p>
                <Users size={16} /> {championship.participants.length} participants
              </p>
              <div className="progress-info">
                <p>{championship.participants.find(p => p.user === currentUser._id).completedChallenges.length} challenges completed</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No active championships found.</p>
        )}
      </div>
    </section>
  );
} 