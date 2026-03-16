const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name images price");
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: productId, quantity, price: product.price });
    await cart.save();
    res.json({ success: true, message: "Added to cart!" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });
    if (quantity < 1) cart.items = cart.items.filter(i => i.product.toString() !== productId);
    else { const item = cart.items.find(i => i.product.toString() === productId); if (item) item.quantity = quantity; }
    await cart.save();
    res.json({ success: true, cart });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) { cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId); await cart.save(); }
    res.json({ success: true, message: "Removed." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
