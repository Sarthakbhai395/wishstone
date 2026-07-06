const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true, lowercase: true },
  content:    { type: String, required: true },
  coverImage: { type: String, default: "" },
  author:     { type: String, default: "Admin" },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
