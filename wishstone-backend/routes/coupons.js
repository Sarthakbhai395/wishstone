const router = require("express").Router();
const Coupon = require("../models/Coupon");

// Shared validation logic
const validateCoupon = async (code, orderTotal) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error("Invalid coupon code.");
  if (coupon.expiresAt && new Date() > coupon.expiresAt) throw new Error("Coupon has expired.");
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon usage limit reached.");
  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) throw new Error(`Minimum order of ₹${coupon.minOrderValue} required.`);
  const discount = coupon.discountType === "flat"
    ? coupon.discountValue
    : Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
  return { discount: Math.round(discount), coupon };
};

// POST /api/coupons/apply  (original)
router.post("/apply", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required." });
    const { discount } = await validateCoupon(code, orderTotal || 0);
    res.json({ success: true, discount, message: `₹${discount} discount applied!` });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

// GET /api/coupons  (public - active coupons for promo modal)
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }]
    }).select("code discountType discountValue minOrderValue description expiresAt").sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/coupons/validate  (alias used by frontend cart)
router.post("/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required." });
    const { discount, coupon } = await validateCoupon(code, orderTotal || 0);
    res.json({
      success: true,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `₹${discount} discount applied!`,
    });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

module.exports = router;
