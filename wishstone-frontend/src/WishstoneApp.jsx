import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "manifestation",
    name: "Manifestation",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80",
    desc: "Crystals & tools to align your energy with the universe",
  },
  {
    id: "therapy",
    name: "Therapy",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    desc: "Natural healing aids for mind, body & soul restoration",
  },
  {
    id: "habit-builder",
    name: "Habit Builder",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    desc: "Daily rituals & tools to build powerful life habits",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Celestial Rose Quartz",
    category: "manifestation",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80",
    shortDesc: "A stunning rose quartz crystal charged under the full moon to amplify love, compassion, and self-worth energies in your space.",
    suitableFor: "Beginners, healers, those seeking emotional balance",
    benefits: ["Enhances self-love", "Promotes emotional healing", "Attracts positive relationships", "Clears heart chakra blockages"],
    bestSeller: true,
  },
  {
    id: 2,
    name: "Lunar Amethyst Cluster",
    category: "manifestation",
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=500&q=80",
    shortDesc: "Premium amethyst cluster sourced from Brazilian mines, perfect for meditation spaces and amplifying intuition.",
    suitableFor: "Meditators, spiritual seekers, healers",
    benefits: ["Deepens meditation", "Protects energy field", "Enhances intuition", "Promotes restful sleep"],
    bestSeller: true,
  },
  {
    id: 3,
    name: "Healing Lavender Bundle",
    category: "therapy",
    price: 699,
    originalPrice: 999,
    discount: 30,
    image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=500&q=80",
    shortDesc: "Hand-harvested organic lavender bundle for cleansing negative energy and promoting deep relaxation.",
    suitableFor: "Anyone seeking calm, anxiety relief, better sleep",
    benefits: ["Reduces stress", "Purifies space", "Promotes sleep", "Calms the nervous system"],
    bestSeller: true,
  },
  {
    id: 4,
    name: "Moonstone Ritual Kit",
    category: "habit-builder",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=500&q=80",
    shortDesc: "Complete moonstone ritual kit with journal, crystal, and guide for building powerful daily moon rituals.",
    suitableFor: "Anyone building spiritual daily habits",
    benefits: ["Creates daily ritual", "Tracks moon cycles", "Builds consistency", "Deepens self-awareness"],
    bestSeller: false,
  },
  {
    id: 5,
    name: "Obsidian Protection Stone",
    category: "manifestation",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=500&q=80",
    shortDesc: "Volcanic obsidian stone known for its powerful protective properties against negative energies.",
    suitableFor: "Empaths, sensitives, protection seekers",
    benefits: ["Shields from negativity", "Grounds energy", "Reveals hidden truths", "Heals emotional wounds"],
    bestSeller: true,
  },
  {
    id: 6,
    name: "Sacred Sandalwood Incense",
    category: "therapy",
    price: 499,
    originalPrice: 699,
    discount: 29,
    image: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=500&q=80",
    shortDesc: "Premium Mysore sandalwood incense sticks for meditation, yoga, and creating sacred spaces at home.",
    suitableFor: "Meditators, yoga practitioners, home rituals",
    benefits: ["Deepens focus", "Purifies air", "Elevates mood", "Aids in prayer"],
    bestSeller: false,
  },
];

const FAQS = [
  { q: "How do I use the crystals?", a: "Cleanse your crystal under moonlight or with sage smoke. Set your intention by holding it in both hands and breathing deeply. Place it in your space or carry it with you daily." },
  { q: "How long does it take to see results?", a: "Most customers notice subtle energy shifts within 7–21 days of consistent use. Results vary by individual, intention clarity, and usage consistency." },
  { q: "Are all products 100% natural?", a: "Yes! Every Wishstone product is ethically sourced, 100% natural, and free from synthetic treatments or artificial enhancements." },
  { q: "What are your shipping timelines?", a: "Standard delivery: 5–7 business days. Express delivery: 2–3 business days. Free shipping on orders above ₹999." },
  { q: "What is your return policy?", a: "We offer hassle-free returns within 7 days of delivery. Product must be unused and in original packaging. Refund processed within 3–5 business days." },
];

// ─── STAR FIELD ───────────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: 0,
            animation: `twinkle ${s.duration}s ${s.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

// ─── FLOATING PARTICLES ───────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 6 + 3,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 12,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: "-20px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,180,255,0.6), rgba(150,120,220,0.2))",
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ cartCount, wishCount, onNav, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Home", "Category", "Products", "Our Story"];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 2rem",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(35,37,42,0.97)"
          : "linear-gradient(180deg, rgba(20,22,28,0.95) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "all 0.4s ease",
      }}
    >
      {/* Logo */}
      <div
        onClick={() => onNav("home")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
      >
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>💎</div>
        <span style={{
          fontSize: "1.4rem",
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#fff",
          textShadow: "0 0 20px rgba(167,139,250,0.5)",
        }}>WISHSTONE</span>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", gap: "2rem" }}>
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => onNav(link.toLowerCase().replace(" ", "-"))}
            style={{
              background: "none",
              border: "none",
              color: currentPage === link.toLowerCase().replace(" ", "-") ? "#a78bfa" : "rgba(255,255,255,0.8)",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.78rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              padding: "4px 0",
              borderBottom: currentPage === link.toLowerCase().replace(" ", "-") ? "1px solid #a78bfa" : "1px solid transparent",
              transition: "all 0.3s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => { e.target.style.color = "#a78bfa"; }}
            onMouseLeave={(e) => { if (currentPage !== link.toLowerCase().replace(" ", "-")) e.target.style.color = "rgba(255,255,255,0.8)"; }}
          >
            {link}
          </button>
        ))}
      </nav>

      {/* Icons */}
      <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
        <button
          onClick={() => onNav("wishlist")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            position: "relative", padding: 4,
          }}
          title="Wishlist"
        >
          <span style={{ fontSize: 22 }}>🤍</span>
          {wishCount > 0 && (
            <span style={{
              position: "absolute", top: -2, right: -2,
              background: "#a78bfa", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}>{wishCount}</span>
          )}
        </button>
        <button
          onClick={() => onNav("cart")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            position: "relative", padding: 4,
          }}
          title="Cart"
        >
          <span style={{ fontSize: 22 }}>🛒</span>
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -2, right: -2,
              background: "#ec4899", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}>{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

// ─── OFFER BANNER ─────────────────────────────────────────────────────────────
function OfferBanner() {
  const offers = [
    "✨ Flat ₹300 OFF using coupon WOW300",
    "🌙 Free shipping on orders above ₹999",
    "💎 New Moon Collection — Limited Stock",
    "🔮 Buy 2 Get 1 Free on all Manifestation products",
    "🌿 100% Natural & Ethically Sourced",
  ];
  const text = offers.join("   •   ");
  return (
    <div style={{
      position: "fixed",
      top: 70,
      left: 0,
      right: 0,
      zIndex: 999,
      background: "linear-gradient(90deg, #4c1d95, #6d28d9, #4c1d95)",
      height: 36,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>
      <div style={{
        display: "flex",
        animation: "marquee 28s linear infinite",
        whiteSpace: "nowrap",
      }}>
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{
            color: "#e9d5ff",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            fontFamily: "'Cinzel', serif",
            paddingRight: "4rem",
          }}>{text}</span>
        ))}
      </div>
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection({ onShop }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, #1e1040 0%, #0d0a1a 40%, #4B4E53 100%)`,
        transition: "background 0.3s ease",
      }}
    >
      <StarField />
      <FloatingParticles />

      {/* Moon */}
      <div style={{
        position: "absolute",
        top: "8%",
        right: "12%",
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #f5f0e8, #c8b89a, #9a8570)",
        boxShadow: "0 0 60px rgba(245,240,232,0.3), 0 0 120px rgba(200,184,154,0.15), inset -20px -20px 40px rgba(0,0,0,0.4)",
        animation: "moonGlow 6s ease-in-out infinite",
      }} />

      {/* Orbital ring */}
      <div style={{
        position: "absolute",
        top: "4%",
        right: "8%",
        width: 260,
        height: 260,
        borderRadius: "50%",
        border: "1px solid rgba(200,180,255,0.2)",
        animation: "spin 20s linear infinite",
      }}>
        <div style={{
          position: "absolute",
          top: -4,
          left: "50%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#a78bfa",
          boxShadow: "0 0 12px #a78bfa",
        }} />
      </div>

      {/* Content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 10, padding: "0 2rem", maxWidth: 800 }}>
        <div style={{
          display: "inline-block",
          background: "rgba(167,139,250,0.1)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 100,
          padding: "6px 20px",
          marginBottom: "1.5rem",
          animation: "fadeInDown 1s ease both",
        }}>
          <span style={{ color: "#c4b5fd", fontSize: "0.72rem", letterSpacing: "0.25em", fontFamily: "'Cinzel', serif" }}>
            ✦ ALIGN WITH THE UNIVERSE ✦
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: "1rem",
          animation: "fadeInUp 1s 0.2s ease both",
          textShadow: "0 0 60px rgba(167,139,250,0.4)",
        }}>
          Manifest Your
          <br />
          <span style={{
            background: "linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Destiny
          </span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          maxWidth: 520,
          margin: "0 auto 2.5rem",
          fontFamily: "'Cormorant Garamond', serif",
          animation: "fadeInUp 1s 0.4s ease both",
        }}>
          Premium natural crystals, healing tools & ritual kits crafted to align your energy with the cosmos.
        </p>

        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          animation: "fadeInUp 1s 0.6s ease both",
        }}>
          <button
            onClick={onShop}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              border: "none",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: 100,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(124,58,237,0.6)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(124,58,237,0.4)"; }}
          >
            EXPLORE COLLECTION
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: 100,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.15em",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#a78bfa"; e.target.style.color = "#a78bfa"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.color = "#fff"; }}
          >
            OUR STORY
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "3rem",
          justifyContent: "center",
          marginTop: "4rem",
          animation: "fadeInUp 1s 0.8s ease both",
        }}>
          {[["12K+", "Happy Souls"], ["100%", "Natural"], ["3+", "Categories"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#a78bfa", fontWeight: 700 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", letterSpacing: "0.15em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        animation: "bounce 2s ease-in-out infinite",
      }}>
        <div style={{ width: 1, height: 50, background: "linear-gradient(to bottom, transparent, rgba(167,139,250,0.6))" }} />
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "0.2em" }}>SCROLL</div>
      </div>
    </section>
  );
}

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
function CategorySection({ onCategoryClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      padding: "100px 4rem",
      background: "#4B4E53",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
          ✦ DISCOVER ✦
        </p>
        <h2 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "#fff",
          margin: 0,
        }}>Explore Our Range</h2>
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #a78bfa, transparent)", margin: "1.5rem auto 0" }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onCategoryClick(cat)}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              cursor: "pointer",
              aspectRatio: "4/5",
              boxShadow: hovered === cat.id
                ? "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.4)"
                : "0 10px 40px rgba(0,0,0,0.3)",
              transform: hovered === cat.id ? "translateY(-8px)" : "translateY(0)",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hovered === cat.id ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.6s ease",
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,5,30,0.95) 0%, rgba(10,5,30,0.3) 60%, transparent 100%)",
            }} />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "2rem 1.5rem 1.5rem",
            }}>
              <div style={{
                display: "inline-block",
                background: "rgba(167,139,250,0.2)",
                border: "1px solid rgba(167,139,250,0.4)",
                borderRadius: 100,
                padding: "3px 12px",
                marginBottom: 8,
              }}>
                <span style={{ color: "#c4b5fd", fontSize: "0.65rem", letterSpacing: "0.2em" }}>COLLECTION</span>
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.3rem",
                color: "#fff",
                margin: "0 0 8px",
              }}>{cat.name}</h3>
              <p style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "'Cormorant Garamond', serif",
              }}>{cat.desc}</p>
              <div style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#a78bfa",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                fontFamily: "'Cinzel', serif",
                opacity: hovered === cat.id ? 1 : 0.6,
                transform: hovered === cat.id ? "translateX(4px)" : "translateX(0)",
                transition: "all 0.3s",
              }}>
                EXPLORE →
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── VIDEO USES SECTION ────────────────────────────────────────────────────────
function UsesSection() {
  const [activeVideo, setActiveVideo] = useState(0);
  const videos = [
    { title: "Crystal Cleansing Ritual", thumb: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80", tag: "Manifestation" },
    { title: "Moon Water Preparation", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", tag: "Therapy" },
    { title: "Morning Habit Ritual", thumb: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80", tag: "Habit Builder" },
    { title: "Healing Space Setup", thumb: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&q=80", tag: "Therapy" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVideo((v) => (v + 1) % videos.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      padding: "100px 4rem",
      background: "linear-gradient(180deg, #4B4E53 0%, #2d2f33 100%)",
    }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
          ✦ IMPACT ✦
        </p>
        <h2 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "#fff",
          margin: 0,
        }}>Our Uses & Impact</h2>
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #a78bfa, transparent)", margin: "1.5rem auto 0" }} />
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Main video */}
        <div style={{
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          aspectRatio: "16/7",
          marginBottom: "2rem",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}>
          <img
            src={videos[activeVideo].thumb}
            alt={videos[activeVideo].title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: "50%",
              background: "rgba(167,139,250,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(167,139,250,0.5)",
              transition: "transform 0.3s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
            </div>
          </div>
          <div style={{
            position: "absolute", bottom: 24, left: 24,
          }}>
            <div style={{
              background: "rgba(167,139,250,0.2)",
              border: "1px solid rgba(167,139,250,0.4)",
              borderRadius: 100,
              padding: "3px 12px",
              display: "inline-block",
              marginBottom: 8,
            }}>
              <span style={{ color: "#c4b5fd", fontSize: "0.65rem", letterSpacing: "0.2em" }}>{videos[activeVideo].tag}</span>
            </div>
            <h3 style={{ color: "#fff", fontFamily: "'Cinzel', serif", fontSize: "1.2rem", margin: 0 }}>
              {videos[activeVideo].title}
            </h3>
          </div>
        </div>

        {/* Thumbnails */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {videos.map((v, i) => (
            <div
              key={i}
              onClick={() => setActiveVideo(i)}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                aspectRatio: "16/9",
                border: activeVideo === i ? "2px solid #a78bfa" : "2px solid transparent",
                opacity: activeVideo === i ? 1 : 0.5,
                transition: "all 0.3s",
                position: "relative",
              }}
            >
              <img src={v.thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 16, opacity: 0.8 }}>▶</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BEST SELLERS ─────────────────────────────────────────────────────────────
function BestSellers({ onAddToCart, onWishlist, wishlist, onProductClick }) {
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller);
  return (
    <section style={{
      padding: "100px 4rem",
      background: "#2d2f33",
    }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
          ✦ TRENDING ✦
        </p>
        <h2 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "#fff",
          margin: 0,
        }}>Best Sellers</h2>
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #a78bfa, transparent)", margin: "1.5rem auto 0" }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        {bestSellers.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
            isWishlisted={wishlist.includes(p.id)}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onWishlist, isWishlisted, onProductClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        border: hovered ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Image */}
      <div
        onClick={() => onProductClick(product)}
        style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", cursor: "pointer" }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.5s ease",
          }}
        />
        <div style={{
          position: "absolute",
          top: 12, left: 12,
          background: "linear-gradient(135deg, #ec4899, #f43f5e)",
          color: "#fff",
          borderRadius: 100,
          padding: "3px 10px",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
        }}>
          -{product.discount}%
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
          style={{
            position: "absolute",
            top: 12, right: 12,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            width: 34, height: 34,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "1.2rem" }}>
        <h4
          onClick={() => onProductClick(product)}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.9rem",
            color: "#fff",
            margin: "0 0 8px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => e.target.style.color = "#a78bfa"}
          onMouseLeave={(e) => e.target.style.color = "#fff"}
        >
          {product.name}
        </h4>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", color: "#a78bfa", fontWeight: 700 }}>
            ₹{product.price.toLocaleString()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", textDecoration: "line-through" }}>
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            border: "none",
            color: "#fff",
            padding: "10px",
            borderRadius: 12,
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => e.target.style.opacity = "0.85"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

// ─── OUR STORY SECTION ────────────────────────────────────────────────────────
function OurStorySection() {
  return (
    <section style={{
      padding: "100px 4rem",
      background: "linear-gradient(180deg, #2d2f33 0%, #1a1b1e 100%)",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "5rem",
        alignItems: "center",
      }}>
        {/* Image */}
        <div style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            inset: -20,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.2), transparent 70%)",
            borderRadius: "50%",
          }} />
          <img
            src="https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80"
            alt="Our Story"
            style={{
              width: "100%",
              borderRadius: 24,
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          />
          <div style={{
            position: "absolute",
            bottom: -20,
            right: -20,
            background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
            borderRadius: 16,
            padding: "1.5rem",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.8rem", color: "#fff", fontWeight: 900 }}>2020</div>
            <div style={{ color: "#c4b5fd", fontSize: "0.7rem", letterSpacing: "0.15em" }}>FOUNDED</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 16 }}>
            ✦ OUR STORY ✦
          </p>
          <h2 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
            color: "#fff",
            margin: "0 0 1.5rem",
            lineHeight: 1.3,
          }}>
            Born from the Earth,
            <br />
            <span style={{ color: "#a78bfa" }}>Guided by the Stars</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            lineHeight: 1.9,
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: "1.5rem",
          }}>
            Wishstone was born from a deep belief that nature holds the answers to our modern struggles. Founded in 2020 by a group of healers and naturalists, we source every crystal, herb, and ritual tool with intention and reverence.
          </p>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            lineHeight: 1.9,
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: "2.5rem",
          }}>
            Our mission is simple: to make ancient healing wisdom accessible to the modern soul. Every product in our collection is ethically sourced, energetically cleansed, and delivered with love.
          </p>

          {[["Ethically Sourced", "💎"], ["Moon-Charged", "🌙"], ["Nature-Inspired", "🌿"]].map(([text, icon]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36,
                background: "rgba(167,139,250,0.15)",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>{icon}</div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Cinzel', serif", fontSize: "0.82rem", letterSpacing: "0.1em" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{
      padding: "100px 4rem",
      background: "#1a1b1e",
    }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
          ✦ SUPPORT ✦
        </p>
        <h2 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "#fff",
          margin: 0,
        }}>Frequently Asked</h2>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "0",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "1.5rem 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                textAlign: "left",
                gap: 16,
              }}
            >
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.9rem",
                color: open === i ? "#a78bfa" : "#fff",
                letterSpacing: "0.05em",
                transition: "color 0.3s",
              }}>{faq.q}</span>
              <span style={{
                color: "#a78bfa",
                fontSize: "1.2rem",
                transform: open === i ? "rotate(45deg)" : "rotate(0)",
                transition: "transform 0.3s",
                flexShrink: 0,
              }}>+</span>
            </button>
            {open === i && (
              <p style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                fontFamily: "'Cormorant Garamond', serif",
                paddingBottom: "1.5rem",
                margin: 0,
                animation: "fadeInUp 0.3s ease",
              }}>{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: "#0d0e10",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "4rem 4rem 2rem",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: "3rem",
        marginBottom: "3rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>💎</div>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#fff", letterSpacing: "0.12em" }}>WISHSTONE</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.8, fontFamily: "'Cormorant Garamond', serif", maxWidth: 260 }}>
            Premium natural crystals and healing products aligned with the universe's energy.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem" }}>
            {["Instagram", "Facebook", "YouTube"].map((s) => (
              <div key={s} style={{
                width: 36, height: 36,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                {s === "Instagram" ? "📸" : s === "Facebook" ? "📘" : "▶️"}
              </div>
            ))}
          </div>
        </div>

        {[
          ["Policies", ["Terms & Conditions", "Privacy Policy", "Shipping Policy", "Refund Policy"]],
          ["Shop", ["All Products", "Manifestation", "Therapy", "Habit Builder"]],
          ["Support", ["Contact Us", "Track Order", "FAQ", "About Us"]],
        ].map(([title, links]) => (
          <div key={title}>
            <h4 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.78rem",
              color: "#a78bfa",
              letterSpacing: "0.2em",
              margin: "0 0 1.5rem",
            }}>{title}</h4>
            {links.map((link) => (
              <div key={link} style={{ marginBottom: 10 }}>
                <a href="#" style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.target.style.color = "#a78bfa"}
                  onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{link}</a>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
          © 2025 WISHSTONE. ALL RIGHTS RESERVED.
        </span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
          Made with 💜 for the universe
        </span>
      </div>
    </footer>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────────────────────
function CategoryPage({ category, onAddToCart, onWishlist, wishlist, onProductClick }) {
  const products = PRODUCTS.filter((p) => p.category === category.id);

  return (
    <div style={{ paddingTop: 106 }}>
      {/* Banner */}
      <div style={{
        position: "relative",
        height: 360,
        overflow: "hidden",
      }}>
        <img src={category.image} alt={category.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)",
          display: "flex", alignItems: "center",
          padding: "0 4rem",
        }}>
          <div>
            <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.3em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>COLLECTION</p>
            <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "3rem", color: "#fff", margin: "0 0 1rem" }}>{category.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>{category.desc}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ background: "#2d2f33", padding: "4rem" }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: "#fff", marginBottom: "2rem", fontSize: "1.2rem", letterSpacing: "0.15em" }}>
          {products.length} PRODUCTS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={wishlist.includes(p.id)}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ product, onAddToCart, onWishlist, isWishlisted }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: 106, background: "#1a1b1e", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          {/* Left: Image + Video */}
          <div>
            <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", display: "block" }} />
            </div>
            {/* Video preview placeholder */}
            <div style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}>
              <img src={product.image} alt="video" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              <div style={{
                position: "absolute",
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(167,139,250,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, boxShadow: "0 0 30px rgba(167,139,250,0.4)",
              }}>▶</div>
              <div style={{ position: "absolute", bottom: 12, left: 12, color: "#fff", fontFamily: "'Cinzel', serif", fontSize: "0.75rem" }}>
                Product Preview
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div style={{
              display: "inline-block",
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: 100,
              padding: "4px 16px",
              marginBottom: "1rem",
            }}>
              <span style={{ color: "#c4b5fd", fontSize: "0.7rem", letterSpacing: "0.2em", fontFamily: "'Cinzel', serif" }}>
                {product.category.toUpperCase()}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: "2rem",
              color: "#fff",
              margin: "0 0 1rem",
              lineHeight: 1.3,
            }}>{product.name}</h1>

            <p style={{
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginBottom: "1.5rem",
            }}>{product.shortDesc}</p>

            {/* Suitable for */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.2em", fontFamily: "'Cinzel', serif", marginBottom: 8 }}>
                SUITABLE FOR
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>
                {product.suitableFor}
              </p>
            </div>

            {/* Benefits */}
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: "0.2em", fontFamily: "'Cinzel', serif", marginBottom: 12 }}>
                BENEFITS
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {product.benefits.map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontFamily: "'Cormorant Garamond', serif" }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: "2rem", color: "#a78bfa", fontWeight: 700 }}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1rem", textDecoration: "line-through" }}>
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span style={{
                  background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                  color: "#fff",
                  borderRadius: 100,
                  padding: "2px 10px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}>SAVE {product.discount}%</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: 0 }}>
                Inclusive of all taxes • Free shipping above ₹999
              </p>
            </div>

            {/* Qty + CTA */}
            <div style={{ display: "flex", gap: 12, marginBottom: "1rem", alignItems: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                overflow: "hidden",
              }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#fff", padding: "10px 16px", cursor: "pointer", fontSize: 18 }}>−</button>
                <span style={{ color: "#fff", padding: "10px 12px", fontFamily: "'Cinzel', serif", minWidth: 32, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#fff", padding: "10px 16px", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  background: added ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  border: "none",
                  color: "#fff",
                  padding: "14px",
                  borderRadius: 12,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.82rem",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {added ? "✓ ADDED TO CART" : "ADD TO CART"}
              </button>
              <button
                onClick={() => onWishlist(product.id)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "14px 16px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 20,
                }}
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        </div>

        {/* Full Video */}
        <div style={{ marginTop: "4rem" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: "1.2rem", letterSpacing: "0.15em", marginBottom: "1.5rem" }}>
            HOW TO USE
          </h2>
          <div style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            aspectRatio: "16/7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
            <img src={product.image} alt="usage" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
            <div style={{
              position: "absolute",
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(167,139,250,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, boxShadow: "0 0 40px rgba(167,139,250,0.5)",
              cursor: "pointer",
            }}>▶</div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "4rem" }}>
          <FAQSection />
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────
function CartPage({ cart, onUpdateQty, onRemove, onCheckout }) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "WOW300") {
      setDiscount(300);
      setCouponMsg("✅ Coupon applied! ₹300 off");
    } else {
      setDiscount(0);
      setCouponMsg("❌ Invalid coupon code");
    }
  };

  if (cart.length === 0) return (
    <div style={{ paddingTop: 150, textAlign: "center", background: "#1a1b1e", minHeight: "100vh", padding: "150px 2rem 4rem" }}>
      <div style={{ fontSize: 64, marginBottom: "1rem" }}>🛒</div>
      <h2 style={{ fontFamily: "'Cinzel', serif", color: "#fff", marginBottom: "1rem" }}>Your Cart is Empty</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
        Add some magical products to begin your journey
      </p>
    </div>
  );

  return (
    <div style={{ paddingTop: 106, background: "#1a1b1e", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "2rem", marginBottom: "2rem" }}>Your Cart</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem" }}>
          {/* Items */}
          <div>
            {cart.map((item) => (
              <div key={item.id} style={{
                display: "flex",
                gap: "1.5rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "1.5rem",
                marginBottom: "1rem",
                alignItems: "center",
              }}>
                <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Cinzel', serif", color: "#fff", margin: "0 0 6px", fontSize: "0.9rem" }}>{item.name}</h4>
                  <p style={{ color: "#a78bfa", fontFamily: "'Cinzel', serif", fontSize: "1rem", margin: 0 }}>₹{item.price.toLocaleString()}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10 }}>
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)} style={{ background: "none", border: "none", color: "#fff", padding: "8px 12px", cursor: "pointer" }}>−</button>
                  <span style={{ color: "#fff", padding: "8px", fontFamily: "'Cinzel', serif", minWidth: 28, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ background: "none", border: "none", color: "#fff", padding: "8px 12px", cursor: "pointer" }}>+</button>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: "1rem", marginBottom: 8 }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 18 }}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "2rem",
              position: "sticky",
              top: 120,
            }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: "1rem", letterSpacing: "0.15em", marginTop: 0 }}>ORDER SUMMARY</h3>

              {/* Coupon */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 10,
                      color: "#fff",
                      padding: "10px 14px",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                      border: "none",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "0 16px",
                      cursor: "pointer",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                    }}
                  >APPLY</button>
                </div>
                {couponMsg && <p style={{ color: discount > 0 ? "#10b981" : "#f43f5e", fontSize: "0.78rem", marginTop: 6 }}>{couponMsg}</p>}
              </div>

              {[
                ["Subtotal", `₹${subtotal.toLocaleString()}`],
                ["Shipping", shipping === 0 ? "FREE" : `₹${shipping}`],
                ...(discount > 0 ? [["Discount", `-₹${discount}`]] : []),
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}>{label}</span>
                  <span style={{ color: label === "Discount" ? "#10b981" : "#fff", fontFamily: "'Cinzel', serif", fontSize: "0.85rem" }}>{val}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ color: "#fff", fontFamily: "'Cinzel', serif", fontSize: "1rem" }}>Total</span>
                <span style={{ color: "#a78bfa", fontFamily: "'Cinzel', serif", fontSize: "1.3rem", fontWeight: 700 }}>₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={onCheckout}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  border: "none",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: 14,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                }}
              >PROCEED TO CHECKOUT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function CheckoutPage({ cart, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "", age: "", email: "", phone: "",
    flat: "", area: "", landmark: "", city: "", state: "", country: "India",
    payment: "cod",
  });
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validate form
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields (Name, Email, Phone)");
      return;
    }
    if (!form.flat || !form.area || !form.city || !form.state) {
      setError("Please fill in complete address details");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare order data (no login required)
      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          age: form.age ? Number(form.age) : undefined,
        },
        shippingAddress: {
          flat: form.flat,
          area: form.area,
          landmark: form.landmark,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: "",
        },
        items: cart.map(item => ({
          productId: item.id, // Keep as-is (number or string)
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.qty,
        })),
        couponCode: "",
        paymentMethod: form.payment,
      };

      console.log("🌙 Placing order...", orderData);

      // Send order to backend (without authentication)
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("✅ Order placed successfully!", result.order);
        setPlaced(true);
        setTimeout(() => onPlaceOrder(), 2000);
      } else {
        setError(result.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (placed) return (
    <div style={{ paddingTop: 150, textAlign: "center", background: "#1a1b1e", minHeight: "100vh", padding: "150px 2rem" }}>
      <div style={{ fontSize: 64, marginBottom: "1rem", animation: "bounce 0.6s ease" }}>✅</div>
      <h2 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#a78bfa", fontSize: "2rem" }}>Order Placed!</h2>
      <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
        Thank you, {form.name || "dear soul"}! Your magical order is on its way. 🌙
      </p>
    </div>
  );

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "#fff",
    padding: "12px 14px",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.72rem",
    letterSpacing: "0.15em",
    fontFamily: "'Cinzel', serif",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ paddingTop: 106, background: "#1a1b1e", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "2rem", marginBottom: "2rem" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem" }}>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "#a78bfa", fontSize: "0.85rem", letterSpacing: "0.2em", marginTop: 0 }}>DELIVERY INFORMATION</h3>

            {/* Error Message */}
            {error && (
              <div style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid #f43f5e",
                borderRadius: 10,
                padding: "12px",
                marginBottom: "1rem",
                color: "#f43f5e",
                fontSize: "0.85rem",
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[["Full Name", "name", "text"], ["Age", "age", "number"], ["Email", "email", "email"], ["Phone", "phone", "tel"]].map(([label, key, type]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
            </div>

            {[["Flat / House No.", "flat"], ["Area / Street", "area"], ["Landmark", "landmark"]].map(([label, key]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>{label}</label>
                <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              {[["City", "city"], ["State", "state"], ["Country", "country"]].map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Cinzel', serif", color: "#a78bfa", fontSize: "0.85rem", letterSpacing: "0.2em" }}>PAYMENT METHOD</h3>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[["cod", "💵 Cash on Delivery"], ["prepaid", "💳 Online Payment"], ["qr", "📱 QR Code"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setForm({ ...form, payment: val })}
                  style={{
                    flex: 1,
                    background: form.payment === val ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.03)",
                    border: form.payment === val ? "1px solid #a78bfa" : "1px solid rgba(255,255,255,0.1)",
                    color: form.payment === val ? "#a78bfa" : "rgba(255,255,255,0.6)",
                    borderRadius: 12,
                    padding: "12px 8px",
                    cursor: "pointer",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    transition: "all 0.3s",
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* Summary + Place Order */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "2rem",
            height: "fit-content",
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: "#fff", fontSize: "0.9rem", letterSpacing: "0.15em", marginTop: 0 }}>ORDER</h3>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Cormorant Garamond', serif", margin: 0, fontSize: "0.95rem" }}>{item.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", margin: "2px 0 0" }}>Qty: {item.qty}</p>
                </div>
                <span style={{ color: "#fff", fontFamily: "'Cinzel', serif", fontSize: "0.85rem" }}>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <span style={{ color: "#fff", fontFamily: "'Cinzel', serif" }}>Total</span>
              <span style={{ color: "#a78bfa", fontFamily: "'Cinzel', serif", fontSize: "1.2rem", fontWeight: 700 }}>₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "rgba(167,139,250,0.5)" : "linear-gradient(135deg, #7c3aed, #a78bfa)",
                border: "none",
                color: "#fff",
                padding: "16px",
                borderRadius: 14,
                fontFamily: "'Cinzel', serif",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "⏳ Processing..." : "PLACE ORDER ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ─────────────────────────────────────────────────────────────
function WishlistPage({ wishlistIds, onAddToCart, onWishlist, onProductClick }) {
  const items = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  if (items.length === 0) return (
    <div style={{ paddingTop: 150, textAlign: "center", background: "#1a1b1e", minHeight: "100vh", padding: "150px 2rem" }}>
      <div style={{ fontSize: 64, marginBottom: "1rem" }}>🤍</div>
      <h2 style={{ fontFamily: "'Cinzel', serif", color: "#fff" }}>Your Wishlist is Empty</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
        Heart products you love to save them here
      </p>
    </div>
  );
  return (
    <div style={{ paddingTop: 106, background: "#1a1b1e", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "2rem", marginBottom: "2rem" }}>Your Wishlist</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={true}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ALL PRODUCTS PAGE ────────────────────────────────────────────────────────
function AllProductsPage({ onAddToCart, onWishlist, wishlist, onProductClick }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div style={{ paddingTop: 106, background: "#1a1b1e", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#fff", fontSize: "2rem", marginBottom: "2rem" }}>All Products</h1>

        <div style={{ display: "flex", gap: 12, marginBottom: "2rem", flexWrap: "wrap" }}>
          {[["all", "All"], ...CATEGORIES.map((c) => [c.id, c.name])].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              style={{
                background: activeFilter === val ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "rgba(255,255,255,0.06)",
                border: activeFilter === val ? "none" : "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                borderRadius: 100,
                padding: "8px 20px",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              isWishlisted={wishlist.includes(p.id)}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onCategoryClick, onAddToCart, onWishlist, wishlist, onProductClick }) {
  return (
    <>
      <HeroSection onShop={() => {}} />
      <CategorySection onCategoryClick={onCategoryClick} />
      <UsesSection />
      <BestSellers onAddToCart={onAddToCart} onWishlist={onWishlist} wishlist={wishlist} onProductClick={onProductClick} />
      <OurStorySection />
      <FAQSection />
      <Footer />
    </>
  );
}

// ─── CSS INJECTION ────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1a1b1e; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1a1b1e; }
  ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 3px; }

  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1); }
  }
  @keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 0.6; }
    100% { transform: translateY(-100vh) scale(0); opacity: 0; }
  }
  @keyframes moonGlow {
    0%, 100% { box-shadow: 0 0 60px rgba(245,240,232,0.3), 0 0 120px rgba(200,184,154,0.15); }
    50% { box-shadow: 0 0 80px rgba(245,240,232,0.45), 0 0 160px rgba(200,184,154,0.25); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-33.33%); }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-8px); }
  }
`;

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WishstoneApp() {
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const toggleWishlist = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleNav = (nav) => {
    setSelectedProduct(null);
    setSelectedCategory(null);
    if (nav === "home") setPage("home");
    else if (nav === "category") {
      setPage("home");
      setTimeout(() => document.getElementById("cat-section")?.scrollIntoView({ behavior: "smooth" }), 100);
    } else if (nav === "products") setPage("products");
    else if (nav === "our-story") setPage("home");
    else if (nav === "cart") setPage("cart");
    else if (nav === "wishlist") setPage("wishlist");
    else setPage(nav);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setPage("category");
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setPage("product");
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const renderPage = () => {
    if (page === "product" && selectedProduct) return (
      <ProductPage
        product={selectedProduct}
        onAddToCart={addToCart}
        onWishlist={toggleWishlist}
        isWishlisted={wishlist.includes(selectedProduct.id)}
      />
    );
    if (page === "category" && selectedCategory) return (
      <CategoryPage
        category={selectedCategory}
        onAddToCart={addToCart}
        onWishlist={toggleWishlist}
        wishlist={wishlist}
        onProductClick={handleProductClick}
      />
    );
    if (page === "products") return <AllProductsPage onAddToCart={addToCart} onWishlist={toggleWishlist} wishlist={wishlist} onProductClick={handleProductClick} />;
    if (page === "cart") return <CartPage cart={cart} onUpdateQty={updateQty} onRemove={removeFromCart} onCheckout={() => setPage("checkout")} />;
    if (page === "checkout") return <CheckoutPage cart={cart} onPlaceOrder={() => { setCart([]); setPage("home"); }} />;
    if (page === "wishlist") return <WishlistPage wishlistIds={wishlist} onAddToCart={addToCart} onWishlist={toggleWishlist} onProductClick={handleProductClick} />;
    return (
      <HomePage
        onCategoryClick={handleCategoryClick}
        onAddToCart={addToCart}
        onWishlist={toggleWishlist}
        wishlist={wishlist}
        onProductClick={handleProductClick}
      />
    );
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", background: "#1a1b1e", minHeight: "100vh" }}>
        <Header
          cartCount={cartCount}
          wishCount={wishlist.length}
          onNav={handleNav}
          currentPage={page}
        />
        <OfferBanner />
        <main style={{ paddingTop: page === "home" ? 0 : 0 }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}
