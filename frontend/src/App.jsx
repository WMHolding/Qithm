import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import ChallengesPage from "./pages/Challenges";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ChallengeCoachView from "./pages/ChallengeCoachView";
import Leaderboard from "./pages/LeaderBoard";
import ProfilePage from "./pages/ProfilePage";
import LiftSideDash from "./pages/LiftSideDash";
import ActiveChallenges from "./pages/ActiveChallenges";
import Dashboard from "./pages/Dashboard";
import WeeklyProgress from "./pages/WeeklyProgress";
import Navbar from "./pages/Navbar";
import AdminDashboard from "./pages/Admin";


function App() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

export default App;
