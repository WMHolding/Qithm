import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests
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
      console.error('Error fetching championships:', error);
      throw error;
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
      console.error('Error enrolling in championship:', error);
      throw error;
    }
  }
};