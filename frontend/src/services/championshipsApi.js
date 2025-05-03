import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
  getFeaturedChampionships: async () => {
    try {
      const response = await axiosInstance.get('/championships/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured championships:', error.response?.data || error.message);
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
      console.error('Error fetching user championships:', error.response?.data || error.message);
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
      console.error('Error enrolling in championship:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to enroll in championship');
    }
  }
}; 