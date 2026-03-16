const router = require("express").Router();
const Coupon = require("../models/Coupon");

router.post("/apply", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon code." });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: "Coupon expired." });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: "Coupon limit reached." });
    if (orderTotal < coupon.minOrderValue) return res.status(400).json({ success: false, message: `Min order ₹${coupon.minOrderValue} required.` });
    const discount = coupon.discountType === "flat" ? coupon.discountValue : Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    res.json({ success: true, discount, message: `✅ ₹${discount} off applied!` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
