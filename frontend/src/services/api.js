// src/services/api.js
import axios from 'axios';

// --- Configuration ---

// Dynamically set the API base URL
const API_URL = import.meta.env.MODE === 'production'
  ? '/api' // Relative path for production on Vercel
  : 'http://localhost:3000/api'; // Your local backend URL for development

// Helper function to get the JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// --- Axios Instance Setup ---

// Create a single Axios instance for most API calls
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Add the JWT token to outgoing requests using the instance
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Use the header your backend authMiddleware expects
      config.headers['x-auth-token'] = token;
      // Example if using Bearer token:
      // config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request configuration errors
    console.error("Axios request config error:", error);
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor for global error handling (e.g., auto-logout on 401)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., invalid or expired token)
      console.warn("Unauthorized request or expired token (401). Logging out.");
      localStorage.removeItem('token');
      // Redirect to login page. Use window.location for simplicity here,
      // or integrate with router/AuthContext for better SPA handling.
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    // Return the error so specific component catch blocks can also handle it
    return Promise.reject(error);
  }
);

// --- API Service Objects ---

// Authentication API calls
export const authApi = {
  login: async (username, password) => {
    try {
      // Use base axios for login as interceptor isn't needed before token exists
      // and we need the full API_URL here
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      return response.data; // Contains token and user object
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  signup: async (userData) => {
    try {
      // Use base axios for signup
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data; // Contains { message, user }
    } catch (error) {
      console.error('Signup API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  getCurrentUser: async () => {
    // Requires authentication, use the instance with interceptor
    if (!getToken()) {
        console.warn("Attempted getCurrentUser without token.");
        throw new Error("No token found");
    }
    try {
      // Path is relative to baseURL defined in axiosInstance
      const response = await axiosInstance.get(`/auth/me`);
      return response.data; // User object
    } catch (error) {
      console.error('Get current user API error:', error.response?.data || error.message);
      // Response interceptor might handle 401 logout
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
};

// Challenges API calls
export const challengesApi = {
  getFeaturedChallenges: async () => {
    try {
      // Use instance (might be public, but consistent and uses interceptors if needed later)
      const response = await axiosInstance.get(`/challenges/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load featured challenges');
    }
  },

  getUserChallenges: async (userId) => {
    if (!userId) {
        console.error("getUserChallenges called without userId");
        throw new Error("User ID required for getUserChallenges");
    }
    try {
      // Use instance (route might require auth on backend)
      const response = await axiosInstance.get(`/challenges/user/${userId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user challenges:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load user challenges');
    }
  },

  enrollInChallenge: async (userId, challengeId, progressGoal) => {
    if (!userId || !challengeId) {
        console.error("enrollInChallenge called without userId or challengeId");
        throw new Error("User ID and Challenge ID are required for enrollment.");
    }
    try {
      // Use instance (requires auth)
      const response = await axiosInstance.post(`/challenges/enroll`, {
        // Backend might get userId from token (req.user.id), check backend route implementation
        userId,
        challengeId,
        progressGoal: progressGoal || 100 // Default goal if needed
      });
      return response.data; // Updated challenge document
    } catch (error) {
      console.error('Challenge enrollment error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to enroll in challenge');
    }
  },
  // Add other challenge-related API functions here...
};

// Championships API calls
export const championshipsApi = {
  getAllChampionships: async () => {
    try {
      const response = await axiosInstance.get('/championships');
      return response.data;
    } catch (error) {
      console.error('Error fetching championships:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load championships');
    }
  },

  getFeaturedChampionships: async () => {
    try {
      const response = await axiosInstance.get('/championships/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured championships:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load featured championships');
    }
  },

  getUserChampionships: async (userId) => {
    if (!userId) {
      console.error("getUserChampionships called without userId");
      throw new Error('User ID is required');
    }
    try {
      // Assumes this route requires authentication
      const response = await axiosInstance.get(`/championships/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user championships:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to load user championships');
    }
  },

  enrollInChampionship: async (championshipId, userId) => {
     if (!userId || !championshipId) {
        console.error("enrollInChampionship called without userId or championshipId");
        throw new Error("User ID and Championship ID are required for enrollment.");
    }
    try {
      // Assumes this route requires authentication
      const response = await axiosInstance.post('/championships/enroll', {
        championshipId,
        // Backend might get userId from token (req.user.id), check backend route implementation
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error enrolling in championship:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to enroll in championship');
    }
  },
  // Add other championship-related API functions here...
};

// You could also export the instance if needed elsewhere, though usually not necessary
// export default axiosInstance;
