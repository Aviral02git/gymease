import api from './api';

export const comparisonService = {
  /**
   * Compare gyms
   * @param {Array} gymIds - IDs of gyms to compare
   * @returns {Promise}
   */
  compareGyms: (gymIds) =>
    api.post('/comparison', { gymIds }),

  /**
   * Get comparison features
   * @returns {Promise}
   */
  getComparisonFeatures: () =>
    api.get('/comparison/features')
};
