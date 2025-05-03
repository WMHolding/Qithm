// src/services/api.js (or create src/services/authApi.js)

import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Your backend URL

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Axios instance with default headers (optional but good)
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-auth-token'] = token; // Or 'Authorization': `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Auth API Functions ---
export const authApi = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
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
      return response.data; // Contains { message, user }
    } catch (error) {
      console.error('Signup API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  getCurrentUser: async () => {
     // Requires token to be set in localStorage first
     const token = getToken();
     if (!token) {
         throw new Error("No token found");
     }
    try {
      // Use the axiosInstance that includes the token interceptor
      const response = await axiosInstance.get(`/auth/me`);
      return response.data; // Returns user object (without password)
    } catch (error) {
      console.error('Get current user API error:', error.response?.data || error.message);
      // If token is invalid/expired, backend returns 401, handle appropriately
      if (error.response?.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
};

// --- Challenges API (Can use axiosInstance too) ---
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
     if (!userId) return []; // Or throw error
    try {
      // This route might need authMiddleware on backend if it's sensitive
      const response = await axiosInstance.get(`/challenges/user/${userId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user challenges:', error.response?.data || error.message);
      throw error;
    }
  },

  enrollInChallenge: async (userId, challengeId, progressGoal) => {
     if (!userId || !challengeId) throw new Error("User/Challenge ID missing");
    try {
      // This route definitely needs authMiddleware on backend
      const response = await axiosInstance.post(`/challenges/enroll`, {
        userId, // Backend might get this from req.user.id via token instead
        challengeId,
        progressGoal
      });
      return response.data;
    } catch (error) {
      console.error('Enrollment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to enroll');
    }
  }
};
