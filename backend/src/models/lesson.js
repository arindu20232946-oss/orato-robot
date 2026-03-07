import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  timeLeft: { type: String, default: '0 min left' },
  totalTime: { type: Number, default: 30 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  icon: { type: String, default: '📚' },
  iconBg: { type: String, default: 'bg-green-100' },
  order: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);