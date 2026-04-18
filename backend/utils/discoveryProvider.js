const TIERS = ['Lite', 'Prime', 'Platinum'];

function hashNumber(input) {
  let hash = 0;
  const value = String(input || '');
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function inferTier(seed) {
  return TIERS[hashNumber(seed) % TIERS.length];
}

function inferMonthlyPrice(tier, seed) {
  const base = {
    Lite: 1499,
    Prime: 2999,
    Platinum: 4499
  };
  return base[tier] + (hashNumber(seed) % 10) * 100;
}

function inferRating(seed) {
  const value = 42 + (hashNumber(seed) % 8);
  return Number((value / 10).toFixed(1));
}

function inferTags(tags = {}) {
  const derived = [];

  if (tags.sport === 'yoga') derived.push('Yoga');
  if (tags.leisure === 'fitness_centre' || tags.amenity === 'gym') derived.push('Gym');
  if (tags.healthcare) derived.push('Health Center');
  if (tags.fee === 'yes') derived.push('Paid');
  if (tags.diet) derived.push('Nutrition');

  if (derived.length === 0) derived.push('Fitness');
  return derived.slice(0, 3);
}

function normalizePlace(item, fallbackCity = '') {
  const tags = item.tags || {};
  const name =
    tags.name ||
    tags.brand ||
    tags.operator ||
    (tags.sport === 'yoga' ? 'Yoga Studio' : 'Fitness Center');

  const lat = Number(item.lat || item.center?.lat || 0);
  const lon = Number(item.lon || item.center?.lon || 0);
  const city = tags['addr:city'] || tags.city || fallbackCity || 'Unknown City';
  const state = tags['addr:state'] || 'Unknown State';
  const locality = tags['addr:suburb'] || tags['addr:street'] || city;

  const seed = `${item.type}-${item.id}-${name}`;
  const tier = inferTier(seed);

  return {
    id: `osm-${item.type}-${item.id}`,
    name,
    location: `${locality}, ${city}`,
    city,
    state,
    latitude: lat,
    longitude: lon,
    monthlyPrice: inferMonthlyPrice(tier, seed),
    tier,
    rating: inferRating(seed),
    reviews: 40 + (hashNumber(seed) % 280),
    viewsPerMonth: 1500 + (hashNumber(seed) % 18000),
    peakOccupancy: 55 + (hashNumber(seed) % 40),
    isPrimeLocation: tier !== 'Lite',
    tags: inferTags(tags),
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=900',
    source: 'openstreetmap'
  };
}

async function geocodeCity(city) {
  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`;

  const response = await fetch(endpoint, {
    headers: {
      'User-Agent': 'GymEase/1.0 (discovery-service)'
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon)
  };
}

async function fetchNearbyPlaces({ lat, lon, radius = 12000, limit = 40, city = '' }) {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      way["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      relation["leisure"="fitness_centre"](around:${radius},${lat},${lon});
      node["amenity"="gym"](around:${radius},${lat},${lon});
      way["amenity"="gym"](around:${radius},${lat},${lon});
      relation["amenity"="gym"](around:${radius},${lat},${lon});
      node["sport"="fitness"](around:${radius},${lat},${lon});
      way["sport"="fitness"](around:${radius},${lat},${lon});
      node["sport"="yoga"](around:${radius},${lat},${lon});
      node["healthcare"="centre"](around:${radius},${lat},${lon});
      way["healthcare"="centre"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'User-Agent': 'GymEase/1.0 (discovery-service)'
    },
    body: overpassQuery
  });

  if (!response.ok) {
    throw new Error(`Places fetch failed with status ${response.status}`);
  }

  const payload = await response.json();
  const elements = Array.isArray(payload.elements) ? payload.elements : [];

  const unique = new Map();
  for (const item of elements) {
    const normalized = normalizePlace(item, city);
    if (!normalized.latitude || !normalized.longitude || !normalized.name) continue;
    if (!unique.has(normalized.id)) {
      unique.set(normalized.id, normalized);
    }
  }

  return Array.from(unique.values()).slice(0, limit);
}

async function discoverPlaces({ city, lat, lon, radius, limit }) {
  let resolvedLat = lat;
  let resolvedLon = lon;

  if ((!resolvedLat || !resolvedLon) && city) {
    const geocoded = await geocodeCity(city);
    if (!geocoded) {
      return [];
    }
    resolvedLat = geocoded.lat;
    resolvedLon = geocoded.lon;
  }

  if (!resolvedLat || !resolvedLon) {
    return [];
  }

  return fetchNearbyPlaces({
    lat: Number(resolvedLat),
    lon: Number(resolvedLon),
    radius: Number(radius || 12000),
    limit: Number(limit || 40),
    city
  });
}

module.exports = {
  discoverPlaces
};
