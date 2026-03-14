import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getLevels,
  getQuestions,
  submitAnswers,
  getProgress
} from '../controllers/grammar.controller.js';

const router = express.Router();

router.use(protect);

router.get('/levels', getLevels);
router.get('/levels/:level', getQuestions);
router.post('/levels/:level/submit', submitAnswers);
router.get('/progress', getProgress);

export default router;
