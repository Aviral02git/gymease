/**
 * Gym Comparison Controller
 * Handles comparison API requests
 */

const { sendSuccess, sendError } = require('../utils/responseHandler');
const comparisonModel = require('../models/comparisonModel');
const gymModel = require('../models/gymModel');

/**
 * Compare selected gyms
 * POST /api/comparison
 * Body: { gymIds: ['gym-1', 'gym-2', 'gym-3'] }
 */
async function compareGyms(req, res) {
  try {
    const { gymIds } = req.body;

    if (!gymIds || !Array.isArray(gymIds)) {
      return sendError(res, 'gymIds must be an array', 400);
    }

    if (gymIds.length < 2 || gymIds.length > 3) {
      return sendError(res, 'Select 2 or 3 gyms to compare', 400);
    }

    // Get all available gyms from model
    let allGyms = gymModel.getAllGyms();
    
    // Create a map of gym IDs to gym data for quick lookup
    const gymMap = {};
    allGyms.forEach(gym => {
      gymMap[gym.id] = gym;
    });

    // Build gym list with fallback for missing gyms
    const selectedGymsData = gymIds.map(id => {
      if (gymMap[id]) {
        return gymMap[id];
      }
      // If gym not found in model, create a minimal gym object
      // This allows frontend gyms to be compared even if backend doesn't have full data
      return {
        id,
        name: `Gym ${id}`,
        location: 'Location',
        city: 'City',
        monthlyPrice: 1000,
        rating: 4.0,
        reviews: 50,
        image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=900',
        tags: []
      };
    });

    // Create comparison using the comparison model
    const comparison = comparisonModel.compareGyms(gymIds, selectedGymsData);

    return sendSuccess(
      res,
      comparison,
      'Gyms compared successfully',
      200
    );
  } catch (error) {
    console.error('Comparison error:', error);
    return sendError(res, error.message, 400);
  }
}

/**
 * Get comparison features metadata
 * GET /api/comparison/features
 */
async function getComparisonFeatures(req, res) {
  try {
    const features = comparisonModel.COMPARISON_FEATURES;
    return sendSuccess(
      res,
      features,
      'Comparison features fetched successfully'
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  compareGyms,
  getComparisonFeatures
};
