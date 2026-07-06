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


const PORT = process.env.PORT || 5000;

const app = express();

const normalizeOrigin = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/\/$/, "");
};

const envOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
]
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = new Set([
  ...envOrigins,
  "https://www.guidra.tech",
  "https://guidra.tech",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
]);

app.use(passport.initialize());
// Connect to database
connectDB();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
      } else {
        if (normalizedOrigin.includes(".vercel.app")) {
          callback(null, true);
        } else {
          console.warn(`❌ CORS blocked origin: ${origin}`);
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

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Guidra API is running!" });
});


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
