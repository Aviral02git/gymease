const { sendSuccess, sendError } = require('../utils/responseHandler');
const fitnessModel = require('../models/fitnessTrackerModel');

/**
 * Log a workout
 */
async function logWorkout(req, res) {
  try {
    const { userId } = req.params;
    const { date, type, duration, caloriesBurned, notes, intensity, exercises } = req.body;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    if (!type || !duration) {
      return sendError(res, 'Workout type and duration are required', 400);
    }

    const workout = fitnessModel.logWorkout(userId, {
      date,
      type,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned) || 0,
      notes,
      intensity,
      exercises
    });

    return sendSuccess(res, workout, 'Workout logged successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Log weight
 */
async function logWeight(req, res) {
  try {
    const { userId } = req.params;
    const { date, weight, unit, notes } = req.body;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    if (!weight) {
      return sendError(res, 'Weight is required', 400);
    }

    const weightEntry = fitnessModel.logWeight(userId, {
      date,
      weight: parseFloat(weight),
      unit,
      notes
    });

    return sendSuccess(res, weightEntry, 'Weight logged successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Log calorie entry
 */
async function logCalorie(req, res) {
  try {
    const { userId } = req.params;
    const { date, calories, type, meal, notes } = req.body;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    if (!calories || !type) {
      return sendError(res, 'Calories and type are required', 400);
    }

    const calorieEntry = fitnessModel.logCalorie(userId, {
      date,
      calories: parseInt(calories),
      type,
      meal,
      notes
    });

    return sendSuccess(res, calorieEntry, 'Calorie entry logged successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get user's fitness data
 */
async function getUserFitnessData(req, res) {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const fitnessData = fitnessModel.getUserFitnessData(userId);
    const workouts = fitnessModel.getWorkouts(userId, parseInt(days));
    const weights = fitnessModel.getWeights(userId, parseInt(days));
    const calories = fitnessModel.getCalories(userId, parseInt(days));

    return sendSuccess(
      res,
      {
        workouts,
        weights,
        calories,
        stats: fitnessData.stats,
        streaks: fitnessData.streaks
      },
      'Fitness data fetched successfully'
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get weekly summary
 */
async function getWeeklySummary(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const summary = fitnessModel.getWeeklySummary(userId);

    return sendSuccess(res, summary, 'Weekly summary fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get monthly progress
 */
async function getMonthlyProgress(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const progress = fitnessModel.getMonthlyProgress(userId);

    return sendSuccess(res, progress, 'Monthly progress fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get workouts
 */
async function getWorkouts(req, res) {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const workouts = fitnessModel.getWorkouts(userId, parseInt(days));

    return sendSuccess(res, { workouts, count: workouts.length }, 'Workouts fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get weights
 */
async function getWeights(req, res) {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const weights = fitnessModel.getWeights(userId, parseInt(days));

    return sendSuccess(res, { weights, count: weights.length }, 'Weights fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get calories
 */
async function getCalories(req, res) {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    if (!userId) {
      return sendError(res, 'User ID is required', 400);
    }

    const calories = fitnessModel.getCalories(userId, parseInt(days));

    return sendSuccess(res, { calories, count: calories.length }, 'Calories fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  logWorkout,
  logWeight,
  logCalorie,
  getUserFitnessData,
  getWeeklySummary,
  getMonthlyProgress,
  getWorkouts,
  getWeights,
  getCalories
};
