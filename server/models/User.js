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

  // MODIFIED: Password is now optional for OAuth users
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"]
  },

  // ADDED: Track authentication method
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
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
    type: [String],
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
      completed: { type: Boolean, default: false }
    }
  ],

  // 🪞 AI reflection memory
  aiSummary: {
    type: String,
    default: ""
  },

  // 📝 Optional feedback logs
  feedbackHistory: [
    {
      topic: String,
      subtopic: String,
      feedback: String,
      difficulty: { type: String, enum: ["too easy", "just right", "too hard"] },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// ===== CUSTOM VALIDATION =====
userSchema.pre('validate', function(next) {
  // Only validate password for local auth users
  if (this.authProvider === 'local') {
    // Check if password exists and meets length requirement
    if (!this.password || this.password.length < 6) {
      const err = new mongoose.Error.ValidationError(this);
      err.addError('password', new mongoose.Error.ValidatorError({
        message: 'Password is required and must be at least 6 characters for email/password users',
        type: 'minlength',
        path: 'password',
        value: this.password
      }));
      return next(err);
    }
  }
  
  // For OAuth users, password can be null
  next();
});

// ===== PASSWORD HASHING =====
userSchema.pre('save', async function (next) {
  // Only hash password if it exists and is modified
  if (this.password && this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// ===== INSTANCE METHODS =====

// Hide password when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Check if user has a password set
userSchema.methods.hasPassword = function() {
  return !!this.password && this.authProvider === 'local';
};

// Set password for Google OAuth users
userSchema.methods.setPassword = async function(newPassword) {
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  this.password = newPassword;
  this.authProvider = 'local'; // Change to local auth after setting password
  await this.save();
  return true;
};

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  // If user doesn't have a password (Google OAuth user)
  if (!this.password) {
    return false;
  }
  
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user needs password setup (Google OAuth user without password)
userSchema.methods.needsPasswordSetup = function() {
  return this.authProvider === 'google' && !this.password;
};

const User = mongoose.model('User', userSchema);
module.exports = User;