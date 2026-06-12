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
    {
      name: "Wishstone",
      slug: "wishstone",
      category: cats[0]._id,
      shortDesc: "14-year charged sacred manifestation stone connecting your desires to your subconscious mind.",
      fullDesc: "Wishstone is more than a rock. It's a story. Its been on a 14-year journey across India getting charged at places so now it holds a unique kind of energy. This stone works on two ideas: energy and how your subconscious mind really works. Since your subconscious is a bit mysterious, Wishstone acts as a link. A bridge connecting what you want with the deeper part of you that makes things happen. Use it every day for 45 days with focus and see what happens. There's no religion or rituals involved. Pure energy and your own belief.",
      suitableFor: "If you have a meaningful goal. Like a new job, better relationships or improved health. This is your tool. It's great for people who meditate or are into the Law of Attraction who want something to focus on. It's also perfect as a gift for big life moments or for anyone who wants something",
      benefits: [
        "It's been charged at high-energy places for 14 years, which gives it a potency.",
        "Your subconscious mind picks up on objects faster than vague thoughts so keeping Wishstone close helps lock your goal deeper inside.",
        "Stick with it for 45 days. You'll start to form new habits; your intention becomes instinct.",
        "It doesn't matter what your background is since its based on science and energy. No mantras, no rituals.",
        "People who use it usually notice changes: more clarity, confidence and positive shifts. And it just keeps working.",
        "You can keep it in your pocket on your desk or under your pillow."
      ],
      price: 1299,
      originalPrice: 1799,
      stock: 100,
      isBestSeller: true,
      isFeatured: true,
      images: ["/wishstone-horizontal.jpeg"]
    },
    {
      name: "Cosmic Eye",
      slug: "cosmic-eye",
      category: cats[1]._id,
      shortDesc: "A way to connect with a special kind of energy to remove hidden obstacles and shape your life.",
      fullDesc: "The Cosmic Eye is more than a tool. It's a way to connect with a special kind of energy that can help shape your life. You're probably holding onto a dream or a big goal. Sometimes it feels like something is getting in the way. The Cosmic Eye helps clear those hidden obstacles so you can actually achieve what you want. It uses wisdom about energy alignment and acts like an antenna for good vibes sending that positive energy straight to your deepest desires. It's really helpful for you. It's even better as a gift for someone you care about.",
      suitableFor: "It's perfect for people who're new to energy tools but want something easy to use and powerful. If you're chasing a dream. Like a new job, better health or financial freedom. Or if you feel like something is always stopping you this eye can help. It also makes a gift for coworkers because its both high-quality and interesting to talk about. Its designed for ambitious people who are open to new possibilities.",
      benefits: [
        "Think of it like a magnet for energy. It pulls in frequencies around you and directs them to your goal so your intention becomes clearer.",
        "It helps get rid of blocks bad luck or negative patterns that might be holding you back.",
        "Whenever you hold it and think about your goal your subconscious really takes note.",
        "Over time you build up an energy field that keeps negativity away..",
        "If you give it as a gift you're passing on real positive intention."
      ],
      price: 1899,
      originalPrice: 2499,
      stock: 50,
      isBestSeller: true,
      isFeatured: true,
      images: ["/cosmic-eye.jpeg"]
    },
    {
      name: "Reed Diffuser (Earth Essence)",
      slug: "earth-essence-reed-diffuser",
      category: cats[1]._id,
      shortDesc: "Luxury reed diffuser to lift your home fragrance and recalibrate your energy.",
      fullDesc: "Earth Essence is more than a home fragrance. It's an experience. This luxury reed diffuser blends a fragrance formula with natural reed sticks letting a pleasant scent fill your space day and night. No flame, no plugs needed. When your home smells great it feels like the energy lifts your mind. Your goals have room to grow. Earth Essence helps recalibrate your energy, one breath at a time.",
      suitableFor: "It's a fit for homemakers who care about their spaces energy, professionals who want a calm environment after work or anyone setting up a meditation or yoga zone. It also makes a premium memorable gift. Ideal for newlyweds or new homeowners who want to curate their space",
      benefits: [
        "You set it up once then let it work. No upkeep, no stress.",
        "The fragrance activates your system boosting your mood easing anxiety and sharpening your focus.",
        "If you're into manifestation your goals need a space to thrive so Earth Essence helps make your home more receptive to good intentions.",
        "Its scent is clean and consistent not overwhelming or chemical-heavy.",
        "The bottle also looks great anywhere upgrading your decor while making your home feel cozy and inviting."
      ],
      price: 999,
      originalPrice: 1499,
      stock: 60,
      isBestSeller: false,
      isFeatured: true,
      images: ["/defuser-product.jpeg"]
    },
    {
      name: "Camphor (Kapoor)",
      slug: "premium-camphor",
      category: cats[1]._id,
      shortDesc: "Premium upgrade camphor releasing a soothing fragrance as it purifies and cleanses your space.",
      fullDesc: "Forget the sharp-smelling camphor you're used to. Our camphor is a premium upgrade to a ritual made for modern homes. Traditional camphor purifies the air. Ours does that and more releasing a soothing fragrance as it burns. Light it. Instantly your space feels cleansed, warm and filled with a calming scent.",
      suitableFor: "Perfect for anyone with a ritual wanting to upgrade people who dislike harsh traditional camphor or those who believe in vastu and regularly cleanse their space. It's great for festivals, housewarming, special occasions or everyday moments that need a sacred touch.",
      benefits: [
        "Camphors ability to purify air is proven. It zaps bacteria and germs as soon as it burns.",
        "For ages its been used to clear energy but our version does this while making your home smell fantastic.",
        "The fragrance calms your mind, so anxiety.",
        "Meditation feels deeper. It makes your daily ritual a real sensory experience..",
        "It works fast: light it and you feel the shift right away."
      ],
      price: 499,
      originalPrice: 699,
      stock: 150,
      isBestSeller: false,
      images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600"]
    },
    {
      name: "Habit Builder",
      slug: "habit-builder",
      category: cats[2]._id,
      shortDesc: "21 cards, 21 days deck to build life habits one day at a time.",
      fullDesc: "21 cards, 21 days. A brand new you. The Habit Builder deck makes self-improvement easy not overwhelming. Each card has one powerful habit. No complicated programs, no apps. Just pick a card each morning and focus on that one thing. By the end of three weeks you'll have swapped chaos for structure and wishful thinking for action. If your routine has totally fallen apart or you want a start this is your reset.",
      suitableFor: "Students struggling with routines professionals feeling stuck people who've tried app after app and need something anyone facing major life changes or parents seeking a meaningful gift for their teens.",
      benefits: [
        "Psychology says it takes 21 days of repetition to turn behavior into habit so the deck follows that science.",
        "Most self-improvement plans fail because we try to change everything at once; this deck keeps you one habit per day no more.",
        "There's no screen, no notifications. A card on your table reminding you all day.",
        "The habits aren't random; each ones carefully picked to boost productivity, mindset, health and relationships.",
        "Use it again and again. Pass it on after you finish."
      ],
      price: 799,
      originalPrice: 1099,
      stock: 80,
      isBestSeller: true,
      images: ["/habit-builder2-product.jpeg"]
    },
    {
      name: "Combo 1: WishStone + Reed Diffuser",
      slug: "combo-1",
      category: cats[0]._id,
      shortDesc: "Complete 360-degree manifestation setup: align your mind and your environment.",
      fullDesc: "Manifestation takes more than thinking. It needs the right environment. With Wishstone and Earth Essence Diffuser you're aligning your mind and your space. Wishstone embeds your goal in your subconscious while Earth Essence makes your home positive and full of energy. This combo isn't two items. It's a complete system. It's your 360-degree manifestation setup.",
      suitableFor: "Best for people who want solutions, not stuff. First-timers serious about manifesting and anyone gifting something complete.",
      benefits: [
        "You get a tool and an outer environment working perfectly together.",
        "Wishstone keeps your intentions anchored; the Diffuser uplifts your homes energy 24/7.",
        "Together they build an energy field around you.",
        "Buying the combo is better value than getting each one alone. It's the starter pack for anyone ready to make real changes."
      ],
      price: 1999,
      originalPrice: 2798,
      stock: 30,
      isBestSeller: true,
      images: ["/wishstone-horizontal.jpeg"]
    },
    {
      name: "Combo 2: Cosmic Eye + Reed Diffuser",
      slug: "combo-2",
      category: cats[0]._id,
      shortDesc: "High-frequency home wellness combo: draw energy with Cosmic Eye and anchor it with Earth Essence Diffuser.",
      fullDesc: "The Cosmic Eye draws in the energy. The Earth Essence Diffuser holds it. When you use them together your place turns into a circuit. Cosmic Eye pulls positive vibes into your space Diffuser keeps your homes atmosphere so good that energy stays put and keeps working. On their own both are strong. Combined the effect multiplies.",
      suitableFor: "Great, for folks, meditation fans and anyone wanting a complete home wellness upgrade. If you're gifting it stands out as truly purposeful and premium.",
      benefits: [
        "Cosmic Eye brings in energy Diffuser locks it in.",
        "Your home stays high-frequency. No dips, no negativity sneaking back in.",
        "They're a match. One attracts, one anchors. This setup is ideal for meditation, intention-setting and all kinds of energy practices..",
        "They look premium and make an unforgettable gift."
      ],
      price: 2499,
      originalPrice: 3498,
      stock: 30,
      images: ["/cosmic-eye.jpeg"]
    }
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
