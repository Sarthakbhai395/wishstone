require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

const categories = [
  {
    name: "Crystals & Gemstones",
    slug: "crystals-gemstones",
    description: "Natural healing crystals and precious gemstones for spiritual wellness",
    sortOrder: 1,
    isActive: true
  },
  {
    name: "Spiritual Jewelry",
    slug: "spiritual-jewelry",
    description: "Handcrafted jewelry with healing stones and spiritual symbols",
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    description: "Crystal decor, feng shui items, and spiritual home accessories",
    sortOrder: 3,
    isActive: true
  },
  {
    name: "Meditation Tools",
    slug: "meditation-tools",
    description: "Meditation aids, singing bowls, and mindfulness accessories",
    sortOrder: 4,
    isActive: true
  },
  {
    name: "Healing Stones",
    slug: "healing-stones",
    description: "Therapeutic stones for chakra balancing and energy healing",
    sortOrder: 5,
    isActive: true
  },
  {
    name: "Spiritual Gifts",
    slug: "spiritual-gifts",
    description: "Unique spiritual gifts for loved ones and special occasions",
    sortOrder: 6,
    isActive: true
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing categories`);
      const choice = process.argv[2];
      
      if (choice === "--force") {
        console.log("🗑️  Clearing existing categories...");
        await Category.deleteMany({});
      } else {
        console.log("✅ Categories already exist. Use --force to reset.");
        process.exit(0);
      }
    }

    // Insert categories
    console.log("📦 Seeding categories...");
    const result = await Category.insertMany(categories);
    console.log(`✅ Successfully created ${result.length} categories:`);
    
    result.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log("\n🎉 Category seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    process.exit(1);
  }
}

seedCategories();
