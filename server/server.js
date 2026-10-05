const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI must be configured");
}

if (!process.env.GOOGLE_CALLBACK_URL) {
  throw new Error("GOOGLE_CALLBACK_URL must be configured");
}

const passport = require("./configs/passport");
const connectDB = require("./configs/db");
const authRoutes = require("./routes/v1/auth-routes");
const userRoutes = require("./routes/v1/user-routes");
const learningRoutes = require("./routes/v1/learning-routes");
const progressRoutes = require("./routes/v1/progress-routes");
const contentRoutes = require("./routes/v1/content-routes");


const PORT = Number(process.env.PORT || 5000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

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

const isAllowedOrigin = (origin) =>
  allowedOrigins.has(normalizeOrigin(origin));

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Try again later." },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many AI requests. Try again later." },
});

app.use((req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");
  if (origin && !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: "Invalid request origin" });
  }
  return next();
});

app.use(passport.initialize());
// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (isAllowedOrigin(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn("CORS blocked an untrusted origin");
        callback(new Error("Not allowed by CORS"));
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
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(cookieParser());

// Keep development logs useful without flooding production stdout.
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API v1 Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/learning", aiLimiter, learningRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/content", aiLimiter, contentRoutes);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Guidra API is running!" });
});


// Health check
app.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "OK" : "DEGRADED",
    database: databaseReady ? "connected" : "disconnected",
  });
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

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode`);
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close(false);
      process.exit(0);
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));

  return server;
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
