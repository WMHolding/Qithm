// src/components/ActiveChampionships.jsx
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
    // Load championships only if currentUser is available
    if (currentUser) {
      loadActiveChampionships();
    }
  }, [currentUser]); // Depend on currentUser to refetch when it changes

  const loadActiveChampionships = async () => {
    try {
      setLoading(true);
      // This API call should ideally return only championships the user is in
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
    // Ensure championship object and name exist before filtering
    if (!c || !c.name) return false;

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
        {/* Check if filtered has items before mapping */}
        {filtered.length > 0 ? (
          filtered.map((championship) => {
            // Find the current user's participant data within this championship
            // Use == for comparison as ObjectId from backend might be object, and currentUser._id is string
            const currentUserParticipant = championship.participants.find(
              p => p.user && p.user._id == currentUser._id // Access p.user._id if populated
            );

            return (
              <div key={championship._id} className="championship-card">
                <div className="card-header">
                  <img src={championship.image} alt={championship.name} />
                  <div className="enrolled-badge">Enrolled</div> {/* Assumed user is enrolled if in this list */}
                </div>
                <div className="card-body">
                  <h3><Trophy size={20} /> {championship.name}</h3>
                  <p>
                    <Calendar size={16} /> {new Date(championship.startDate).toLocaleDateString()} – {new Date(championship.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <Users size={16} /> {championship.participants.length} participants
                  </p>
                  {/* Safely access completedChallenges if participant found */}
                  {currentUserParticipant ? (
                     <div className="progress-info">
                       <p>{currentUserParticipant.completedChallenges.length} challenges completed</p>
                     </div>
                  ) : (
                     <div className="progress-info">
                        <p>Participant data not found for this championship.</p> {/* Should not happen if API works */}
                     </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // Display a message if no active championships are found after filtering
          <p className="no-results">No active championships found.</p>
        )}
      </div>
    </section>
  );
}
