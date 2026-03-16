require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/wishstone")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

app.use("/api/auth",       require("./routes/auth"));
app.use("/api/products",   require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/wishlist",   require("./routes/wishlist"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/coupons",    require("./routes/coupons"));
app.use("/api/admin",      require("./routes/admin"));

app.get("/", (req, res) => res.json({ status: "🔮 Wishstone API Running" }));

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
