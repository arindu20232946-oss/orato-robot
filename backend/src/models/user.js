import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: false, // Optional for Google users
  },

  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  profilePicture: {
    type: String,
    default: "",
  },

  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },

  // Personal Info
  age: {
    type: Number,
  },

  nativeLanguage: {
    type: String,
    default: "Sinhala",
  },

  targetLanguage: {
    type: String,
    default: "English",
  },

  learningGoal: {
    type: String,
    enum: ["career", "travel", "education", "personal"],
    default: "personal",
  },

  dailyGoalMinutes: {
    type: Number,
    default: 15,
  },

  bio: {
    type: String,
    default: "",
  },

  goals: [goalSchema],

  skillLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },

  assessmentScore: {
    type: Number,
    default: 0,
  },

  assessmentCompleted: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpire: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  stats: {
    dayStreak: { type: Number, default: 0 },
    streakChange: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    rankPercentile: { type: Number, default: 0 },
    badgesEarned: { type: Number, default: 0 },
    badgesToNextLevel: { type: Number, default: 5 },
    lessonsDone: { type: Number, default: 0 },
    lessonsThisWeek: { type: Number, default: 0 },
    lastStreakUpdate: { type: Date, default: Date.now }
  },
});



//  FIXED: Update timestamp before saving (no next() needed)
userSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Clean API responses - hide sensitive data
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

// Mongoose creates these automatically from unique: true and sparse: true

export default mongoose.models.User || mongoose.model("User", userSchema);