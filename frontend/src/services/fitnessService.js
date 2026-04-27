import api from './api';

export const fitnessService = {
  /**
   * Get all fitness data for user
   */
  getUserFitnessData: (userId, days = 30) => {
    return api.get(`/fitness/${userId}?days=${days}`);
  },

  /**
   * Log a workout
   */
  logWorkout: (userId, workoutData) => {
    return api.post(`/fitness/${userId}/workouts`, workoutData);
  },

  /**
   * Get user's workout history
   */
  getWorkouts: (userId, days = 30) => {
    return api.get(`/fitness/${userId}/workouts?days=${days}`);
  },

  /**
   * Log weight
   */
  logWeight: (userId, weightData) => {
    return api.post(`/fitness/${userId}/weights`, weightData);
  },

  /**
   * Get user's weight history
   */
  getWeights: (userId, days = 30) => {
    return api.get(`/fitness/${userId}/weights?days=${days}`);
  },

  /**
   * Log calorie entry
   */
  logCalorie: (userId, calorieData) => {
    return api.post(`/fitness/${userId}/calories`, calorieData);
  },

  /**
   * Get user's calorie history
   */
  getCalories: (userId, days = 30) => {
    return api.get(`/fitness/${userId}/calories?days=${days}`);
  },

  /**
   * Get weekly summary
   */
  getWeeklySummary: (userId) => {
    return api.get(`/fitness/${userId}/weekly-summary`);
  },

  /**
   * Get monthly progress
   */
  getMonthlyProgress: (userId) => {
    return api.get(`/fitness/${userId}/monthly-progress`);
  }
};

export default fitnessService;
