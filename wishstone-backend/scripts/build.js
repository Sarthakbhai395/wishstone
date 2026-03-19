#!/usr/bin/env node
/**
 * Wishstone Backend — Production Build Script
 * Works on Windows, Mac, and Linux
 */

const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const log = (msg) => console.log(msg);
const err = (msg) => { console.error(msg); process.exit(1); };

log("\n========================================");
log("  Wishstone Backend — Production Build  ");
log("========================================\n");

// ── Step 1: Check Node version ──────────────────────────────
const [major] = process.versions.node.split(".").map(Number);
if (major < 16) err(`❌ Node.js >= 16 required. You have v${process.versions.node}`);
log(`✅ Node.js v${process.versions.node}`);

// ── Step 2: Check required files exist ──────────────────────
const required = ["server.js", "package.json", ".env"];
for (const file of required) {
  const full = path.join(__dirname, "..", file);
  if (!fs.existsSync(full)) err(`❌ Missing required file: ${file}`);
}
log("✅ Required files present");

// ── Step 3: Validate environment variables ──────────────────
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "PORT"];
const missing = requiredEnv.filter((v) => !process.env[v]);
if (missing.length) {
  err(`❌ Missing environment variables:\n   ${missing.join("\n   ")}\n\n   Copy .env.example to .env and fill in the values.`);
}
log("✅ Environment variables present");

// ── Step 4: Validate JWT_SECRET strength ────────────────────
if (process.env.JWT_SECRET.length < 32) {
  err("❌ JWT_SECRET must be at least 32 characters for security.");
}
log("✅ JWT_SECRET strength OK");

// ── Step 5: Check logs directory ────────────────────────────
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  log("✅ Created logs/ directory");
} else {
  log("✅ logs/ directory exists");
}

// ── Step 6: Check uploads directory ─────────────────────────
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  log("✅ Created uploads/ directory");
} else {
  log("✅ uploads/ directory exists");
}

// ── Done ─────────────────────────────────────────────────────
log("\n========================================");
log("  BUILD PASSED — Ready for production!  ");
log("========================================");
log("\nTo start the server:");
log("  npm start              (simple)");
log("  npm run start:prod     (with NODE_ENV=production)");
log("  npm run pm2:start      (PM2 cluster mode — recommended)\n");
