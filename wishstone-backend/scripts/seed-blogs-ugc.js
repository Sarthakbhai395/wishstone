require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const UGCVideo = require("../models/UGCVideo");

const seedData = async () => {
  const atlasURI = process.env.MONGO_URI;
  const localURI = "mongodb://localhost:27017/wishstone";
  const uri = atlasURI || localURI;

  console.log("🔄 Connecting to database for seeding...", uri);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }

  
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0) {
    console.log("🌱 Seeding mock blogs...");
    const blogs = [
      {
        title: "Finding peace in Delhi's chaos: Rohan's journey with Wishstone",
        slug: "rohans-journey-with-wishstone",
        content: "Meet Rohan, a 28-year-old software engineer in Delhi. Commuting daily through Noida-Delhi traffic and dealing with tight deadlines left him constantly anxious. One day, his sister gifted him a Wishstone. Though skeptical at first, Rohan started his 45-day intention setting practice. Holding the stone every morning while setting a clear intention of staying calm transformed his perspective. Today, Rohan feels more present, grounded, and focused despite the city's fast pace. 'It acts as my anchor in the chaos,' Rohan says.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        author: "Aarav Sharma",
        isActive: true
      },
      {
        title: "A Doctor's Healing Light: Priya's Self-Care Ritual in Mumbai",
        slug: "priyas-self-care-ritual",
        content: "Dr. Priya Sen has spent the last five years working in busy hospital wards in Mumbai. With endless shifts, burnout was inevitable. Priya realized she needed a grounding practice. She integrated the Wishstone Diffuser and Kapoor (Camphor) ritual into her evening wind-down. The calming smell of camphor coupled with lavender-infused diffuser reeds changed her bedroom atmosphere. 'It became my sacred recovery space,' Priya explains. Taking those 15 minutes of digital-detox every night restored her energy to heal others.",
        coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
        author: "Dr. Priya Sen",
        isActive: true
      },
      {
        title: "From Overthinking to Action: Kabir's 21-Day Habit Build",
        slug: "kabirs-21-day-habit-build",
        content: "Kabir, a 22-year-old college student from Pune, found himself constantly procrastinating and overthinking his future. He decided to try the Wishstone Habit Builder deck. 21 cards, 21 days. Every morning, he picked a card and committed to that single habit—no screens, no distractions, just action. By day 21, Kabir formed positive daily routines that helped him clear his exams and start his startup. 'The physical cards are so much better than notification-heavy apps,' Kabir shares.",
        coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
        author: "Kabir Mehta",
        isActive: true
      }
    ];
    await Blog.insertMany(blogs);
    console.log("✅ Seeded 3 mock blogs.");
  } else {
    console.log("📝 Blogs already exist, skipping seeding.");
  }

  
  const videoCount = await UGCVideo.countDocuments();
  if (videoCount === 0) {
    console.log("🌱 Seeding mock UGC videos...");
    
    const videos = [
      {
        title: "Surrender & Stillness",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-meditating-43026-large.mp4",
        caption: "Letting go of what I can't control",
        tag: "STILLNESS",
        isActive: true
      },
      {
        title: "My 45-day Manifestation Ritual",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-sparkler-at-night-42289-large.mp4",
        caption: "How I write my goals and manifest them",
        tag: "RITUAL",
        isActive: true
      },
      {
        title: "Morning Habit Building",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-meditation-in-nature-41584-large.mp4",
        caption: "Up at 5 AM with the Habit Builder deck",
        tag: "ROUTINE",
        isActive: true
      }
    ];
    await UGCVideo.insertMany(videos);
    console.log("✅ Seeded 3 mock UGC videos.");
  } else {
    console.log("📝 UGC videos already exist, skipping seeding.");
  }

  console.log("👋 Seeding process complete.");
  mongoose.connection.close();
};

seedData();
