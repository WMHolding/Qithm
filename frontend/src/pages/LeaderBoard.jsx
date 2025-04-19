import React, { useState } from "react";
import "../styles/LeaderBoard.css"; 
import Navbar from "./Navbar";
const walkingData  = [
    { name: "Ahmed Ali", steps: 12345, streak: 6,pfp:  "../assets/smiling-teacher-sitting-desk-university-260nw-265830800.jpg.webp"},
    { name: "Ali Khaled", steps: 11200, streak: 5, pfp:  "./moon.jpg" },
    { name: "Mohammed Saleh", steps: 10800, streak: 4, pfp:  "./moon.jpg"},
    { name: "Ahmed Alharbi", steps: 9700, streak: 3,  pfp:  "./moon.jpg"},
    { name: "Faisal Nasser", steps: 8900, streak: 2, pfp:  "./moon.jpg"},
  ];
  const resistanceData = [
    { name: "Ahmed Ali", hours: 12, streak: 6,pfp:  "../assets/smiling-teacher-sitting-desk-university-260nw-265830800.jpg.webp"},
    { name: "Ali Khaled", hours: 11, streak: 5, pfp:  "./moon.jpg" },
    { name: "Mohammed Saleh", hours: 10, streak: 4, pfp:  "./moon.jpg"},
    { name: "Ahmed Alharbi", hours: 9, streak: 3,  pfp:  "./moon.jpg"},
    { name: "Faisal Nasser", hours: 8, streak: 2, pfp:  "./moon.jpg"},
  ];
  function Leaderboard() {
    const [isWalking, setIsWalking] = useState(true);
    const data = isWalking ? walkingData : resistanceData;

    return (
      <div>
        <Navbar/>
      <div className="leaderboard">
        
      <div className="leaderboard-header-bar">
        <h2>{isWalking ? "🚶 Walking Leaderboard" : "🏋️ Resistance Training"}</h2>
        <button className="toggle-button" onClick={() => setIsWalking(!isWalking)}>
          {isWalking ? "Show Resistance Training" : "Show Walking Leaderboard"}
        </button>
      </div>

      <div className="leaderboard-header">
        <span className="col-rank">Rank</span>
        <span className="col-name">Member</span>
        <span className="col-steps">{isWalking ? "Steps" : "Hours"}</span>
        <span className="col-streak">Streak</span>
      </div>

      {data.map((user, index) => (
        <div key={index} className="leaderboard-entry">
          <span className="col-rank">#{index + 1}</span>
          <span className="col-name">
            <img src={user.pfp} alt="pfp" className="pfp" />
            {user.name}
          </span>
          <span className="col-steps">
            {(isWalking ? user.steps : user.hours).toLocaleString()}
          </span>
          <span className="col-streak">{user.streak}🔥</span>
          </div>
        ))}
      </div>
      </div>
    );
  }
  
  export default Leaderboard;
  