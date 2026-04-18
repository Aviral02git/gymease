import api from './api';

export const discoveryService = {
  async discoverPlaces({ city, lat, lon, radius = 12000, limit = 40 }) {
    const params = {
      radius,
      limit
    };

    if (city) params.city = city;
    if (lat) params.lat = lat;
    if (lon) params.lon = lon;

    const response = await api.get('/discovery/places', { params });
    return response?.data?.data || [];
  }
};
