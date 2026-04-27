/**
 * Gym Comparison Model
 * Handles side-by-side comparison of gyms
 */

const { v4: uuidv4 } = require('uuid');

// Feature categories for comparison
const COMPARISON_FEATURES = {
  pricing: {
    name: 'Pricing',
    items: ['Monthly Price', 'Annual Discount', 'Trial Fee']
  },
  facilities: {
    name: 'Facilities',
    items: ['Cardio Equipment', 'Strength Training', 'Yoga Area', 'Swimming Pool', 'Sauna', 'Locker Rooms']
  },
  services: {
    name: 'Services',
    items: ['Personal Trainer', 'Group Classes', 'Nutrition Guidance', 'Progress Tracking']
  },
  amenities: {
    name: 'Amenities',
    items: ['WiFi', 'Parking', 'Shower Facilities', 'Lounge Area']
  },
  reputation: {
    name: 'Reputation',
    items: ['Rating', 'Reviews Count', 'Member Testimonials']
  }
};

/**
 * Compare multiple gyms
 * @param {Array} gymIds - Array of gym IDs to compare (2-3 gyms)
 * @param {Array} gymsData - Array of gym data objects
 * @returns {Object} Comparison data with all features
 */
function compareGyms(gymIds, gymsData) {
  if (!Array.isArray(gymIds) || gymIds.length < 2 || gymIds.length > 3) {
    throw new Error('Please select 2 or 3 gyms to compare');
  }

  // Build map for quick lookup
  const gymMap = {};
  gymsData.forEach(gym => {
    gymMap[gym.id] = gym;
  });

  const selectedGyms = gymIds
    .map(id => gymMap[id])
    .filter(g => g !== undefined);

  // If no gyms found, throw error
  if (selectedGyms.length === 0) {
    throw new Error('No valid gyms found');
  }

  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    gyms: selectedGyms.map(gym => formatGymForComparison(gym)),
    features: buildComparisonMatrix(selectedGyms),
    summary: generateComparisonSummary(selectedGyms)
  };
}

/**
 * Format gym data for comparison
 * @param {Object} gym - Gym object
 * @returns {Object} Formatted gym with relevant fields
 */
function formatGymForComparison(gym) {
  return {
    id: gym.id,
    name: gym.name,
    location: gym.location,
    city: gym.city,
    monthlyPrice: gym.monthlyPrice || gym.tier,
    rating: gym.rating || 4.5,
    reviews: gym.reviews || 0,
    image: gym.image || 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=900',
    tags: gym.tags || []
  };
}

/**
 * Build feature comparison matrix
 * @param {Array} gyms - Selected gyms
 * @returns {Object} Feature comparison data
 */
function buildComparisonMatrix(gyms) {
  const comparison = {};

  Object.keys(COMPARISON_FEATURES).forEach(category => {
    comparison[category] = {
      name: COMPARISON_FEATURES[category].name,
      features: COMPARISON_FEATURES[category].items.map(feature => ({
        name: feature,
        values: gyms.map(gym => getFeatureValue(gym, category, feature))
      }))
    };
  });

  return comparison;
}

/**
 * Get feature value for a gym
 * @param {Object} gym - Gym object
 * @param {String} category - Feature category
 * @param {String} feature - Feature name
 * @returns {Object} Feature value with status
 */
function getFeatureValue(gym, category, feature) {
  const featureMap = {
    // Pricing
    'Monthly Price': {
      value: `₹${gym.monthlyPrice || 999}`,
      status: 'available'
    },
    'Annual Discount': {
      value: gym.annualDiscount || '15%',
      status: 'available'
    },
    'Trial Fee': {
      value: `₹${gym.trialFee || 99}`,
      status: 'available'
    },
    // Facilities
    'Cardio Equipment': {
      value: gym.tags?.includes('Cardio') ? '✔' : '✘',
      status: gym.tags?.includes('Cardio') ? 'yes' : 'no'
    },
    'Strength Training': {
      value: gym.tags?.includes('Strength') ? '✔' : '✘',
      status: gym.tags?.includes('Strength') ? 'yes' : 'no'
    },
    'Yoga Area': {
      value: gym.tags?.includes('Yoga') ? '✔' : '✘',
      status: gym.tags?.includes('Yoga') ? 'yes' : 'no'
    },
    'Swimming Pool': {
      value: gym.tags?.includes('Pool') ? '✔' : '✘',
      status: gym.tags?.includes('Pool') ? 'yes' : 'no'
    },
    'Sauna': {
      value: gym.tags?.includes('Sauna') ? '✔' : '✘',
      status: gym.tags?.includes('Sauna') ? 'yes' : 'no'
    },
    'Locker Rooms': {
      value: '✔',
      status: 'yes'
    },
    // Services
    'Personal Trainer': {
      value: gym.tags?.includes('Trainer') ? '✔' : '✘',
      status: gym.tags?.includes('Trainer') ? 'yes' : 'no'
    },
    'Group Classes': {
      value: '✔',
      status: 'yes'
    },
    'Nutrition Guidance': {
      value: gym.tags?.includes('Nutrition') ? '✔' : '✘',
      status: gym.tags?.includes('Nutrition') ? 'yes' : 'no'
    },
    'Progress Tracking': {
      value: '✔',
      status: 'yes'
    },
    // Amenities
    'WiFi': {
      value: '✔',
      status: 'yes'
    },
    'Parking': {
      value: '✔',
      status: 'yes'
    },
    'Shower Facilities': {
      value: '✔',
      status: 'yes'
    },
    'Lounge Area': {
      value: gym.tags?.includes('Lounge') ? '✔' : '✘',
      status: gym.tags?.includes('Lounge') ? 'yes' : 'no'
    },
    // Reputation
    'Rating': {
      value: `${gym.rating || 4.5}⭐`,
      status: 'available'
    },
    'Reviews Count': {
      value: `${gym.reviews || 120}+`,
      status: 'available'
    },
    'Member Testimonials': {
      value: '✔',
      status: 'yes'
    }
  };

  return featureMap[feature] || { value: '-', status: 'unknown' };
}

/**
 * Generate comparison summary with recommendations
 * @param {Array} gyms - Selected gyms
 * @returns {Object} Summary with pros and cons
 */
function generateComparisonSummary(gyms) {
  const summary = gyms.map(gym => ({
    id: gym.id,
    name: gym.name,
    pros: generatePros(gym),
    cons: generateCons(gym),
    bestFor: determineBestFor(gym)
  }));

  return summary;
}

/**
 * Generate pros for a gym
 * @param {Object} gym - Gym object
 * @returns {Array} List of pros
 */
function generatePros(gym) {
  const pros = [];

  if (gym.rating >= 4.5) pros.push(`High rating (${gym.rating}⭐)`);
  if (gym.monthlyPrice <= 1500) pros.push('Affordable pricing');
  if (gym.tags?.includes('Trainer')) pros.push('Expert trainers available');
  if (gym.tags?.includes('Yoga')) pros.push('Yoga and flexibility classes');
  if (gym.reviews >= 100) pros.push(`${gym.reviews}+ verified reviews`);
  if (gym.tags?.includes('Pool')) pros.push('Swimming facility included');

  return pros.length > 0 ? pros : ['Good value'];
}

/**
 * Generate cons for a gym
 * @param {Object} gym - Gym object
 * @returns {Array} List of cons
 */
function generateCons(gym) {
  const cons = [];

  if (gym.rating < 4.0) cons.push('Below average rating');
  if (gym.monthlyPrice > 2500) cons.push('Premium pricing');
  if (!gym.tags?.includes('Trainer')) cons.push('Limited trainer availability');
  if (!gym.tags?.includes('Pool')) cons.push('No swimming facility');
  if (gym.reviews < 50) cons.push('Limited member reviews');

  return cons.length > 0 ? cons : [];
}

/**
 * Determine what the gym is best for
 * @param {Object} gym - Gym object
 * @returns {String} Best use case
 */
function determineBestFor(gym) {
  if (gym.tags?.includes('Yoga') && gym.tags?.includes('Meditation')) {
    return 'Wellness & Mindfulness';
  }
  if (gym.tags?.includes('Strength') && gym.rating >= 4.5) {
    return 'Serious Bodybuilding';
  }
  if (gym.monthlyPrice < 1000) {
    return 'Budget-conscious members';
  }
  if (gym.tags?.includes('Pool') && gym.tags?.includes('Trainer')) {
    return 'Complete fitness experience';
  }
  if (gym.rating >= 4.5) {
    return 'Quality & reputation';
  }
  return 'General fitness';
}

module.exports = {
  COMPARISON_FEATURES,
  compareGyms,
  formatGymForComparison,
  buildComparisonMatrix,
  generateComparisonSummary
};
