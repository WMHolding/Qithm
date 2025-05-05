// src/pages/LoginPage.js
import React, { useState } from "react";
import "../styles/LoginPage.css";
import Qithm from "../assets/Qithm.png";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../services/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  // Changed from username to email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client-side validation
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      // Call the backend API for login with email and password
      const data = await authApi.login(email, password); // Pass email here

      // --- SUCCESS ---
      console.log("Login successful:", data);

      // 1. Update Auth Context State
      setCurrentUser(data.user);

      // 2. Store the JWT token for session persistence
      localStorage.setItem('token', data.token);

      // 3. Navigate to dashboard or desired page
      navigate("/dashboard");

    } catch (err) {
      // --- FAILURE ---
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        {error && <p className="error-msg">{error}</p>}

        {/* Input for Email */}
        <input
          type="email" // Use type="email" for better mobile keyboards and basic browser validation
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        {/* Input for Password */}
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="login-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-text">Don't have an account?</p>
        <button
          className="create-button"
          onClick={() => navigate("/signin")} // Corrected path if needed
          disabled={loading}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
