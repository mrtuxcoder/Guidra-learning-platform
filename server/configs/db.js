const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 20),
    minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 2),
  });
  console.log("✅ MongoDB Connected");
  return mongoose.connection;
};

module.exports = connectDB;
