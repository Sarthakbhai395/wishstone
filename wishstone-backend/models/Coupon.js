const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true },
  discountType:  { type: String, enum: ["flat", "percentage"], default: "flat" },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount:   { type: Number },
  usageLimit:    { type: Number, default: null },
  usedCount:     { type: Number, default: 0 },
  expiresAt:     { type: Date },
  isActive:      { type: Boolean, default: true },
  description:   { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
