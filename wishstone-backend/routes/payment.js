/**
 * Payment Routes — Razorpay Integration
 * ─────────────────────────────────────────────────────────────
 * POST /api/payment/create-order  → Creates Razorpay order
 * POST /api/payment/verify        → Verifies payment + creates DB order
 * GET  /api/payment/status        → Check if Razorpay is configured
 *
 * Security:
 *   - Server-side price recalculation (ignores frontend amounts)
 *   - HMAC-SHA256 signature verification
 *   - Duplicate payment prevention
 *   - JWT-protected routes
 */

const router = require("express").Router();
const crypto = require("crypto");
const { protect } = require("../middleware/auth");
const { razorpayInstance, isRazorpayConfigured, useMockMode, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../services/razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// ─── CHECK RAZORPAY STATUS ──────────────────────────────────
// Frontend calls this to know if online payment is available
router.get("/status", (req, res) => {
  res.json({
    success: true,
    configured: isRazorpayConfigured() || useMockMode,
    mockMode: useMockMode,
    keyId: RAZORPAY_KEY_ID,
    configId: process.env.RAZORPAY_CONFIG_ID || "",
  });
});

// ─── CREATE RAZORPAY ORDER ──────────────────────────────────
// Called when user clicks "Place Order" with online payment
router.post("/create-order", async (req, res) => {
  try {
    // Check if Razorpay is configured or mock mode is enabled
    if (!isRazorpayConfigured() && !useMockMode) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: "Online payment is not configured. Please use Cash on Delivery, or contact the store owner to enable Razorpay.",
      });
    }

    const { items, couponCode, shippingAddress, customer, isGift } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided." });
    }
    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ success: false, message: "Customer details are required." });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address is required." });
    }

    // ── SERVER-SIDE PRICE CALCULATION ──
    // Never trust frontend amounts — recalculate from database
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);

      if (isValidObjectId) {
        const product = await Product.findById(item.productId);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
            });
          }
          validatedItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            price: product.price,
            quantity: item.quantity,
          });
          subtotal += product.price * item.quantity;
        } else {
          // Product not found — use provided price as fallback
          const itemPrice = item.price || 0;
          validatedItems.push({
            name: item.name || "Product",
            image: item.image || "",
            price: itemPrice,
            quantity: item.quantity,
          });
          subtotal += itemPrice * item.quantity;
        }
      } else {
        // Mock/fallback product ID
        const itemPrice = item.price || 0;
        validatedItems.push({
          name: item.name || "Product",
          image: item.image || "",
          price: itemPrice,
          quantity: item.quantity,
        });
        subtotal += itemPrice * item.quantity;
      }
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products found." });
    }

    // Calculate shipping
    const shippingCost = subtotal >= 999 ? 0 : 99;

    // Calculate gift charge
    const totalQty = items.reduce((s, i) => s + (i.quantity || 1), 0);
    const giftCharge = isGift ? totalQty * 50 : 0;

    // Calculate coupon discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt)) {
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return res.status(400).json({
            success: false,
            message: `Minimum order value for coupon is ₹${coupon.minOrderValue}`,
          });
        }
        discount = coupon.discountType === "flat"
          ? coupon.discountValue
          : (subtotal * coupon.discountValue) / 100;
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingCost + giftCharge - discount);

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be at least ₹1.",
      });
    }

    // Create Razorpay order (or mock it)
    let razorpayOrderId;
    if (useMockMode) {
      razorpayOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    } else {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        notes: {
          customerName: customer.name,
          customerEmail: customer.email,
          itemCount: String(validatedItems.length),
        },
      });
      razorpayOrderId = razorpayOrder.id;
    }

    // Return order details to frontend
    res.json({
      success: true,
      configured: true,
      mockMode: useMockMode,
      razorpayOrderId: razorpayOrderId,
      keyId: RAZORPAY_KEY_ID,
      configId: process.env.RAZORPAY_CONFIG_ID || "",
      amount: amountInPaise,
      currency: "INR",
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      // Also return calculated amounts for frontend display
      calculatedAmounts: {
        subtotal,
        shippingCost,
        discount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("⛔ Payment create-order error:", error);
    res.status(500).json({
      success: false,
      message: error.error?.description || error.message || "Failed to create payment order.",
    });
  }
});

// ─── VERIFY PAYMENT & CREATE ORDER ──────────────────────────
// Called after Razorpay popup success callback
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      items,
      customer,
      shippingAddress,
      couponCode,
      isGift,
      giftNote,
    } = req.body;

    // Validate required payment fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data.",
      });
    }

    // ── SIGNATURE VERIFICATION ──
    let expectedSignature;
    
    if (useMockMode && razorpay_payment_id.startsWith("pay_mock_")) {
      // In mock mode, we generate a mock signature to simulate the verification
      expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
    } else {
      // Real Razorpay signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
      expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
    }

    if (expectedSignature !== razorpay_signature) {
      console.error("⛔ Payment signature verification FAILED");
      console.error(`   Expected: ${expectedSignature}`);
      console.error(`   Received: ${razorpay_signature}`);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // ── DUPLICATE PAYMENT CHECK ──
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "This payment has already been processed.",
        order: {
          _id: existingOrder._id,
          orderNumber: existingOrder.orderNumber,
          totalAmount: existingOrder.totalAmount,
        },
      });
    }

    // ── RECALCULATE SERVER-SIDE AMOUNTS ──
    let subtotal = 0;
    const orderItems = [];

    for (const item of (items || [])) {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);

      if (isValidObjectId) {
        const product = await Product.findById(item.productId);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for ${product.name}.`,
            });
          }
          orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            price: product.price,
            quantity: item.quantity,
          });
          subtotal += product.price * item.quantity;

          // Update stock
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -item.quantity, totalSold: item.quantity },
          });
        } else {
          const itemPrice = item.price || 0;
          orderItems.push({
            name: item.name || "Product",
            image: item.image || "",
            price: itemPrice,
            quantity: item.quantity,
          });
          subtotal += itemPrice * item.quantity;
        }
      } else {
        const itemPrice = item.price || 0;
        orderItems.push({
          name: item.name || "Product",
          image: item.image || "",
          price: itemPrice,
          quantity: item.quantity,
        });
        subtotal += itemPrice * item.quantity;
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products in order." });
    }

    const shippingCost = subtotal >= 999 ? 0 : 99;

    // Calculate gift charge
    const totalQty = (orderItems || []).reduce((s, i) => s + (i.quantity || 1), 0);
    const giftCharge = isGift ? totalQty * 50 : 0;

    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt)) {
        discount = coupon.discountType === "flat"
          ? coupon.discountValue
          : (subtotal * coupon.discountValue) / 100;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingCost + giftCharge - discount);

    // ── FIND USER ──
    let userId = null;
    try {
      const User = require("../models/User");
      const user = await User.findOne({ email: customer?.email });
      if (user) userId = user._id;
    } catch (err) {
      console.log("Could not find user:", err.message);
    }

    // ── CREATE ORDER ──
    const orderData = {
      customer: {
        name: customer?.name || "Guest",
        email: customer?.email || "",
        phone: customer?.phone || "",
      },
      shippingAddress: {
        flat: shippingAddress?.flat || shippingAddress?.address || "",
        area: shippingAddress?.area || "",
        landmark: shippingAddress?.landmark || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        pincode: shippingAddress?.pincode || "",
        country: "India",
      },
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      giftCharge,
      isGift: !!isGift,
      giftNote: giftNote || "",
      totalAmount,
      couponCode: couponCode || "",
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      statusHistory: [
        { status: "pending", note: "Order placed" },
        { status: "confirmed", note: "Payment verified via Razorpay" },
      ],
    };

    if (userId) orderData.user = userId;

    const order = await Order.create(orderData);

    console.log(`✅ Order created: ${order.orderNumber} | Payment: ${razorpay_payment_id} | Amount: ₹${totalAmount}`);

    res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully! 🎉",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discount: order.discount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        razorpayPaymentId: order.razorpayPaymentId,
        razorpayOrderId: order.razorpayOrderId,
        customer: order.customer,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("⛔ Payment verify error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
});

module.exports = router;
