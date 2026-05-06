const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const { uploadProductImages, uploadCategoryImage, getFileUrls } = require("../middleware/uploadCloudinary");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const User = require("../models/User");

router.use(protect, adminOnly);

// ── ANALYTICS ────────────────────────────────────────────────
router.get("/analytics", async (req, res) => {
  try {
    const [totalOrders, revenueData, totalProducts, totalUsers, pendingOrders, recentOrders, topProducts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: "user" }),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.find().sort({ createdAt: -1 }).limit(10),
      Product.find({ isActive: true }).sort({ totalSold: -1 }).limit(5).select("name totalSold totalClicks price images"),
    ]);
    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: revenueData[0]?.total || 0,
        totalProducts,
        totalUsers,
        pendingOrders,
        recentOrders,
        topProducts,
      },
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── PRODUCTS ─────────────────────────────────────────────────
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    const products = await Product.find(query).populate("category", "name").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/product/add", uploadProductImages([{ name: "images", maxCount: 5 }, { name: "image", maxCount: 1 }, { name: "previewVideo", maxCount: 1 }, { name: "fullVideo", maxCount: 1 }]), async (req, res) => {
  try {
    const { name, category, shortDesc, fullDesc, suitableFor, howToUse, price, originalPrice, stock, isBestSeller, isFeatured, benefits, tags, weight } = req.body;

    // Validation
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: "Product name is required." });
    if (!category)             return res.status(400).json({ success: false, message: "Category is required." });
    if (!price || isNaN(Number(price))) return res.status(400).json({ success: false, message: "Valid price is required." });

    const parsedPrice    = Number(price);
    const parsedOriginal = originalPrice && !isNaN(Number(originalPrice)) ? Number(originalPrice) : parsedPrice;

    // Generate unique slug
    const baseSlug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) { slug = `${baseSlug}-${counter++}`; }

    // Handle images using Cloudinary or local storage
    const { images, previewVideo, fullVideo } = getFileUrls(req);

    // Parse array fields safely
    const parseBenefits = () => {
      if (!benefits) return [];
      try { return JSON.parse(benefits); } catch { return benefits.split(",").map(s => s.trim()).filter(Boolean); }
    };
    const parseTags = () => {
      if (!tags) return [];
      try { return JSON.parse(tags); } catch { return tags.split(",").map(s => s.trim()).filter(Boolean); }
    };

    const product = await Product.create({
      name: name.trim(), slug, category,
      shortDesc: shortDesc || "", fullDesc: fullDesc || "",
      suitableFor: suitableFor || "", howToUse: howToUse || "",
      price: parsedPrice, originalPrice: parsedOriginal,
      stock: Number(stock) || 0,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      isFeatured:   isFeatured   === "true" || isFeatured   === true,
      benefits: parseBenefits(),
      tags:     parseTags(),
      weight:   weight || "",
      images, previewVideo, fullVideo,
    });

    res.status(201).json({ success: true, message: "Product created!", product });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ success: false, message: "A product with this name already exists." });
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put("/product/update/:id", uploadProductImages([{ name: "images", maxCount: 5 }, { name: "image", maxCount: 1 }, { name: "previewVideo", maxCount: 1 }, { name: "fullVideo", maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price)         updates.price         = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
    if (updates.stock)         updates.stock         = Number(updates.stock);
    if (updates.isBestSeller !== undefined) updates.isBestSeller = updates.isBestSeller === "true" || updates.isBestSeller === true;
    if (updates.isFeatured   !== undefined) updates.isFeatured   = updates.isFeatured   === "true" || updates.isFeatured   === true;
    if (updates.benefits) {
      try { updates.benefits = JSON.parse(updates.benefits); }
      catch { updates.benefits = updates.benefits.split(",").map(s => s.trim()).filter(Boolean); }
    }
    if (updates.tags) {
      try { updates.tags = JSON.parse(updates.tags); }
      catch { updates.tags = updates.tags.split(",").map(s => s.trim()).filter(Boolean); }
    }

    // Handle images using Cloudinary or local storage
    const { images: newImages, previewVideo, fullVideo } = getFileUrls(req);
    if (newImages.length > 0) updates.images = newImages;
    if (req.files?.previewVideo) updates.previewVideo = previewVideo;
    if (req.files?.fullVideo)    updates.fullVideo    = fullVideo;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: false });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/product/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id); // Permanent delete
    res.json({ success: true, message: "Product permanently deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── CATEGORIES ───────────────────────────────────────────────
router.post("/category/add", uploadCategoryImage(), async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    // Get image URL from Cloudinary or local storage
    const image = req.file?.path || "";
    const category = await Category.create({ name, slug, description, image, sortOrder: Number(sortOrder) || 0 });
    res.status(201).json({ success: true, category });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/category/update/:id", uploadCategoryImage(), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path; // Cloudinary returns full URL in path
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, category });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/category/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Category removed." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── ORDERS ───────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (search) {
      query.$or = [
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { orderNumber: { $regex: search, $options: "i" } }
      ];
    }
    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Get single order details
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone role createdAt")
      .populate("items.product", "name images price");
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }
    
    const update = { 
      orderStatus: status, 
      $push: { statusHistory: { status, note: note || "" } } 
    };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (status === "delivered") update.deliveredAt = new Date();
    if (status === "cancelled") update.paymentStatus = "refunded";
    
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── COUPONS ──────────────────────────────────────────────────
router.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/coupon/create", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/coupon/update/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coupon });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/coupon/delete/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── CUSTOMERS ────────────────────────────────────────────────
router.get("/customers", async (req, res) => {
  try {
    // Get ALL registered users (not just those with orders)
    const allUsers = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    
    // Get all orders to calculate stats
    const orders = await Order.find()
      .select("customer user shippingAddress paymentMethod orderNumber orderStatus paymentStatus createdAt totalAmount items")
      .sort({ createdAt: -1 });
    
    // Create customer list with all registered users
    const customers = [];
    
    for (const user of allUsers) {
      // Find all orders for this user
      const userOrders = orders.filter(order => 
        order.user?.toString() === user._id.toString() || 
        order.customer.email.toLowerCase() === user.email.toLowerCase()
      );
      
      // Calculate stats
      const orderCount = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Get latest address from most recent order
      const latestOrder = userOrders[0];
      const latestAddress = latestOrder?.shippingAddress || {};
      
      // Get recent orders (limit to 10)
      const recentOrders = userOrders.slice(0, 10).map(order => ({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress || {},
        createdAt: order.createdAt,
        items: order.items || []
      }));
      
      customers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        age: user.age,
        isActive: user.isActive !== false,
        createdAt: user.createdAt,
        isGuest: false,
        orderCount,
        totalSpent,
        latestAddress,
        orders: recentOrders
      });
    }
    
    // Also include guest customers (those who ordered without registering)
    const guestEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
    const guestOrders = orders.filter(order => 
      !order.user && !guestEmails.has(order.customer.email.toLowerCase())
    );
    
    // Group guest orders by email
    const guestMap = new Map();
    for (const order of guestOrders) {
      const email = order.customer.email.toLowerCase();
      if (!guestMap.has(email)) {
        guestMap.set(email, {
          _id: order._id,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || "",
          age: order.customer.age,
          isActive: true,
          createdAt: order.createdAt,
          isGuest: true,
          orderCount: 0,
          totalSpent: 0,
          latestAddress: order.shippingAddress || {},
          orders: []
        });
      }
      
      const guest = guestMap.get(email);
      guest.orderCount += 1;
      guest.totalSpent += order.totalAmount || 0;
      
      if (guest.orders.length < 10) {
        guest.orders.push({
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress || {},
          createdAt: order.createdAt,
          items: order.items || []
        });
      }
    }
    
    // Add guest customers to the list
    customers.push(...Array.from(guestMap.values()));
    
    // Sort by creation date (most recent first)
    customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, customers });
  } catch (e) { 
    res.status(500).json({ success: false, message: e.message }); 
  }
});

// Get single customer details with full order history
router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "orders",
        model: "Order",
        populate: { path: "items.product", select: "name images price" }
      });
    
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    
    const orderCount = await Order.countDocuments({ user: req.params.id });
    const totalSpent = await Order.aggregate([
      { $match: { user: req.params.id } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    res.json({ 
      success: true, 
      customer: {
        ...customer.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0
      }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── USERS (GET ALL) ──────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Create user (admin)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered." });
    const user = await User.create({ name, email, password, phone, role: role || "user" });
    res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, phone, role, isActive, password } = req.body;
    const updates = {};
    if (name     !== undefined) updates.name     = name;
    if (email    !== undefined) updates.email    = email;
    if (phone    !== undefined) updates.phone    = phone;
    if (role     !== undefined) updates.role     = role;
    if (isActive !== undefined) updates.isActive = isActive;
    // Only update password if provided
    if (password) {
      const bcrypt = require("bcryptjs");
      updates.password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Clear all users (except admins)
router.delete("/users-clear-all", async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: "admin" } });
    res.json({ success: true, message: `${result.deletedCount} users deleted successfully.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
