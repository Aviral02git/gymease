const express = require('express');
const gymController = require('../controllers/gymController');

const router = express.Router();

router.get('/', gymController.getGyms);
router.get('/:gymId', gymController.getGymById);
router.post('/', gymController.createGym);

module.exports = router;
