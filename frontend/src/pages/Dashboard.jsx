import React, { useState, useEffect } from 'react';
import LiftSideDash from './LiftSideDash';
import WeeklyProgress from './WeeklyProgress';
import ActiveChallenges from './ActiveChallenges';
import '../styles/Dashboard.css'; // Ensure you have the correct path to your CSS file
import Navbar from './Navbar';

const Dashboard = () => {
    const [showCoachButton, setShowCoachButton] = useState(false);

    // Add scroll event listener to show/hide button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowCoachButton(true);
            } else {
                setShowCoachButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Navbar />
            <div className="dashboard-container">

                <div className="left-sidebar">
                    <LiftSideDash />
                </div>

                {/* Right Content */}
                <div className="right-content">
                    <div className="weekly-progress-section">
                        <WeeklyProgress />
                    </div>
                    <div className="active-challenges-section">
                        <ActiveChallenges searchQuery="" selectedCategory="all" />
                    </div>
                </div>

                <div className={`search-coach-button-container ${showCoachButton ? 'visible' : ''}`}>
                    <button className="search-coach-button">Search for a Coach</button>
                </div>
            </div>
        </>
    );
};

export default Dashboard;