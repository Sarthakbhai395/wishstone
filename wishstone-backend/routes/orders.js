const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const { protect } = require("../middleware/auth");

// Create order (guest or authenticated user)
router.post("/create", async (req, res) => {
  try {
    const { customer, shippingAddress, items, couponCode, paymentMethod } = req.body;
    
    // Validate required fields
    if (!customer || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required order details." });
    }
    
    let subtotal = 0;
    const orderItems = [];
    
    // Process each item
    for (const item of items) {
      try {
        // Check if productId is a valid MongoDB ObjectId format (24 hex characters)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);
        
        if (isValidObjectId) {
          // Valid ObjectId - try to find in database
          const product = await Product.findById(item.productId);
          
          if (product) {
            // Product exists in DB - use real data
            if (product.stock < item.quantity) {
              return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
            }
            
            orderItems.push({ 
              product: product._id, 
              name: product.name, 
              image: product.images?.[0] || "", 
              price: product.price, 
              quantity: item.quantity 
            });
            subtotal += product.price * item.quantity;
            
            // Update stock
            await Product.findByIdAndUpdate(product._id, { 
              $inc: { stock: -item.quantity, totalSold: item.quantity } 
            });
          } else {
            // Product not found with this ID
            console.warn(`Product with ID ${item.productId} not found in database.`);
            // Use placeholder
            orderItems.push({ 
              name: `Product`, 
              image: "", 
              price: 0,
              quantity: item.quantity 
            });
          }
        } else {
          // Not a valid ObjectId format (likely mock ID like "6")
          // Skip database lookup and use as-is
          console.log(`Mock product ID detected: ${item.productId}. Using as placeholder.`);
          orderItems.push({ 
            name: `Product`, 
            image: "", 
            price: 0,
            quantity: item.quantity 
          });
        }
      } catch (error) {
        console.error("Error processing product:", error.message);
        // Continue with next product instead of failing entire order
      }
    }
    
    // If no valid items, return error
    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products in order." });
    }
    
    // Calculate shipping and discount
    const shippingCost = subtotal >= 999 ? 0 : 99;
    let discount = 0;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt)) {
        discount = coupon.discountType === "flat" ? coupon.discountValue : (subtotal * coupon.discountValue) / 100;
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return res.status(400).json({ success: false, message: `Minimum order value for coupon is ₹${coupon.minOrderValue}` });
        }
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }
    
    const totalAmount = Math.max(0, subtotal + shippingCost - discount);
    
    // Create order - user field is optional for guest checkout
    const order = await Order.create({ 
      customer, 
      shippingAddress, 
      items: orderItems, 
      subtotal, 
      shippingCost, 
      discount, 
      totalAmount, 
      couponCode, 
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      orderStatus: "pending",
      statusHistory: [{ status: "pending", note: "Order placed successfully" }] 
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully! 🌙", 
      order: { 
        _id: order._id, 
        orderNumber: order.orderNumber, 
        totalAmount: order.totalAmount,
        customer: order.customer,
        orderStatus: order.orderStatus
      } 
    });
  } catch (error) { 
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: error.message }); 
  }
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
