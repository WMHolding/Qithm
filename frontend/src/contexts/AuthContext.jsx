// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi'; // Import authApi

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // State to track initial auth check

  // Function to attempt loading user from token
  const loadUserFromToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Use the API function to get user data using the stored token
        const userData = await authApi.getCurrentUser();
        setCurrentUser(userData); // Set user if token is valid
      } catch (error) {
        console.error("Failed to load user from token:", error.message);
        localStorage.removeItem('token'); // Remove invalid token
        setCurrentUser(null);
      }
    }
    setLoadingAuth(false); // Finished attempting to load
  }, []); // Empty dependency array means this function is stable

  // Run the check once when the provider mounts
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]); // Run when loadUserFromToken changes (which is never)

  // Function to handle logout
  const logout = useCallback(() => {
      localStorage.removeItem('token');
      setCurrentUser(null);
      // Optionally navigate to login page: navigate('/login');
      console.log("User logged out");
  }, []); // Add logout function

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    currentUser,
    setCurrentUser, // Still provide this for direct setting after login
    loadingAuth,
    logout // Provide logout function
  }), [currentUser, loadingAuth, logout]); // Dependencies for useMemo

  // Render children only after the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth ? children : <div>Loading Application...</div>} {/* Show loading indicator */}
    </AuthContext.Provider>
  );
};

// Custom hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
