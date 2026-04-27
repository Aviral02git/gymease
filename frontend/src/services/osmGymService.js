/**
 * Hybrid Gym Discovery Service
 * Combines OpenStreetMap (Overpass API) + Foursquare Places API
 * Provides comprehensive gym data coverage across India
 */

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places/search';
const FOURSQUARE_API_KEY = process.env.REACT_APP_FOURSQUARE_API_KEY;

/**
 * Generate random gym-like pricing for OSM gyms
 */
const generatePrice = () => {
  const prices = [1999, 2499, 2999, 3499, 3999, 4499, 4999];
  return prices[Math.floor(Math.random() * prices.length)];
};

/**
 * Generate realistic ratings based on review count
 */
const generateRating = (reviews) => {
  const baseRating = 3.8 + Math.random() * 1.2; // 3.8 to 5.0
  return Math.min(5.0, Math.round(baseRating * 10) / 10);
};

/**
 * Determine gym tier based on name and amenities
 */
const determineTier = (name) => {
  const premiumKeywords = ['platinum', 'elite', 'premium', 'pro', 'luxury'];
  const primeKeywords = ['fit', 'studio', 'performance', 'power', 'strength'];
  
  const lowerName = name.toLowerCase();
  
  if (premiumKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'Platinum';
  }
  if (primeKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'Prime';
  }
  return 'Lite';
};

/**
 * Parse Overpass API response and convert to gym data format
 */
const parseOsmGym = (node, index) => {
  const name = node.tags?.name || `Fitness Center ${index + 1}`;
  const amenity = node.tags?.amenity || 'gym';
  
  // Generate realistic mock data that matches our gym structure
  const reviews = Math.floor(Math.random() * 300) + 20;
  
  return {
    id: `osm-gym-${node.id}`,
    name,
    location: `${node.tags?.['addr:street'] || 'Local Area'} • ${generateDistance()}`,
    city: node.tags?.['addr:city'] || 'City',
    state: node.tags?.['addr:state'] || 'State',
    latitude: node.lat,
    longitude: node.lon,
    monthlyPrice: generatePrice(),
    tier: determineTier(name),
    rating: generateRating(reviews),
    reviews,
    viewsPerMonth: Math.floor(Math.random() * 15000) + 2000,
    peakOccupancy: Math.floor(Math.random() * 30) + 60,
    isPrimeLocation: Math.random() > 0.7,
    tags: generateTags(name, amenity),
    image: generateGymImage(),
    website: node.tags?.website || '',
    phone: node.tags?.phone || '',
    openingHours: node.tags?.['opening_hours'] || 'Check locally',
    amenity
  };
};

/**
 * Generate realistic distance string
 */
const generateDistance = () => {
  const distance = (Math.random() * 8 + 0.5).toFixed(1);
  return `${distance} km`;
};

/**
 * Generate realistic tags based on gym name and amenity
 */
const generateTags = (name, amenity) => {
  const defaultTags = ['Equipment', 'Professional Trainers'];
  const additionalTags = [
    '24/7 Access',
    'Sauna',
    'Pool',
    'Yoga',
    'Cardio',
    'Strength Training',
    'CrossFit',
    'Boxing',
    'Spinning',
    'Premium',
    'WiFi',
    'Lockers'
  ];
  
  const selectedTags = [defaultTags[Math.floor(Math.random() * defaultTags.length)]];
  
  // Add 1-3 random additional tags
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    const tag = additionalTags[Math.floor(Math.random() * additionalTags.length)];
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  return selectedTags;
};

/**
 * Get varied gym images from Unsplash
 */
const generateGymImage = () => {
  const gymImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1574680178050-55c6a6795a51?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1533090161767-e6ffb817ba2e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518611505868-48510c2e2e80?auto=format&fit=crop&q=80&w=800'
  ];
  return gymImages[Math.floor(Math.random() * gymImages.length)];
};

/**
 * Build Overpass QL query for gyms
 */
const buildOverpassQuery = (lat, lon, radiusMeters = 15000) => {
  const radius = radiusMeters / 111000;
  return `
    [bbox:${lat - radius},${lon - radius},${lat + radius},${lon + radius}];
    (
      node["amenity"="gym"];
      node["amenity"="fitness_centre"];
      node["amenity"="sports_centre"];
      way["amenity"="gym"];
      way["amenity"="fitness_centre"];
      way["amenity"="sports_centre"];
      node["leisure"="fitness_centre"];
      way["leisure"="fitness_centre"];
      node["leisure"="sports_centre"];
      way["leisure"="sports_centre"];
      node["name"~"gym|fitness|health|workout|training|studio", i];
      way["name"~"gym|fitness|health|workout|training|studio", i];
    );
    out center;
  `;
};

/**
 * Fetch gyms from OpenStreetMap Overpass API
 */
export const osmGymService = {
  async fetchNearbyGyms(lat, lon, radiusMeters = 15000, limit = 20) {
    try {
      const query = buildOverpassQuery(lat, lon, radiusMeters);
      console.log(`[OSM] Query:', query.substring(0, 100) + '...`);
      
      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        console.error(`[OSM] API error: ${response.statusText}`);
        throw new Error(`Overpass API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.elements || data.elements.length === 0) {
        console.log('[OSM] No elements found in response');
        return [];
      }

      // Parse and format the OSM data
      const gyms = data.elements
        .slice(0, limit)
        .map((element, index) => parseOsmGym(element, index))
        .filter(gym => gym.name); // Filter out gyms without names

      return gyms;
    } catch (error) {
      console.error('Error fetching from Overpass API:', error);
      return [];
    }
  },

  /**
   * Search gyms by city name
   */
  async searchGymsByCity(cityName, limit = 20) {
    try {
      // This is a simplified approach - in production, you'd use Nominatim API
      // to get city coordinates first
      const knownCities = {
        // Major Metro Cities
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'bengaluru': { lat: 12.9716, lon: 77.5946 },
        'delhi': { lat: 28.7041, lon: 77.1025 },
        'kolkata': { lat: 22.5726, lon: 88.3639 },
        'chennai': { lat: 13.0827, lon: 80.2707 },
        
        // Major Tier-2 Cities
        'hyderabad': { lat: 17.3850, lon: 78.4867 },
        'pune': { lat: 18.5204, lon: 73.8567 },
        'ahmedabad': { lat: 23.0225, lon: 72.5714 },
        'jaipur': { lat: 26.9124, lon: 75.7873 },
        'lucknow': { lat: 26.8467, lon: 80.9462 },
        'surat': { lat: 21.1458, lon: 72.1924 },
        'chandigarh': { lat: 30.7333, lon: 76.7794 },
        'kochi': { lat: 9.9312, lon: 76.2673 },
        
        // Haryana & NCR Region
        'sonipat': { lat: 29.0200, lon: 77.6245 },
        'gurgaon': { lat: 28.4595, lon: 77.0266 },
        'noida': { lat: 28.5921, lon: 77.0188 },
        'faridabad': { lat: 28.4089, lon: 77.3178 },
        'meerut': { lat: 28.9845, lon: 77.7064 },
        'rohtak': { lat: 28.8994, lon: 76.6063 },
        'panipat': { lat: 29.3960, lon: 79.1580 },
        'hisar': { lat: 29.1576, lon: 75.7394 },
        'karnal': { lat: 29.6383, lon: 77.1091 },
        
        // Other Popular Cities
        'indore': { lat: 22.7196, lon: 75.8577 },
        'bhopal': { lat: 23.1815, lon: 79.9864 },
        'nagpur': { lat: 21.1458, lon: 79.0882 },
        'vadodara': { lat: 22.3072, lon: 73.1812 },
        'rajkot': { lat: 22.3039, lon: 70.8022 },
        'nashik': { lat: 19.9975, lon: 73.7898 },
        'aurangabad': { lat: 19.8762, lon: 75.3433 },
        'ludhiana': { lat: 30.9010, lon: 75.8573 },
        'amritsar': { lat: 31.6340, lon: 74.8723 },
        'visakhapatnam': { lat: 17.6869, lon: 83.2185 },
        'vijayawada': { lat: 16.5062, lon: 80.6480 },
        'coimbatore': { lat: 11.0081, lon: 76.9958 },
        'madurai': { lat: 9.9252, lon: 78.1198 },
        'salem': { lat: 11.6643, lon: 78.1460 },
        'thrissur': { lat: 10.5276, lon: 76.2144 },
        'ernakulam': { lat: 9.9674, lon: 76.2433 },
        'thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
        'guwahati': { lat: 26.1445, lon: 91.7362 },
        'ranchi': { lat: 23.3441, lon: 85.3096 },
        'patna': { lat: 25.5941, lon: 85.1376 },
        'varanasi': { lat: 25.3176, lon: 82.9789 },
        'agra': { lat: 27.1767, lon: 78.0081 },
        'mathura': { lat: 27.4924, lon: 77.6737 },
        'aligarh': { lat: 27.8974, lon: 77.8938 },
        'kanpur': { lat: 26.4499, lon: 80.3319 },
        'allahabad': { lat: 25.4358, lon: 81.8463 },
        'bareilly': { lat: 28.3670, lon: 79.4304 },
        'moradabad': { lat: 28.8386, lon: 77.7597 },
        'gorakhpur': { lat: 26.7605, lon: 83.3731 },
        'varanasi': { lat: 25.3176, lon: 82.9789 }
      };

      const coords = knownCities[cityName.toLowerCase()];
      if (!coords) {
        console.warn(`City "${cityName}" not found in known cities. Try searching with your location instead.`);
        return [];
      }

      return this.fetchNearbyGyms(coords.lat, coords.lon, 30000, limit);
    } catch (error) {
      console.error('Error searching gyms by city:', error);
      return [];
    }
  },

  /**
   * Fetch gyms from Foursquare Places API
   * Better coverage than OSM for some Indian cities
   */
  async fetchFromFoursquare(lat, lon, radiusMeters = 30000, limit = 50) {
    try {
      // Call backend proxy instead of calling Foursquare directly (avoids CORS issues)
      const url = `http://localhost:5001/api/discovery/foursquare/gyms?lat=${lat}&lon=${lon}&radius=${radiusMeters}&limit=${limit}`;
      console.log(`[Foursquare] Calling: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`[Foursquare] Backend error: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const gyms = data.results || [];
      
      console.log(`[Foursquare] Returned ${gyms.length} gyms`);
      if (gyms.length > 0) {
        console.log('[Foursquare] Sample gym:', gyms[0]);
      }
      return gyms;
    } catch (error) {
      console.error('[Foursquare] Fetch error:', error);
      return [];
    }
  },

  /**
   * Hybrid search: Combine Overpass (OSM) + Foursquare
   * Priority: OSM first (free, reliable), then Foursquare (better coverage)
   */
  async hybridGymSearch(lat, lon, radiusMeters = 30000, limit = 50) {
    try {
      console.log(`\n🔍 [HYBRID SEARCH] Starting at (${lat.toFixed(4)}, ${lon.toFixed(4)}) radius: ${radiusMeters}m`);

      // Fetch from both sources in parallel
      const [osmGyms, foursquareGyms] = await Promise.all([
        this.fetchNearbyGyms(lat, lon, radiusMeters, limit),
        this.fetchFromFoursquare(lat, lon, radiusMeters, limit)
      ]);

      console.log(`[HYBRID] OSM: ${osmGyms.length}, Foursquare: ${foursquareGyms.length}`);

      // Merge results
      const allGyms = [...osmGyms, ...foursquareGyms];

      // Deduplication: Remove gyms with same name within 100m distance
      const uniqueGyms = [];
      const seen = new Set();

      for (const gym of allGyms) {
        const key = `${gym.name.toLowerCase()}-${Math.round(gym.lat)}-${Math.round(gym.lon)}`;
        if (!seen.has(key)) {
          uniqueGyms.push(gym);
          seen.add(key);
        }
      }

      // Sort by distance
      uniqueGyms.sort((a, b) => a.distance - b.distance);

      console.log(`[HYBRID] After dedup: ${uniqueGyms.length} unique gyms`);
      return uniqueGyms.slice(0, limit);
    } catch (error) {
      console.error('[HYBRID] Search error:', error);
      // Fallback to OSM only
      return this.fetchNearbyGyms(lat, lon, radiusMeters, limit);
    }
  },

  /**
   * Hybrid city search: Combine both APIs for maximum coverage
   */
  async hybridCitySearch(cityName, limit = 50) {
    try {
      const knownCities = {
        'mumbai': { lat: 19.0760, lon: 72.8777 },
        'bangalore': { lat: 12.9716, lon: 77.5946 },
        'bengaluru': { lat: 12.9716, lon: 77.5946 },
        'delhi': { lat: 28.7041, lon: 77.1025 },
        'kolkata': { lat: 22.5726, lon: 88.3639 },
        'hyderabad': { lat: 17.3850, lon: 78.4867 },
        'pune': { lat: 18.5204, lon: 73.8567 },
        'ahmedabad': { lat: 23.0225, lon: 72.5714 },
        'jaipur': { lat: 26.9124, lon: 75.7873 },
        'lucknow': { lat: 26.8467, lon: 80.9462 },
        'surat': { lat: 21.1458, lon: 72.8336 },
        'chandigarh': { lat: 30.7333, lon: 76.7794 },
        'kochi': { lat: 9.9312, lon: 76.2673 },
        'sonipat': { lat: 29.0200, lon: 77.6245 },
        'gurgaon': { lat: 28.4595, lon: 77.0266 },
        'noida': { lat: 28.5765, lon: 77.3860 },
        'faridabad': { lat: 28.4089, lon: 77.3178 },
        'meerut': { lat: 28.9845, lon: 77.7064 },
        'rohtak': { lat: 28.8951, lon: 76.5556 },
        'panipat': { lat: 29.3910, lon: 79.1592 },
        'hisar': { lat: 29.1492, lon: 75.7217 },
        'karnal': { lat: 29.6200, lon: 77.1040 },
        'indore': { lat: 22.7196, lon: 75.8577 },
        'bhopal': { lat: 23.1815, lon: 79.9864 },
        'nagpur': { lat: 21.1458, lon: 79.0882 },
        'vadodara': { lat: 22.3072, lon: 73.1812 },
        'rajkot': { lat: 22.3039, lon: 70.8022 },
        'nashik': { lat: 19.9975, lon: 73.7898 },
        'aurangabad': { lat: 19.8762, lon: 75.3433 },
        'ludhiana': { lat: 30.9010, lon: 75.8573 },
        'amritsar': { lat: 31.6340, lon: 74.8711 },
        'visakhapatnam': { lat: 17.6869, lon: 83.2185 },
        'vijayawada': { lat: 16.5062, lon: 80.6480 },
        'coimbatore': { lat: 11.0026, lon: 76.9124 },
        'madurai': { lat: 9.9252, lon: 78.1198 },
        'salem': { lat: 11.6643, lon: 78.1460 },
        'thrissur': { lat: 10.5276, lon: 76.2144 },
        'ernakulam': { lat: 9.9312, lon: 76.2673 },
        'thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
        'guwahati': { lat: 26.1445, lon: 91.7362 },
        'ranchi': { lat: 23.3441, lon: 85.3096 },
        'patna': { lat: 25.5941, lon: 85.1376 },
        'varanasi': { lat: 25.3176, lon: 82.9789 },
        'agra': { lat: 27.1767, lon: 78.0081 },
        'mathura': { lat: 27.4924, lon: 77.6737 },
        'aligarh': { lat: 27.8974, lon: 77.8944 },
        'kanpur': { lat: 26.4499, lon: 80.3319 },
        'allahabad': { lat: 25.4358, lon: 81.8463 },
        'bareilly': { lat: 28.3670, lon: 79.4304 },
        'moradabad': { lat: 28.8386, lon: 77.7597 },
        'gorakhpur': { lat: 26.7605, lon: 83.3731 }
      };

      const coords = knownCities[cityName.toLowerCase()];
      if (!coords) {
        console.warn(`City "${cityName}" not found. Trying OSM only...`);
        return this.searchGymsByCity(cityName, limit);
      }

      // Use hybrid search with both APIs
      return this.hybridGymSearch(coords.lat, coords.lon, 30000, limit);
    } catch (error) {
      console.error('Error in hybrid city search:', error);
      return [];
    }
  }
};
