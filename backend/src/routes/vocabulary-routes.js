import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllVocabularyContent,
  getVocabularyById,
  submitVocabularyAnswers,
  getVocabularyProgress,
} from "../controllers/vocabulary.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllVocabularyContent);
router.get("/progress", getVocabularyProgress);
router.get("/:id", getVocabularyById);
router.post("/:id/submit", submitVocabularyAnswers);

export default router;