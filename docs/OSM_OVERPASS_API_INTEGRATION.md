# OpenStreetMap + Overpass API Integration

## Overview
GymEase now integrates with **OpenStreetMap (OSM)** and the **Overpass API** to display real, actual gym locations near the user instead of dummy data. This provides practical, location-based gym discovery.

## Features

### 1. **Real Gym Data from OpenStreetMap**
- Fetches actual gym and fitness center locations from OSM database
- Supports multiple amenity types:
  - `amenity=gym`
  - `amenity=fitness_centre`
  - `amenity=sports_centre`
  - `leisure=fitness_centre`
  - `leisure=sports_centre`

### 2. **Location-Based Discovery**
- **Geolocation**: When user enables "Use Nearby", automatically fetches gyms within 20km radius
- **City Search**: Users can search gyms by entering a city name
- Supports major Indian cities: Mumbai, Bengaluru, Delhi, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad

### 3. **Smart Data Formatting**
The service intelligently converts OSM data to match GymEase gym structure:

```javascript
{
  id: 'osm-gym-{osmNodeId}',
  name: 'Gym Name from OSM',
  location: 'Street Address • Distance',
  city: 'City from OSM',
  state: 'State from OSM',
  latitude: osmLat,
  longitude: osmLon,
  monthlyPrice: generatedPrice,    // Realistic mock pricing
  tier: 'Prime|Platinum|Lite',      // Based on gym name
  rating: 4.2-5.0,                  // Realistic ratings
  reviews: 20-300,                  // Mock review counts
  tags: ['24/7 Access', 'Sauna', ...],  // Generated tags
  image: gymImage,                  // Unsplash gym photos
  website: osmWebsite,              // From OSM tags if available
  phone: osmPhone,                  // From OSM tags if available
  openingHours: osmHours            // From OSM tags if available
}
```

## API Endpoints

### Overpass API Query
- **Endpoint**: `https://overpass-api.de/api/interpreter`
- **Method**: POST
- **Format**: Overpass Query Language (QL)

Example query for gyms:
```sql
[bbox:lat-delta,lon-delta,lat+delta,lon+delta];
(
  node["amenity"="gym"];
  way["amenity"="gym"];
  node["amenity"="fitness_centre"];
  way["amenity"="fitness_centre"];
);
out center;
```

## Service: `osmGymService.js`

### Methods

#### 1. `fetchNearbyGyms(lat, lon, radiusMeters, limit)`
Fetches gyms near user's current location.

**Parameters:**
- `lat` (number): User latitude
- `lon` (number): User longitude
- `radiusMeters` (number): Search radius in meters (default: 15000m = 15km)
- `limit` (number): Maximum gyms to return (default: 20)

**Returns:** Array of gym objects

**Example:**
```javascript
const gyms = await osmGymService.fetchNearbyGyms(
  12.9716,    // Bengaluru lat
  77.5946,    // Bengaluru lon
  20000,      // 20km radius
  50          // Max 50 gyms
);
```

#### 2. `searchGymsByCity(cityName, limit)`
Searches gyms in a specific city.

**Parameters:**
- `cityName` (string): City name (e.g., "Mumbai", "Bengaluru")
- `limit` (number): Maximum gyms to return (default: 20)

**Returns:** Array of gym objects

**Supported Cities:**
- Mumbai, Bengaluru, Delhi, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad

**Example:**
```javascript
const gyms = await osmGymService.searchGymsByCity('Mumbai', 50);
```

## Integration with FindGyms

### Automatic Discovery on Location Enable
When users click "Use Nearby":
1. Browser requests user's geolocation
2. `osmGymService.fetchNearbyGyms()` is called automatically
3. Real gyms appear in the results
4. Gyms are sorted by distance

### Manual Discovery
Users can click "Import from Maps" button:
1. Fetches gyms from user's location OR entered city name
2. Real OSM data is merged with existing GymEase gyms
3. Shows count of discovered gyms

### Combined Results
- **Platform Gyms**: GymEase-verified gyms (always shown)
- **OSM Gyms**: Real gyms from OpenStreetMap (when user imports)
- **Deduplication**: Same gym won't appear twice (checked by ID)

## Data Generation Strategy

Since OSM data doesn't include gym-specific details like pricing, ratings, or amenities, the service intelligently generates realistic data:

### Pricing
Random selection from realistic prices:
- `[1999, 2499, 2999, 3499, 3999, 4499, 4999]`

### Ratings
- Base: 3.8 to 5.0 (realistic gym ratings)
- Adjusts based on review count

### Gym Tier Classification
Based on gym name keywords:
- **Platinum**: Contains "platinum", "elite", "premium", "pro", "luxury"
- **Prime**: Contains "fit", "studio", "performance", "power", "strength"
- **Lite**: Default tier

### Tags/Amenities
Generated from:
- Default: "Equipment", "Professional Trainers"
- Random selection from: "24/7 Access", "Sauna", "Pool", "Yoga", "Cardio", "CrossFit", etc.

### Images
Randomly selected from curated Unsplash gym photos (6 variations)

## Error Handling

- **Network Error**: Returns empty array, shows message "Could not fetch gyms right now"
- **City Not Found**: Returns empty array, logs warning
- **Invalid Coordinates**: Returns empty array
- **API Timeout**: Graceful fallback to existing gym data

## Performance Considerations

- **API Rate Limiting**: Overpass API is free but rate-limited
  - Recommended: Max 1-2 requests per user per minute
  - Uses IP-based rate limiting
  
- **Response Size**: Queries return JSON with potentially 100+ gyms
  - Frontend limits to `limit` parameter (default 50)
  - Typical response: 50-200 KB

- **Caching**: Currently no caching (can be added for repeated searches)

## Future Enhancements

1. **Database Integration**: Store fetched OSM gyms to reduce API calls
2. **Real Pricing**: Partner with gyms to get real monthly pricing
3. **Member Reviews**: Allow users to review OSM-discovered gyms
4. **Amenity Details**: Fetch actual amenities from OSM tags
5. **Opening Hours**: Display real opening hours from OSM
6. **Contact Info**: Show phone and website from OSM
7. **Caching Layer**: Cache results for 24 hours to reduce API calls
8. **Filtering**: Filter by real amenities (pool, sauna, yoga, etc.)

## Testing

### Test Location Enable (Geolocation)
```javascript
// Mock user location: Bengaluru
// Click "Use Nearby" → Should fetch gyms within 20km
// Expect: ~30-50 gyms from OpenStreetMap
```

### Test City Search
```javascript
// Enter "Mumbai" in location field
// Click "Import from Maps"
// Expect: ~30-50 gyms from Mumbai
```

### Test Combined View
```javascript
// Should see both:
// 1. Platform gyms (Ironbound Elite, Zenith Active Core, etc.)
// 2. OSM gyms (real locations from OpenStreetMap)
```

## Configuration

### Change Search Radius
In `FindGyms.js`:
```javascript
// Default: 20000 meters (20km)
const discovered = await osmGymService.fetchNearbyGyms(
  coords.latitude,
  coords.longitude,
  20000,  // Change this value
  50
);
```

### Add More Cities
In `osmGymService.js`:
```javascript
const knownCities = {
  'new-city': { lat: 28.5xxx, lon: 77.2xxx },
  // Add more cities here
};
```

### Adjust Price Range
In `osmGymService.js`:
```javascript
const generatePrice = () => {
  const prices = [1999, 2499, 2999, 3499, 3999, 4499, 4999];
  // Modify array to change available prices
  return prices[Math.floor(Math.random() * prices.length)];
};
```

## Troubleshooting

### Issue: No gyms showing
- Check browser geolocation permissions
- Verify internet connection
- Try entering a city name manually

### Issue: Overpass API timeout
- Try again after a few seconds (rate limit recovery)
- Overpass API is free tier and may be slow during peak hours

### Issue: Distance calculation incorrect
- Ensure user location is enabled
- Check that gym has valid latitude/longitude

## References

- **Overpass API Docs**: https://overpass-api.de/
- **OpenStreetMap**: https://www.openstreetmap.org/
- **Overpass QL Guide**: https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide
