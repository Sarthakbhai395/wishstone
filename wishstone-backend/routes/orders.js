const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { protect } = require("../middleware/auth");

router.post("/create", async (req, res) => {
  try {
    const { customer, shippingAddress, items, couponCode, paymentMethod } = req.body;
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product not found.` });
      orderItems.push({ product: product._id, name: product.name, image: product.images?.[0] || "", price: product.price, quantity: item.quantity });
      subtotal += product.price * item.quantity;
    }
    const shippingCost = subtotal >= 999 ? 0 : 99;
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt)) {
        discount = coupon.discountType === "flat" ? coupon.discountValue : (subtotal * coupon.discountValue) / 100;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }
    const totalAmount = Math.max(0, subtotal + shippingCost - discount);
    const order = await Order.create({ customer, shippingAddress, items: orderItems, subtotal, shippingCost, discount, totalAmount, couponCode, paymentMethod, statusHistory: [{ status: "pending", note: "Order placed" }] });
    for (const item of items) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity, totalSold: item.quantity } });
    res.status(201).json({ success: true, message: "Order placed! 🌙", order: { _id: order._id, orderNumber: order.orderNumber, totalAmount } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ "customer.email": req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
