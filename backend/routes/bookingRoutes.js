const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/gym/:gymId', bookingController.getGymBookings);
router.post('/trial', bookingController.createTrialBooking);

module.exports = router;
