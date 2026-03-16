const multer = require("multer");
const path = require("path");
const fs = require("fs");

["uploads/images", "uploads/videos"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.mimetype.startsWith("video/") ? "uploads/videos" : "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`);
  },
});

module.exports = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });
