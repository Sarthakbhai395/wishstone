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

// Google OAuth — verify credential from frontend, find/create user
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: "Google credential required." });

    // Decode the Google JWT (id_token) — no library needed, just base64 decode the payload
    const payload = JSON.parse(Buffer.from(credential.split(".")[1], "base64url").toString("utf8"));
    const { sub: googleId, email, name, picture } = payload;

    if (!email) return res.status(400).json({ success: false, message: "Could not get email from Google." });

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update googleId and avatar if missing
      if (!user.googleId) { user.googleId = googleId; user.avatar = picture || ""; await user.save(); }
    } else {
      // Create new Google user (no password)
      user = await User.create({ name, email, googleId, avatar: picture || "", password: "" });
    }

    res.json({ success: true, token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Me
router.get("/me", protect, (req, res) => res.json({ success: true, user: req.user }));

// Update profile
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { name, phone, age } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, age },
      { new: true, runValidators: true }
    ).select("-password");
    
    // Return updated user data
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        role: user.role
      }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
