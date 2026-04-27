const express = require('express');
const fitnessTrackerController = require('../controllers/fitnessTrackerController');

const router = express.Router();

/**
 * GET /api/fitness/:userId
 * Get all fitness data for a user
 * Query params: days (default: 30)
 */
router.get('/:userId', fitnessTrackerController.getUserFitnessData);

/**
 * POST /api/fitness/:userId/workouts
 * Log a workout
 * Body: { date, type, duration, caloriesBurned, notes, intensity, exercises }
 */
router.post('/:userId/workouts', fitnessTrackerController.logWorkout);

/**
 * GET /api/fitness/:userId/workouts
 * Get user's workout history
 * Query params: days (default: 30)
 */
router.get('/:userId/workouts', fitnessTrackerController.getWorkouts);

/**
 * POST /api/fitness/:userId/weights
 * Log weight
 * Body: { date, weight, unit, notes }
 */
router.post('/:userId/weights', fitnessTrackerController.logWeight);

/**
 * GET /api/fitness/:userId/weights
 * Get user's weight history
 * Query params: days (default: 30)
 */
router.get('/:userId/weights', fitnessTrackerController.getWeights);

/**
 * POST /api/fitness/:userId/calories
 * Log calorie entry
 * Body: { date, calories, type, meal, notes }
 */
router.post('/:userId/calories', fitnessTrackerController.logCalorie);

/**
 * GET /api/fitness/:userId/calories
 * Get user's calorie history
 * Query params: days (default: 30)
 */
router.get('/:userId/calories', fitnessTrackerController.getCalories);

/**
 * GET /api/fitness/:userId/weekly-summary
 * Get weekly summary
 */
router.get('/:userId/weekly-summary', fitnessTrackerController.getWeeklySummary);

/**
 * GET /api/fitness/:userId/monthly-progress
 * Get monthly progress
 */
router.get('/:userId/monthly-progress', fitnessTrackerController.getMonthlyProgress);

module.exports = router;
