import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'star' },
  iconColor: { type: String, default: 'text-yellow-500' },
  iconBg: { type: String, default: 'bg-yellow-100' },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  points: { type: Number, default: 100 },
  earnedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);