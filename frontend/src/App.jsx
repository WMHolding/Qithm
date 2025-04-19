// App.jsx (example usage)
import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import LiftSideDash from "./pages/LiftSideDash";
import ActiveChallenges from "./pages/ActiveChallenges";
import Dashboard from "./pages/Dashboard";
import WeeklyProgress from "./pages/WeeklyProgress";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
