import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users } from 'lucide-react';
import { championshipsApi } from '../services/championshipsApi';
import { useAuth } from '../contexts/AuthContext';
import ChampionshipPopup from './ChampionshipPopup';

export default function FeaturedChampionships({ searchQuery, selectedStatus }) {
  const { currentUser } = useAuth();
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  useEffect(() => {
    loadFeaturedChampionships();
    if (currentUser) {
      loadUserEnrollments();
    }
  }, [currentUser]);

  const loadFeaturedChampionships = async () => {
    try {
      setLoading(true);
      const data = await championshipsApi.getFeaturedChampionships();
      setChampionships(data);
    } catch (err) {
      setError('Failed to load featured championships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserEnrollments = async () => {
    if (!currentUser) return;
    
    try {
      const userChampionships = await championshipsApi.getUserChampionships(currentUser._id);
      const enrolledChampionshipIds = new Set(
        userChampionships.map(championship => championship._id)
      );
      setEnrolledIds(enrolledChampionshipIds);
    } catch (err) {
      console.error('Failed to load user enrollments:', err);
    }
  };

  const handleEnroll = async (championship) => {
    if (!currentUser) {
      throw new Error('You must be logged in to enroll');
    }

    try {
      await championshipsApi.enrollInChampionship(championship._id, currentUser._id);
      setEnrolledIds(prev => new Set([...prev, championship._id]));
      await loadFeaturedChampionships(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Enrollment failed:', error);
      throw error;
    }
  };

  const openChampionshipDetails = (championship) => {
    setSelectedChampionship(championship);
  };

  const closeChampionshipDetails = () => {
    setSelectedChampionship(null);
  };

  const filtered = championships.filter(c => {
    const matchesStatus =
      selectedStatus === 'all' ? true : c.status === selectedStatus;
    const matchesText = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesText;
  });

  if (loading) return <div>Loading featured championships...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="featured-championships">
      <h2>Featured Championships</h2>
      <div className="championships-grid">
        {filtered.map((championship) => (
          <div 
            key={championship._id} 
            className="championship-card"
            onClick={() => openChampionshipDetails(championship)}
          >
            <div className="card-header">
              <img src={championship.image} alt={championship.name} />
              {enrolledIds.has(championship._id) && (
                <div className="enrolled-badge">Enrolled</div>
              )}
            </div>
            <div className="card-body">
              <h3><Trophy size={20} /> {championship.name}</h3>
              <p>
                <Calendar size={16} /> {new Date(championship.startDate).toLocaleDateString()} – {new Date(championship.endDate).toLocaleDateString()}
              </p>
              <p><Users size={16} /> {championship.participants.length} participants</p>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="no-results">No championships found matching your criteria.</p>
        )}
      </div>

      {selectedChampionship && (
        <ChampionshipPopup
          championship={selectedChampionship}
          onEnroll={handleEnroll}
          isEnrolled={enrolledIds.has(selectedChampionship._id)}
          onClose={closeChampionshipDetails}
        />
      )}
    </section>
  );
}
