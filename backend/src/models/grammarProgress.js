import mongoose from 'mongoose';

const grammarProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  completedLevels: [{
    type: Number
  }],
  currentLevel: {
    type: Number,
    default: 1
  },
  totalScore: {
    type: Number,
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  badgeAwarded: {
    type: Boolean,
    default: false
  },
  masterBadgeAwarded: {
    type: Boolean,
    default: false
  },
  levelPoints: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

grammarProgressSchema.index({ userId: 1, skillLevel: 1 }, { unique: true });

export default mongoose.model('GrammarProgress', grammarProgressSchema);
