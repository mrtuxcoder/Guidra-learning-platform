const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },

  // 🎯 AI learning preferences
  learningStyle: {
    type: String,
    enum: ["visual", "practical", "theory", "conceptual", "logical"],
    default: "theory"
  },

  reasonForLearning: {
    type: String,
    trim: true,
    maxlength: 200,
    default: "“I want to build a strong foundation and actually understand what I’m learning, not just memorize it.”"
  },

  // 💪 Personalized learning tuning
  struggles: {
    type: [String], // e.g., ["Error handling", "Loops"]
    default: []
  },

  tonePreference: {
    type: String,
    default: "neutral"
  },

  difficultyPreference: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },


progress: [
  {
    topic: { type: String },
    subTopics: [
      {
        name: { type: String },
        completed: { type: Boolean, default: false },
        understandingLevel: { type: Number, min: 1, max: 5, default: 0 },
        lastReviewed: { type: Date, default: Date.now },
        generationCount: { type: Number, min: 0, max: 3, default: 0 },
        quizMark: {
          correct: { type: Number, default: 0 },
          wrong: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
          percentage: { type: Number, min: 0, max: 100, default: 0 },
          submittedAt: { type: Date, default: Date.now }
        }
      }
    ],
    overallUnderstanding: { type: Number, min: 1, max: 5, default: 3 },
    lastAccessed: { type: Date, default: Date.now },
    completed:{type: Boolean, default: false}
  }
],

  // 🪞 AI reflection memory
  aiSummary: {
    type: String,
    default: ""
  },

  // 📝 Optional feedback logs (for continuous learning)
  feedbackHistory: [
    {
      topic: String,
      subtopic: String,
      feedback: String, // e.g., “Too fast”, “More examples please”
      difficulty: { type: String, enum: ["too easy", "just right", "too hard"] },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Hide password when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
