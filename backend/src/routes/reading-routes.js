import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllReadingContent,
  getReadingById,
  submitReadingAnswers,
  getReadingProgress,
} from "../controllers/reading.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllReadingContent);
router.get("/progress", getReadingProgress);
router.get("/:id", getReadingById);
router.post("/:id/submit", submitReadingAnswers);

export default router;