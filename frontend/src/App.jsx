// src/App.js (or wherever your main App component is)

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

// Import Pages
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import ChallengesPage from "./pages/Challenges"; // Corrected path assuming it's in pages
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
// import ChallengeCoachView from "./pages/ChallengeCoachView";
import Leaderboard from "./pages/LeaderBoard";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import ChampionshipsPage from "./pages/Championships";
import AdminDashboard from "./pages/Admin";

// Import AuthProvider
import { AuthProvider } from './contexts/AuthContext'; // Adjust path if needed

function App() {
  return (
    // Wrap the BrowserRouter with AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Now all routes and their components are descendants of AuthProvider */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          {/* <Route path="/coach" element={<ChallengeCoachView />} /> */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/championships" element={<ChampionshipsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
