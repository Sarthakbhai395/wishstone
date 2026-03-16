const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "wishstone_secret", { expiresIn: "30d" });

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password required." });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered." });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ success: true, token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    res.json({ success: true, token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    res.json({ success: true, token: sign(user._id), admin: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Me
router.get("/me", protect, (req, res) => res.json({ success: true, user: req.user }));

module.exports = router;
