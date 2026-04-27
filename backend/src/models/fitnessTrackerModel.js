const { v4: uuidv4 } = require('uuid');

// In-memory storage for fitness tracking data
// In production, use Firebase/PostgreSQL
const fitnessData = {};

/**
 * Initialize user fitness data
 */
function initializeUserFitnessData(userId) {
  if (!fitnessData[userId]) {
    fitnessData[userId] = {
      userId,
      workouts: [],
      weights: [],
      calories: [],
      streaks: {
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: null
      },
      stats: {
        totalWorkouts: 0,
        totalCaloriesBurned: 0,
        totalWeightLost: 0,
        averageWeeklyWorkouts: 0
      }
    };
  }
  return fitnessData[userId];
}

/**
 * Log a workout
 */
function logWorkout(userId, workoutData) {
  const userData = initializeUserFitnessData(userId);

  const workout = {
    id: uuidv4(),
    userId,
    date: new Date(workoutData.date || Date.now()),
    type: workoutData.type, // 'cardio', 'strength', 'yoga', 'sports', etc.
    duration: workoutData.duration, // in minutes
    caloriesBurned: workoutData.caloriesBurned || 0,
    notes: workoutData.notes || '',
    intensity: workoutData.intensity || 'medium', // 'low', 'medium', 'high'
    exercises: workoutData.exercises || []
  };

  userData.workouts.push(workout);
  updateStats(userData);
  updateStreak(userData);

  return workout;
}

/**
 * Log weight entry
 */
function logWeight(userId, weightData) {
  const userData = initializeUserFitnessData(userId);

  const weightEntry = {
    id: uuidv4(),
    userId,
    date: new Date(weightData.date || Date.now()),
    weight: weightData.weight, // in kg
    unit: weightData.unit || 'kg',
    notes: weightData.notes || ''
  };

  userData.weights.push(weightEntry);
  updateStats(userData);

  return weightEntry;
}

/**
 * Log calorie entry
 */
function logCalorie(userId, calorieData) {
  const userData = initializeUserFitnessData(userId);

  const calorieEntry = {
    id: uuidv4(),
    userId,
    date: new Date(calorieData.date || Date.now()),
    calories: calorieData.calories,
    type: calorieData.type, // 'consumed', 'burned'
    meal: calorieData.meal || '', // 'breakfast', 'lunch', 'dinner', 'snack'
    notes: calorieData.notes || ''
  };

  userData.calories.push(calorieEntry);
  updateStats(userData);

  return calorieEntry;
}

/**
 * Get user's workout history
 */
function getWorkouts(userId, days = 30) {
  const userData = initializeUserFitnessData(userId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return userData.workouts.filter((w) => new Date(w.date) >= startDate);
}

/**
 * Get user's weight history
 */
function getWeights(userId, days = 30) {
  const userData = initializeUserFitnessData(userId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return userData.weights.filter((w) => new Date(w.date) >= startDate);
}

/**
 * Get user's calorie history
 */
function getCalories(userId, days = 30) {
  const userData = initializeUserFitnessData(userId);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return userData.calories.filter((c) => new Date(c.date) >= startDate);
}

/**
 * Get all fitness data for user
 */
function getUserFitnessData(userId) {
  return initializeUserFitnessData(userId);
}

/**
 * Get weekly summary
 */
function getWeeklySummary(userId) {
  const userData = initializeUserFitnessData(userId);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weeklyWorkouts = userData.workouts.filter((w) => new Date(w.date) >= weekAgo);
  const weeklyCaloriesBurned = weeklyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  const workoutsByType = {};
  weeklyWorkouts.forEach((w) => {
    workoutsByType[w.type] = (workoutsByType[w.type] || 0) + 1;
  });

  return {
    week: {
      start: weekAgo,
      end: now
    },
    workoutCount: weeklyWorkouts.length,
    caloriesBurned: weeklyCaloriesBurned,
    workoutsByType,
    averageDuration: weeklyWorkouts.length > 0 ? Math.round(weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0) / weeklyWorkouts.length) : 0
  };
}

/**
 * Get monthly progress
 */
function getMonthlyProgress(userId) {
  const userData = initializeUserFitnessData(userId);
  const now = new Date();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const monthlyWorkouts = userData.workouts.filter((w) => new Date(w.date) >= monthAgo);
  const monthlyWeights = userData.weights.filter((w) => new Date(w.date) >= monthAgo);

  const startWeight = monthlyWeights.length > 0 ? monthlyWeights[0].weight : null;
  const currentWeight = monthlyWeights.length > 0 ? monthlyWeights[monthlyWeights.length - 1].weight : null;
  const weightChange = startWeight && currentWeight ? startWeight - currentWeight : 0;

  const totalCaloriesBurned = monthlyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  return {
    month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    workoutCount: monthlyWorkouts.length,
    totalCaloriesBurned,
    startWeight,
    currentWeight,
    weightChange,
    weightLoss: weightChange > 0
  };
}

/**
 * Update user stats
 */
function updateStats(userData) {
  userData.stats.totalWorkouts = userData.workouts.length;
  userData.stats.totalCaloriesBurned = userData.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

  if (userData.weights.length >= 2) {
    const firstWeight = userData.weights[0].weight;
    const lastWeight = userData.weights[userData.weights.length - 1].weight;
    userData.stats.totalWeightLost = Math.max(0, firstWeight - lastWeight);
  }

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weeklyWorkouts = userData.workouts.filter((w) => new Date(w.date) >= thisWeek);
  userData.stats.averageWeeklyWorkouts = weeklyWorkouts.length;
}

/**
 * Update streak
 */
function updateStreak(userData) {
  if (userData.workouts.length === 0) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workoutDates = new Set(
    userData.workouts.map((w) => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let currentStreak = 0;
  let checkDate = new Date(today);

  while (workoutDates.has(checkDate.getTime())) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  userData.streaks.currentStreak = currentStreak;
  userData.streaks.lastWorkoutDate = new Date(Math.max(...Array.from(workoutDates)));

  if (currentStreak > userData.streaks.longestStreak) {
    userData.streaks.longestStreak = currentStreak;
  }
}

module.exports = {
  logWorkout,
  logWeight,
  logCalorie,
  getWorkouts,
  getWeights,
  getCalories,
  getUserFitnessData,
  getWeeklySummary,
  getMonthlyProgress,
  initializeUserFitnessData
};
