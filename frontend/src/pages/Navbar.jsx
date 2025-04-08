import React from 'react';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left Section: Logo */}
      <div className="nav-left">
        <span className="nav-logo">FitComp</span>
      </div>

      {/* Center Section: Nav Links */}
      <div className="nav-center">
        <ul className="nav-links">
          <li className="nav-item">
            <a href="#dashboard">Dashboard</a>
          </li>
          <li className="nav-item active">
            <a href="#challenges">Challenges</a>
          </li>
          <li className="nav-item">
            <a href="#championships">Championships</a>
          </li>
          <li className="nav-item">
            <a href="#leaderboard">Leaderboard</a>
          </li>
          <li className="nav-item">
            <a href="#chat">Chat</a>
          </li>
        </ul>
      </div>

      {/* Right Section: User Avatar */}
      {/* <div className="nav-right">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="nav-avatar"
        />
      </div> */}
    </nav>
  );
}

export default Navbar;
