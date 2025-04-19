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

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // For login status messages

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

    // Check if the user exists in local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Successful login
      setMessage("Login successful!");
      console.log("Logged in:", { username, password });

      // Store current user in session storage (optional)
      sessionStorage.setItem("currentUser", JSON.stringify(user));

      // Navigate to the next page after a brief delay
      setTimeout(() => {
        navigate("/dashboard"); // Change this to your target page
      }, 1000);
    } else {
      // Failed login
      setMessage("Invalid username or password. Please try again or sign up.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        {message && (
          <p
            className={
              message.includes("successful") ? "success-msg" : "error-msg"
            }
          >
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="User name"
          className="login-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors({ ...errors, username: undefined });
            setMessage(""); // Clear any previous messages
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
            setMessage(""); // Clear any previous messages
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
