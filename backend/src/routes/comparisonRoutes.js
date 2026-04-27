const express = require('express');
const comparisonController = require('../controllers/comparisonController');

const router = express.Router();

// Compare gyms
router.post('/', comparisonController.compareGyms);

// Get comparison features
router.get('/features', comparisonController.getComparisonFeatures);

module.exports = router;
