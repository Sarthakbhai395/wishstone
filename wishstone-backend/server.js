require("dotenv").config();
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

// ─── 404 + ERROR HANDLERS ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── DATABASE ────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/wishstone", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
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
