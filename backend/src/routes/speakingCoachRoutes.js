import express from "express";
import { chatWithSpeakingCoach } from "../controllers/speakingCoachController.js";

const router = express.Router();

/**
 * @route   POST /api/speaking-coach/chat
 * @desc    Get AI-generated feedback and grammar correction for a spoken sentence
 * @access  Public
 */
router.post("/chat", chatWithSpeakingCoach);

export default router;