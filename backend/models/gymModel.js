const { v4: uuidv4 } = require('uuid');

const gyms = [
  {
    id: 'gym-1',
    name: 'Iron Pulse Fitness',
    description: 'Strength and conditioning center with expert trainers.',
    address: '21 Park Street',
    city: 'Bengaluru',
    state: 'KA',
    trialFee: 99,
    availableTrialSlots: ['6:00 AM - 7:00 AM', '8:00 AM - 9:00 AM', '5:00 PM - 6:00 PM', '7:00 PM - 8:00 PM']
  },
  {
    id: 'gym-2',
    name: 'FlexZone Studio',
    description: 'Premium gym with group classes and nutrition support.',
    address: '9 Residency Road',
    city: 'Bengaluru',
    state: 'KA',
    trialFee: 149,
    availableTrialSlots: ['7:00 AM - 8:00 AM', '9:00 AM - 10:00 AM', '4:00 PM - 5:00 PM', '6:30 PM - 7:30 PM']
  }
];

function getAllGyms(query = '') {
  if (!query) return gyms;
  const normalized = query.toLowerCase();
  return gyms.filter(
    (gym) =>
      gym.name.toLowerCase().includes(normalized) ||
      gym.city.toLowerCase().includes(normalized)
  );
}

function getGymById(id) {
  return gyms.find((gym) => gym.id === id) || null;
}

function createGym(payload) {
  const newGym = {
    id: uuidv4(),
    name: payload.name,
    description: payload.description || '',
    address: payload.address || '',
    city: payload.city || '',
    state: payload.state || '',
    trialFee: Number(payload.trialFee || 99),
    availableTrialSlots: Array.isArray(payload.availableTrialSlots) && payload.availableTrialSlots.length
      ? payload.availableTrialSlots
      : ['6:00 AM - 7:00 AM', '8:00 AM - 9:00 AM', '5:00 PM - 6:00 PM', '7:00 PM - 8:00 PM']
  };

  gyms.push(newGym);
  return newGym;
}

module.exports = {
  getAllGyms,
  getGymById,
  createGym
};
