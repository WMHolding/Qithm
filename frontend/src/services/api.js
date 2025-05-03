import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const challengesApi = {
  // Get all featured challenges
  getFeaturedChallenges: async () => {
    try {
      const response = await axios.get(`${API_URL}/challenges/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured challenges:', error);
      throw error;
    }
  },

  // Get user's active challenges
  getUserChallenges: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/challenges/user/${userId}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      throw error;
    }
  },

  // Enroll in a challenge
  enrollInChallenge: async (userId, challengeId, progressGoal) => {
    try {
      console.log('Sending enrollment request:', { userId, challengeId, progressGoal });
      const response = await axios.post(`${API_URL}/challenges/enroll`, {
        userId,
        challengeId,
        progressGoal
      });
      return response.data;
    } catch (error) {
      console.error('Enrollment error:', error.response?.data || error);
      throw error;
    }
  }
}; 