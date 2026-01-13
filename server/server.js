const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({});

const passport = require("./configs/passport");
const connectDB = require("./configs/db");
const authRoutes = require("./routes/v1/auth-routes");
const userRoutes = require("./routes/v1/user-routes");
const learningRoutes = require("./routes/v1/learning-routes");
const progressRoutes = require("./routes/v1/progress-routes");
const contentRoutes = require("./routes/v1/content-routes");
const cacheRoute = require("./routes/v1/cache-debug");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(passport.initialize());
// Connect to database
connectDB();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:5173", // Vite default
        "http://localhost:5174",
      ];

      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        if (origin.includes(".vercel.app")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API v1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/learning", learningRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/cache", cacheRoute);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
