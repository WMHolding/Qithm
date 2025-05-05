// src/services/authApi.js

import axios from 'axios';

// Use Vite environment variable for API URL if available, otherwise use localhost for development
const API_URL = import.meta.env.MODE === 'production'
  ? '/api' // Relative path for production on Vercel
  : 'http://localhost:3000/api'; // Your local backend URL for development
// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Axios instance with base URL and default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token for protected routes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log(`Axios Interceptor: Requesting ${config.url}`);
    console.log(`Axios Interceptor: Token found?`, !!token); // Log if token exists (boolean)
    console.log(`Axios Interceptor: Token value (first 10 chars):`, token ? token.substring(0, 10) + '...' : 'None');
    if (token) {
      // Use 'x-auth-token' as defined in your backend authMiddleware
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error("Axios Interceptor: Request error", error); // Log if interceptor itself hits an error
    return Promise.reject(error);
  }
);


// --- Auth API Functions ---
export const authApi = {
  // Updated login function to accept email and password
  login: async (email, password) => {
    try {
      // Send email and password in the request body
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Return the full response data (includes token and user)
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      // Throw a more specific error message if available from backend
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  signup: async (userData) => {
    try {
      // userData should contain { username, email, password, ... }
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data; // Contains { token, user } based on your backend signup route
    } catch (error) {
      console.error('Signup API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  getCurrentUser: async () => {
     // Requires token to be set in localStorage first
     const token = getToken();
     if (!token) {
         // Don't necessarily throw an error if no token, just return null or indicate no user
         console.log("No token found for getCurrentUser.");
         return null;
     }
    try {
      // Use the axiosInstance that includes the token interceptor
      const response = await axiosInstance.get(`/auth/me`);
      return response.data; // Returns user object (without password)
    } catch (error) {
      console.error('Get current user API error:', error.response?.data || error.message);
      // If token is invalid/expired, backend returns 401.
      // Clear the token and indicate failure.
      if (error.response?.status === 401) {
          console.log("Token invalid or expired. Clearing token.");
          localStorage.removeItem('token');
           // You might want to dispatch a 'LOGOUT' action or similar here if using Redux/context
      }
      // Rethrow the error so the calling component (AuthContext) can handle it
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
};

// --- Challenges API (Can use axiosInstance too) ---
// Kept for reference, ensure these use axiosInstance for authenticated routes
export const challengesApi = {
  getFeaturedChallenges: async () => {
    try {
      const response = await axiosInstance.get(`/challenges/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured challenges:', error.response?.data || error.message);
      throw error;
    }
  },

  getUserChallenges: async (userId) => {
     // Note: Your backend route is GET /challenges/user/:userId/active
     // This should be a protected route on the backend using authMiddleware
     // The userId in the URL should ideally match the authenticated user's ID
     // req.user.userId to prevent one user from fetching another's challenges easily.
     // Or change backend route to GET /challenges/user/me/active
     // For now, keeping the call structure as is but noting potential backend security
     if (!userId) {
          console.warn("getUserChallenges called without userId");
          return []; // Or throw error depending on desired behavior
     }
    try {
      const response = await axiosInstance.get(`/challenges/user/${userId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user challenges:', error.response?.data || error.message);
      // Rethrow the error for the component to handle
      throw error;
    }
  },

  enrollInChallenge: async (userId, challengeId, progressGoal) => {
     // Note: Your backend route is POST /challenges/enroll
     // This should be a protected route on the backend using authMiddleware
     // The userId sent in the body should ideally match the authenticated user's ID
     // req.user.userId to prevent one user from enrolling another user.
     // For now, keeping the call structure as is but noting potential backend security
     if (!userId || !challengeId) {
        const errorMsg = "User/Challenge ID missing for enrollment";
        console.error(errorMsg);
        throw new Error(errorMsg);
     }
    try {
      const response = await axiosInstance.post(`/challenges/enroll`, {
        userId, // Backend should ideally ignore this and use req.user.userId
        challengeId,
        progressGoal
      });
      return response.data;
    } catch (error) {
      console.error('Enrollment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to enroll');
    }
  }
  // Add other API functions here (championships, chats, profile, etc.)
};
