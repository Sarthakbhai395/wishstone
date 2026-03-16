require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Coupon = require("./models/Coupon");

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected");

  // Clear old data
  await Promise.all([User.deleteMany(), Product.deleteMany(), Category.deleteMany(), Coupon.deleteMany()]);
  console.log("🗑  Cleared old data");

  // Admin user
  await User.create({ name: "Wishstone Admin", email: "admin@wishstone.com", password: "wishstone@123", role: "admin" });
  console.log("👑 Admin created: admin@wishstone.com / wishstone@123");

  // Categories
  const cats = await Category.insertMany([
    { name: "Manifestation", slug: "manifestation", description: "Crystals & tools to align your energy with the universe", sortOrder: 1, image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600" },
    { name: "Therapy",       slug: "therapy",       description: "Natural healing aids for mind, body & soul", sortOrder: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" },
    { name: "Habit Builder", slug: "habit-builder", description: "Daily rituals to build powerful life habits", sortOrder: 3, image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600" },
  ]);
  console.log("📂 Categories created");

  // Products
  await Product.insertMany([
    { name: "Celestial Rose Quartz", slug: "celestial-rose-quartz", category: cats[0]._id, shortDesc: "Moon-charged rose quartz for love and self-worth", benefits: ["Enhances self-love", "Emotional healing", "Attracts love", "Heart chakra"], price: 1299, originalPrice: 1799, stock: 50, isBestSeller: true, isFeatured: true, images: ["https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500"] },
    { name: "Lunar Amethyst Cluster", slug: "lunar-amethyst-cluster", category: cats[0]._id, shortDesc: "Brazilian amethyst for meditation and intuition", benefits: ["Deepens meditation", "Protects aura", "Enhances intuition", "Better sleep"], price: 2199, originalPrice: 2999, stock: 30, isBestSeller: true, images: ["https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=500"] },
    { name: "Healing Lavender Bundle", slug: "healing-lavender-bundle", category: cats[1]._id, shortDesc: "Organic lavender for cleansing and deep relaxation", benefits: ["Reduces stress", "Purifies space", "Better sleep", "Calms nerves"], price: 699, originalPrice: 999, stock: 100, isBestSeller: true, images: ["https://images.unsplash.com/photo-1471943311424-646960669fbc?w=500"] },
    { name: "Moonstone Ritual Kit", slug: "moonstone-ritual-kit", category: cats[2]._id, shortDesc: "Complete kit for building powerful moon rituals", benefits: ["Daily ritual", "Moon tracking", "Self-awareness", "Consistency"], price: 1899, originalPrice: 2499, stock: 25, images: ["https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=500"] },
    { name: "Obsidian Protection Stone", slug: "obsidian-protection-stone", category: cats[0]._id, shortDesc: "Volcanic obsidian for protection against negativity", benefits: ["Shields negativity", "Grounds energy", "Reveals truth", "Emotional healing"], price: 899, originalPrice: 1199, stock: 60, isBestSeller: true, images: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=500"] },
    { name: "Sacred Sandalwood Incense", slug: "sacred-sandalwood-incense", category: cats[1]._id, shortDesc: "Premium Mysore sandalwood for meditation and yoga", benefits: ["Deepens focus", "Purifies air", "Elevates mood", "Aids prayer"], price: 499, originalPrice: 699, stock: 80, images: ["https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=500"] },
  ]);
  console.log("💎 Products created");

  // Coupons
  await Coupon.insertMany([
    { code: "WOW300",  discountType: "flat",       discountValue: 300, minOrderValue: 500, description: "₹300 off on orders above ₹500" },
    { code: "FIRST10", discountType: "percentage", discountValue: 10,  maxDiscount: 200,   description: "10% off — first order" },
    { code: "MOON50",  discountType: "flat",       discountValue: 50,  minOrderValue: 0,   description: "₹50 welcome discount" },
  ]);
  console.log("🎫 Coupons created: WOW300 | FIRST10 | MOON50");

  console.log("\n✅ Database ready! Your Wishstone is live 🌙\n");
  process.exit(0);
}

seed().catch(err => { console.error("❌ Error:", err.message); process.exit(1); });
