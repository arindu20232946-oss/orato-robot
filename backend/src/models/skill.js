import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  color: { type: String, default: '#3B82F6' },
  details: {
    totalWords: { type: Number, default: 0 },
    masteredWords: { type: Number, default: 0 },
    totalRules: { type: Number, default: 0 },
    masteredRules: { type: Number, default: 0 },
    totalExercises: { type: Number, default: 0 },
    completedExercises: { type: Number, default: 0 },
    totalAudio: { type: Number, default: 0 },
    completedAudio: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);