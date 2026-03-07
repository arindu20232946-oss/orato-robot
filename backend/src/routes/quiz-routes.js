import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  getResults,
  getRecommended
} from '../controllers/quiz.controller.js';

const router = express.Router();

// All quiz routes require authentication
router.use(protect);

// Important: /results and /recommended must come BEFORE /:id
// otherwise express will treat "results" as an id
router.get('/', getAllQuizzes);
router.get('/results', getResults);
router.get('/recommended', getRecommended);
router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);

export default router;