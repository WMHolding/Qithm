import React, { useState } from "react";
import "../styles/LoginPage.css";
import Qithm from "../assets/Qithm.png";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (username.trim().length < 5)
      e.username = "Username must be at least 5 characters";
    if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    // ✅ بيانات صحيحة – نفّذ ما تريد:
    console.log("Logged in:", { username, password }); navigate("/Dashboard")
    // ... تابع للصفحة التالية
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        <input
          type="text"
          placeholder="User name"
          className="login-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors({ ...errors, username: undefined });
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
            setErrors({ ...errors, password: undefined });
          }}
        />
        {errors.password && <p className="error-msg">{errors.password}</p>}

        <button className="login-button" onClick={handleSubmit}>
          Login
        </button>

        <p className="login-text">Don't have an account?</p>

        <button
          className="create-button"
          onClick={() => navigate("/SignInPage")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
