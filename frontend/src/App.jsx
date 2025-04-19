import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import ChallengesPage from "./pages/Challenges";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ChallengeCoachView from "./pages/ChallengeCoachView";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/coach" element={<ChallengeCoachView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
