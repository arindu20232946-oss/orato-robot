import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  current: { type: Number, default: 0 },
  target: { type: Number, required: true },
  points: { type: Number, default: 10 },
  type: { type: String, enum: ['lessons', 'speaking', 'vocabulary', 'quiz', 'streak'], default: 'lessons' },
  completed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Challenge', challengeSchema);