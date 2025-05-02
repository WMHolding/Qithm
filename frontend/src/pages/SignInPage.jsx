// import React, { useState } from "react";
// import "../styles/LoginPage.css";
// import Qithm from "../assets/Qithm.png";
// import { useNavigate } from "react-router-dom";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// function SignInPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPass] = useState("");
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const e = {};

//     if (!emailRegex.test(email)) e.email = "Invalid email address";
//     if (username.trim().length < 5)
//       e.username = "Username must be at least 5 characters";
//     if (password.length < 8)
//       e.password = "Password must be at least 8 characters";
//     if (confirmPassword !== password) e.confirm = "Passwords do not match";
//     return e;
//   };

//   const handleSubmit = () => {
//     const e = validate();
//     if (Object.keys(e).length) {
//       setErrors(e);
//       return;
//     }
//     console.log(username, password);
//     localStorage.setItem("username", username);
//     localStorage.setItem("password", password);
//     // ... انتقل للصفحة التالية
//   };

//   // Helper to clear حقل واحد
//   const clearError = (field) =>
//     setErrors((prev) => ({ ...prev, [field]: undefined }));

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <img src={Qithm} alt="Logo" className="login-logo" />
//         <h1 className="login-title">Create Account</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="login-input"
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//             clearError("email");
//           }}
//         />
//         {errors.email && <p className="error-msg">{errors.email}</p>}

//         <input
//           type="text"
//           placeholder="Username"
//           className="login-input"
//           value={username}
//           onChange={(e) => {
//             setUsername(e.target.value);
//             clearError("username");
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
//             clearError("password");
//           }}
//         />
//         {errors.password && <p className="error-msg">{errors.password}</p>}

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="login-input"
//           value={confirmPassword}
//           onChange={(e) => {
//             setConfirmPass(e.target.value);
//             clearError("confirm");
//           }}
//         />
//         {errors.confirm && <p className="error-msg">{errors.confirm}</p>}

//         <button className="login-button" onClick={handleSubmit}>
//           Sign up
//         </button>

//         <p className="login-text">Already have an account?</p>

//         <button className="create-button" onClick={() => navigate("/")}>
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default SignInPage;

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
  const [message, setMessage] = useState(""); // For signup status messages

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

    // Get existing users from localStorage or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if username already exists
    if (existingUsers.some((user) => user.username === username)) {
      setMessage("Username already exists. Please choose another username.");
      return;
    }

    // Create new user object
    const newUser = {
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    // Add new user to the array and save back to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Show success message
    setMessage("Account created successfully!");
    console.log("Signed up:", { email, username });

    // Navigate to login page after a brief delay
    setTimeout(() => {
      navigate("/login"); // Change this to your target page
    }, 2000);
  };

  // Helper to clear one field
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={Qithm} alt="Logo" className="login-logo" />
        <h1 className="login-title">Create Account</h1>

        {message && (
          <p
            className={
              message.includes("successfully") ? "success-msg" : "error-msg"
            }
          >
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
            setMessage(""); // Clear any previous messages
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
            clearError("password");
            setMessage(""); // Clear any previous messages
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
            setMessage(""); // Clear any previous messages
          }}
        />
        {errors.confirm && <p className="error-msg">{errors.confirm}</p>}

        <button className="login-button" onClick={handleSubmit}>
          Sign up
        </button>

        <p className="login-text">Already have an account?</p>
        <button className="create-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SignInPage;
