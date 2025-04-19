import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../styles/Navbar.css';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Challenges', path: '/challenges' },
  { name: 'Championships', path: '/championships' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Chat', path: '/chat' },
];

function Navbar() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef(null);
  const navItemRefs = useRef([]);

  // Update active index based on current location's pathname.
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname);
    setActiveIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [location]);

  // Function to update the indicator's position and width.
  const updateIndicator = () => {
    const currentItem = navItemRefs.current[activeIndex];
    if (currentItem && indicatorRef.current) {
      const { offsetLeft, clientWidth } = currentItem;
      indicatorRef.current.style.left = `${offsetLeft}px`;
      indicatorRef.current.style.width = `${clientWidth}px`;
    }
  };

  // Update indicator on activeIndex change and window resize.
  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeIndex]);

  return (
    <nav className="navbar">
      {/* Left Section: Logo */}
      <div className="nav-left">
        <span className="nav-logo">FitComp</span>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="nav-center">
        <ul className="nav-links">
          {navItems.map((item, index) => (
            <li
              key={item.name}
              className={`nav-item ${index === activeIndex ? 'active' : ''}`}
              ref={el => navItemRefs.current[index] = el}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
          {/* The moving green indicator */}
          <span className="nav-indicator" ref={indicatorRef}></span>
        </ul>
      </div>

      {/* Right Section: (Optional) User Avatar */}
      {/*
      <div className="nav-right">
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="nav-avatar"
        />
      </div>
      */}
    </nav>
  );
}

export default Navbar;
