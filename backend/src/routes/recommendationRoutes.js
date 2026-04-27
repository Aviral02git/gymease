const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

/**
 * GET /api/recommendations
 * Get smart gym recommendations
 * Query params:
 *   - budget: number (default: 3000)
 *   - goals: string or comma-separated (default: 'general fitness')
 *   - preferredTime: 'morning' | 'afternoon' | 'evening' | 'night' (default: 'evening')
 *   - maxDistance: number in km (default: 10)
 *   - latitude: number (optional)
 *   - longitude: number (optional)
 *   - city: string (optional)
 */
router.get('/', recommendationController.getRecommendations);

/**
 * GET /api/recommendations/:gymId
 * Get detailed recommendation info for a specific gym
 */
router.get('/:gymId', recommendationController.getRecommendationDetails);

module.exports = router;
