const mongoose = require("mongoose");

const contentCacheSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    subtopic: {
      type: String,
      required: true,
      index: true,
    },
    learningStyle: {
      type: String,
      enum: ["visual", "practical", "theory"],
      required: true,
    },
    learningMotivation: { type: String },
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    contentFormat: {
      type: String,
      enum: [
        "comprehensive",
        "theory_only",
        "practice_only",
        "examples_only",
        "visual_heavy",
      ],
      default: "comprehensive",
    },
    // FIXED: Use Mixed type to store ANY JSON structure from AI
    content: {
      type: mongoose.Schema.Types.Mixed, // ← CHANGE THIS LINE
      required: true,
    },
    aiModelUsed: { type: String },
    aiPromptHash: { type: String },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    timesAccessed: { type: Number, default: 0 },
    lastAccessed: { type: Date },
    userRating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient cache lookups
contentCacheSchema.index({
  userId: 1,
  topic: 1,
  subtopic: 1,
  learningStyle: 1,
});

contentCacheSchema.index({
  userId: 1,
  topic: 1,
  subtopic: 1,
  learningStyle: 1,
  isActive: 1,
});

module.exports = mongoose.model("ContentCache", contentCacheSchema);
