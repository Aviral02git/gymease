const express = require('express');
const coachController = require('../controllers/coachController');

const router = express.Router();

router.post('/chat', coachController.chat);

module.exports = router;
