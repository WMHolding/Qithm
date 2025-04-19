import React from 'react';
import { ArrowRight, Award, Users, Calendar } from 'lucide-react';
import Navbar from './Navbar';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div>
    <Navbar />
    <div className="landing-container">
      {/* Navbar */}
      
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">Transform Your Fitness Journey</span>
          
          <h1 className="hero-heading">
            Challenge Yourself. <span className="accent-text">Transform Together.</span>
          </h1>
          
          <p className="hero-description">
            Join Qitham to discover exciting fitness challenges, connect with expert coaches, 
            and build a community of like-minded fitness enthusiasts who will push you to achieve more.
          </p>
          
          <div className="hero-actions">
            <button className="primary-button">
              Join Now!
              <ArrowRight className="button-icon" />
            </button>
            <button className="secondary-button">
              See How It Works
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-heading">Your Complete Fitness Experience</h2>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Award />
              </div>
              <h3 className="feature-title">Engaging Challenges</h3>
              <p className="feature-description">
                Join weekly and monthly fitness challenges tailored to your skill level and goals.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3 className="feature-title">Expert Coaching</h3>
              <p className="feature-description">
                Train with certified coaches who provide personalized guidance to maximize your results.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar />
              </div>
              <h3 className="feature-title">Community Support</h3>
              <p className="feature-description">
                Connect with fitness enthusiasts who share your passion and will motivate you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2 className="cta-heading">Ready to Begin Your Fitness Transformation?</h2>
          <p className="cta-description">
            Join thousands of members who are crushing their fitness goals with Qithm.
          </p>
          <button className="cta-button"> Join Now!
          <ArrowRight className="button-icon" /></button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">Qithm</div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Qithm. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default LandingPage;