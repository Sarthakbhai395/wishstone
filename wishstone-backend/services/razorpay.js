/**
 * Razorpay Service Layer
 * ─────────────────────────────────────────────────────────────
 * Initializes Razorpay instance with environment variables.
 * If credentials are missing/placeholders, it enables MOCK MODE.
 * Mock mode perfectly simulates Razorpay's API responses to
 * test the full end-to-end architecture (backend + frontend).
 *
 * ACTIVATION:
 *   1. Add real keys to .env:
 *      RAZORPAY_KEY_ID=rzp_test_xxxxx   (or rzp_live_xxxxx)
 *      RAZORPAY_KEY_SECRET=xxxxx
 *   2. Restart server
 *   3. Online payments switch to real Razorpay instantly
 */

const Razorpay = require("razorpay");

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

const PLACEHOLDER_VALUES = ["YOUR_KEY", "YOUR_SECRET", ""];

const isRazorpayConfigured = () => {
  return (
    !PLACEHOLDER_VALUES.includes(KEY_ID) &&
    !PLACEHOLDER_VALUES.includes(KEY_SECRET) &&
    KEY_ID.startsWith("rzp_")
  );
};

let razorpayInstance = null;
let useMockMode = false;

if (isRazorpayConfigured()) {
  try {
    razorpayInstance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
    console.log("✅ Razorpay initialized successfully");
    console.log(`   Mode: ${KEY_ID.includes("_test_") ? "TEST" : "LIVE"}`);
  } catch (err) {
    console.error("⛔ Razorpay init failed, falling back to Mock Mode");
    useMockMode = true;
  }
} else {
  console.log("⚠️  Razorpay keys not found — Enabling MOCK DEMO MODE");
  console.log("   (Architecture will be fully tested end-to-end)");
  useMockMode = true;
}

module.exports = {
  razorpayInstance,
  isRazorpayConfigured,
  useMockMode,
  RAZORPAY_KEY_ID: useMockMode ? "rzp_mock_demo_key" : KEY_ID,
  RAZORPAY_KEY_SECRET: useMockMode ? "mock_demo_secret_123" : KEY_SECRET,
};
