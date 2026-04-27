const { sendError, sendSuccess } = require('../utils/responseHandler');
const { discoverPlaces } = require('../utils/discoveryProvider');

async function getDiscoveredPlaces(req, res) {
  try {
    const { city = '', lat, lon, radius = 12000, limit = 40 } = req.query;

    if (!city && (!lat || !lon)) {
      return sendError(res, 'Provide either city or lat/lon query params', 400);
    }

    const places = await discoverPlaces({ city, lat, lon, radius, limit });
    return sendSuccess(res, places, 'Places discovered successfully');
  } catch (error) {
    return sendError(res, error.message || 'Unable to discover places', 500);
  }
}

module.exports = {
  getDiscoveredPlaces
};
