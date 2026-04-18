const express = require('express');
const discoveryController = require('../controllers/discoveryController');

const router = express.Router();

router.get('/places', discoveryController.getDiscoveredPlaces);

module.exports = router;
