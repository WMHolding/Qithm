import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const challengesApi = {
  // Get all featured challenges
  getFeaturedChallenges: async () => {
    const response = await axios.get(`${API_URL}/challenges/featured`);
    return response.data;
  },

  // Get user's active challenges
  getUserChallenges: async (userId) => {
    const response = await axios.get(`${API_URL}/challenges/active/${userId}`);
    return response.data;
  },

  // Enroll in a challenge
  enrollInChallenge: async (userId, challengeId, progressGoal) => {
    const response = await axios.post(`${API_URL}/challenges/enroll`, {
      userId,
      challengeId,
      progressGoal
    });
    return response.data;
  }
}; 