const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1] : null;
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "wishstone_secret");
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ success: false, message: "User not found." });
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success: false, message: "Admin access required." });
  next();
};
