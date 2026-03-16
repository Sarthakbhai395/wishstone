const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
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

router.post("/product/add", upload.fields([{ name: "images", maxCount: 5 }, { name: "previewVideo", maxCount: 1 }, { name: "fullVideo", maxCount: 1 }]), async (req, res) => {
  try {
    const { name, category, shortDesc, price, originalPrice, stock, isBestSeller, isFeatured, benefits, tags } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const images = req.files?.images?.map(f => f.path) || [];
    const previewVideo = req.files?.previewVideo?.[0]?.path || "";
    const fullVideo = req.files?.fullVideo?.[0]?.path || "";
    const product = await Product.create({
      name, slug, category, shortDesc,
      price: Number(price), originalPrice: Number(originalPrice),
      stock: Number(stock) || 0,
      isBestSeller: isBestSeller === "true",
      isFeatured: isFeatured === "true",
      benefits: benefits ? JSON.parse(benefits) : [],
      tags: tags ? JSON.parse(tags) : [],
      images, previewVideo, fullVideo,
    });
    res.status(201).json({ success: true, message: "Product created!", product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/product/update/:id", upload.fields([{ name: "images", maxCount: 5 }, { name: "previewVideo", maxCount: 1 }, { name: "fullVideo", maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
    if (updates.stock) updates.stock = Number(updates.stock);
    if (updates.benefits) updates.benefits = JSON.parse(updates.benefits);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);
    if (req.files?.images) updates.images = req.files.images.map(f => f.path);
    if (req.files?.previewVideo) updates.previewVideo = req.files.previewVideo[0].path;
    if (req.files?.fullVideo) updates.fullVideo = req.files.fullVideo[0].path;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/product/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Product removed." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── CATEGORIES ───────────────────────────────────────────────
router.post("/category/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const category = await Category.create({ name, slug, description, image: req.file?.path || "", sortOrder: Number(sortOrder) || 0 });
    res.status(201).json({ success: true, category });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/category/update/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path;
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
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const update = { orderStatus: status, $push: { statusHistory: { status, note: note || "" } } };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (status === "delivered") update.deliveredAt = new Date();
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
    const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).select("-password");
    res.json({ success: true, customers });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
