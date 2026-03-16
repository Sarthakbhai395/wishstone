const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  shortDesc:     { type: String, default: "" },
  fullDesc:      { type: String, default: "" },
  suitableFor:   { type: String, default: "" },
  benefits:      [{ type: String }],
  howToUse:      { type: String, default: "" },
  price:         { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount:      { type: Number, default: 0 },
  images:        [{ type: String }],
  previewVideo:  { type: String, default: "" },
  fullVideo:     { type: String, default: "" },
  stock:         { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
  isFeatured:    { type: Boolean, default: false },
  isBestSeller:  { type: Boolean, default: false },
  totalClicks:   { type: Number, default: 0 },
  totalSold:     { type: Number, default: 0 },
  tags:          [{ type: String }],
  weight:        { type: String, default: "" },
}, { timestamps: true });

productSchema.pre("save", function (next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
