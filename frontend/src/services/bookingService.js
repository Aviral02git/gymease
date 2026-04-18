import api from './api';

const bookingService = {
  async createTrialBooking(payload) {
    const response = await api.post('/bookings/trial', payload);
    return response.data?.data || null;
  },

  async getGymBookings(gymId) {
    const response = await api.get(`/bookings/gym/${gymId}`);
    return response.data?.data || [];
  }
};

export default bookingService;
