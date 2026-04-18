const { sendSuccess, sendError } = require('../utils/responseHandler');
const reviewModel = require('../models/reviewModel');

async function getGymReviews(req, res) {
  try {
    const { gymId } = req.params;
    const reviews = reviewModel.getReviewsByGymId(gymId);
    return sendSuccess(res, reviews, 'Reviews fetched successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

async function createReview(req, res) {
  try {
    const { gymId, rating, comment } = req.body;

    if (!gymId || !rating || !comment) {
      return sendError(res, 'gymId, rating and comment are required', 400);
    }

    const review = reviewModel.addReview(req.body);
    return sendSuccess(res, review, 'Review added successfully', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  getGymReviews,
  createReview
};
