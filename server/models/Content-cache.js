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
    content: {
      versions: [
        {
          version: { type: Number, required: true }, // Incremental version number
          contentType: { type: String, required: true }, // "full" or "component"
          componentName: { type: String }, // Only for component versions
          data: { type: mongoose.Schema.Types.Mixed, required: true }, // The actual content data (can be full content or component content)
          createdAt: { type: Date, default: Date.now } 
        }
      ],
      latestVersion: { type: Number, default: 0 },
      components: { type: mongoose.Schema.Types.Mixed, default: {} },
      componentVersionCounters: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    timesAccessed: { type: Number, default: 0 },
    lastAccessed: { type: Date },
  },
  {
    timestamps: true,
  }
);

contentCacheSchema.index({ userId: 1, topic: 1, subtopic: 1 }, { unique: true });

module.exports = mongoose.model("ContentCache", contentCacheSchema);