import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  word: { type: String },
  selectedAnswer: { type: String },
  correctAnswer: { type: String },
  isCorrect: { type: Boolean },
});

const vocabularyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vocabularyContentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VocabularyContent",
    required: true,
  },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  order: { type: Number },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("VocabularyProgress", vocabularyProgressSchema);