import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  answers: [{
    questionIndex: { type: Number },
    selectedAnswer: { type: Number },
    isCorrect: { type: Boolean }
  }],
  timeTaken: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('QuizResult', quizResultSchema);