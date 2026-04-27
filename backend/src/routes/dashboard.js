const express = require('express');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const bookingModel = require('../models/bookingModel');
const db = require('../config/db');

const router = express.Router();

router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return sendError(res, 'email is required', 400);
    }

    const bookings = await bookingModel.getBookingsByUserEmail(email);

    const planResult = await db.query('SELECT * FROM user_plans WHERE user_email = $1 LIMIT 1', [email]);
    const plan = planResult.rows.length > 0 ? planResult.rows[0] : null;

    const historyResult = await db.query('SELECT * FROM workout_logs WHERE user_email = $1 ORDER BY date DESC', [email]);
    const workoutHistory = historyResult.rows;

    return sendSuccess(res, {
      bookings,
      plan: plan ? {
        tier: plan.tier,
        startedAt: plan.started_at,
        expiresAt: plan.expires_at
      } : null,
      workoutHistory: workoutHistory.map(w => ({
        id: w.id,
        type: w.type,
        duration: w.duration,
        notes: w.notes,
        gymName: w.gym_name,
        date: w.date
      }))
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return sendError(res, err.message, 500);
  }
});

// Endpoint to cancel booking
router.post('/cancel-booking', async (req, res) => {
  try {
    const { bookingId } = req.body;
    await db.query('UPDATE bookings SET status = $1 WHERE id = $2', ['cancelled', bookingId]);
    return sendSuccess(res, null, 'Booking cancelled successfully');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// Endpoint to log workout
router.post('/log-workout', async (req, res) => {
  try {
    const { email, type, duration, notes, gymName } = req.body;
    await db.query(
      'INSERT INTO workout_logs (user_email, type, duration, notes, gym_name) VALUES ($1, $2, $3, $4, $5)',
      [email, type, duration, notes, gymName]
    );
    return sendSuccess(res, null, 'Workout logged successfully');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

module.exports = router;
