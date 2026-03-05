const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Route mapping to the controller function
// The base URL in app.js will be '/api/cards', so this becomes '/api/cards/random'
router.get('/random', cardController.getRandomCards);

module.exports = router