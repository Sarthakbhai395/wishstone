const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, default: "" },
  googleId: { type: String, default: "" },
  avatar:   { type: String, default: "" },
  phone:    { type: String, default: "" },
  age:      { type: Number },
  address:  { type: Object, default: {} },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual for orders relationship (Order schema has user reference)
userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user"
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
