import React, { useState } from "react";
import "../styles/LoginPage.css";
import Qithm from "../assets/Qithm.png";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!emailRegex.test(email)) e.email = "Invalid email address";
    if (username.trim().length < 5)
      e.username = "Username must be at least 5 characters";
    if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (confirmPassword !== password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    console.log("Signed up:", { email, username });
    // ... انتقل للصفحة التالية
  };

  // Helper to clear حقل واحد
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
        />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            clearError("username");
          }}
        />
        {errors.username && <p className="error-msg">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
        />
        {errors.password && <p className="error-msg">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          className="login-input"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPass(e.target.value);
            clearError("confirm");
          }}
        />
        {errors.confirm && <p className="error-msg">{errors.confirm}</p>}

        <button className="login-button" onClick={handleSubmit}>
          Sign up
        </button>

        <p className="login-text">Already have an account?</p>

        <button className="create-button" onClick={() => navigate("/")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SignInPage;
