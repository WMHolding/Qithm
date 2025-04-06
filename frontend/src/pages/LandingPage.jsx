import React from 'react';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="lp-container">
      {/* Header / Navbar */}
      <header className="lp-header">
        <div className="lp-logo">FitComp</div>
        <nav className="lp-nav">
          <a href="#products">Products</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="lp-actions">
          <button className="lp-outline-btn">Contact Sales</button>
          <button className="lp-login-btn">Login</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lp-hero">
        <h1>From idea to fitness transformation, fast.</h1>
        <p>
          FitComp is your complete platform for discovering new challenges, 
          connecting with a supportive community, and reaching your goals.
        </p>
        <div className="lp-hero-actions">
          <button className="lp-primary-btn">Get Started Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p>© {new Date().getFullYear()} FitComp. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
