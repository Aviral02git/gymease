const { v4: uuidv4 } = require('uuid');

const reviews = [
  {
    id: 'review-1',
    gymId: 'gym-1',
    userName: 'Aviral',
    rating: 5,
    comment: 'Great trainers and excellent equipment.'
  },
  {
    id: 'review-2',
    gymId: 'gym-2',
    userName: 'Riya',
    rating: 4,
    comment: 'Clean facility and friendly staff.'
  }
];

function getReviewsByGymId(gymId) {
  return reviews.filter((review) => review.gymId === gymId);
}

function addReview(payload) {
  const newReview = {
    id: uuidv4(),
    gymId: payload.gymId,
    userName: payload.userName || 'Anonymous',
    rating: Number(payload.rating) || 0,
    comment: payload.comment || ''
  };

  reviews.push(newReview);
  return newReview;
}

module.exports = {
  getReviewsByGymId,
  addReview
};
