import api from './api';

export const recommendationService = {
  /**
   * Get smart gym recommendations
   * @param {Object} preferences - User preferences
   * @returns {Promise}
   */
  getRecommendations: (preferences = {}) => {
    const params = new URLSearchParams();

    if (preferences.budget) params.append('budget', preferences.budget);
    if (preferences.goals) {
      const goalsStr = Array.isArray(preferences.goals)
        ? preferences.goals.join(',')
        : preferences.goals;
      params.append('goals', goalsStr);
    }
    if (preferences.preferredTime) params.append('preferredTime', preferences.preferredTime);
    if (preferences.maxDistance) params.append('maxDistance', preferences.maxDistance);
    if (preferences.latitude) params.append('latitude', preferences.latitude);
    if (preferences.longitude) params.append('longitude', preferences.longitude);
    if (preferences.city) params.append('city', preferences.city);

    return api.get(`/recommendations?${params.toString()}`);
  },

  /**
   * Get recommendation details for a specific gym
   * @param {string} gymId - Gym ID
   * @param {Object} preferences - User preferences
   * @returns {Promise}
   */
  getRecommendationDetails: (gymId, preferences = {}) => {
    const params = new URLSearchParams();

    if (preferences.budget) params.append('budget', preferences.budget);
    if (preferences.goals) {
      const goalsStr = Array.isArray(preferences.goals)
        ? preferences.goals.join(',')
        : preferences.goals;
      params.append('goals', goalsStr);
    }
    if (preferences.preferredTime) params.append('preferredTime', preferences.preferredTime);
    if (preferences.maxDistance) params.append('maxDistance', preferences.maxDistance);
    if (preferences.latitude) params.append('latitude', preferences.latitude);
    if (preferences.longitude) params.append('longitude', preferences.longitude);

    return api.get(`/recommendations/${gymId}?${params.toString()}`);
  }
};

export default recommendationService;
