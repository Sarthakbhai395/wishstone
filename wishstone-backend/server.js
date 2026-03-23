require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const { apiLimiter, authLimiter, errorHandler, notFound } = require("./middleware/security");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// ─── SECURITY HEADERS ────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // allow image/file serving
}));

// ─── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return cb(null, true);
    if (!isProd || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── COMPRESSION ─────────────────────────────────────────────
app.use(compression());

// ─── REQUEST LOGGING ─────────────────────────────────────────
app.use(morgan(isProd ? "combined" : "dev", {
  skip: (req) => req.url === "/health",
}));

// ─── BODY PARSING ────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── NOSQL INJECTION SANITIZE ────────────────────────────────
app.use(mongoSanitize());

// ─── STATIC FILES ────────────────────────────────────────────
app.use("/uploads", express.static("uploads"));

// Serve frontend build if it exists
const frontendBuild = path.join(__dirname, "../wishstone-frontend/build");
if (require("fs").existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
}

// Silence favicon 404
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ─── RATE LIMITING ───────────────────────────────────────────
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ─── ROUTES ──────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/products",   require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/wishlist",   require("./routes/wishlist"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/coupons",    require("./routes/coupons"));
app.use("/api/admin",      require("./routes/admin"));

app.get("/", (req, res) => res.json({ status: "🔮 Wishstone API Running", version: "1.0.0" }));

// ─── FRONTEND CATCH-ALL (SPA) ─────────────────────────────────
const frontendIndex = path.join(__dirname, "../wishstone-frontend/build/index.html");
if (require("fs").existsSync(frontendIndex)) {
  app.get(/^(?!\/api|\/uploads|\/health).*/, (req, res) => res.sendFile(frontendIndex));
}

// ─── 404 + ERROR HANDLERS ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── DATABASE ────────────────────────────────────────────────
const connectDB = async () => {
  const mongoOptions = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  const atlasURI = process.env.MONGO_URI;
  const localURI = "mongodb://localhost:27017/wishstone";

  // Try Atlas
  if (atlasURI && atlasURI.includes("mongodb+srv")) {
    try {
      console.log("🔄 Connecting to MongoDB Atlas...");
      await mongoose.connect(atlasURI, mongoOptions);
      console.log("✅ MongoDB Atlas Connected");
      return;
    } catch (err) {
      console.warn("⚠️  Atlas failed:", err.message.split("\n")[0]);
      if (err.message.includes("Could not connect") || err.message.includes("ENOTFOUND")) {
        console.warn("💡 Fix: Go to https://cloud.mongodb.com → Network Access → Add 0.0.0.0/0");
      }
      console.warn("🔄 Falling back to local MongoDB...");
    }
  }

  // Fallback to local MongoDB — server stays running
  try {
    await mongoose.connect(localURI, { ...mongoOptions, serverSelectionTimeoutMS: 3000 });
    console.log("✅ Local MongoDB Connected (localhost:27017)");
  } catch {
    // No local MongoDB either — run without DB (limited functionality)
    console.warn("⚠️  No MongoDB available. Server running without database.");
    console.warn("   → Fix Atlas: https://cloud.mongodb.com → Network Access → Add 0.0.0.0/0");
  }
};

// ─── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });

  // ─── GRACEFUL SHUTDOWN ──────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
      console.log("👋 Server shut down cleanly");
      process.exit(0);
    });
    // Force exit after 10s if graceful shutdown hangs
    setTimeout(() => { console.error("⛔ Forced exit after timeout"); process.exit(1); }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  // Unhandled promise rejections
  process.on("unhandledRejection", (reason) => {
    console.error("⛔ Unhandled Rejection:", reason);
    if (isProd) shutdown("unhandledRejection");
  });
};

startServer();
