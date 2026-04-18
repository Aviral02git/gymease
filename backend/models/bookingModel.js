const { v4: uuidv4 } = require('uuid');
const gymModel = require('./gymModel');

const bookings = [];

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function getBookingsByGymId(gymId) {
  return bookings.filter((booking) => booking.gymId === gymId);
}

function getBookingByGymAndEmail(gymId, email) {
  const normalizedEmail = normalizeEmail(email);
  return bookings.find(
    (booking) => booking.gymId === gymId && booking.userEmail === normalizedEmail
  ) || null;
}

function createTrialBooking(payload) {
  const gym = gymModel.getGymById(payload.gymId);

  if (!gym) {
    const error = new Error('Gym not found');
    error.status = 404;
    throw error;
  }

  const normalizedEmail = normalizeEmail(payload.userEmail);

  if (!normalizedEmail) {
    const error = new Error('userEmail is required');
    error.status = 400;
    throw error;
  }

  if (!payload.slot) {
    const error = new Error('slot is required');
    error.status = 400;
    throw error;
  }

  const allowedSlots = gym.availableTrialSlots || [];
  const normalizedSlot = String(payload.slot).trim();
  const slotExists = allowedSlots.includes(normalizedSlot);

  if (!slotExists) {
    const error = new Error('Selected slot is not available for this gym');
    error.status = 400;
    throw error;
  }

  const duplicate = getBookingByGymAndEmail(payload.gymId, normalizedEmail);
  if (duplicate) {
    const error = new Error('Trial already booked for this gym by this user');
    error.status = 409;
    throw error;
  }

  const feeAmount = Number(gym.trialFee || 0);
  const newBooking = {
    id: uuidv4(),
    gymId: payload.gymId,
    gymName: gym.name,
    userEmail: normalizedEmail,
    userName: payload.userName || 'Anonymous',
    slot: normalizedSlot,
    visitDate: payload.visitDate || '',
    feeAmount,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  return newBooking;
}

module.exports = {
  getBookingsByGymId,
  getBookingByGymAndEmail,
  createTrialBooking
};
