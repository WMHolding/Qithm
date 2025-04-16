// App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChallengesPage from './pages/Challenges';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The landing page is rendered at the root path */}
        <Route path="/" element={<LandingPage />} />
        {/* The challenges page is rendered at /challenges */}
        <Route path="/challenges" element={<ChallengesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
