import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  description: { type: String, default: '' },
  icon: { type: String, default: '📝' },
  iconBg: { type: String, default: 'bg-blue-100' },
  timeLimit: { type: Number, default: 10 },
  points: { type: Number, default: 50 },
  questions: [questionSchema]
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);