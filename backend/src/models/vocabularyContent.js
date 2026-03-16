import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  word: { type: String, required: true },
  questionText: { type: String, required: true },
  type: { type: String, default: "mcq" },
  options: [String],
  correctAnswer: { type: String, required: true },
});

const vocabularyContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  order: { type: Number, required: true },
  theme: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  estimatedMinutes: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VocabularyContent", vocabularyContentSchema);