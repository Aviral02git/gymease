const { sendSuccess, sendError } = require('../utils/responseHandler');
const bookingModel = require('../models/bookingModel');

async function createTrialBooking(req, res) {
  try {
    const { gymId, userEmail, userName, slot, visitDate } = req.body;

    if (!gymId || !userEmail || !slot) {
      return sendError(res, 'gymId, userEmail and slot are required', 400);
    }

    const booking = bookingModel.createTrialBooking({
      gymId,
      userEmail,
      userName,
      slot,
      visitDate
    });

    return sendSuccess(res, booking, 'Trial booking confirmed', 201);
  } catch (error) {
    return sendError(res, error.message, error.status || 500);
  }
}

async function getGymBookings(req, res) {
  try {
    const { gymId } = req.params;
    const bookings = bookingModel.getBookingsByGymId(gymId);
    return sendSuccess(res, bookings, 'Bookings fetched successfully');
  } catch (error) {
    return sendError(res, error.message, error.status || 500);
  }
}

module.exports = {
  createTrialBooking,
  getGymBookings
};
