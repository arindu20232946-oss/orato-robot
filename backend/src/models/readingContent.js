import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ["mcq", "writing"], required: true },
  options: [String], // only for MCQ
  correctAnswer: { type: String }, // only for MCQ
});

const readingContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["paragraph", "poem"], required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  order: { type: Number, required: true }, // 1–10
  content: { type: String, required: true }, // the passage or poem text
  questions: [questionSchema],
  estimatedMinutes: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ReadingContent", readingContentSchema);