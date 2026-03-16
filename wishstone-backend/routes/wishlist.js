const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id }).populate("products", "name images price originalPrice discount");
    res.json({ success: true, wishlist: wl || { products: [] } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = await Wishlist.create({ user: req.user._id, products: [] });
    if (!wl.products.map(String).includes(req.body.productId)) wl.products.push(req.body.productId);
    await wl.save();
    res.json({ success: true, message: "Added to wishlist!" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { $pull: { products: req.params.productId } });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
