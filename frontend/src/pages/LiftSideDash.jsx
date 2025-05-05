// src/components/LiftSideDash.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
// No need to import ProfilePic directly if using user's profilePicture URL
// import ProfilePic from "../assets/istockphoto-1309328823-612x612.jpg";
import "../styles/LiftSideDash.css"; // Ensure correct path

// ProfileBox component updated to receive user data as props
function ProfileBox({ user }) {
    // Ensure user object is available before trying to access properties
    if (!user) {
        return (
            <div className="profile-box">
                 <div className="profile-pic-placeholder"></div> {/* Placeholder or loading spinner */}
                <h2>Loading User...</h2>
                <p></p>
            </div>
        );
    }

    return (
        <div className="profile-box">
            {/* Use the user's profile picture URL from the user object */}
            {/* Provide an alt text and a fallback src in case profilePicture is missing */}
            <img
                src={user.profilePicture || 'https://via.placeholder.com/150?text=User'} // Use user.profilePicture, fallback to placeholder
                alt={`${user.username}'s profile`}
                className="profile-pic"
            />
            {/* Display username */}
            <h2>{user.username}</h2>
            {/* Display user's points (assuming points is available on the user object) */}
            {/* You might calculate or fetch rank separately for a true ranking */}
            <p>Points: {user.points || 0}</p> {/* Display points or 0 if not available */}
             {/* Optional: Display role */}
             {user.role && <p>Role: {user.role}</p>}
        </div>
    );
}

// TrackProgress component remains hardcoded for now
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

            {/* Add more hardcoded challenges or integrate dynamic data here later */}

        </div>
    );
}


// LiftSideDash component uses useAuth and passes user to ProfileBox
function LiftSideDash() {
    const { currentUser, loadingAuth } = useAuth(); // Get current user and auth loading state

    // You might want to show a loading state if auth is still loading
    if (loadingAuth) {
        return (
            <div className="lift-side-dash">
                <div>Loading sidebar...</div>
            </div>
        );
    }

    // If auth is loaded but no current user, show a message or redirect (Dashboard already handles this)
    // if (!currentUser) {
    //     return (
    //         <div className="lift-side-dash">
    //             <div>Please log in to see your dashboard.</div>
    //         </div>
    //     );
    // }


    return (
        <div className="lift-side-dash">
            {/* Pass the currentUser object to ProfileBox */}
            <ProfileBox user={currentUser} />
            <TrackProgress /> {/* Keep TrackProgress hardcoded for now */}
        </div>
    )
}

// Export components
export default LiftSideDash;
// If you export ProfileBox or TrackProgress for other uses, export them here too
// export { ProfileBox, TrackProgress };
