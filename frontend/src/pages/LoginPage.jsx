// import React, { useState } from "react";
// import "../styles/LoginPage.css";
// import Qithm from "../assets/Qithm.png";
// import { useNavigate } from "react-router-dom";

// function LoginPage() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const e = {};
//     if (username.trim().length < 5)
//       e.username = "Username must be at least 5 characters";
//     if (password.length < 8)
//       e.password = "Password must be at least 8 characters";
//     return e;
//   };

//   const handleSubmit = () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       setErrors(e);
//       return;
//     }
//     // ✅ بيانات صحيحة – نفّذ ما تريد:
//     console.log("Logged in:", { username, password });

//     // ... تابع للصفحة التالية
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <img src={Qithm} alt="Logo" className="login-logo" />
//         <h1 className="login-title">Login</h1>

//         <input
//           type="text"
//           placeholder="User name"
//           className="login-input"
//           value={username}
//           onChange={(e) => {
//             setUsername(e.target.value);
//             setErrors({ ...errors, username: undefined });
//           }}
//         />
//         {errors.username && <p className="error-msg">{errors.username}</p>}

//         <input
//           type="password"
//           placeholder="Password"
//           className="login-input"
//           value={password}
//           onChange={(e) => {
//             setPassword(e.target.value);
//             setErrors({ ...errors, password: undefined });
//           }}
//         />
//         {errors.password && <p className="error-msg">{errors.password}</p>}

//         <button className="login-button" onClick={handleSubmit}>
//           Login
//         </button>

//         <p className="login-text">Don't have an account?</p>

//         <button
//           className="create-button"
//           onClick={() => navigate("/SignInPage")}
//         >
//           Create Account
//         </button>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

// LoginPage.js
import React, { useState } from "react";
import "../styles/LoginPage.css";
import Qithm from "../assets/Qithm.png";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { authApi } from "../services/authApi"; // Import authApi

function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get setCurrentUser from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Single error message state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission if it were a form
    setError(""); // Clear previous errors
    setLoading(true);

    // Basic client-side validation (optional, backend handles main validation)
    if (!username || !password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      // Call the backend API for login
      const data = await authApi.login(username, password);

      // --- SUCCESS ---
      console.log("Login successful:", data);

      // 1. Update Auth Context State
      setCurrentUser(data.user); // Set the user object in the context

      // 2. Store the JWT token for session persistence
      localStorage.setItem('token', data.token);

      // 3. Navigate to dashboard or desired page
      navigate("/dashboard"); // Or /challenges, etc.

    } catch (err) {
      // --- FAILURE ---
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check credentials."); // Show error from API or generic message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        {/* Display API error */}
        {error && <p className="error-msg">{error}</p>}

        {/* Consider using a <form> element */}
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

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
          onClick={handleSubmit} // Or use onSubmit if using <form>
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-text">Don't have an account?</p>
        <button
          className="create-button"
          onClick={() => navigate("/signin")} // Corrected path
          disabled={loading}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

