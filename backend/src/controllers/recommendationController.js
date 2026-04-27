const { sendSuccess, sendError } = require('../utils/responseHandler');
const gymModel = require('../models/gymModel');
const recommendationModel = require('../models/recommendationModel');

/**
 * Get smart gym recommendations based on user preferences
 */
async function getRecommendations(req, res) {
  try {
    const {
      budget = 3000,
      goals = 'general fitness',
      preferredTime = 'evening',
      maxDistance = 10,
      latitude,
      longitude,
      city
    } = req.query;

    // Parse goals if it's a string (comma-separated)
    const parsedGoals = Array.isArray(goals)
      ? goals
      : typeof goals === 'string'
        ? goals.split(',').map((g) => g.trim())
        : ['general fitness'];

    // Prepare user location
    let userLocation = null;
    if (latitude && longitude) {
      userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    // Get all gyms
    let gyms = gymModel.getAllGyms();

    // Filter by city if provided
    if (city) {
      gyms = gyms.filter((g) => g.city?.toLowerCase().includes(city.toLowerCase()));
    }

    // Prepare preferences
    const preferences = {
      budget: parseFloat(budget) || 3000,
      goals: parsedGoals,
      preferredTime,
      maxDistance: parseFloat(maxDistance) || 10,
      userLocation
    };

    // Get ranked recommendations
    const recommendations = recommendationModel.getRecommendations(gyms, preferences);

    return sendSuccess(
      res,
      {
        recommendations,
        preferences,
        totalGymsAnalyzed: gyms.length,
        topResult: recommendations[0] || null
      },
      'Recommendations fetched successfully'
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Get recommendation details for a specific gym
 */
async function getRecommendationDetails(req, res) {
  try {
    const { gymId } = req.params;
    const { budget = 3000, goals = 'general fitness', preferredTime = 'evening', maxDistance = 10, latitude, longitude } = req.query;

    // Get gym details
    const gym = gymModel.getGymById(gymId);
    if (!gym) {
      return sendError(res, 'Gym not found', 404);
    }

    // Parse goals
    const parsedGoals = Array.isArray(goals) ? goals : typeof goals === 'string' ? goals.split(',').map((g) => g.trim()) : ['general fitness'];

    // Prepare user location
    let userLocation = null;
    if (latitude && longitude) {
      userLocation = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    // Prepare preferences
    const preferences = {
      budget: parseFloat(budget) || 3000,
      goals: parsedGoals,
      preferredTime,
      maxDistance: parseFloat(maxDistance) || 10,
      userLocation
    };

    // Get detailed scores
    const score = recommendationModel.calculateRecommendationScore(gym, preferences);
    const scoreBreakdown = recommendationModel.getScoreBreakdown(gym, preferences);

    return sendSuccess(
      res,
      {
        gym,
        recommendationScore: score,
        scoreBreakdown,
        explanation: generateExplanation(gym, scoreBreakdown, score)
      },
      'Gym recommendation details fetched successfully'
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

/**
 * Generate human-readable explanation of the score
 */
function generateExplanation(gym, scoreBreakdown, totalScore) {
  const explanations = [];

  // Price explanation
  if (scoreBreakdown.price >= 80) {
    explanations.push(`✅ Price match: Great price point for your budget`);
  } else if (scoreBreakdown.price >= 50) {
    explanations.push(`⚠️ Price: Slightly above your budget but competitive`);
  } else if (scoreBreakdown.price > 0) {
    explanations.push(`❌ Price: Above your budget`);
  }

  // Facilities explanation
  if (scoreBreakdown.facilities >= 80) {
    explanations.push(`✅ Facilities: Excellent match for your fitness goals`);
  } else if (scoreBreakdown.facilities >= 50) {
    explanations.push(`⚠️ Facilities: Good match, though some goals may need other gyms`);
  } else {
    explanations.push(`❌ Facilities: Limited facilities for your goals`);
  }

  // Distance explanation
  if (scoreBreakdown.distance >= 80) {
    explanations.push(`✅ Distance: Very close to you (${scoreBreakdown.distanceKm} km)`);
  } else if (scoreBreakdown.distance > 0) {
    explanations.push(`⚠️ Distance: ${scoreBreakdown.distanceKm} km away`);
  }

  // Time explanation
  if (scoreBreakdown.time >= 80) {
    explanations.push(`✅ Timing: Opens during your preferred hours`);
  } else {
    explanations.push(`⚠️ Timing: Limited availability during your preferred hours`);
  }

  // Popularity explanation
  if (scoreBreakdown.popularity >= 80) {
    explanations.push(`✅ Popularity: Highly rated by members`);
  }

  return {
    summary: `${gym.name} is ${totalScore >= 70 ? 'highly recommended' : totalScore >= 50 ? 'a good option' : 'worth considering'} for you`,
    details: explanations,
    overallMatch: totalScore
  };
}

module.exports = {
  getRecommendations,
  getRecommendationDetails
};
