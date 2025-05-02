import React, { useState } from "react";
import "../styles/LeaderBoard.css"; 
import Navbar from "./Navbar";
import Avatar1 from '../assets/portrait-one-young-happy-cheerful-260nw-1949791540.jpg.webp';
import Avatar2 from '../assets/portrait-smile-man-home-relax-260nw-2468677419.jpg.webp';
import Avatar3 from '../assets/smiling-teacher-sitting-desk-university-260nw-265830800.jpg.webp';
import Avatar4 from '../assets/young-brazilian-man-isolated-on-260nw-2152183993.jpg.webp';
import { Trophy, Footprints, Dumbbell, Flame, Medal, ArrowRight } from 'lucide-react';

const walkingData = [
    { name: "Ahmed Ali", steps: 12345, streak: 6, pfp: Avatar3 },
    { name: "Ali Khaled", steps: 11200, streak: 5, pfp: Avatar1 },
    { name: "Mohammed Saleh", steps: 10800, streak: 4, pfp: Avatar2 },
    { name: "Ahmed Alharbi", steps: 9700, streak: 3, pfp: Avatar4 },
    { name: "Faisal Nasser", steps: 8900, streak: 2, pfp: Avatar1 },
];

const resistanceData = [
    { name: "Ahmed Ali", hours: 12, streak: 6, pfp: Avatar3 },
    { name: "Ali Khaled", hours: 11, streak: 5, pfp: Avatar1 },
    { name: "Mohammed Saleh", hours: 10, streak: 4, pfp: Avatar2 },
    { name: "Ahmed Alharbi", hours: 9, streak: 3, pfp: Avatar4 },
    { name: "Faisal Nasser", hours: 8, streak: 2, pfp: Avatar1 },
];

function Leaderboard() {
  const [isWalking, setIsWalking] = useState(true);
  const data = isWalking ? walkingData : resistanceData;

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return 'rank-gold';
      case 1: return 'rank-silver';
      case 2: return 'rank-bronze';
      default: return '';
    }
  };

  return (
    <div>
      <Navbar />
      <div className="leaderboard">
        <div className="leaderboard-header-bar">
          <div className="header-title">
            <Trophy className="trophy-icon" size={24} />
            <h2>{isWalking ? "Walking Challenge" : "Resistance Training"}</h2>
          </div>
          <button className="toggle-button" onClick={() => setIsWalking(!isWalking)}>
            {isWalking ? <Dumbbell size={18} /> : <Footprints size={18} />}
            <span>{isWalking ? "Show Resistance" : "Show Walking"}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="leaderboard-header">
          <span className="col-rank">Rank</span>
          <span className="col-name">Member</span>
          <span className="col-stats">
            {isWalking ? (
              <>
                <Footprints size={16} />
                <span>Steps</span>
              </>
            ) : (
              <>
                <Dumbbell size={16} />
                <span>Hours</span>
              </>
            )}
          </span>
          <span className="col-streak">Streak</span>
        </div>

        {data.map((user, index) => (
          <div key={index} className={`leaderboard-entry ${getRankStyle(index)}`}>
            <span className="col-rank">
              {index < 3 ? (
                <Medal className={`medal-icon ${getRankStyle(index)}`} size={20} />
              ) : (
                `#${index + 1}`
              )}
            </span>
            <span className="col-name">
              <img src={user.pfp} alt="pfp" className="pfp" />
              <span className="user-name">{user.name}</span>
            </span>
            <span className="col-stats">
              {(isWalking ? user.steps : user.hours).toLocaleString()}
            </span>
            <span className="col-streak">
              {user.streak} <Flame className="streak-icon" size={16} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
  