// src/services/championshipsApi.js
import axios from 'axios';

// Use Vite environment variable for API URL if available, otherwise use localhost for development
const API_URL = import.meta.env.MODE === 'production'
  ? '/api' // Relative path for production on Vercel
  : 'http://localhost:3000/api'; // Your local backend URL for development
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const championshipsApi = {
  getAllChampionships: async () => {
    try {
      const response = await axiosInstance.get('/championships');
      return response.data;
    } catch (error) {
      console.error('Error fetching championships:', error.response?.data || error);
      throw new Error('Failed to load championships');
    }
  },

  getFeaturedChampionships: async () => {
    try {
      const response = await axiosInstance.get('/championships/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured championships:', error.response?.data || error);
      throw new Error('Failed to load featured championships');
    }
  },

  getUserChampionships: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    try {
      const response = await axiosInstance.get(`/championships/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user championships:', error.response?.data || error);
      throw new Error('Failed to load active championships');
    }
  },

  enrollInChampionship: async (championshipId, userId) => {
    try {
      const response = await axiosInstance.post('/championships/enroll', {
        championshipId,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error enrolling in championship:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to enroll in championship');
    }
  },
  
  completeChallenge: async (championshipId, userId, challengeId, pointsEarned) => {
    try {
      const response = await axiosInstance.post(`/championships/${championshipId}/complete-challenge`, {
        userId,
        challengeId,
        pointsEarned
      });
      return response.data;
    } catch (error) {
      console.error('Error completing challenge:', error.response?.data || error);
      throw new Error('Failed to complete challenge');
    }
  }
};
