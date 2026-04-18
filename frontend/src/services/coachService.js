import api from './api';

const coachService = {
  async sendMessage(message, context = {}) {
    const response = await api.post('/coach/chat', { message, context });
    return response.data?.data || null;
  }
};

export default coachService;
