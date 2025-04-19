import React from 'react';
import LiftSideDash from './LiftSideDash';
import WeeklyProgress from './WeeklyProgress';
import ActiveChallenges from './ActiveChallenges';
import Navbar from './Navbar';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Left Sidebar */}
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
        </div>
    );
};

export default Dashboard;