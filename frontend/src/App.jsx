import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
<<<<<<< HEAD
import ChallengesPage from "./pages/Challenges";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ChallengeCoachView from "./pages/ChallengeCoachView";

import Leaderboard from "./pages/LeaderBoard";
=======
import ProfilePage from "./pages/ProfilePage";
import LiftSideDash from "./pages/LiftSideDash";
import ActiveChallenges from "./pages/ActiveChallenges";
import Dashboard from "./pages/Dashboard";
import WeeklyProgress from "./pages/WeeklyProgress";
import Navbar from "./pages/Navbar";
>>>>>>> abdullah/dashboard

function App() {
  return (
    <div>
<<<<<<< HEAD
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/coach" element={<ChallengeCoachView />} />
          <Route path="/leaderboard" element={<Leaderboard/>}/>
        </Routes>
      </BrowserRouter>
=======
      <Dashboard />
>>>>>>> abdullah/dashboard
    </div>
  );
}

export default App;
