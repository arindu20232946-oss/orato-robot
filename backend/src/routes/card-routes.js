import express from 'express';
import { getRandomCards } from '../controllers/card-controller.js';

const router = express.Router();

// Route mapping to the controller function
// The base URL in server.js will be '/api/cards', so this becomes '/api/cards/random'
router.get('/random', getRandomCards);

export default router;