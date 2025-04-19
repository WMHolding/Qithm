import React from 'react';
import ProfilePic from "../assets/istockphoto-1309328823-612x612.jpg";
import "../styles/LiftSideDash.css";

function ProfileBox({ profile }) {
    return (
        <div className="profile-box">
            <img src={profile.image} alt="Profile" className="profile-pic" />
            <h2>{profile.name}</h2>
            <p>{profile.rank}</p>
        </div>
    );
}

function TrackProgress() {
    return (
        <div className="track-progress">
            <h2>Track Progress</h2>

            <div className="challenge-card">
                <div className="challenge-header">
                    <h3>10K Steps Daily</h3>
                    <span className="rank">Rank: 5/120</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>
                <div className="progress-text">
                    <span>7,500/10,000 steps</span>
                    <span>4 hours left</span>
                </div>
            </div>
        </div>
    );
}

const profile = {
    name: "John Doe",
    rank: "1763",
    image: ProfilePic,
};

function LiftSideDash() {
    return (
        <div className="lift-side-dash">
            <ProfileBox profile={profile} />
            <TrackProgress />
        </div>
    )

}

// Export components individually
export default LiftSideDash;