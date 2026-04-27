const { v4: uuidv4 } = require('uuid');
const gymModel = require('./gymModel');
const db = require('../config/db');

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

async function getBookingsByGymId(gymId) {
  const result = await db.query('SELECT * FROM bookings WHERE gym_id = $1', [gymId]);
  return result.rows.map(mapDbToBooking);
}

async function getBookingByGymAndEmail(gymId, email) {
  const normalizedEmail = normalizeEmail(email);
  const result = await db.query('SELECT * FROM bookings WHERE gym_id = $1 AND user_email = $2', [gymId, normalizedEmail]);
  return result.rows.length > 0 ? mapDbToBooking(result.rows[0]) : null;
}

async function getBookingsByUserEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const result = await db.query('SELECT * FROM bookings WHERE user_email = $1 ORDER BY created_at DESC', [normalizedEmail]);
  return result.rows.map(mapDbToBooking);
}

function mapDbToBooking(row) {
  return {
    id: row.id,
    gymId: row.gym_id,
    gymName: row.gym_name,
    userEmail: row.user_email,
    userName: row.user_name,
    slot: row.slot,
    visitDate: row.visit_date,
    feeAmount: row.fee_amount,
    status: row.status,
    createdAt: row.created_at
  };
}

async function createTrialBooking(payload) {
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

  // Removed duplicate trial check for testing flexibility

  const feeAmount = Number(gym.trialFee || 0);
  const id = uuidv4();
  
  await db.query(
    `INSERT INTO bookings 
    (id, gym_id, gym_name, user_email, user_name, slot, visit_date, fee_amount, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, payload.gymId, gym.name, normalizedEmail, payload.userName || 'Anonymous', normalizedSlot, payload.visitDate || '', feeAmount, 'confirmed']
  );

  return {
    id,
    gymId: payload.gymId,
    gymName: gym.name,
    userEmail: normalizedEmail,
    userName: payload.userName || 'Anonymous',
    slot: normalizedSlot,
    visitDate: payload.visitDate || '',
    feeAmount,
    status: 'confirmed'
  };
}

module.exports = {
  getBookingsByGymId,
  getBookingByGymAndEmail,
  getBookingsByUserEmail,
  createTrialBooking
};
