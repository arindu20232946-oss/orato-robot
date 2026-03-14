import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["mcq", "writing"] },
  selectedAnswer: { type: String }, // for MCQ
  writtenAnswer: { type: String },  // for writing
  isCorrect: { type: Boolean },     // for MCQ only
});

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  readingContentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReadingContent",
    required: true,
  },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  order: { type: Number },
  completed: { type: Boolean, default: false },
  score: { type: Number, default: 0 },        // MCQ score percentage
  totalMcq: { type: Number, default: 0 },
  correctMcq: { type: Number, default: 0 },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ReadingProgress", readingProgressSchema);