const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const sortMap = { newest: { createdAt: -1 }, "price-asc": { price: 1 }, "price-desc": { price: -1 }, popular: { totalSold: -1 } };
    const products = await Product.find(query).populate("category", "name slug").sort(sortMap[sort] || { createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/best-sellers", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isBestSeller: true }).populate("category", "name slug").sort({ totalSold: -1 }).limit(8);
    res.json({ success: true, products });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, isActive: true }, { $inc: { totalClicks: 1 } }, { new: true }).populate("category", "name slug");
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
