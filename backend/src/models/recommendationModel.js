/**
 * Recommendation Model
 * Calculates gym scores based on user preferences
 */

const gymModel = require('./gymModel');
const { distanceInKm } = require('../utils/helpers');

/**
 * Calculate facilities match score (0-100)
 * @param {Array} userGoals - User's fitness goals
 * @param {Array} gymFacilities - Available facilities
 * @returns {number}
 */
function calculateFacilitiesScore(userGoals, gymFacilities) {
  if (!userGoals?.length || !gymFacilities?.length) {
    return 50; // Neutral score if no data
  }

  const facilitiesMap = {
    'weight loss': ['cardio', 'elliptical', 'treadmill', 'swimming pool', 'group fitness'],
    'muscle gain': ['free weights', 'dumbbells', 'barbell', 'cable machine', 'bench press'],
    'flexibility': ['yoga studio', 'stretching area', 'pilates studio', 'foam roller'],
    'endurance': ['cycling', 'rowing machine', 'swimming pool', 'track'],
    'general fitness': ['cardio', 'free weights', 'group fitness', 'locker room']
  };

  let matchCount = 0;
  let totalRequired = 0;

  userGoals.forEach((goal) => {
    const required = facilitiesMap[goal.toLowerCase()] || [];
    totalRequired += Math.max(required.length, 1);
    const matches = required.filter((facility) =>
      gymFacilities.some((f) => f.toLowerCase().includes(facility.toLowerCase()))
    );
    matchCount += matches.length;
  });

  return totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 50;
}

/**
 * Calculate price match score (0-100)
 * Budget vs Gym price
 * @param {number} userBudget - User's monthly budget in INR
 * @param {number} gymPrice - Gym's monthly price in INR
 * @returns {number}
 */
function calculatePriceScore(userBudget, gymPrice) {
  if (!userBudget || !gymPrice) {
    return 50;
  }

  const priceDifference = Math.abs(userBudget - gymPrice);
  const maxDifference = userBudget * 0.5; // 50% difference is acceptable

  if (priceDifference === 0) {
    return 100; // Perfect match
  }

  if (priceDifference <= maxDifference) {
    return Math.round(100 - (priceDifference / maxDifference) * 50);
  }

  return 0; // Out of budget
}

/**
 * Calculate distance score (0-100)
 * Closer distance = higher score
 * @param {number} distance - Distance in km
 * @param {number} maxDistance - User's max acceptable distance in km
 * @returns {number}
 */
function calculateDistanceScore(distance, maxDistance) {
  if (!distance || !maxDistance) {
    return 50;
  }

  if (distance > maxDistance) {
    return 0; // Too far
  }

  // Closer = better score
  return Math.round(((maxDistance - distance) / maxDistance) * 100);
}

/**
 * Calculate rating/popularity score (0-100)
 * @param {number} rating - Gym rating (0-5)
 * @param {number} reviews - Number of reviews
 * @returns {number}
 */
function calculatePopularityScore(rating, reviews) {
  const ratingScore = (rating || 4) * 20; // Convert 5-star to 100-scale
  const reviewBonus = Math.min((reviews || 0) / 100, 20); // Bonus for reviews (max 20)
  return Math.min(ratingScore + reviewBonus, 100);
}

/**
 * Calculate time preference score (0-100)
 * Check if gym operating hours match user's preferred time
 * @param {string} preferredTime - 'morning', 'afternoon', 'evening', 'night'
 * @param {Array} operatingHours - Gym operating hours (e.g., ['6:00 AM - 11:00 PM'])
 * @returns {number}
 */
function calculateTimeScore(preferredTime, operatingHours) {
  if (!preferredTime || !operatingHours?.length) {
    return 50; // Neutral score
  }

  const timeRanges = {
    morning: { start: 5, end: 12 }, // 5 AM to 12 PM
    afternoon: { start: 12, end: 17 }, // 12 PM to 5 PM
    evening: { start: 17, end: 21 }, // 5 PM to 9 PM
    night: { start: 21, end: 24 } // 9 PM to midnight
  };

  const preferredRange = timeRanges[preferredTime.toLowerCase()];
  if (!preferredRange) {
    return 50;
  }

  // Simple check: see if operating hours cover the preferred time
  const hasMatch = operatingHours.some((hours) => {
    const parts = hours.split('-').map((h) => {
      const time = h.trim();
      const hour = parseInt(time.split(':')[0]);
      return hour;
    });

    if (parts.length === 2) {
      const [startHour, endHour] = parts;
      return (
        startHour <= preferredRange.start && endHour >= preferredRange.end
      );
    }
    return false;
  });

  return hasMatch ? 100 : 30;
}

/**
 * Get weighted recommendation score
 * @param {Object} gym - Gym object
 * @param {Object} preferences - User preferences
 * @returns {number}
 */
function calculateRecommendationScore(gym, preferences) {
  const {
    budget = 3000,
    goals = ['general fitness'],
    preferredTime = 'evening',
    maxDistance = 10, // km
    userLocation = null
  } = preferences;

  // Calculate individual scores
  const facilitiesScore = calculateFacilitiesScore(
    goals,
    gym.facilities || ['free weights', 'cardio']
  );

  const priceScore = calculatePriceScore(budget, gym.monthlyPrice || 2500);

  // Calculate distance score only if user location is provided
  let distanceScore = 75; // Default score if no location
  if (userLocation && gym.latitude && gym.longitude) {
    const distance = distanceInKm(
      userLocation.latitude,
      userLocation.longitude,
      gym.latitude,
      gym.longitude
    );
    distanceScore = calculateDistanceScore(distance, maxDistance);
  }

  const timeScore = calculateTimeScore(
    preferredTime,
    gym.availableTrialSlots || gym.operatingHours || []
  );

  const popularityScore = calculatePopularityScore(gym.rating, gym.reviews);

  // Weighted average
  // Price: 30%, Facilities: 25%, Distance: 20%, Time: 15%, Popularity: 10%
  const finalScore = Math.round(
    priceScore * 0.3 +
    facilitiesScore * 0.25 +
    distanceScore * 0.2 +
    timeScore * 0.15 +
    popularityScore * 0.1
  );

  return Math.max(0, Math.min(100, finalScore));
}

/**
 * Get gym recommendations
 * @param {Array} gyms - List of gyms to rank
 * @param {Object} preferences - User preferences
 * @returns {Array} Ranked gyms with scores
 */
function getRecommendations(gyms, preferences) {
  if (!gyms?.length) {
    return [];
  }

  const rankedGyms = gyms
    .map((gym) => ({
      ...gym,
      recommendationScore: calculateRecommendationScore(gym, preferences),
      scoreBreakdown: getScoreBreakdown(gym, preferences)
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10); // Top 10 recommendations

  return rankedGyms;
}

/**
 * Get detailed score breakdown for transparency
 * @param {Object} gym - Gym object
 * @param {Object} preferences - User preferences
 * @returns {Object} Score breakdown
 */
function getScoreBreakdown(gym, preferences) {
  const { budget = 3000, goals = ['general fitness'], preferredTime = 'evening', maxDistance = 10, userLocation = null } = preferences;

  const facilitiesScore = calculateFacilitiesScore(goals, gym.facilities || ['free weights', 'cardio']);
  const priceScore = calculatePriceScore(budget, gym.monthlyPrice || 2500);

  let distanceScore = 75;
  let distance = 'N/A';
  if (userLocation && gym.latitude && gym.longitude) {
    distance = distanceInKm(
      userLocation.latitude,
      userLocation.longitude,
      gym.latitude,
      gym.longitude
    ).toFixed(2);
    distanceScore = calculateDistanceScore(parseFloat(distance), maxDistance);
  }

  const timeScore = calculateTimeScore(preferredTime, gym.availableTrialSlots || gym.operatingHours || []);
  const popularityScore = calculatePopularityScore(gym.rating, gym.reviews);

  return {
    price: priceScore,
    facilities: facilitiesScore,
    distance: distanceScore,
    distanceKm: distance,
    time: timeScore,
    popularity: popularityScore
  };
}

module.exports = {
  calculateRecommendationScore,
  getRecommendations,
  getScoreBreakdown,
  calculateFacilitiesScore,
  calculatePriceScore,
  calculateDistanceScore,
  calculatePopularityScore,
  calculateTimeScore
};
