import React from "react";
import "../styles/LeaderBoard.css"; 
import Navbar from "./Navbar";
const leaderboardData = [
    { name: "Ahmed Ali", steps: 12345, streak: 6,pfp:  "../assets/smiling-teacher-sitting-desk-university-260nw-265830800.jpg.webp"},
    { name: "Sara Khaled", steps: 11200, streak: 5, pfp:  "./moon.jpg" },
    { name: "Mohammed Saleh", steps: 10800, streak: 4, pfp:  "./moon.jpg"},
    { name: "Lama Alharbi", steps: 9700, streak: 3,  pfp:  "./moon.jpg"},
    { name: "Faisal Nasser", steps: 8900, streak: 2, pfp:  "./moon.jpg"},
  ];
  
  function Leaderboard() {
    return (
      <div>
        <Navbar/>
      <div className="leaderboard">
        <h2>🏆 Weekly Leaderboard</h2>
  
        <div className="leaderboard-header">
          <span className="col-rank">Rank</span>
          <span className="col-name">Member</span>
          <span className="col-steps">Steps</span>
          <span className="col-streak">Streak</span>
        </div>
  
        {leaderboardData.map((user, index) => (
          <div key={index} className="leaderboard-entry">
            <span className="col-rank">#{index + 1}</span>
            <span className="col-name">
              <img src={user.pfp} alt="pfp" className="pfp" />
              {user.name}
            </span>
            <span className="col-steps">{user.steps.toLocaleString()}</span>
            <span className="col-streak">{user.streak}🔥</span>
          </div>
        ))}
      </div></div>
    );
  }
  
  export default Leaderboard;
  