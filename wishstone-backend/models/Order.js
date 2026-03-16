const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber:  { type: String, unique: true },
  customer: {
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age:   Number,
  },
  shippingAddress: {
    flat:     String,
    area:     String,
    landmark: String,
    city:     String,
    state:    String,
    country:  { type: String, default: "India" },
    pincode:  String,
  },
  items:         [orderItemSchema],
  subtotal:      { type: Number, required: true },
  shippingCost:  { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },
  couponCode:    { type: String, default: "" },
  paymentMethod: { type: String, enum: ["cod", "prepaid", "qr"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  orderStatus:   { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  trackingNumber: { type: String, default: "" },
  statusHistory:  [{ status: String, note: String, updatedAt: { type: Date, default: Date.now } }],
  deliveredAt:    Date,
}, { timestamps: true });

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `WS-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
