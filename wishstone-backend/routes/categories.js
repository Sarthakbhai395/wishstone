const router = require("express").Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, categories });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, category });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
