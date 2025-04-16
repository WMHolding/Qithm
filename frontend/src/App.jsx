// src/App.jsx
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";

function App() {
  const [showLogin, setShowLogin] = useState(true); // true = login, false = sign‑in

  return showLogin ? (
    <LoginPage goToSignIn={() => setShowLogin(false)} />
  ) : (
    <SignInPage goToLogin={() => setShowLogin(true)} />
  );
}

export default App;
