const router = require("express").Router();
const UGCVideo = require("../models/UGCVideo");

router.get("/", async (req, res) => {
  try {
    const videos = await UGCVideo.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, videos });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
