import mongoose from 'mongoose';

const listeningProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListeningContent',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Each user can have only one progress record per content item
listeningProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model('ListeningProgress', listeningProgressSchema);
