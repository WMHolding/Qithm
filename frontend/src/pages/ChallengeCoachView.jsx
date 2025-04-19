import React, { useState } from 'react';
import { challengesData } from './FeaturedChallenges';
import { Check, X, Users, Trophy, Clock, Bell, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import '../styles/ChallengeCoachView.css';

// Sample coaching requests data
const coachingRequests = [
  {
    id: 1,
    userName: "Sarah Miller",
    challengeId: 1,
    message: "I need help with my running form and pacing strategy.",
    timestamp: "2 hours ago",
    status: "pending"
  },
  {
    id: 2,
    userName: "John Davis",
    challengeId: 3,
    message: "Looking for guidance on proper weightlifting techniques.",
    timestamp: "5 hours ago",
    status: "pending"
  },
  {
    id: 3,
    userName: "Emma Wilson",
    challengeId: 2,
    message: "Need help creating a sustainable meal plan.",
    timestamp: "1 day ago",
    status: "pending"
  }
];

function ChallengeCoachView() {
  const [requests, setRequests] = useState(coachingRequests);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestAction = (requestId, action) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: action } 
          : request
      )
    );
  };

  return (
    <div className="coach-view-container">
      <Navbar />
      <div className="coach-dashboard">
        {/* Main Content - Challenge Management */}
        <div className="challenges-management">
          <div className="management-header">
            <div className="header-content">
              <h2><Trophy className="icon" /> Your Coached Challenges</h2>
              <div className="header-stats">
                <div className="stat">
                  <Users className="icon" />
                  <span>125 Active Participants</span>
                </div>
                <div className="stat">
                  <Clock className="icon" />
                  <span>5 Active Challenges</span>
                </div>
              </div>
            </div>
          </div>

          <div className="challenges-grid">
            {challengesData.map(challenge => (
              <div key={challenge.id} className="challenge-card coach-view">
                <div className="card-header">
                  <img 
                    src={challenge.image} 
                    alt={challenge.title} 
                    className="challenge-image"
                  />
                  <div className="challenge-badge">Coach</div>
                </div>
                <div className="challenge-info">
                  <h3>{challenge.title}</h3>
                  <div className="challenge-stats">
                    <span><Users size={14} /> {challenge.participants}</span>
                    <span><Clock size={14} /> {challenge.daysLeft}d</span>
                    <span><MessageSquare size={14} /> 12</span>
                  </div>
                  <div className="challenge-progress">
                    <div className="progress-overview">
                      <span>Avg. Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                  <div className="coach-actions">
                    <button className="view-details-btn">Details</button>
                    <button className="send-message-btn">Message</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Coaching Requests */}
        <div className="coaching-requests-panel">
          <div className="panel-header">
            <h2><Bell className="icon" /> Coaching Requests</h2>
            <span className="request-count">
              {requests.filter(r => r.status === 'pending').length} pending
            </span>
          </div>

          <div className="requests-list">
            {requests.map(request => {
              const challenge = challengesData.find(c => c.id === request.challengeId);
              
              return (
                <div 
                  key={request.id} 
                  className={`request-card ${request.status !== 'pending' ? 'handled' : ''}`}
                >
                  <div className="request-header">
                    <h3>{request.userName}</h3>
                    <span className="timestamp">{request.timestamp}</span>
                  </div>
                  
                  <div className="challenge-reference">
                    <Trophy className="icon" size={14} />
                    <span>{challenge?.title}</span>
                  </div>

                  <p className="request-message">{request.message}</p>

                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {request.status !== 'pending' && (
                    <div className={`status-badge ${request.status}`}>
                      {request.status}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeCoachView;
