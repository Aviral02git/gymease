const { sendSuccess, sendError } = require('../utils/responseHandler');
const gymModel = require('../models/gymModel');
const reviewModel = require('../models/reviewModel');

async function getGyms(req, res) {
  try {
    const { q = '' } = req.query;
    const gyms = gymModel.getAllGyms(q);
    return sendSuccess(res, gyms, 'Gyms fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

async function getGymById(req, res) {
  try {
    const { gymId } = req.params;
    const gym = gymModel.getGymById(gymId);

    if (!gym) {
      return sendError(res, 'Gym not found', 404);
    }

    const reviews = reviewModel.getReviewsByGymId(gymId);
    return sendSuccess(res, { ...gym, reviews }, 'Gym fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

async function createGym(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return sendError(res, 'Gym name is required', 400);
    }

    const gym = gymModel.createGym(req.body);
    return sendSuccess(res, gym, 'Gym created successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  getGyms,
  getGymById,
  createGym
};
