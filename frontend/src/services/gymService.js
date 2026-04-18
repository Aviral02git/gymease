import api from './api';

const gymService = {
  async getGyms(query = '') {
    const response = await api.get('/gyms', { params: { q: query } });
    return response.data?.data || [];
  },

  async getGymById(gymId) {
    const response = await api.get(`/gyms/${gymId}`);
    return response.data?.data || null;
  }
};

export default gymService;
