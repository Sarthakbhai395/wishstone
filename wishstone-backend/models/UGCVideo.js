const mongoose = require("mongoose");

const ugcVideoSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  videoUrl:   { type: String, required: true },
  caption:    { type: String, default: "" },
  tag:        { type: String, default: "" },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("UGCVideo", ugcVideoSchema);
