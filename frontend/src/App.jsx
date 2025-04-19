// App.jsx (example usage)
import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/SignInPage" element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
