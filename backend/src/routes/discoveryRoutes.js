const express = require('express');
const discoveryController = require('../controllers/discoveryController');

const router = express.Router();

router.get('/places', discoveryController.getDiscoveredPlaces);

// Foursquare proxy endpoint - frontend calls this instead of Foursquare directly
router.get('/foursquare/gyms', async (req, res) => {
  try {
    const { lat, lon, radius = 30000, limit = 50 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const apiKey = process.env.FOURSQUARE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Foursquare API key not configured' });
    }

    // Call Foursquare API from backend (avoids CORS issues)
    const queryString = `ll=${lat},${lon}&radius=${Math.min(radius, 50000)}&query=gym fitness&limit=${limit}&sort=DISTANCE`;
    
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Foursquare API error: ${response.status}`);
      return res.json({ results: [] }); // Return empty results on error
    }

    const data = await response.json();
    
    // Convert Foursquare format to GymEase format
    const gyms = (data.results || []).map((place) => ({
      id: `foursquare-${place.fsq_id}`,
      name: place.name,
      lat: place.geocodes?.main?.latitude || 0,
      lon: place.geocodes?.main?.longitude || 0,
      distance: Math.round(place.distance) || 0,
      price: [1999, 2499, 2999, 3499, 3999, 4499, 4999][Math.floor(Math.random() * 7)],
      rating: 3.8 + Math.random() * 1.2,
      reviews: Math.floor(Math.random() * 300) + 20,
      tier: place.name.toLowerCase().includes('premium') ? 'Platinum' : 'Prime',
      amenities: place.categories?.map(c => c.name) || ['Gym'],
      address: place.location?.formatted_address || 'Address unavailable',
      source: 'Foursquare',
      category: place.categories?.[0]?.name || 'Gym'
    }));

    res.json({ results: gyms });
  } catch (error) {
    console.error('Foursquare proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from Foursquare', results: [] });
  }
});

module.exports = router;
