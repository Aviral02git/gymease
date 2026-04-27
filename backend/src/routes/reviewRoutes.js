const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/:gymId', reviewController.getGymReviews);
router.post('/', reviewController.createReview);

module.exports = router;
