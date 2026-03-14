import mongoose from 'mongoose';

const grammarQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  category: {
    type: String,
    default: 'grammar'
  }
}, { timestamps: true });

grammarQuestionSchema.index({ skillLevel: 1, level: 1 });

export default mongoose.model('GrammarQuestion', grammarQuestionSchema);
