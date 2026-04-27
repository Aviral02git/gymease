import React, { createContext, useContext, useState, useCallback } from 'react';
import fitnessService from '../services/fitnessService';

const FitnessContext = createContext(null);

export function FitnessProvider({ children }) {
  const [fitnessData, setFitnessData] = useState({
    workouts: [],
    weights: [],
    calories: [],
    stats: {
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      totalWeightLost: 0,
      averageWeeklyWorkouts: 0
    },
    streaks: {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null
    }
  });

  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlyProgress, setMonthlyProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load user fitness data
   */
  const loadFitnessData = useCallback(async (userId, days = 30) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.getUserFitnessData(userId, days);
      if (response.data?.data) {
        setFitnessData(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load fitness data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log workout
   */
  const logWorkout = useCallback(async (userId, workoutData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.logWorkout(userId, workoutData);
      if (response.data?.data) {
        setFitnessData((prev) => ({
          ...prev,
          workouts: [...prev.workouts, response.data.data],
          stats: {
            ...prev.stats,
            totalWorkouts: prev.stats.totalWorkouts + 1,
            totalCaloriesBurned: prev.stats.totalCaloriesBurned + (workoutData.caloriesBurned || 0)
          }
        }));
      }
      return response.data?.data;
    } catch (err) {
      setError(err.message || 'Failed to log workout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log weight
   */
  const logWeight = useCallback(async (userId, weightData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.logWeight(userId, weightData);
      if (response.data?.data) {
        setFitnessData((prev) => ({
          ...prev,
          weights: [...prev.weights, response.data.data]
        }));
      }
      return response.data?.data;
    } catch (err) {
      setError(err.message || 'Failed to log weight');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Log calories
   */
  const logCalorie = useCallback(async (userId, calorieData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.logCalorie(userId, calorieData);
      if (response.data?.data) {
        setFitnessData((prev) => ({
          ...prev,
          calories: [...prev.calories, response.data.data]
        }));
      }
      return response.data?.data;
    } catch (err) {
      setError(err.message || 'Failed to log calorie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get weekly summary
   */
  const loadWeeklySummary = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.getWeeklySummary(userId);
      if (response.data?.data) {
        setWeeklySummary(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load weekly summary');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get monthly progress
   */
  const loadMonthlyProgress = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fitnessService.getMonthlyProgress(userId);
      if (response.data?.data) {
        setMonthlyProgress(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load monthly progress');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    fitnessData,
    weeklySummary,
    monthlyProgress,
    loading,
    error,
    loadFitnessData,
    logWorkout,
    logWeight,
    logCalorie,
    loadWeeklySummary,
    loadMonthlyProgress
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within FitnessProvider');
  }
  return context;
}

export default FitnessContext;
