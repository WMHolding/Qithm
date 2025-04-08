import React from 'react';
import Navbar from './Navbar'; 
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="lp-container">
      {/* New Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="lp-hero">
        <h1>From idea to fitness transformation, fast.</h1>
        <p>
          Qitham is your complete platform for discovering new challenges, 
          connecting with a supportive community, and reaching your goals!!!!
        </p>
        <div className="lp-hero-actions">
          <button className="lp-primary-btn">Get Started Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p>© {new Date().getFullYear()} Qitham. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
