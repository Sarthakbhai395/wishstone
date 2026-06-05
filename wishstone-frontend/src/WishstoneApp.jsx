import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IntentionAnchoringPage from "./IntentionAnchoringPage";

const T = {
  bg: "#F5F0E8", bgDark: "#2C3320",
  text: "#1a1a1a", textMid: "#4a4a4a",
  orange: "#E8720C", orangeD: "#C45E00", orangeL: "#FF9A3C",
  white: "#ffffff", border: "rgba(26,26,26,0.12)",
};

const PRODUCTS = [
  {
    id: 1, slug: "celestial-rose-quartz", name: "WishStone — Rose Quartz", category: "manifestation", price: 1299, originalPrice: 1799, discount: 28,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80", "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80", "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80"],
    shortDesc: "Moon-charged rose quartz to amplify love, compassion, and self-worth energies in your sacred space.", suitableFor: "Beginners, healers, those seeking emotional balance", benefits: ["Enhances self-love", "Promotes emotional healing", "Attracts positive relationships", "Clears heart chakra"], bestSeller: true
  },
  {
    id: 2, slug: "lunar-amethyst-cluster", name: "WishStone — Amethyst", category: "manifestation", price: 2199, originalPrice: 2999, discount: 27,
    image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80", "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80", "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80"],
    shortDesc: "Premium amethyst from Brazilian mines for deep meditation and amplifying intuition.", suitableFor: "Meditators, spiritual seekers, healers", benefits: ["Deepens meditation", "Protects energy field", "Enhances intuition", "Promotes restful sleep"], bestSeller: true
  },
  {
    id: 3, slug: "obsidian-protection-stone", name: "WishStone — Obsidian", category: "manifestation", price: 899, originalPrice: 1199, discount: 25,
    image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80", "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80", "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80"],
    shortDesc: "Volcanic obsidian known for powerful protective properties against negative energies.", suitableFor: "Empaths, sensitives, protection seekers", benefits: ["Shields from negativity", "Grounds energy", "Reveals hidden truths", "Heals emotional wounds"], bestSeller: true
  },
  {
    id: 4, slug: "moonstone-ritual-kit", name: "Moonstone Ritual Kit", category: "habit-builder", price: 1899, originalPrice: 2499, discount: 24,
    image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80", "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80", "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80", "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80"],
    shortDesc: "Complete ritual kit with journal, crystal, and guide for powerful daily moon rituals.", suitableFor: "Anyone building spiritual daily habits", benefits: ["Creates daily ritual", "Tracks moon cycles", "Builds consistency", "Deepens self-awareness"], bestSeller: false
  },
  {
    id: 5, slug: "healing-lavender-bundle", name: "Healing Lavender Bundle", category: "therapy", price: 699, originalPrice: 999, discount: 30,
    image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80", "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80", "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80", "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80"],
    shortDesc: "Hand-harvested organic lavender for cleansing negative energy and deep relaxation.", suitableFor: "Anyone seeking calm, anxiety relief, better sleep", benefits: ["Reduces stress", "Purifies space", "Promotes sleep", "Calms the nervous system"], bestSeller: true
  },
  {
    id: 6, slug: "sacred-sandalwood-incense", name: "Sacred Sandalwood Incense", category: "therapy", price: 499, originalPrice: 699, discount: 29,
    image: "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80", "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80", "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80", "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80"],
    shortDesc: "Premium Mysore sandalwood incense for meditation, yoga, and sacred home spaces.", suitableFor: "Meditators, yoga practitioners, home rituals", benefits: ["Deepens focus", "Purifies air", "Elevates mood", "Aids in prayer"], bestSeller: false
  },
];

const FAQS = [
  { q: "WishStone kaise use karein?", a: "Apne stone ko moonlight ya sage smoke se cleanse karein. Dono haathon mein pakad ke apni intention set karein. Isse apne paas rakhein ya sacred space mein place karein." },
  { q: "Results kitne time mein dikhte hain?", a: "Zyaadatar customers 7-21 din ke consistent use mein subtle energy shifts notice karte hain. Results individual, intention clarity, aur usage consistency pe depend karte hain." },
  { q: "Kya saare products 100% natural hain?", a: "Haan. Har WishStone product ethically sourced, 100% natural, aur synthetic treatments se free hai." },
  { q: "Shipping kitne time mein hoti hai?", a: "Standard delivery: 5-7 business days. Express delivery: 2-3 business days. ₹999 se upar ke orders pe free shipping." },
  { q: "Return policy kya hai?", a: "Delivery ke 7 din ke andar hassle-free returns. Product unused aur original packaging mein hona chahiye. Refund 3-5 business days mein process hota hai." },
];

const QUOTES = [
  { text: "Imagination is everything. It is the preview of life's coming attractions.", author: "Albert Einstein" },
  { text: "Whatever the mind can conceive and believe, it can achieve.", author: "Napoleon Hill" },
  { text: "You are the creator of your own reality.", author: "Abraham Hicks" },
  { text: "Ask for what you want and be prepared to get it.", author: "Maya Angelou" },
  { text: "The universe is not outside of you. Look inside yourself.", author: "Rumi" },
  { text: "जो तुम खोज रहे हो, वह भी तुम्हें खोज रहा है।", author: "Rumi" },
];

const MARQUEE_ITEMS = [
  "शुभ संकल्प", "Manifest with Intention", "विश्वास करो, पाओ", "You Are The Creator",
  "ब्रह्माण्ड पर भरोसा करो", "Abundance Is Your Birthright", "WishStone", "अपनी नियति बनाओ",
  "शुभ संकल्प", "Manifest with Intention", "विश्वास करो, पाओ", "You Are The Creator",
  "ब्रह्माण्ड पर भरोसा करो", "Abundance Is Your Birthright", "WishStone", "अपनी नियति बनाओ",
];

const POWERS = [
  {
    num: "01", iconBg: "#fff0e8", icon: "🎯", title: "Intention Anchoring",
    desc: "Stone ka physical weight ek somatic anchor create karta hai — ek tangible connection apni conscious wish aur physical duniya ke beech.",
    tag: "NEUROSCIENCE-BACKED",
    image: "/wishstone-horizontal.jpeg"
  },
  {
    num: "02", iconBg: "#f0e8f8", icon: "🔮", title: "Frequency Activation",
    desc: "Specific crystal formations jo apni personal energy field ko tune karti hain — clarity, abundance, aur love attract karo.",
    tag: "CRYSTAL SCIENCE",
    image: "/cosmic-eye.jpeg"
  },
  {
    num: "03", iconBg: "#e8f0e8", icon: "🌿", title: "Earth Grounding",
    desc: "Natural stone compounds carry prithvi ki stabilizing frequency — calm, centered, aur aligned raho apni highest desires ke saath.",
    tag: "EARTH ENERGY",
    image: "/defuser-product.jpeg"
  },
];

// ── Community Videos — local public folder ──
const COMMUNITY_VIDEOS = [
  { id: 1, videoUrl: `${process.env.PUBLIC_URL || ""}/v1.mp4`, title: "Balance", caption: "Finding stillness in motion", tag: "MINDFULNESS" },
  { id: 2, videoUrl: `${process.env.PUBLIC_URL || ""}/v2.mp4`, title: "Gratitude", caption: "Everyday abundance", tag: "GRATITUDE" },
  { id: 3, videoUrl: `${process.env.PUBLIC_URL || ""}/v3.mp4`, title: "Clarity", caption: "Intention becomes reality", tag: "MANIFESTATION" },
  { id: 4, videoUrl: `${process.env.PUBLIC_URL || ""}/v1.mp4`, title: "Surrender", caption: "Let go, let flow", tag: "SURRENDER" },
  { id: 5, videoUrl: `${process.env.PUBLIC_URL || ""}/v2.mp4`, title: "Abundance", caption: "Calling in what is mine", tag: "ABUNDANCE" },
  { id: 6, videoUrl: `${process.env.PUBLIC_URL || ""}/v3.mp4`, title: "Presence", caption: "Here. Now. Always.", tag: "PRESENCE" },
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Noto+Serif+Devanagari:wght@700;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:#F5F0E8;color:#1a1a1a;font-family:'Inter',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#F5F0E8;}
  ::-webkit-scrollbar-thumb{background:#E8720C;border-radius:3px;}
  @keyframes autoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .scroll-hide::-webkit-scrollbar{display:none;}
  .scroll-hide{-ms-overflow-style:none;scrollbar-width:none;}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes modalIn{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes couponSlide{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
  @keyframes copyPop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes quoteIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cardIn{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes shimmerBar{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes stone3d{
    0%   { transform: rotateY(-18deg) rotateX(6deg) translateY(0px); }
    25%  { transform: rotateY(8deg)  rotateX(-4deg) translateY(-10px); }
    50%  { transform: rotateY(22deg) rotateX(6deg)  translateY(-18px); }
    75%  { transform: rotateY(6deg)  rotateX(-3deg) translateY(-8px); }
    100% { transform: rotateY(-18deg) rotateX(6deg) translateY(0px); }
  }
  @keyframes badgeFloat1{0%,100%{transform:translateY(0px)}50%{transform:translateY(-7px)}}
  @keyframes badgeFloat2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
  @keyframes badgeFloat3{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
  @keyframes videoSlide{from{transform:translateX(0)}to{transform:translateX(calc(-220px * 4 - 1rem * 4))}}
  @keyframes wishJump{
    0%{transform:scale(1) translateY(0);}
    20%{transform:scale(1.35) translateY(-8px);}
    40%{transform:scale(0.9) translateY(0);}
    60%{transform:scale(1.15) translateY(-4px);}
    80%{transform:scale(0.97) translateY(0);}
    100%{transform:scale(1) translateY(0);}
  }
  @keyframes flyHeart{
    0%  { transform:translate(0,0) scale(1.2) rotate(-10deg); opacity:1; }
    20% { transform:translate(calc(var(--dx)*0.15), calc(var(--dy)*0.1 - 80px)) scale(1.5) rotate(15deg); opacity:1; }
    50% { transform:translate(calc(var(--dx)*0.5), calc(var(--dy)*0.4 - 60px)) scale(1.2) rotate(-5deg); opacity:1; }
    80% { transform:translate(calc(var(--dx)*0.85), calc(var(--dy)*0.85 - 10px)) scale(0.8) rotate(5deg); opacity:0.9; }
    100%{ transform:translate(var(--dx), var(--dy)) scale(0.2) rotate(0deg); opacity:0; }
  }
  @keyframes flyTrail{
    0%  { transform:translate(0,0) scale(0.7); opacity:0.7; }
    60% { transform:translate(calc(var(--dx)*0.5), calc(var(--dy)*0.4 - 40px)) scale(0.4); opacity:0.4; }
    100%{ transform:translate(var(--dx), var(--dy)) scale(0.1); opacity:0; }
  }
  @keyframes burstPop{
    0%  { transform:translate(-50%,-50%) scale(0) rotate(0deg); opacity:1; }
    60% { transform:translate(calc(-50% + var(--bx)), calc(-50% + var(--by))) scale(1.2) rotate(var(--br)); opacity:0.9; }
    100%{ transform:translate(calc(-50% + var(--bx)*1.8), calc(-50% + var(--by)*1.8)) scale(0); opacity:0; }
  }
  @keyframes wishIconPop{
    0%  { transform:scale(1); }
    40% { transform:scale(1.5) rotate(-8deg); }
    70% { transform:scale(0.85) rotate(5deg); }
    100%{ transform:scale(1) rotate(0deg); }
  }
  @keyframes cartIconAnim{
    0%  { transform:scale(1) rotate(0deg); }
    15% { transform:scale(1.4) rotate(-14deg); }
    30% { transform:scale(1.25) rotate(10deg); }
    50% { transform:scale(1.32) rotate(-8deg); }
    65% { transform:scale(1.15) rotate(5deg); }
    80% { transform:scale(1.08) rotate(-2deg); }
    100%{ transform:scale(1) rotate(0deg); }
  }
  @keyframes dashPageIn{
    from{opacity:0;transform:translateX(32px) scale(0.98);}
    to{opacity:1;transform:translateX(0) scale(1);}
  }
  .nav-link{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#1a1a1a;padding:4px 0;transition:color 0.2s;}
  .nav-link:hover,.nav-link.active{color:#E8720C;}
  .prod-card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid rgba(26,26,26,0.08);transition:all 0.3s;cursor:pointer;}
  .prod-card:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(26,26,26,0.12);}
  .btn-orange{background:linear-gradient(135deg,#C45E00,#E8720C);border:none;color:#fff;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;letter-spacing:0.06em;transition:all 0.3s;}
  .btn-orange:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,114,12,0.4);background:#fff;color:#000;}
  .btn-outline{background:transparent;border:1.5px solid #fff;color:#1a1a1a;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;letter-spacing:0.06em;transition:all 0.2s;}
  .btn-outline:hover{border-color:#E8720C;color:#E8720C;}
  .max-w{max-width:1200px;margin:0 auto;width:100%;}
  .power-card{background:#fff;border-radius:16px;padding:1.8rem 1.6rem;border:1px solid rgba(26,26,26,0.07);transition:all 0.3s;}
  .power-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(232,114,12,0.1);border-color:rgba(232,114,12,0.18);}
  .show-mobile-flex{display:none !important;}

  /* Video card styles */
  .video-card{
    position:relative;
    width:220px;
    flex-shrink:0;
    border-radius:20px;
    overflow:hidden;
    cursor:pointer;
    box-shadow:0 12px 40px rgba(0,0,0,0.18);
    transition:transform 0.3s, box-shadow 0.3s;
    background:#1a1a1a;
  }
  .video-card:hover{
    transform:scale(1.04) translateY(-6px);
    box-shadow:0 24px 60px rgba(0,0,0,0.28);
  }
  .video-card video{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
    transition:opacity 0.3s;
  }

  @media(max-width:1024px){
    .hero-grid{grid-template-columns:1fr !important;}
    .hero-right{display:none !important;}
    .powers-layout{grid-template-columns:1fr !important;}
    .powers-center-col{display:none !important;}
    .checkout-grid{grid-template-columns:1fr !important;}
    .prod-detail-grid{grid-template-columns:1fr !important;}
    .dashboard-grid{grid-template-columns:1fr !important;}
    .dashboard-stats{grid-template-columns:repeat(2,1fr) !important;}
    .dashboard-layout{grid-template-columns:1fr !important;}
    .dash-sidebar{position:relative !important; top:0 !important;}
    .profile-grid{grid-template-columns:1fr !important;}
  }
  @media(max-width:768px){
    .hero-grid{grid-template-columns:1fr !important; gap:0 !important;}
    .hero-right{display:flex !important;}
    .prod-grid{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr 1fr !important;}
    .stats-row{flex-wrap:wrap !important;gap:1.5rem !important;}
    .header-nav{display:none !important;}
    .hero-badge{transform:scale(0.85) !important; transform-origin:left center !important;}
    .show-mobile-flex{display:flex !important;}
    .dashboard-stats{grid-template-columns:repeat(2,1fr) !important;}
    .founder-grid{grid-template-columns:1fr !important;}
    .founder-img-col{min-height:300px !important; height:300px !important;}
    .video-card{width:180px !important;}
    .dashboard-layout{grid-template-columns:1fr !important; gap:1.2rem !important;}
    .dash-sidebar{margin-bottom:1rem !important;}
    .dash-order-card{padding:1rem !important; gap:10px !important;}
    .dash-order-card > div:first-child{display:none !important;}
    .profile-grid{grid-template-columns:1fr !important;}
    .profile-info-grid{grid-template-columns:1fr !important;}
    .prod-detail-grid{grid-template-columns:1fr !important; gap:1.5rem !important;}
  }
  @media(max-width:600px){
    .prod-grid{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
    .stats-row > div{flex:1 1 45% !important;}
    .hero-badge{transform:scale(0.78) !important;}
    .dashboard-stats{grid-template-columns:repeat(2,1fr) !important;}
    .video-card{width:160px !important;}
    .checkout-grid{grid-template-columns:1fr !important;}
    .checkout-form-grid{grid-template-columns:1fr !important;}
    .profile-grid{grid-template-columns:1fr !important;}
    .profile-info-grid{grid-template-columns:1fr !important;}
    .prod-detail-grid{grid-template-columns:1fr !important;}
  }
  @media(max-width:480px){
    .stats-row > div{flex:1 1 100% !important;}
    .dashboard-stats{grid-template-columns:1fr 1fr !important;}
    .video-card{width:150px !important;}
    .dash-order-card{flex-direction:column !important; align-items:flex-start !important;}
    .profile-grid{grid-template-columns:1fr !important;}
    .profile-info-grid{grid-template-columns:1fr !important;}
    .checkout-form-grid{grid-template-columns:1fr !important;}
  }
  /* ── GLOBAL RESPONSIVE FIXES ── */
  img{max-width:100%;}
  *{box-sizing:border-box;}
  @media(max-width:768px){
    .max-w{padding-left:1rem !important;padding-right:1rem !important;}
    h1,h2{word-break:break-word;}
    .prod-detail-grid > div:first-child{margin-bottom:1rem;}
    .prod-detail-grid .scroll-hide{flex-wrap:nowrap;}
  }
  @media(max-width:400px){
    .prod-grid{grid-template-columns:1fr !important;}
    .dashboard-stats{grid-template-columns:1fr 1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
    .checkout-grid{grid-template-columns:1fr !important;}
    .checkout-form-grid{grid-template-columns:1fr !important;}
  }`;

// ─── HEADER ───────────────────────────────────────────────────
function Header({ cartCount, wishCount, onNav, currentPage, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);
  const [cartAnim, setCartAnim] = useState(false);
  const prevWishCount = useRef(wishCount);
  const prevCartCount = useRef(cartCount);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (wishCount > prevWishCount.current) {
      setWishAnim(true);
      const t = setTimeout(() => setWishAnim(false), 600);
      return () => clearTimeout(t);
    }
    prevWishCount.current = wishCount;
  }, [wishCount]);

  // Trigger cart icon animation when cartCount increases
  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartAnim(true);
      const t = setTimeout(() => setCartAnim(false), 700);
      return () => clearTimeout(t);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const links = [["products", "Shop"], ["rituals", "The Ritual"], ["benefits", "Benefits"], ["stories", "Stories"]];
  const navTo = (k) => { onNav(k); setMobileOpen(false); };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(245,240,232,0.97)" : "rgba(245,240,232,0.92)",
      backdropFilter: "blur(14px)",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      transition: "all 0.3s",
    }}>
      <div className="max-w" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 clamp(1rem,4vw,2.5rem)" }}>
        <button onClick={() => navTo("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 28, width: "auto", display: "block" }} />
        </button>

        <nav className="header-nav" style={{ display: "flex", gap: "2.2rem", alignItems: "center" }}>
          {links.map(([k, l]) => (
            <button key={k} className={`nav-link${currentPage === k ? " active" : ""}`} onClick={() => navTo(k)}>{l}</button>
          ))}
          <button onClick={() => navTo("cart")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.text, position: "relative", padding: "6px 4px", borderRadius: 8, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg id="cart-nav-desktop" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", animation: cartAnim ? "cartIconAnim 0.7s cubic-bezier(0.36,0.07,0.19,0.97)" : "none" }}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            {cartCount > 0 && <span style={{ background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: "0.58rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, position: "absolute", top: -4, right: -6 }}>{cartCount}</span>}
          </button>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          {/* Wishlist icon — black default, red when items exist */}
          <button id="wishlist-nav-btn" onClick={() => navTo("wishlist")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={wishCount > 0 ? "#e53e3e" : "none"} stroke={wishCount > 0 ? "#e53e3e" : "#000000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.25s ease", display: "block", animation: wishAnim ? "wishJump 0.6s cubic-bezier(0.36,0.07,0.19,0.97)" : "none" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: "0.52rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{wishCount}</span>}
          </button>

          {/* Cart icon mobile — black */}
          <button id="cart-nav-btn" onClick={() => navTo("cart")} className="show-mobile-flex" style={{ display: "none", background: "none", border: "none", cursor: "pointer", position: "relative", padding: "6px", alignItems: "center", justifyContent: "center", borderRadius: 8, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", animation: cartAnim ? "cartIconAnim 0.7s cubic-bezier(0.36,0.07,0.19,0.97)" : "none" }}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#1a1a1a", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: "0.52rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
          </button>
          {user ? (
            <>
              <button onClick={() => navTo("dashboard")} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, border: "none", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                {(user.name || user.email || "U")[0].toUpperCase()}
              </button>
              <button className="btn-outline header-nav" style={{ padding: "7px 14px", fontSize: "0.72rem", borderRadius: 6 }} onClick={onLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-orange header-nav" onClick={() => navTo("products")} style={{ padding: "9px 18px", fontSize: "0.72rem", borderRadius: 6 }}>ORDER NOW</button>
              <button className="nav-link header-nav" onClick={() => navTo("auth")} style={{ fontSize: "0.72rem" }}>LOGIN</button>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "6px", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center" }} className="show-mobile-flex">
            <span style={{ display: "block", width: 22, height: 2, background: T.text, borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: T.text, borderRadius: 2, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: T.text, borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: T.white, borderTop: `1px solid ${T.border}`, padding: "1rem clamp(1rem,4vw,2.5rem) 1.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          {links.map(([k, l]) => (
            <button key={k} onClick={() => navTo(k)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "12px 0", fontSize: "0.95rem", fontWeight: 600, color: currentPage === k ? T.orange : T.text, borderBottom: `1px solid ${T.border}`, fontFamily: "'Inter',sans-serif" }}>{l}</button>
          ))}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            {user ? (
              <>
                <button className="btn-orange" onClick={() => navTo("dashboard")} style={{ padding: "10px 20px", fontSize: "0.8rem", borderRadius: 7, flex: 1 }}>My Account</button>
                <button className="btn-outline" onClick={() => { onLogout(); setMobileOpen(false); }} style={{ padding: "10px 20px", fontSize: "0.8rem", borderRadius: 7, flex: 1 }}>Sign Out</button>
              </>
            ) : (
              <>
                <button className="btn-orange" onClick={() => navTo("products")} style={{ padding: "10px 20px", fontSize: "0.8rem", borderRadius: 7, flex: 1 }}>Order Now</button>
                <button className="btn-outline" onClick={() => navTo("auth")} style={{ padding: "10px 20px", fontSize: "0.8rem", borderRadius: 7, flex: 1 }}>Login</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── HERO — TEXT CENTERED ─────────────────────────────────────
function Hero({ onShop, onRitual }) {
  const [rot, setRot] = useState({ x: 6, y: -18 });
  const [dragging, setDragging] = useState(false);
  const [last, setLast] = useState({ x: 0, y: 0 });
  const [autoAnim, setAutoAnim] = useState(true);

  const onMouseDown = e => { setDragging(true); setAutoAnim(false); setLast({ x: e.clientX, y: e.clientY }); };
  const onMouseMove = e => {
    if (!dragging) return;
    const dx = e.clientX - last.x; const dy = e.clientY - last.y;
    setRot(r => ({ x: Math.max(-40, Math.min(40, r.x - dy * 0.4)), y: r.y + dx * 0.5 }));
    setLast({ x: e.clientX, y: e.clientY });
  };
  const onMouseUp = () => setDragging(false);
  const onTouchStart = e => { setDragging(true); setAutoAnim(false); setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
  const onTouchMove = e => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - last.x; const dy = e.touches[0].clientY - last.y;
    setRot(r => ({ x: Math.max(-40, Math.min(40, r.x - dy * 0.4)), y: r.y + dx * 0.5 }));
    setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const onTouchEnd = () => setDragging(false);

  return (
    <section style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", paddingTop: 80, paddingBottom: 40, paddingLeft: "clamp(1rem,5vw,3.5rem)", paddingRight: "clamp(1rem,5vw,3.5rem)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "18%", right: "6%", width: 8, height: 8, borderRadius: "50%", background: T.orange, opacity: 0.5 }} />
      <div style={{ position: "absolute", bottom: "28%", right: "32%", width: 6, height: 6, borderRadius: "50%", background: T.orange, opacity: 0.4 }} />

      <div className="max-w hero-grid" style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
        {/* LEFT: Text — fully centered */}
        <div style={{ animation: "fadeUp 0.8s ease both", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(232,114,12,0.08)", border: `1px solid rgba(232,114,12,0.22)`, borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingLeft: 14, paddingRight: 14, marginBottom: "1.6rem" }}>
            <span style={{ color: T.orange, fontSize: 10 }}>✦</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase" }}>India's Sacred Manifestation Stone</span>
          </div>

          <h1 style={{ fontFamily: "'Noto Serif Devanagari','Playfair Display',serif", fontSize: "clamp(2.2rem,5.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "0.3rem", color: T.text }}>अपनी इच्छाएँ,</h1>
          <h1 style={{ fontFamily: "'Noto Serif Devanagari','Playfair Display',serif", fontSize: "clamp(2.2rem,5.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem", color: T.orange, fontStyle: "italic" }}>अपनी नियति।</h1>

          <p style={{ fontSize: "clamp(0.7rem,1.2vw,0.88rem)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: T.text, marginBottom: "1.2rem", borderBottom: `2px solid ${T.text}`, paddingBottom: "0.8rem", display: "inline-block" }}>Manifest with WishStone</p>

          <blockquote style={{ fontSize: "clamp(0.8rem,1.4vw,0.88rem)", color: T.textMid, lineHeight: 1.7, marginBottom: "2rem", borderLeft: `3px solid ${T.orange}`, paddingLeft: "1rem", fontStyle: "italic", maxWidth: 420, textAlign: "left" }}>
            "जो तुम खोज रहे हो, वह भी तुम्हें खोज रहा है — WishStone उस रास्ते को छोटा करता है।"
          </blockquote>

          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-orange" onClick={onShop} style={{ paddingTop: 13, paddingBottom: 13, paddingLeft: 26, paddingRight: 26, fontSize: "0.82rem", borderRadius: 8 }}>अभी शुरू करें</button>
            <button className="btn-outline" onClick={onRitual} style={{ paddingTop: 13, paddingBottom: 13, paddingLeft: 26, paddingRight: 26, fontSize: "0.82rem", borderRadius: 8 }}>The Ritual</button>
          </div>
        </div>

        {/* RIGHT: 3D Interactive Stone */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "clamp(320px,45vw,520px)", perspective: "900px" }}
          onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: "0.62rem", color: T.textMid, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, opacity: 0.6, whiteSpace: "nowrap", zIndex: 10 }}>↔ Drag to rotate</div>
          <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            style={{ position: "relative", zIndex: 2, transformStyle: "preserve-3d", transform: autoAnim ? undefined : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, animation: autoAnim ? "stone3d 8s ease-in-out infinite" : "none", cursor: dragging ? "grabbing" : "grab", transition: dragging ? "none" : "transform 0.4s ease", userSelect: "none" }}>
            <div style={{ width: "clamp(190px,24vw,300px)", height: "clamp(230px,30vw,360px)", borderRadius: "50% 50% 48% 52% / 55% 55% 45% 45%", background: "radial-gradient(ellipse at 32% 28%, #f5b070 0%, #38271a 40%, #120c08 65%, #181716 100%)", boxShadow: "0 40px 100px rgba(200,90,16,0.5), 0 0 0 1px rgba(200,90,16,0.1), inset 0 -25px 50px rgba(0,0,0,0.25), inset 0 12px 35px rgba(255,210,130,0.35)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "18%", left: "22%", width: "35%", height: "28%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,180,0.75) 0%, transparent 70%)", filter: "blur(6px)" }} />
              <div style={{ position: "absolute", top: "10%", left: "15%", width: "20%", height: "14%", borderRadius: "50%", background: "rgba(255,245,220,0.45)", filter: "blur(4px)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)", borderRadius: "0 0 50% 50%" }} />
            </div>
            <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", width: "70%", height: 20, borderRadius: "50%", background: "rgba(200,90,16,0.22)", filter: "blur(10px)" }} />
          </div>
          <div className="hero-badge" style={{ position: "absolute", top: "14%", left: "0%", background: T.white, borderRadius: 14, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 148, zIndex: 3, animation: "badgeFloat1 4s ease-in-out infinite" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#ff6b6b,#ee5a24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🎯</div>
            <div><div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>Set Intentions</div><div style={{ fontSize: "0.63rem", color: T.textMid }}>Daily Ritual</div></div>
          </div>
          <div className="hero-badge" style={{ position: "absolute", top: "40%", right: "-4%", background: T.white, borderRadius: 14, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 158, zIndex: 3, animation: "badgeFloat2 4.5s ease-in-out infinite" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#f9ca24,#f0932b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>✨</div>
            <div><div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>Energy Aligned</div><div style={{ fontSize: "0.63rem", color: T.textMid }}>Natural Stone</div></div>
          </div>
          <div className="hero-badge" style={{ position: "absolute", bottom: "12%", left: "4%", background: T.white, borderRadius: 14, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 148, zIndex: 3, animation: "badgeFloat3 5s ease-in-out infinite" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#6ab04c,#2ecc71)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🌿</div>
            <div><div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>Inner Peace</div><div style={{ fontSize: "0.63rem", color: T.textMid }}>Grounding</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────
function StatsBar() {
  return (
    <div style={{ background: T.bg, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "28px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(2rem,5vw,5rem)", flexWrap: "wrap" }}>
          {[["12K+", "DREAMERS"], ["4.9★", "RATING"], ["100%", "NATURAL"], ["21", "DAY SHIFT"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.3rem,2.5vw,1.8rem)", fontWeight: 800, color: T.text, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: T.textMid, letterSpacing: "0.14em", marginTop: 4, fontFamily: "'Inter',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────
function MarqueeSection() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ background: T.bgDark, padding: "13px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 32s linear infinite", width: "max-content" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ color: t === "WishStone" ? T.orange : "rgba(255,255,255,0.65)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", fontStyle: "italic", padding: "0 1.8rem", whiteSpace: "nowrap", fontFamily: "'Playfair Display',serif" }}>
            {t}
            {i < doubled.length - 1 && <span style={{ color: T.orange, margin: "0 0.5rem" }}>•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNITY VIDEO SECTION — REDESIGNED ────────────────────
function CommunityVideoSection() {
  const videoRefs = useRef([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Auto-play videos when they enter viewport
  useEffect(() => {
    const observers = [];
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      vid.muted = true;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(vid);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleClick = (i) => {
    const vid = videoRefs.current[i];
    if (!vid) return;
    if (activeVideo === i) {
      if (vid.paused) { vid.play().catch(() => { }); setPlaying(true); }
      else { vid.pause(); setPlaying(false); }
    } else {
      videoRefs.current.forEach((v, idx) => {
        if (v && idx !== i) { v.pause(); v.muted = true; v.currentTime = 0; v.play().catch(() => { }); }
      });
      vid.muted = false;
      vid.play().catch(() => { });
      setActiveVideo(i);
      setPlaying(true);
    }
  };

  return (
    <section style={{ background: "linear-gradient(180deg, #2C3320 0%, #1F2417 100%)", paddingTop: "80px", paddingBottom: "80px", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ height: 1, width: 50, background: "linear-gradient(to right, transparent, #E8720C)" }} />
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.orange, letterSpacing: "0.28em", textTransform: "uppercase" }}>From Our Community</span>
          <div style={{ height: 1, width: 50, background: "linear-gradient(to left, transparent, #E8720C)" }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: T.white, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          Poetry by the<br /><em style={{ color: T.orange, fontStyle: "italic" }}>Community</em>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.84rem", marginTop: "0.8rem", fontStyle: "italic" }}>Real moments. Real intention. Real transformation.</p>
      </div>

      {/* Video Strip */}
      <div style={{ overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", display: "flex", gap: "1.2rem", paddingLeft: "clamp(1rem,4vw,3rem)", paddingRight: "clamp(1rem,4vw,3rem)", paddingBottom: 8, scrollbarWidth: "none" }}>
        {COMMUNITY_VIDEOS.map((v, i) => (
          <div
            key={v.id}
            onClick={() => handleClick(i)}
            style={{
              flex: "0 0 220px",
              aspectRatio: "9/16",
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              scrollSnapAlign: "start",
              boxShadow: activeVideo === i ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.4)",
              transform: activeVideo === i ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <video
              ref={el => videoRefs.current[i] = el}
              src={v.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Bottom gradient + info */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)", borderRadius: "0 0 20px 20px", padding: "1.2rem 1rem 1rem", pointerEvents: "none" }}>
              <div style={{ display: "inline-block", background: "rgba(232,114,12,0.92)", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "0.4rem" }}>{v.tag}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "0.2rem", fontStyle: "italic" }}>{v.title}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>{v.caption}</div>
            </div>
            {/* Play/Pause button — only on active video */}
            {activeVideo === i && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", opacity: playing ? 0 : 1, transition: "opacity 0.2s" }}>
                  <span style={{ fontSize: 22, color: "#fff", marginLeft: playing ? 0 : 4 }}>{playing ? "⏸" : "▶"}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginBottom: "1rem", letterSpacing: "0.08em" }}>Join 12,000+ conscious souls on their journey</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>
          <span style={{ color: T.orange }}>✦</span><span>#WishStoneJourney</span><span style={{ color: T.orange }}>✦</span>
        </div>
      </div>
    </section>
  );
}

// ─── POWERS SECTION ──────────────────────────────────────────
function PowersSection({ onNav }) {
  const navigate = useNavigate();

  const handleLearnMore = (powerNum) => {
    if (powerNum === "01" || powerNum === "02") {
      navigate("/intention-anchoring");
    } else {
      onNav("benefits");
    }
  };

  return (
    <section style={{ background: T.bg, padding: "90px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 40, background: T.orange }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase" }}>WishStone की शक्ति</span>
            <div style={{ height: 1, width: 40, background: T.orange }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: T.text, lineHeight: 1.2 }}>
            Three Powers to <em style={{ color: T.orange, fontStyle: "italic" }}>Amplify</em><br />Your Manifestation
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid">
          {POWERS.map(p => (
            <div key={p.num} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", transition: "all 0.3s", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(232,114,12,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; }}>
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img referrerPolicy="no-referrer" src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                <div style={{ position: "absolute", top: 12, left: 12, width: 40, height: 40, borderRadius: 10, background: p.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>{p.icon}</div>
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: "1.6rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{p.num}</span>
              </div>
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.8rem", color: T.textMid, lineHeight: 1.65, marginBottom: "1rem", flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.textMid, letterSpacing: "0.14em", border: `1px solid ${T.border}`, borderRadius: 3, padding: "3px 8px" }}>{p.tag}</span>
                  <button onClick={() => handleLearnMore(p.num)} style={{ background: "none", border: "none", cursor: "pointer", color: T.orange, fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, fontFamily: "'Inter',sans-serif", transition: "gap 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.gap = "8px"}
                    onMouseLeave={e => e.currentTarget.style.gap = "4px"}>
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── QUOTE SECTION ────────────────────────────────────────────
function QuoteSection() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const t = setInterval(() => { setIdx(i => (i + 1) % QUOTES.length); setKey(k => k + 1); }, 4500);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[idx];
  return (
    <section style={{ background: T.bgDark, padding: "48px clamp(1.5rem,5vw,3.5rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(232,114,12,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="max-w" style={{ maxWidth: 760, position: "relative" }}>
        <div style={{ fontSize: "0.62rem", fontWeight: 700, color: T.orange, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span>✦</span> Daily Manifestation Oracle <span>✦</span>
        </div>
        <blockquote key={key} style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 700, color: T.white, lineHeight: 1.5, marginBottom: "0.6rem", fontStyle: "italic", animation: "quoteIn 0.5s ease both" }}>
          "{q.text}"
        </blockquote>
        <cite style={{ fontSize: "0.72rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase", fontStyle: "normal" }}>— {q.author}</cite>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.4rem" }}>
          <button onClick={() => { setIdx(i => (i - 1 + QUOTES.length) % QUOTES.length); setKey(k => k + 1); }} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid rgba(255,255,255,0.2)`, background: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: T.orange, borderRadius: 1, width: `${((idx + 1) / QUOTES.length) * 100}%`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {QUOTES.map((_, i) => (
              <button key={i} onClick={() => { setIdx(i); setKey(k => k + 1); }} style={{ width: i === idx ? 18 : 7, height: 7, borderRadius: 4, background: i === idx ? T.orange : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
          <button onClick={() => { setIdx(i => (i + 1) % QUOTES.length); setKey(k => k + 1); }} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid rgba(255,255,255,0.2)`, background: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
      </div>
    </section>
  );
}

// ─── FOUNDER NOTE SECTION — replaces OurStories ──────────────
function FounderNoteSection() {
  return (
    <section style={{ background: "#fff", padding: "80px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 40, background: T.orange }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase" }}>The Story Behind WishStone</span>
            <div style={{ height: 1, width: 40, background: T.orange }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: T.text }}>
            A Note from Our <em style={{ color: T.orange, fontStyle: "italic" }}>Founders</em>
          </h2>
        </div>

        {/* Card: image left, content right */}
        <div
          className="founder-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 0,
            borderRadius: 24,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
            boxShadow: "0 12px 60px rgba(0,0,0,0.08)",
            background: T.bg,
            alignItems: "stretch",
          }}
        >
          {/* LEFT: Founder photo */}
          <div className="founder-img-col" style={{ position: "relative", minHeight: 320, overflow: "hidden" }}>
            <img
              src={`${process.env.PUBLIC_URL || ""}/founder.png`}
              alt="Vikash Malik - Co-founder, WishStone"
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", position: "absolute", inset: 0, minHeight: 320 }}
            />
            {/* Fallback if image fails */}
            <div style={{ display: "none", position: "absolute", inset: 0, background: `linear-gradient(135deg,${T.bgDark},${T.orange})`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", opacity: 0.8 }}>Vikash Malik</div>
            </div>
            {/* Overlay gradient */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(44,51,32,0.25), rgba(232,114,12,0.08))" }} />

            {/* Founder name card at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.5) 60%, transparent 100%)",
              padding: "2rem 1.5rem 1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>V</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem", lineHeight: 1.2 }}>Vikash Malik & Vinay Verma</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>Co-founders, WishStone</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Founder note content */}
          <div style={{ padding: "clamp(2rem,5vw,3.5rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Label */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(232,114,12,0.08)",
              border: `1px solid rgba(232,114,12,0.2)`,
              borderRadius: 20, padding: "5px 14px",
              marginBottom: "1.5rem", width: "fit-content",
            }}>
              <span style={{ color: T.orange, fontSize: 10 }}>✦</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 700, color: T.orange, letterSpacing: "0.15em", textTransform: "uppercase" }}>A Note from Our Founders</span>
            </div>

            {/* Quote highlight */}
            <blockquote style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1rem,2vw,1.2rem)",
              fontWeight: 700,
              color: T.orange,
              lineHeight: 1.5,
              fontStyle: "italic",
              marginBottom: "1.5rem",
              borderLeft: `3px solid ${T.orange}`,
              paddingLeft: "1.2rem",
            }}>
              "The goal didn't disappear. The daily reminder of it did."
            </blockquote>

            {/* Body paragraphs */}
            <p style={{ fontSize: "0.86rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              We've seen people give up on goals they never stopped wanting. We didn't start WishStone with a business plan. We started it with a simple question — <strong style={{ color: T.text }}>why do people who genuinely want to change, still stay where they are?</strong>
            </p>
            <p style={{ fontSize: "0.86rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              It's not laziness. It's not lack of desire. Life just gets loud. And in that noise, intention fades.
            </p>
            <p style={{ fontSize: "0.86rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              We travelled, we observed, and one thing kept showing up everywhere — people who stayed on track almost always had something <em>physical</em> to hold on to. A stone. A thread. A small object that brought them back to what mattered.
            </p>
            <p style={{ fontSize: "0.86rem", color: T.text, lineHeight: 1.8, fontWeight: 600, marginBottom: "2rem" }}>
              That's WishStone. Not a lucky charm. Just a daily reminder that what you want — still matters.
            </p>

            {/* Signature */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: "1.5rem", borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: "flex" }}>
                {["V", "V"].map((l, i) => (
                  <div key={i} style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: `linear-gradient(135deg,${T.orangeD},${T.orange})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: "#fff", fontSize: "0.85rem",
                    marginLeft: i > 0 ? -10 : 0,
                    border: "2px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: T.text, fontSize: "0.9rem" }}>Vikash Malik & Vinay Verma</div>
                <div style={{ fontSize: "0.7rem", color: T.textMid, letterSpacing: "0.06em" }}>Co-founders, WishStone</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── POLICY DATA ──────────────────────────────────────────────
const REFUND_EXCHANGE_CANCELLATION_POLICY = [
  {
    heading: "",
    paragraphs: [
      "We want you to love every order you receive from Wishstone. Since our products are personal-use and prepared with care in small batches, we maintain a strict but transparent returns, exchange, and cancellation policy.",
      "If you ever face an issue with your order, please reach out to us at support@wishstone.in or on WhatsApp at +91 81714 40017 and our team will assist you promptly."
    ]
  },
  {
    heading: "Important Disclaimer — Nature of Our Products",
    paragraphs: [
      "Wishstone and its products, including the Wishstone stone, Cosmic Eye, Reed Diffuser, Premium Camphor, and Habit Builder, are designed to support the process of manifestation and to work with the principles of the subconscious mind. These products are tools that aid focus, intention-setting, and the creation of a positive environment.",
      "We do not claim, guarantee, or promise any specific outcome or result from the use of our products. Results depend entirely on the individual's personal practice, consistency, mindset, and engagement with the process of manifestation. Any outcomes experienced are subjective and may vary from person to person. By purchasing from Wishstone, you acknowledge and accept this understanding."
    ]
  },
  {
    heading: "1. Eligibility for Returns & Exchange",
    paragraphs: [
      "We accept return or exchange requests only if the product received meets one of the following conditions:",
      "• The product arrived damaged or broken\n• The product is leaking or has leaked, applicable for Reed Diffuser and Camphor\n• The product is defective or not functioning as intended\n• You received the wrong product\n• The product does not match the item described in your order confirmation",
      "To help us process your request faster, please share clear photos or videos of the issue within 48 hours of order delivery at support@wishstone.in.",
      "Important: Please record a clear unboxing video while opening your package. This helps us verify and resolve your concern quickly. Claims made without an unboxing video may not be accepted."
    ]
  },
  {
    heading: "2. Refund Policy",
    paragraphs: [
      "Refunds are processed only after the returned product has been inspected and approved by our team.",
      "Once approved:",
      "• First-time customers: Refunds are issued as store credit, redeemable on your next purchase.\n• Repeat customers: Refunds may be processed back to the original payment source such as bank account, card, or UPI.",
      "Please allow 7–14 business days for refunds to reflect in your source account.",
      "Reverse Pickup Charges:",
      "• If you want Wishstone to arrange a reverse pickup, a ₹100 pickup fee will be applicable.\n• If you prefer not to pay the pickup fee, you may self-courier the product back to us at your own cost.\n• Reverse pickup availability depends on the serviceability of your pincode.",
      "Please Note:",
      "• Shipping fees and COD charges paid during the original order are non-refundable.\n• Store credit cannot be converted into cash.\n• We do not accept return requests for reasons other than those listed above. All sales are otherwise final."
    ]
  },
  {
    heading: "3. Product-Specific Notes",
    paragraphs: [
      "Wishstone & Cosmic Eye: These are specially prepared physical objects designed to support the manifestation process. Once in your possession and used, returns or exchanges are not applicable unless there is a clear physical manufacturing defect or you received the wrong product.",
      "Reed Diffuser & Premium Camphor: Due to the consumable and hygiene-sensitive nature of these fragrance products, returns are accepted only if the product is unused, sealed, and a defect or leakage is clearly visible and supported by an unboxing video.",
      "Habit Builder Card Deck: Returns or exchanges are accepted only if cards are found to be misprinted or a card is missing from the sealed deck, verified through an unboxing video."
    ]
  },
  {
    heading: "4. Order Cancellation",
    paragraphs: [
      "Orders can only be cancelled before they are shipped. Please reach out to us at support@wishstone.in or on WhatsApp at +91 81714 40017 within 3 hours of placing your order for any cancellation requests.",
      "Once shipped, the order cannot be cancelled, returned, or refunded.",
      "For prepaid orders cancelled before dispatch, the refund will be processed to the original payment source. Please allow 7–14 business days for the amount to reflect in your account.",
      "Cancellation by Wishstone: In rare circumstances, Wishstone reserves the right to cancel an order if the product is out of stock after order placement, the delivery location is unserviceable by our courier partners, there is a suspicion of fraudulent activity, or there is a technical error in pricing. In all such cases, a full refund will be issued within 5–7 business days and you will be notified immediately."
    ]
  },
  {
    heading: "5. Address Issues & Non-Delivery",
    paragraphs: [
      "Orders will not be refunded if:",
      "• The shipping address entered is incomplete or incorrect\n• The phone number provided is incorrect\n• The customer is unreachable at the time of delivery\n• The customer refuses delivery",
      "If the order is returned to us due to any of the above reasons, a reshipment charge of ₹100 will be applicable."
    ]
  },
  {
    heading: "6. How to Raise a Return, Exchange, or Refund Request",
    paragraphs: [
      "Please email us at support@wishstone.in with the following details:",
      "• Order ID\n• Description of the issue\n• Clear photos or videos showing the problem, including the unboxing video",
      "Our support team will respond within 24–48 hours."
    ]
  }
];

const TERMS_AND_CONDITIONS = [
  {
    heading: "",
    paragraphs: [
      "This website is operated by Wishstone Manifesta & Co. Throughout the site, the terms \"we\", \"us\", and \"our\" refer to Wishstone. Wishstone Manifesta & Co. offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.",
      "By visiting our site and/or purchasing something from us, you engage in our \"Service\" and agree to be bound by the following Terms and Conditions, including those additional terms and conditions and policies referenced herein. These Terms apply to all users of the site, including browsers, customers, and contributors of content.",
      "Please read these Terms carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.",
      "We reserve the right to update, change, or replace any part of these Terms by posting updates to our website. It is your responsibility to check this page periodically for changes. Your continued use of the website following the posting of any changes constitutes your acceptance of those changes."
    ]
  },
  {
    heading: "SECTION 1 — PRODUCT DISCLAIMER & NATURE OF OFFERINGS",
    paragraphs: [
      "Wishstone and its products including the Wishstone stone, Cosmic Eye, Reed Diffuser, Premium Camphor, and Habit Builder are designed to support the process of manifestation and to work with the principles of the subconscious mind. These are tools that aid focus, intention-setting, and the creation of a positive environment.",
      "We do not claim, guarantee, or promise any specific outcome or result from the use of our products. Results depend entirely on the individual's personal practice, consistency, mindset, and engagement with the process of manifestation. Any outcomes experienced are subjective and may vary from person to person. By purchasing from Wishstone, you acknowledge and accept this understanding fully.",
      "Our products have no connection to any particular religion, faith, or belief system. They operate on the principles of cosmic energy and the subconscious mind and are completely neutral in nature."
    ]
  },
  {
    heading: "SECTION 2 — ONLINE STORE TERMS",
    paragraphs: [
      "By agreeing to these Terms, you confirm that you are of legal age in your state or territory of residence. You may not use our products for any illegal or unauthorised purpose, nor may you, in the use of the Service, violate any applicable laws. You must not transmit any worms, viruses, or any code of a destructive nature. A breach or violation of any of these Terms will result in immediate termination of your access to our Services."
    ]
  },
  {
    heading: "SECTION 3 — GENERAL CONDITIONS",
    paragraphs: [
      "We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service or any content on this website without our express written permission. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms."
    ]
  },
  {
    heading: "SECTION 4 — ACCURACY OF INFORMATION",
    paragraphs: [
      "We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions. Any reliance on the material on this site is at your own risk. We reserve the right to modify the contents of this site at any time without obligation to update any information. You agree that it is your responsibility to monitor changes to our site."
    ]
  },
  {
    heading: "SECTION 5 — MODIFICATIONS TO SERVICE AND PRICES",
    paragraphs: [
      "Prices for our products are subject to change without notice. All offers, deals, discounts, and coupons are at the sole discretion of Wishstone and may be discontinued at any time without prior notice. We reserve the right to modify or discontinue the Service or any part of it at any time without notice. We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Service."
    ]
  },
  {
    heading: "SECTION 6 — PRODUCTS",
    paragraphs: [
      "Certain products may be available exclusively online through our website and may have limited quantities. They are subject to exchange only according to our Refund & Exchange Policy.",
      "We have made every effort to display our products as accurately as possible. However, we cannot guarantee that your device's display of any colour or image will be fully accurate. We reserve the right to limit the sale of our products to any person, geographic region, or jurisdiction at our sole discretion. We reserve the right to discontinue any product at any time. Any offer for any product made on this site is void where prohibited by law."
    ]
  },
  {
    heading: "SECTION 7 — BILLING AND ACCOUNT INFORMATION",
    paragraphs: [
      "We reserve the right to refuse any order placed with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we modify or cancel an order, we will attempt to notify you using the contact information provided at the time of the order.",
      "You agree to provide current, complete, and accurate purchase and account information for all purchases made on our website. You agree to promptly update your account information, including your email address and contact details, so that we can complete your transactions and reach you as needed."
    ]
  },
  {
    heading: "SECTION 8 — PAYMENT SECURITY",
    paragraphs: [
      "Wishstone does not store any payment-related information on its servers. Details such as UPI IDs, credit card numbers, debit card numbers, net banking credentials, and bank account numbers are never saved by us. All payment transactions are processed exclusively through secure, certified third-party payment gateways. Your financial information remains entirely within those encrypted gateway systems and is never accessible to us. We only retain your name, phone number, email address, and delivery address for the purpose of fulfilling your order."
    ]
  },
  {
    heading: "SECTION 9 — THIRD-PARTY LINKS AND TOOLS",
    paragraphs: [
      "Certain content or services available through our website may include materials from third parties. Third-party links on this site may direct you to websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy of those sites and will not have any liability for any third-party materials, websites, products, or services. Any use of third-party tools offered through our site is entirely at your own risk."
    ]
  },
  {
    heading: "SECTION 10 — USER COMMENTS, FEEDBACK, AND SUBMISSIONS",
    paragraphs: [
      "If you send us creative ideas, suggestions, feedback, or other materials, you agree that we may use them at any time without restriction or compensation. We are not obligated to maintain any submissions in confidence or respond to them. We reserve the right to monitor, edit, or remove content that we determine to be unlawful, offensive, defamatory, or otherwise objectionable. You are solely responsible for any comments or content you submit, and their accuracy. We will not tolerate any abusive language directed at our team, customers, or any other individuals through any mode of submission."
    ]
  },
  {
    heading: "SECTION 11 — PERSONAL INFORMATION",
    paragraphs: [
      "Your submission of personal information through our website is governed by our Privacy Policy, which is available on our website. We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India in all matters related to the collection, use, and protection of your personal data."
    ]
  },
  {
    heading: "SECTION 12 — ERRORS, INACCURACIES, AND OMISSIONS",
    paragraphs: [
      "Occasionally there may be information on our site that contains typographical errors, inaccuracies, or omissions relating to product descriptions, pricing, offers, shipping charges, or availability. We reserve the right to correct any such errors and to change or update information or cancel orders if any information is found to be inaccurate at any time without prior notice."
    ]
  },
  {
    heading: "SECTION 13 — PROHIBITED USES",
    paragraphs: [
      "You are prohibited from using this site or its content for any unlawful purpose; to solicit others to perform unlawful acts; to violate any applicable regulations, rules, or laws; to infringe upon our intellectual property rights or the rights of others; to harass, abuse, insult, harm, defame, or discriminate against any person based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; to submit false or misleading information; to upload or transmit viruses or malicious code; to collect the personal information of others without consent; or to interfere with or circumvent the security features of the Service or any related website. We reserve the right to terminate your use of the Service for violating any of the prohibited uses."
    ]
  },
  {
    heading: "SECTION 14 — DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY",
    paragraphs: [
      "We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free. The service and all products delivered through it are provided on an \"as is\" and \"as available\" basis without any warranties or conditions of any kind, either express or implied. In no case shall Wishstone, its founders, employees, affiliates, agents, or service providers be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including lost profits, lost revenue, loss of data, or replacement costs, arising from your use of the Service or any products procured through it. Our liability shall be limited to the maximum extent permitted by applicable law."
    ]
  },
  {
    heading: "SECTION 15 — INDEMNIFICATION",
    paragraphs: [
      "You agree to indemnify, defend, and hold harmless Wishstone and its founders, employees, affiliates, agents, contractors, service providers, and suppliers from and against any claim or demand, including reasonable legal fees, made by any third party due to or arising out of your breach of these Terms, your violation of any law, or the violation of any rights of a third party."
    ]
  },
  {
    heading: "SECTION 16 — SEVERABILITY",
    paragraphs: [
      "If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed severed from these Terms. This determination shall not affect the validity and enforceability of any other remaining provisions."
    ]
  },
  {
    heading: "SECTION 17 — TERMINATION",
    paragraphs: [
      "These Terms are effective unless and until terminated by either you or us. You may terminate these Terms at any time by notifying us that you no longer wish to use our Services or by ceasing to use our site. If we determine, in our sole judgment, that you have failed to comply with any provision of these Terms, we may terminate this agreement at any time without notice. You will remain liable for all amounts due up to and including the date of termination."
    ]
  },
  {
    heading: "SECTION 18 — ENTIRE AGREEMENT",
    paragraphs: [
      "These Terms, together with any policies or operating rules posted on our site, constitute the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior agreements, communications, or proposals between you and us."
    ]
  },
  {
    heading: "SECTION 19 — GOVERNING LAW",
    paragraphs: [
      "These Terms and any separate agreements through which we provide you Services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India."
    ]
  },
  {
    heading: "SECTION 20 — CHANGES TO TERMS",
    paragraphs: [
      "We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms by posting updates on our website. It is your responsibility to check our website periodically for changes. Your continued use of our website or Service following the posting of any changes constitutes your acceptance of those changes."
    ]
  },
  {
    heading: "SECTION 21 — CONTACT INFORMATION",
    paragraphs: [
      "For any questions about these Terms & Conditions, please contact Wishstone Manifesta & Co. at support@wishstone.in or on WhatsApp at +91 81714 40017."
    ]
  }
];

const REFUND_EXCHANGE_POLICY = [
  {
    heading: "",
    paragraphs: [
      "We want you to love every order you receive from Wishstone. Since our products are personal-use and prepared with care in small batches, we maintain a strict but transparent refund and exchange policy.",
      "If you ever face an issue with your order, please reach out to us at support@wishstone.in or on WhatsApp at +91 81714 40017 and our team will assist you promptly."
    ]
  },
  {
    heading: "Important Disclaimer — Nature of Our Products",
    paragraphs: [
      "Wishstone and its products, including the Wishstone stone, Cosmic Eye, Reed Diffuser, Premium Camphor, and Habit Builder, are designed to support the process of manifestation and to work with the principles of the subconscious mind. These products are tools that aid focus, intention-setting, and the creation of a positive environment.",
      "We do not claim, guarantee, or promise any specific outcome or result from the use of our products. Results depend entirely on the individual's personal practice, consistency, mindset, and engagement with the process of manifestation. Any outcomes experienced are subjective and may vary from person to person. By purchasing from Wishstone, you acknowledge and accept this understanding."
    ]
  },
  {
    heading: "1. Eligibility for Returns & Exchange",
    paragraphs: [
      "We accept return or exchange requests only if the product received meets one of the following conditions:",
      "• The product arrived damaged or broken\n• The product is leaking or has leaked, applicable for Reed Diffuser and Camphor\n• The product is defective or not functioning as intended\n• You received the wrong product\n• The product does not match the item described in your order confirmation",
      "To help us process your request faster, please share clear photos or videos of the issue within 48 hours of order delivery at support@wishstone.in.",
      "Important: Please record a clear unboxing video while opening your package. This helps us verify and resolve your concern quickly. Claims made without an unboxing video may not be accepted."
    ]
  },
  {
    heading: "2. Refund Policy",
    paragraphs: [
      "Refunds are processed only after the returned product has been inspected and approved by our team.",
      "Once approved:",
      "• First-time customers: Refunds are issued as store credit, redeemable on your next purchase.\n• Repeat customers: Refunds may be processed back to the original payment source such as bank account, card, or UPI.",
      "Please allow 7–14 business days for refunds to reflect in your source account.",
      "Reverse Pickup Charges:",
      "• If you want Wishstone to arrange a reverse pickup, a ₹100 pickup fee will be applicable.\n• If you prefer not to pay the pickup fee, you may self-courier the product back to us at your own cost.\n• Reverse pickup availability depends on the serviceability of your pincode.",
      "Please Note:",
      "• Shipping fees and COD charges paid during the original order are non-refundable.\n• Store credit cannot be converted into cash.\n• We do not accept return requests for reasons other than those listed above. All sales are otherwise final."
    ]
  },
  {
    heading: "3. Product-Specific Notes",
    paragraphs: [
      "Wishstone & Cosmic Eye: These are specially prepared physical objects designed to support the manifestation process. Once in your possession and used, returns or exchanges are not applicable unless there is a clear physical manufacturing defect or you received the wrong product.",
      "Reed Diffuser & Premium Camphor: Due to the consumable and hygiene-sensitive nature of these fragrance products, returns are accepted only if the product is unused, sealed, and a defect or leakage is clearly visible and supported by an unboxing video.",
      "Habit Builder Card Deck: Returns or exchanges are accepted only if cards are found to be misprinted or a card is missing from the sealed deck, verified through an unboxing video."
    ]
  },
  {
    heading: "4. How to Raise a Return, Exchange, or Refund Request",
    paragraphs: [
      "Please email us at support@wishstone.in with the following details:",
      "• Order ID\n• Description of the issue\n• Clear photos or videos showing the problem, including the unboxing video",
      "Our support team will respond within 24–48 hours."
    ]
  }
];

const SHIPPING_CANCELLATION_POLICY = [
  {
    heading: "",
    paragraphs: [
      "We take great care in packing and dispatching every Wishstone order. Each product — from the Wishstone and Cosmic Eye to our premium Reed Diffuser, Camphor, and Habit Builder deck — is packaged with care to reach you in perfect condition."
    ]
  },
  {
    heading: "1. Order Processing Time",
    paragraphs: [
      "Once you place an order on our website, it will be processed within 1–2 business days. Orders placed after 5:00 PM will be processed on the next business day. You will receive an order confirmation via email or WhatsApp once your order is accepted."
    ]
  },
  {
    heading: "2. Delivery Time",
    paragraphs: [
      "After your order is processed and dispatched, delivery typically takes 5–7 business days depending on your location within India. We currently ship across India. International shipping is not available at this time."
    ]
  },
  {
    heading: "3. Shipping Charges",
    paragraphs: [
      "A standard flat shipping rate is applicable to all orders. Any applicable shipping fee will be displayed clearly at checkout before you confirm your purchase."
    ]
  },
  {
    heading: "4. Order Tracking",
    paragraphs: [
      "Once your order is dispatched, you will receive a shipment confirmation along with a tracking number via email or WhatsApp. You can use this tracking number to follow your package in real time. If you face any issues tracking your order or believe your package may be lost, please contact us immediately."
    ]
  },
  {
    heading: "5. Possible Delays",
    paragraphs: [
      "While we always aim to deliver within the committed timeline, certain situations beyond our control may cause delays — including national holidays, festivals, natural calamities, or courier service disruptions. We appreciate your patience in such cases and will keep you informed as much as possible."
    ]
  },
  {
    heading: "6. Packaging Note",
    paragraphs: [
      "All products are carefully packed to ensure safe delivery. The Wishstone and Cosmic Eye are dispatched in secure protective packaging. Reed Diffuser bottles are bubble-wrapped to prevent breakage during transit. If your package arrives visibly damaged, please photograph it immediately and contact us before opening the package."
    ]
  },
  {
    heading: "7. Address Issues & Non-Delivery",
    paragraphs: [
      "Orders will not be refunded if:",
      "• The shipping address entered is incomplete or incorrect\n• The phone number provided is incorrect\n• The customer is unreachable at the time of delivery\n• The customer refuses delivery",
      "If the order is returned to us due to any of the above reasons, a reshipment charge of ₹100 will be applicable."
    ]
  },
  {
    heading: "8. Order Cancellation",
    paragraphs: [
      "Orders can only be cancelled before they are shipped. Please reach out to us at support@wishstone.in or on WhatsApp at +91 81714 40017 within 3 hours of placing your order for any cancellation requests. Once shipped, the order cannot be cancelled, returned, or refunded.",
      "For prepaid orders cancelled before dispatch, the refund will be processed to the original payment source. Please allow 7–14 business days for the amount to reflect in your account.",
      "Cancellation by Wishstone: In rare circumstances, Wishstone reserves the right to cancel an order if the product is out of stock after order placement, the delivery location is unserviceable by our courier partners, there is a suspicion of fraudulent activity, or there is a technical error in pricing. In all such cases, a full refund will be issued within 5–7 business days and you will be notified immediately."
    ]
  },
  {
    heading: "9. Contact Us",
    paragraphs: [
      "For any shipping, cancellation, or delivery-related queries, please reach out to us at support@wishstone.in or on WhatsApp at +91 81714 40017. Our team responds within 1–2 business days."
    ]
  }
];

const PRIVACY_POLICY = [
  {
    heading: "Information We Collect",
    paragraphs: ["We collect your name, email address, phone number, and shipping address when you place an order or create an account. We also collect browsing data to improve your experience."]
  },
  {
    heading: "How We Use Your Information",
    paragraphs: ["Your information is used to process orders, send shipping updates, and occasionally inform you about new products or offers. We do not sell your data to third parties."]
  },
  {
    heading: "Cookies",
    paragraphs: ["We use cookies to remember your cart, preferences, and session. You can disable cookies in your browser settings, though some features may not work as expected."]
  },
  {
    heading: "Data Security",
    paragraphs: ["All transactions are secured with SSL encryption. We store your data on secure servers and follow industry best practices to protect your personal information."]
  },
  {
    heading: "Contact",
    paragraphs: ["For any privacy-related concerns, write to us at privacy@wishstone.in. We will respond within 2 business days."]
  }
];

// ─── MODERN POLICY PAGE ──────────────────────────────────────
function ModernPolicyPage({ title, lastUpdated, sections }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
      setShowTop(scrolled > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fontStack = "'Inter', 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  // Floating orb for light theme
  const FloatingOrb = ({ size, top, left, delay, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}
      style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: color, filter: "blur(80px)", top, left, zIndex: 0, pointerEvents: "none"
      }}
    >
      <motion.div
        animate={{ y: [0, -15, 0, 12, 0], x: [0, 8, 0, -8, 0] }}
        transition={{ duration: 8 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />
    </motion.div>
  );

  return (
    <div style={{
      paddingTop: 110, paddingBottom: 100, minHeight: "100vh",
      background: "linear-gradient(180deg, #F5F0E8 0%, #EDE7DA 40%, #F0EBE1 100%)",
      fontFamily: fontStack, position: "relative", overflow: "hidden"
    }}>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, height: 3, zIndex: 9999,
          background: `linear-gradient(90deg, ${T.orange}, ${T.orangeL}, #FFD700)`,
          width: `${scrollProgress}%`,
          boxShadow: `0 0 12px ${T.orange}50`,
        }}
      />

      {/* Floating Background Orbs — warm tones for light theme */}
      <FloatingOrb size={350} top="2%" left="-8%" delay={0} color="rgba(232,114,12,0.07)" />
      <FloatingOrb size={250} top="25%" left="82%" delay={0.3} color="rgba(255,154,60,0.06)" />
      <FloatingOrb size={300} top="55%" left="-6%" delay={0.6} color="rgba(196,94,0,0.04)" />
      <FloatingOrb size={200} top="80%" left="75%" delay={0.9} color="rgba(255,215,0,0.05)" />

      {/* Subtle grain texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px"
      }} />

      <div style={{ padding: "0 1.5rem", maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "3.5rem", textAlign: "left", position: "relative" }}
        >
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            style={{ height: 2, background: `linear-gradient(90deg, ${T.orange}, transparent)`, marginBottom: "1.5rem" }}
          />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(232,114,12,0.08)",
              border: "1px solid rgba(232,114,12,0.18)", borderRadius: 24,
              padding: "6px 16px", marginBottom: "1.2rem",
            }}
          >
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{ color: T.orange, fontSize: 11, display: "inline-block" }}
            >✦</motion.span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Official Policy Document
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800,
              margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1,
              color: T.text
            }}
          >{title}</motion.h1>

          {/* Subtitle bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "1.2rem", flexWrap: "wrap" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ height: 3, background: `linear-gradient(90deg, ${T.orange}, ${T.orangeL})`, borderRadius: 2 }}
            />
            {lastUpdated && (
              <span style={{ fontSize: "0.75rem", color: T.textMid, fontWeight: 500, letterSpacing: "0.04em" }}>
                Last Updated: {lastUpdated}
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "rgba(26,26,26,0.2)" }}>•</span>
            <span style={{ fontSize: "0.75rem", color: T.textMid, fontWeight: 500, opacity: 0.6 }}>
              Wishstone — Manifest Your Reality
            </span>
          </motion.div>
        </motion.div>

        {/* Sections — scroll-triggered reveal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 70, damping: 20, mass: 0.9, delay: 0.05 }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: "relative",
                background: hoveredCard === i
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.55)",
                borderRadius: 20, padding: "2rem 2rem 2rem 2.2rem",
                border: `1px solid ${hoveredCard === i ? "rgba(232,114,12,0.25)" : "rgba(26,26,26,0.06)"}`,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: hoveredCard === i
                  ? "0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px rgba(232,114,12,0.08)"
                  : "0 2px 16px rgba(0,0,0,0.03)",
                backdropFilter: "blur(16px)",
                transform: hoveredCard === i ? "translateY(-3px)" : "translateY(0)",
                cursor: "default"
              }}
            >
              {/* Top glow accent on hover */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: hoveredCard === i
                  ? `linear-gradient(90deg, transparent, ${T.orange}30, ${T.orangeL}25, transparent)`
                  : "transparent",
                transition: "background 0.4s ease", borderRadius: "20px 20px 0 0"
              }} />

              {/* Section Number + Heading — scroll reveal */}
              {s.heading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.1 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: "1.4rem" }}
                >
                  {/* Number Badge */}
                  <div style={{
                    minWidth: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, rgba(232,114,12,0.12), rgba(196,94,0,0.06))`,
                    border: "1px solid rgba(232,114,12,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, color: T.orange,
                    fontFamily: fontStack, flexShrink: 0, marginTop: 2
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{
                    fontSize: "1.15rem", fontWeight: 700, color: T.text,
                    margin: 0, letterSpacing: "-0.01em", lineHeight: 1.35,
                    fontFamily: fontStack
                  }}>
                    {s.heading}
                  </h3>
                </motion.div>
              )}

              {/* Paragraphs — each paragraph reveals on scroll */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", paddingLeft: s.heading ? 50 : 0 }}>
                {s.paragraphs.map((para, pi) => {
                  const lines = para.split("\n");
                  return (
                    <motion.div
                      key={pi}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, delay: pi * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {lines.map((line, li) => {
                        const isLineBullet = line.trim().startsWith("•");
                        return (
                          <p
                            key={li}
                            style={{
                              fontSize: "0.88rem",
                              color: isLineBullet ? T.textMid : "rgba(26,26,26,0.65)",
                              lineHeight: 1.8, margin: isLineBullet ? "0.3rem 0" : "0 0 0.15rem 0",
                              fontFamily: fontStack, fontWeight: 400,
                              paddingLeft: isLineBullet ? "1.2rem" : 0,
                              textIndent: isLineBullet ? "-1.2rem" : 0,
                            }}
                          >
                            {isLineBullet ? (
                              <>
                                <span style={{ color: T.orange, marginRight: 6, fontSize: "0.7rem", verticalAlign: "middle" }}>●</span>
                                {line.trim().substring(1).trim()}
                              </>
                            ) : line}
                          </p>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: "4rem", textAlign: "center", padding: "2rem 0",
            borderTop: `1px solid ${T.border}`
          }}
        >
          <p style={{ fontSize: "0.72rem", color: T.textMid, letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase", fontFamily: fontStack, opacity: 0.5 }}>
            Wishstone — Manifest Your Reality
          </p>
          <p style={{ fontSize: "0.68rem", color: T.textMid, marginTop: "0.5rem", fontFamily: fontStack, opacity: 0.35 }}>
            For queries, contact support@wishstone.in
          </p>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              position: "fixed", bottom: 32, right: 32, zIndex: 999,
              width: 48, height: 48, borderRadius: 14,
              border: "1px solid rgba(232,114,12,0.2)",
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
              color: T.orange, fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,114,12,0.05)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${T.orange}, ${T.orangeD})`;
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,114,12,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.color = T.orange;
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CONTACT US PAGE ──────────────────────────────────────────
function ContactUsPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const fontStack = "'Inter', 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const FloatingOrb = ({ size, top, left, delay, color }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}
      style={{
        position: "absolute", width: size, height: size, borderRadius: "50%",
        background: color, filter: "blur(80px)", top, left, zIndex: 0, pointerEvents: "none"
      }}
    >
      <motion.div
        animate={{ y: [0, -15, 0, 12, 0], x: [0, 8, 0, -8, 0] }}
        transition={{ duration: 8 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />
    </motion.div>
  );

  return (
    <div style={{
      paddingTop: 130, paddingBottom: 100, minHeight: "100vh",
      background: "linear-gradient(180deg, #F5F0E8 0%, #EDE7DA 40%, #F0EBE1 100%)",
      fontFamily: fontStack, position: "relative", overflow: "hidden"
    }}>
      <FloatingOrb size={350} top="5%" left="-10%" delay={0} color="rgba(232,114,12,0.08)" />
      <FloatingOrb size={300} top="45%" left="80%" delay={0.3} color="rgba(255,154,60,0.06)" />

      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "128px 128px"
      }} />

      <div style={{ padding: "0 1.5rem", maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(232,114,12,0.08)",
            border: "1px solid rgba(232,114,12,0.18)", borderRadius: 24,
            padding: "6px 16px", marginBottom: "1.2rem"
          }}>
            <span style={{ color: T.orange, fontSize: 11 }}>✦</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Get In Touch
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3rem)", fontWeight: 800,
            margin: 0, letterSpacing: "-0.02em", color: T.text, lineHeight: 1.2
          }}>Contact Us</h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(26,26,26,0.6)", marginTop: "1rem", lineHeight: 1.6 }}>
            Have questions about our sacred manifestation stones or rituals? Our support team is here to guide you.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Card 1: Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onMouseEnter={() => setHoveredCard("email")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "rgba(255,255,255,0.65)",
              borderRadius: 20, padding: "2rem",
              border: `1px solid ${hoveredCard === "email" ? "rgba(232,114,12,0.25)" : "rgba(26,26,26,0.06)"}`,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              transform: hoveredCard === "email" ? "translateY(-3px)" : "translateY(0)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(232,114,12,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.orange, fontSize: 20
              }}>✉</div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: T.orange, fontWeight: 700 }}>Email Support</h4>
                <a href="mailto:support@wishstone.in" style={{ textDecoration: "none", fontSize: "1.2rem", fontWeight: 700, color: T.text, display: "block", marginTop: 4 }}>
                  support@wishstone.in
                </a>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onMouseEnter={() => setHoveredCard("phone")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "rgba(255,255,255,0.65)",
              borderRadius: 20, padding: "2rem",
              border: `1px solid ${hoveredCard === "phone" ? "rgba(232,114,12,0.25)" : "rgba(26,26,26,0.06)"}`,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
              transform: hoveredCard === "phone" ? "translateY(-3px)" : "translateY(0)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(232,114,12,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.orange, fontSize: 20
              }}>📞</div>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: T.orange, fontWeight: 700 }}>WhatsApp / Phone</h4>
                <a href="https://wa.me/918171440017" target="_blank" rel="noreferrer" style={{ textDecoration: "none", fontSize: "1.2rem", fontWeight: 700, color: T.text, display: "block", marginTop: 4 }}>
                  +91 81714 40017
                </a>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Business Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "rgba(255,255,255,0.45)",
              borderRadius: 20, padding: "2rem",
              border: "1px solid rgba(26,26,26,0.06)",
              fontSize: "0.85rem", color: "rgba(26,26,26,0.6)", lineHeight: 1.6
            }}
          >
            <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", fontWeight: 700, color: T.text }}>Business Information</h4>
            <div style={{ display: "grid", gap: 8 }}>
              <div><strong>Merchant Legal Entity Name:</strong> Wishstone Manifesta & Co.</div>
              <div><strong>Operational Hours:</strong> 10:00 AM to 6:00 PM (Monday to Saturday)</div>
              <div><strong>Response Time:</strong> We usually respond within 24 hours.</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();

  const FOOTER_LINKS = {
    Shop: [
      { label: "WishStone Original", action: () => navigate("/shop") },
      { label: "Ritual Kits", action: () => navigate("/shop") },
      { label: "Bundles", action: () => navigate("/shop") },
      { label: "Best Sellers", action: () => navigate("/shop") },
      { label: "New Arrivals", action: () => navigate("/shop") },
    ],
    Learn: [
      { label: "The Ritual", action: () => navigate("/rituals") },
      { label: "Benefits", action: () => navigate("/benefits") },
      { label: "Stories", action: () => navigate("/stories") },
      { label: "Crystal Guide", action: () => navigate("/rituals") },
      { label: "FAQ", action: () => navigate("/") },
    ],
    Support: [
      { label: "Contact Us", action: () => navigate("/contact-us") },
      { label: "Terms & Conditions", action: () => navigate("/terms-and-conditions") },
      { label: "Shipping Policy", action: () => navigate("/shipping-policy") },
      { label: "Return Policy", action: () => navigate("/return-policy") },
      { label: "Refund Policy", action: () => navigate("/refund-policy") },
      { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
    ],
  };

  return (
    <footer style={{ background: T.bgDark, padding: "60px clamp(1.5rem,5vw,3.5rem) 30px", borderTop: `3px solid ${T.orange}` }}>
      <div className="max-w">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: "1rem" }}>
              <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 24, width: "auto", display: "block" }} />
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 240 }}>India's sacred manifestation stone — hand-crafted with ancient yantra to help you manifest your deepest desires.</p>
            <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.8rem", maxWidth: 240 }}>
              Email: support@wishstone.in<br />
              WhatsApp / Phone: +91 81714 40017
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>{title}</h4>
              {links.map(({ label, action }) => (
                <div key={label}
                  onClick={action}
                  style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", marginBottom: 8, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = T.orange}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
                >{label}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>© 2024 WishStone. All rights reserved.</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Made with 💎 for conscious souls across India</p>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ onShop, onRitual, onNav }) {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const [backendProducts, setBackendProducts] = useState([]);

  // Fetch real backend products so Most Loved Stones uses correct _id
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
    fetch(`${API_BASE}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => { if (data.success && data.products) setBackendProducts(data.products); })
      .catch(() => { });
  }, []);

  const displayProducts = backendProducts.length > 0 ? backendProducts : PRODUCTS;
  const goToProduct = (p) => {
    const match = backendProducts.find(bp => bp.slug === p.slug || bp.name === p.name || bp.images?.[0] === p.image);
    const realId = match?._id || p._id || p.id;
    navigate(`/product/${realId}`);
  };
  return (
    <div>
      <Hero onShop={onShop} onRitual={onRitual} />
      <StatsBar />
      <MarqueeSection />
      <CommunityVideoSection />
      {/* Auto-Scrolling Products Strip */}
      <section style={{ background: "#fff", paddingTop: "70px", paddingBottom: "70px", overflow: "hidden" }}>
        <div className="max-w" style={{ paddingLeft: "clamp(1.5rem,5vw,3.5rem)", paddingRight: "clamp(1.5rem,5vw,3.5rem)", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>BEST SELLERS</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: T.text, margin: 0 }}>Most Loved Stones</h2>
            </div>
            <button className="btn-outline" onClick={onShop} style={{ padding: "10px 24px", fontSize: "0.78rem", borderRadius: 8 }}>View All →</button>
          </div>
        </div>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", animation: "autoScroll 28s linear infinite", width: "max-content" }}>
            {[...displayProducts, ...displayProducts].map((p, i) => (
              <div key={i} onClick={() => goToProduct(p)} style={{ width: 220, flexShrink: 0, marginRight: "1.2rem", cursor: "pointer" }}>
                <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, background: T.bg, transition: "transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                    <img referrerPolicy="no-referrer" src={p.image || p.images?.[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {((p.discount !== undefined && p.discount !== null) || (p.originalPrice > p.price)) && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: T.orange, color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 800 }}>
                        -{p.discount ?? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                      </div>
                    )}
                    {(p.isBestSeller || p.bestSeller) && <div style={{ position: "absolute", bottom: 6, left: 6, background: T.bgDark, color: T.orange, borderRadius: 4, padding: "2px 7px", fontSize: "0.58rem", fontWeight: 700 }}>BEST SELLER</div>}
                  </div>
                  <div style={{ padding: "0.9rem" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "0.9rem", color: T.orange, fontWeight: 700 }}>Rs.{p.price.toLocaleString()}</span>
                      <span style={{ color: T.textMid, fontSize: "0.7rem", textDecoration: "line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PowersSection onNav={onNav} />
      <QuoteSection />

      {/* Founder Note — replaces user stories */}
      <FounderNoteSection />

      {/* FAQ */}
      <section style={{ background: T.bg, padding: "80px clamp(1.5rem,5vw,3.5rem)" }}>
        <div className="max-w" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, color: T.text }}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 0", textAlign: "left" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: T.text }}>{f.q}</span>
                <span style={{ color: T.orange, fontSize: 20, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {openFaq === i && <p style={{ fontSize: "0.84rem", color: T.textMid, lineHeight: 1.7, paddingBottom: "1rem" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── BEST SELLERS STRIP (reusable) ───────────────────────────
function BestSellersStrip({ onShop }) {
  const navigate = useNavigate();
  const [backendProducts, setBackendProducts] = useState([]);
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
    fetch(`${API_BASE}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => { if (data.success && data.products) setBackendProducts(data.products); })
      .catch(() => { });
  }, []);
  const displayProducts = backendProducts.length > 0 ? backendProducts : PRODUCTS;
  const goToProduct = (p) => {
    const match = backendProducts.find(bp => bp.slug === p.slug || bp.name === p.name || bp.images?.[0] === p.image);
    const realId = match?._id || p._id || p.id;
    navigate(`/product/${realId}`);
  };

  return (
    <section style={{ background: "#fff", paddingTop: "70px", paddingBottom: "70px", overflow: "hidden" }}>
      <div className="max-w" style={{ paddingLeft: "clamp(1.5rem,5vw,3.5rem)", paddingRight: "clamp(1.5rem,5vw,3.5rem)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: T.orange, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>BEST SELLERS</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: T.text, margin: 0 }}>Most Loved Stones</h2>
          </div>
          <button className="btn-outline" onClick={onShop} style={{ padding: "10px 24px", fontSize: "0.78rem", borderRadius: 8 }}>View All →</button>
        </div>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", animation: "autoScrollStrip 25s linear infinite", width: "max-content" }}>
          {[...displayProducts, ...displayProducts, ...displayProducts].map((p, i) => (
            <div key={i} onClick={() => goToProduct(p)} style={{ width: 220, flexShrink: 0, marginRight: "1.2rem", cursor: "pointer" }}>
              <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, background: T.bg, transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                  <img referrerPolicy="no-referrer" src={p.image || p.images?.[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {((p.discount !== undefined && p.discount !== null) || (p.originalPrice > p.price)) && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: T.orange, color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 800 }}>
                      -{p.discount ?? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                    </div>
                  )}
                  {(p.isBestSeller || p.bestSeller) && <div style={{ position: "absolute", bottom: 6, left: 6, background: T.bgDark, color: T.orange, borderRadius: 4, padding: "2px 7px", fontSize: "0.58rem", fontWeight: 700 }}>BEST SELLER</div>}
                </div>
                <div style={{ padding: "0.9rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.9rem", color: T.orange, fontWeight: 700 }}>₹{p.price.toLocaleString()}</span>
                    <span style={{ color: T.textMid, fontSize: "0.7rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes autoScrollStrip{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}`}</style>
    </section>
  );
}
// ─── PRODUCTS PAGE ────────────────────────────────────────────
function ProductsPage({ onAdd, onAddAnim, onWish, wished, onClick, cart }) {
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories + products from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`).then(r => r.json()),
          fetch(`${API_BASE}/api/products?limit=100`).then(r => r.json()),
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (prodRes.success) setProducts(prodRes.products || []);
      } catch {
        // Fallback to hardcoded products if backend unreachable
        setProducts(PRODUCTS.map(p => ({
          _id: String(p.id), id: p.id, name: p.name,
          category: { slug: p.category, name: p.category },
          price: p.price, originalPrice: p.originalPrice,
          discount: p.discount, images: [p.image],
          shortDesc: p.shortDesc, isBestSeller: p.bestSeller,
          stock: 99, isActive: true,
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, [API_BASE]);

  const getQty = (id) => cart.filter(i => i.id === id || i.id === String(id)).reduce((s, i) => s + i.qty, 0);

  // Normalize product for consistent usage
  const normalize = (p) => ({
    id: p._id || p.id,
    _id: p._id || String(p.id),
    name: p.name,
    category: p.category?.slug || p.category || "",
    categoryName: p.category?.name || p.category || "",
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discount: p.discount || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0),
    image: p.images?.[0] || p.image || "",
    images: p.images || (p.image ? [p.image] : []),
    shortDesc: p.shortDesc || "",
    isBestSeller: p.isBestSeller || p.bestSeller || false,
    stock: p.stock ?? 99,
    benefits: p.benefits || [],
    tags: p.tags || [],
    suitableFor: p.suitableFor || "",
  });

  const normalized = products.map(normalize);

  const filtered = normalized.filter(p => {
    const matchCat = filter === "all" || p.category === filter || p._id === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Build category tabs from backend + fallback
  const catTabs = [
    { value: "all", label: "All" },
    ...categories.map(c => ({ value: c.slug, label: c.name })),
  ];
  // If no backend categories yet, show hardcoded fallback tabs
  const tabs = catTabs.length > 1 ? catTabs : [
    { value: "all", label: "All" },
    { value: "manifestation", label: "Manifestation" },
    { value: "therapy", label: "Therapy" },
    { value: "habit-builder", label: "Habit Builder" },
  ];

  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Sacred Collection</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 180, padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.85rem", background: "#fff", color: T.text, outline: "none" }}
            onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tabs.map(({ value, label }) => (
              <button key={value} onClick={() => setFilter(value)} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${filter === value ? T.orange : T.border}`, background: filter === value ? T.orange : "#fff", color: filter === value ? "#fff" : T.textMid, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, background: "#fff" }}>
                <div style={{ aspectRatio: "4/3", background: "linear-gradient(90deg,#ede8df 25%,#f5f0e8 50%,#ede8df 75%)", backgroundSize: "400px 100%", animation: "shimmerBar 1.4s infinite" }} />
                <div style={{ padding: "1.2rem" }}>
                  <div style={{ height: 14, borderRadius: 6, background: "#ede8df", marginBottom: 8, width: "70%" }} />
                  <div style={{ height: 10, borderRadius: 6, background: "#ede8df", marginBottom: 8, width: "90%" }} />
                  <div style={{ height: 10, borderRadius: 6, background: "#ede8df", width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid">
            {filtered.map(p => {
              const qty = getQty(p.id);
              return (
                <div key={p._id} className="prod-card" onClick={() => onClick(p)}>
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                    {p.image ? (
                      <img referrerPolicy="no-referrer" src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${T.bg},#ede8df)`, display: p.image ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>◆</div>
                    {p.discount > 0 && <div style={{ position: "absolute", top: 10, left: 10, background: T.orange, color: "#fff", borderRadius: 4, padding: "3px 10px", fontSize: "0.65rem", fontWeight: 800 }}>-{p.discount}%</div>}
                    <button onClick={e => { e.stopPropagation(); onWish(e, p.id); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={wished.includes(p.id) ? "#e53e3e" : "none"} stroke={wished.includes(p.id) ? "#e53e3e" : "#000000"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {p.isBestSeller && <div style={{ position: "absolute", bottom: 8, left: 8, background: T.bgDark, color: T.orange, borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em" }}>BEST SELLER</div>}
                  </div>
                  <div style={{ padding: "1.2rem" }}>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: T.text, marginBottom: "0.4rem", cursor: "pointer" }}>{p.name}</h4>
                    <p style={{ fontSize: "0.76rem", color: T.textMid, marginBottom: "0.7rem", lineHeight: 1.5 }}>{(p.shortDesc || "").slice(0, 65)}{p.shortDesc?.length > 65 ? "..." : ""}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.8rem" }}>
                      <span style={{ fontSize: "1rem", color: T.orange, fontWeight: 700 }}>₹{p.price.toLocaleString()}</span>
                      {p.originalPrice > p.price && <span style={{ color: T.textMid, fontSize: "0.75rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>}
                    </div>
                    {p.stock === 0 ? (
                      <button disabled style={{ width: "100%", padding: "10px", fontSize: "0.72rem", borderRadius: 7, background: "#e5e7eb", color: "#9ca3af", border: "none", cursor: "not-allowed" }}>Out of Stock</button>
                    ) : qty > 0 ? (
                      <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 0, border: `1.5px solid ${T.orange}`, borderRadius: 8, overflow: "hidden", width: "100%" }}>
                        <button onClick={() => onAdd({ ...p, qty: -1 })} style={{ flex: 1, height: 38, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: T.orange, fontWeight: 700 }}>−</button>
                        <span style={{ flex: 1, textAlign: "center", fontWeight: 800, color: T.orange, fontSize: "0.95rem" }}>{qty}</span>
                        <button onClick={(e) => { e.stopPropagation(); onAdd(p); navigate("/cart"); }} style={{ flex: 1, height: 38, background: T.orange, border: "none", cursor: "pointer", fontSize: 18, color: "#fff", fontWeight: 700 }}>+</button>
                      </div>
                    ) : (
                      <button className="btn-orange" onClick={e => { e.stopPropagation(); onAdd(p); navigate("/cart"); }} style={{ width: "100%", padding: "10px", fontSize: "0.72rem", borderRadius: 7 }}>Add to Cart</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: T.textMid }}><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><p>No products found.</p></div>}
      </div>
    </div>
  );
}
// ─── PRODUCT DETAIL ───────────────────────────────────────────
function ProductPage({ product: p, onAdd, onAddAnim, onWish, wished, cart, onShop }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("desc");
  const [activeImg, setActiveImg] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);
  const scrollContainerRef = useRef(null);
  const cartQty = cart ? cart.filter(i => i.id === p?.id).reduce((s, i) => s + i.qty, 0) : 0;

  // Sync scroll position when activeImg changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const targetScroll = activeImg * container.clientWidth;
      if (Math.abs(container.scrollLeft - targetScroll) > 10) {
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
    }
  }, [activeImg]);

  if (!p) return null;
  const imgs = p.images || [p.image];

  // Add one to cart with animation
  const handleAdd = (e) => { onAddAnim ? onAddAnim(e, p) : onAdd(p); };
  // Remove one from cart
  const handleDec = () => { onAdd({ ...p, qty: -1 }); };

  // Navigate images
  const nextImage = () => setActiveImg((prev) => (prev + 1) % imgs.length);
  const prevImage = () => setActiveImg((prev) => (prev - 1 + imgs.length) % imgs.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imgs.length]);

  // Image animation variants
  const imageVariants = {
    enter: { opacity: 0, scale: 0.95, x: 20 },
    center: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.95, x: -20 }
  };

  const thumbnailVariants = {
    idle: { scale: 1, y: 0 },
    hover: { scale: 1.08, y: -4 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      <div style={{ paddingTop: 90, paddingBottom: 80, background: T.bg, minHeight: "100vh" }}>
        <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: "2rem", alignItems: "start" }} className="prod-detail-grid">
            {/* Left Side - Image Gallery Nike Style */}
            <div style={{ minWidth: 0, width: "100%" }}>
              {/* Main Image with Native Scroll & Snap */}
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", marginBottom: "1.2rem", aspectRatio: "1", background: "#f0ece4", position: "relative", isolation: "isolate" }}>
                <div
                  ref={scrollContainerRef}
                  onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.clientWidth;
                    if (width > 0) {
                      const newIndex = Math.round(scrollLeft / width);
                      if (newIndex !== activeImg && newIndex >= 0 && newIndex < imgs.length) {
                        setActiveImg(newIndex);
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  {imgs.map((img, i) => (
                    <img
                      key={i}
                      referrerPolicy="no-referrer"
                      src={img}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        scrollSnapAlign: "start",
                        flexShrink: 0
                      }}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                {imgs.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 10 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 10 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: "0.75rem", fontWeight: 600, zIndex: 10 }}>
                  {activeImg + 1} / {imgs.length}
                </div>
              </div>

              {/* Thumbnail Strip - Nike Style */}
              <div style={{ display: "flex", gap: "0.9rem", overflowX: "auto", padding: "8px 4px", justifyContent: "flex-start" }} className="scroll-hide">
                {imgs.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    variants={thumbnailVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    animate={activeImg === i ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      flexShrink: 0,
                      width: 86,
                      height: 86,
                      borderRadius: 14,
                      overflow: "hidden",
                      padding: 4,
                      background: activeImg === i ? "#fff" : "transparent",
                      border: activeImg === i ? `3px solid ${T.orange}` : "3px solid transparent",
                      cursor: "pointer",
                      boxShadow: activeImg === i ? `0 8px 24px rgba(232,114,12,0.25)` : "0 2px 8px rgba(0,0,0,0.06)",
                      position: "relative"
                    }}
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={img}
                      alt={`view ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 10,
                        opacity: activeImg === i ? 1 : 0.7
                      }}
                    />
                    {activeImg === i && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: "absolute",
                          bottom: -8,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: T.orange
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              {p.bestSeller && <div style={{ display: "inline-block", background: T.orange, color: "#fff", borderRadius: 4, padding: "3px 12px", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "0.8rem" }}>BEST SELLER</div>}
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 900, color: T.text, marginBottom: "0.4rem" }}>{p.name}</h1>
              <p style={{ fontSize: "0.72rem", color: T.textMid, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.category}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.5rem", color: T.orange, fontWeight: 800 }}>₹{p.price.toLocaleString()}</span>
                {p.originalPrice > p.price && <span style={{ color: T.textMid, fontSize: "0.95rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>}
                {p.discount > 0 && <span style={{ background: "rgba(232,114,12,0.1)", color: T.orange, borderRadius: 4, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>{p.discount}% OFF</span>}
                <span style={{ fontSize: "0.72rem", color: T.textMid, fontWeight: 500 }}>(incl. of all taxes)</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem" }}>
                {["desc", "benefits", "suitable"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${tab === t ? T.orange : T.border}`, background: tab === t ? T.orange : "#fff", color: tab === t ? "#fff" : T.textMid, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                    {t === "desc" ? "Description" : t === "benefits" ? "Benefits" : "Suitable For"}
                  </button>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", marginBottom: "1.5rem", border: `1px solid ${T.border}`, minHeight: 90 }}>
                {tab === "desc" && <p style={{ fontSize: "0.86rem", color: T.textMid, lineHeight: 1.7 }}>{p.shortDesc}</p>}
                {tab === "benefits" && <ul style={{ paddingLeft: "1.2rem" }}>{p.benefits.map(b => <li key={b} style={{ fontSize: "0.86rem", color: T.textMid, marginBottom: 6, lineHeight: 1.6 }}>{b}</li>)}</ul>}
                {tab === "suitable" && <p style={{ fontSize: "0.86rem", color: T.textMid, lineHeight: 1.7 }}>{p.suitableFor}</p>}
              </div>
              <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
                {["Free shipping above ₹999", "7-day returns", "100% natural"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: T.textMid }}>
                    <span style={{ color: T.orange }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BestSellersStrip onShop={onShop} />
      {/* Sticky Add to Cart Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: "rgba(255,255,255,0.98)", backdropFilter: "blur(14px)", borderTop: `1px solid ${T.border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", boxShadow: "0 -2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", maxWidth: "500px", width: "100%" }}>
          {cartQty > 0 ? (
            <>
              {/* Compact qty counter */}
              <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${T.orange}`, borderRadius: 8, overflow: "hidden", flexShrink: 0, height: 42 }}>
                <button onClick={handleDec} style={{ width: 36, height: 42, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: T.orange, fontWeight: 700 }}>−</button>
                <span style={{ width: 32, textAlign: "center", fontWeight: 800, color: T.orange, fontSize: "0.95rem" }}>{cartQty}</span>
                <button onClick={handleAdd} disabled={cart?.reduce((s, i) => s + i.qty, 0) >= 10} style={{ width: 36, height: 42, background: cart?.reduce((s, i) => s + i.qty, 0) >= 10 ? "#e5e7eb" : T.orange, border: "none", cursor: cart?.reduce((s, i) => s + i.qty, 0) >= 10 ? "not-allowed" : "pointer", fontSize: 16, color: "#fff", fontWeight: 700 }}>+</button>
              </div>
              {/* View Cart Button */}
              <button onClick={() => navigate("/cart")} style={{ flex: 1, height: 42, background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s", boxShadow: "0 3px 12px rgba(232,114,12,0.3)", animation: "stickyBtnIn 0.3s ease both" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                View Cart • ₹{(cartQty * p.price).toLocaleString()}
              </button>
            </>
          ) : (
            /* Add to Cart Button */
            <button className="btn-orange" onClick={handleAdd} style={{ flex: 1, height: 42, fontSize: "0.9rem", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", animation: "stickyBtnIn 0.3s ease both", boxShadow: "0 3px 12px rgba(232,114,12,0.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart — ₹{p.price.toLocaleString()}
            </button>
          )}
          {/* Wishlist heart */}
          <button onClick={e => onWish(e, p.id)} style={{ width: 42, height: 42, borderRadius: 8, border: `1.5px solid ${T.border}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "scale(1)"; }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wished.includes(p.id) ? "#e53e3e" : "none"} stroke={wished.includes(p.id) ? "#e53e3e" : "#000000"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
      <style>{`@keyframes stickyBtnIn{from{opacity:0;transform:scale(0.94) translateY(4px);}to{opacity:1;transform:scale(1) translateY(0);}}`}</style>
    </>
  );
}
// ─── RITUALS PAGE ─────────────────────────────────────────────
function RitualsPage() {
  const rituals = [
    { icon: "🌙", title: "New Moon Ritual", time: "30 min", desc: "Set powerful intentions with your WishStone under the new moon. Write your desires, charge your stone, and visualize your manifestation.", steps: ["Apne space ko sage se cleanse karein", "WishStone ko dono haathon mein pakdein", "3 intentions paper pe likhein", "Stone ko paper pe raat bhar rakhein", "10 minute meditation karein"] },
    { icon: "☀️", title: "Morning Activation", time: "10 min", desc: "Har subah WishStone activation ritual se apni energy align karein aur din ko positive tone dein.", steps: ["WishStone ko dono haathon mein pakdein", "5 gehri sansein lein", "Apni intention zor se bolein", "Stone ko apne dil pe rakhein", "Isse poore din saath rakhein"] },
    { icon: "🌿", title: "Cleansing Ceremony", time: "20 min", desc: "Regular cleansing se accumulated energies remove hoti hain aur WishStone apni natural vibrational state mein wapas aata hai.", steps: ["Stone ko thande paani se dhoyein", "Sage smoke se pass karein", "1 ghante ke liye sunlight mein rakhein", "Nayi intention set karein", "Sacred space mein store karein"] },
  ];
  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Sacred Rituals</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "0.8rem" }} />
        <p style={{ color: T.textMid, fontSize: "0.88rem", marginBottom: "2.5rem", maxWidth: 580 }}>Ancient practices adapted for modern life.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid">
          {rituals.map(r => (
            <div key={r.title} style={{ background: "#fff", borderRadius: 16, padding: "1.8rem", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 38, marginBottom: "1rem" }}>{r.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.8rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: T.text }}>{r.title}</h3>
                <span style={{ background: "rgba(232,114,12,0.08)", color: T.orange, borderRadius: 20, padding: "2px 10px", fontSize: "0.65rem", fontWeight: 700 }}>{r.time}</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: T.textMid, lineHeight: 1.65, marginBottom: "1.2rem" }}>{r.desc}</p>
              {r.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: "0.78rem", color: T.textMid, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BENEFITS PAGE ────────────────────────────────────────────
function BenefitsPage() {
  const benefits = [
    { icon: "🧘", title: "Mental Clarity", desc: "WishStone ki sacred yantra aur crystal energy mental chatter ko quiet karti hai, focus improve karti hai, aur decision-making mein clarity laati hai." },
    { icon: "💚", title: "Emotional Healing", desc: "Rose quartz aur moonstone gently emotional blockages release karte hain, self-love promote karte hain, aur past wounds se healing support karte hain." },
    { icon: "⚡", title: "Energy Amplification", desc: "WishStone ki frequency motivation, creativity, aur life force energy boost karti hai." },
    { icon: "🛡️", title: "Protection", desc: "Obsidian aur black tourmaline powerful energetic shields create karte hain." },
    { icon: "😴", title: "Better Sleep", desc: "Amethyst aur selenite nervous system ko calm karte hain, anxiety reduce karte hain." },
    { icon: "🌟", title: "Spiritual Growth", desc: "WishStone ki sacred yantra third eye open karti hai, intuition enhance karti hai." },
  ];
  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>WishStone Benefits</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "0.8rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "2rem" }} className="prod-grid">
          {benefits.map(b => (
            <div key={b.title} className="power-card">
              <div style={{ fontSize: 34, marginBottom: "1rem" }}>{b.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>{b.title}</h3>
              <p style={{ fontSize: "0.8rem", color: T.textMid, lineHeight: 1.65 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STORIES PAGE ─────────────────────────────────────────────
function StoriesPage() {
  const stories = [
    { name: "Priya S.", city: "Mumbai", rating: 5, text: "Pehle mujhe yakeen nahi tha, lekin Rose Quartz use karne ke 3 hafte baad, main genuinely zyada peaceful feel karti hoon.", product: "WishStone — Rose Quartz", avatar: "P" },
    { name: "Rahul M.", city: "Delhi", rating: 5, text: "Amethyst WishStone ne meri meditation practice completely change kar di.", product: "WishStone — Amethyst", avatar: "R" },
    { name: "Ananya K.", city: "Bangalore", rating: 5, text: "2 mahine pehle morning ritual shuru kiya WishStone ke saath. Meri productivity double ho gayi.", product: "Moonstone Ritual Kit", avatar: "A" },
    { name: "Vikram T.", city: "Pune", rating: 5, text: "Obsidian WishStone mere desk pe hai aur meri workspace ki energy shift ho gayi hai.", product: "WishStone — Obsidian", avatar: "V" },
    { name: "Meera J.", city: "Chennai", rating: 5, text: "Lavender Bundle bilkul divine hai. Ghar ki khushboo incredible hai.", product: "Healing Lavender Bundle", avatar: "M" },
    { name: "Arjun P.", city: "Hyderabad", rating: 5, text: "Apni maa ko Sandalwood Incense gift kiya. Quality exceptional hai.", product: "Sacred Sandalwood Incense", avatar: "A" },
  ];
  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Customer Stories</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "0.8rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", marginTop: "2rem" }} className="prod-grid">
          {stories.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
                {Array(s.rating).fill(0).map((_, j) => <span key={j} style={{ color: T.orange, fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ fontSize: "0.84rem", color: T.textMid, lineHeight: 1.7, marginBottom: "1.2rem", fontStyle: "italic" }}>"{s.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>{s.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: "0.82rem" }}>{s.name}</div>
                  <div style={{ fontSize: "0.68rem", color: T.textMid }}>{s.city} · {s.product}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────
function CartPage({ cart, onQty, onRemove, onCheckout, onProductClick }) {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ship = sub >= 999 ? 0 : 99;
  const total = sub + ship;
  if (cart.length === 0) return (
    <div style={{ paddingTop: 130, paddingBottom: 40, paddingLeft: "2rem", paddingRight: "2rem", background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
      <div style={{ fontSize: 56 }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.8rem", fontWeight: 900 }}>Your Cart is Empty</h2>
    </div>
  );
  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Your Cart</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "1.5rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }} className="checkout-grid">
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center", border: `1px solid ${T.border}` }}>
                <img referrerPolicy="no-referrer" src={item.image} alt={item.name} onClick={() => onProductClick && onProductClick(item)} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 8, flexShrink: 0, cursor: onProductClick ? "pointer" : "default", transition: "opacity 0.2s" }}
                  onMouseEnter={e => { if (onProductClick) e.currentTarget.style.opacity = "0.8"; }}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"} />
                <div style={{ flex: 1 }}>
                  <h4 onClick={() => onProductClick && onProductClick(item)} style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, marginBottom: 4, cursor: onProductClick ? "pointer" : "default" }}
                    onMouseEnter={e => { if (onProductClick) e.currentTarget.style.color = T.orange; }}
                    onMouseLeave={e => e.currentTarget.style.color = T.text}>{item.name}</h4>
                  <p style={{ fontSize: "0.78rem", color: T.textMid, marginBottom: 8 }}>Rs.{item.price.toLocaleString()} each</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${T.border}`, borderRadius: 6, overflow: "hidden" }}>
                      <button onClick={() => onQty(item.id, -1)} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: T.text }}>-</button>
                      <span style={{ width: 30, textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: T.text }}>{item.qty}</span>
                      <button onClick={() => onQty(item.id, 1)} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: T.text }}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: "0.72rem", fontWeight: 600 }}>Remove</button>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: T.orange, fontSize: "0.95rem", flexShrink: 0 }}>Rs.{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.2rem" }}>Order Summary</h3>
            {[["Subtotal", "Rs." + sub.toLocaleString()], ["Shipping", ship === 0 ? "FREE" : "Rs." + ship]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: T.textMid, fontSize: "0.82rem" }}>{l}</span>
                <span style={{ color: T.text, fontSize: "0.82rem", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem", display: "flex", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <span style={{ color: T.text, fontWeight: 700 }}>Total</span>
              <span style={{ color: T.orange, fontSize: "1.1rem", fontWeight: 800 }}>Rs.{total.toLocaleString()}</span>
            </div>
            <button className="btn-orange" onClick={onCheckout} style={{ width: "100%", padding: "13px", fontSize: "0.8rem", borderRadius: 8 }}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const FALLBACK_COUPONS = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrderValue: 999, description: "Save 10% on your first order of sacred stones & tools" },
  { code: "MANIFEST15", discountType: "percentage", discountValue: 15, minOrderValue: 1999, description: "Get 15% off on your manifestation journey" },
  { code: "COSMIC20", discountType: "percentage", discountValue: 20, minOrderValue: 2999, description: "Unlock 20% off on our premium cosmic collections" }
];

// ─── CHECKOUT PAGE ────────────────────────────────────────────
function CheckoutPage({ cart, onPlaceOrder }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [fetchingCoupons, setFetchingCoupons] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      setFetchingCoupons(true);
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
        const res = await fetch(`${API_BASE}/api/coupons`);
        const data = await res.json();
        if (data.success) {
          setAvailableCoupons(data.coupons || []);
        }
      } catch (err) {
        // Silent fail
      }
      setFetchingCoupons(false);
    };
    fetchCoupons();
  }, []);

  const selectAndApplyCoupon = async (code) => {
    setCoupon(code);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase(), orderTotal: sub })
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        setCouponMsg(data.message || `Coupon ${code} applied!`);
      } else {
        setDiscount(0);
        setCouponMsg(data.message || "Invalid coupon code.");
      }
    } catch {
      setDiscount(0);
      setCouponMsg("Could not validate coupon. Try again.");
    }
  };

  const handleCopyCode = (e, code) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1500);
  };

  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const couponsToShow = availableCoupons.length > 0 ? availableCoupons : FALLBACK_COUPONS;
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const giftCharge = isGift ? totalQty * 50 : 0;
  const ship = sub >= 999 ? 0 : 99;
  const total = sub + ship + giftCharge - discount;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.trim().toUpperCase(), orderTotal: sub })
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        setCouponMsg(data.message || "Coupon applied!");
      } else {
        setDiscount(0);
        setCouponMsg(data.message || "Invalid coupon code.");
      }
    } catch {
      setDiscount(0);
      setCouponMsg("Could not validate coupon. Try again.");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) return setError("Please fill all required fields.");
    setLoading(true);

    const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
    const token = localStorage.getItem("ws_token") || "";
    const orderPayload = {
      items: cart.map(i => ({ productId: String(i._id || i.id || ""), name: i.name || "Product", price: i.price || 0, quantity: i.qty || 1, image: i.image || "" })),
      couponCode: coupon || "",
      customer: { name: form.name, email: form.email, phone: form.phone },
      shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode, country: "India" },
    };

    try {
      // Load Razorpay script if not loaded
      if (!window.Razorpay && !document.getElementById("rzp-script")) {
        await new Promise((res, rej) => {
          const s = document.createElement("script"); s.id = "rzp-script";
          s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; s.onerror = rej;
          document.body.appendChild(s);
        });
      }

      const createRes  = await fetch(`${API_BASE}/api/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(orderPayload) });
      const createData = await createRes.json();
      if (!createData.success) { setError(createData.message || "Could not create payment order."); setLoading(false); return; }

      const verifyPayment = async (response) => {
        try {
          const vRes  = await fetch(`${API_BASE}/api/payment/verify`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, items: orderPayload.items, customer: orderPayload.customer, shippingAddress: orderPayload.shippingAddress, couponCode: coupon || "" }) });
          const vData = await vRes.json();
          if (vData.success) { onPlaceOrder({ items: cart, address: form, totalAmount: vData.order?.totalAmount || total, coupon, discount, isGift, giftNote, paymentMethod: "razorpay", razorpayPaymentId: response.razorpay_payment_id, razorpayOrderId: response.razorpay_order_id, backendOrder: vData.order }); }
          else { setError(vData.message || "Payment verification failed. Contact support if amount was deducted."); }
        } catch { setError("Verification failed. If amount was deducted, please contact support."); }
        setLoading(false);
      };

      // Mock mode (no real keys on server)
      if (createData.mockMode) {
        const ov = document.createElement("div");
        ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;";
        document.body.appendChild(ov);
        const bx = document.createElement("div"); bx.style.cssText = "background:#fff;border-radius:16px;width:360px;max-width:90vw;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);"; ov.appendChild(bx);
        const hd = document.createElement("div"); hd.style.cssText = "background:#02042b;padding:20px;color:#fff;text-align:center;"; hd.innerHTML = "<div style='font-size:18px;font-weight:700;margin-bottom:4px;'>Razorpay Test Mode</div><div style='font-size:13px;opacity:0.75;'>WishStone &bull; ₹" + (createData.amount / 100) + "</div>"; bx.appendChild(hd);
        const bd = document.createElement("div"); bd.style.cssText = "padding:28px 24px;text-align:center;"; bd.innerHTML = "<p style='font-size:13px;color:#555;margin-bottom:20px;line-height:1.6;'>Test mode active. Simulate payment result below.</p>"; bx.appendChild(bd);
        const sb = document.createElement("button"); sb.textContent = "✓  Simulate Successful Payment"; sb.style.cssText = "background:#10b981;color:#fff;border:none;padding:13px 20px;border-radius:8px;width:100%;font-weight:700;cursor:pointer;font-size:14px;margin-bottom:10px;font-family:inherit;"; bd.appendChild(sb);
        const fb = document.createElement("button"); fb.textContent = "✕  Simulate Failed Payment"; fb.style.cssText = "background:#ef4444;color:#fff;border:none;padding:13px 20px;border-radius:8px;width:100%;font-weight:700;cursor:pointer;font-size:14px;font-family:inherit;"; bd.appendChild(fb);
        const close = () => { if (document.body.contains(ov)) document.body.removeChild(ov); };
        sb.onclick = async () => {
          bd.innerHTML = "<div style='padding:20px;color:#555;font-size:14px;'>Verifying payment…</div>";
          const mpid = "pay_mock_" + Date.now();
          try {
            const enc = new TextEncoder(); const k = await window.crypto.subtle.importKey("raw", enc.encode("mock_demo_secret_123"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
            const sig = await window.crypto.subtle.sign("HMAC", k, enc.encode(createData.razorpayOrderId + "|" + mpid));
            const ms = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
            close(); await verifyPayment({ razorpay_payment_id: mpid, razorpay_order_id: createData.razorpayOrderId, razorpay_signature: ms });
          } catch (e) { close(); setError("Mock error: " + e.message); setLoading(false); }
        };
        fb.onclick = () => { close(); setError("Payment failed. Please try again."); setLoading(false); };
        return;
      }

      // Real Razorpay popup
      if (!window.Razorpay) { setError("Payment gateway failed to load. Please refresh and try again."); setLoading(false); return; }
      const rzp = new window.Razorpay({
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency || "INR",
        name: "WishStone",
        description: `Order — ${cart.length} item${cart.length > 1 ? "s" : ""}`,
        image: `${process.env.PUBLIC_URL || ""}/wishstone svg.svg`,
        order_id: createData.razorpayOrderId,
        config_id: process.env.REACT_APP_RAZORPAY_CONFIG_ID || createData.configId || undefined,
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR Code",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr", "intent", "collect"]
                  }
                ]
              }
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        prefill: createData.prefill || {},
        theme: { color: "#E8720C" },
        handler: verifyPayment,
        modal: { ondismiss: () => setLoading(false), escape: true, animation: true }
      });
      rzp.on("payment.failed", r => { setLoading(false); setError(r.error?.description || r.error?.reason || "Payment failed. Please try again."); });
      rzp.open();
    } catch (err) { setError("Something went wrong. Please try again."); setLoading(false); }
  };

  const inp = (key, label, type = "text", half = false) => (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMid, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
        style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.86rem", background: "#fff", color: T.text, outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
    </div>
  );

  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Checkout</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "1.5rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }} className="checkout-grid">
          <form onSubmit={handleSubmit}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, marginBottom: "1.2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>Delivery Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="checkout-form-grid">
                {inp("name", "Full Name")} {inp("email", "Email Address", "email")}
                {inp("phone", "Phone Number", "tel")} {inp("address", "Street Address")}
                {inp("city", "City", "text", true)} {inp("state", "State", "text", true)}
                {inp("pincode", "Pincode", "text", true)}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, marginBottom: "1.2rem" }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Coupon Code</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code"
                  style={{ flex: 1, padding: "10px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.84rem", background: "#fff", color: T.text, outline: "none" }}
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
                <button type="button" className="btn-orange" onClick={applyCoupon} style={{ padding: "10px 18px", fontSize: "0.76rem", borderRadius: 8 }}>Apply</button>
              </div>
              {couponMsg && <p style={{ fontSize: "0.76rem", marginTop: 6, color: discount > 0 ? "#2d7a5a" : "#c0392b" }}>{couponMsg}</p>}

              {/* Beautiful Coupons List Accordion */}
              {couponsToShow.length > 0 && (
                <div style={{ marginTop: "1.2rem", borderTop: `1px dashed ${T.border}`, paddingTop: "1rem" }}>
                  <div 
                    onClick={() => setShowCoupons(!showCoupons)} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "12px 16px", 
                      background: "linear-gradient(135deg, rgba(232,114,12,0.05), rgba(245,240,232,0.5))", 
                      border: `1.5px solid ${showCoupons ? T.orange : T.orange + "44"}`, 
                      borderRadius: 12, 
                      cursor: "pointer", 
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 2px 8px rgba(232,114,12,0.04)"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(232,114,12,0.08)";
                      e.currentTarget.style.borderColor = T.orange;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(232,114,12,0.04)";
                      if (!showCoupons) {
                        e.currentTarget.style.borderColor = T.orange + "44";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1.1rem", animation: "float 2s infinite" }}>🏷️</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text, letterSpacing: "0.02em" }}>
                        Some offers are available! Grab them now
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "0.68rem", background: T.orange, color: "#fff", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                        {couponsToShow.length} Offers
                      </span>
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={T.orange} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        style={{ 
                          transform: showCoupons ? "rotate(180deg)" : "rotate(0deg)", 
                          transition: "transform 0.3s ease" 
                        }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showCoupons && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto", padding: "4px 2px" }} className="scroll-hide">
                          {couponsToShow.map(c => {
                            const isApplied = coupon.trim().toUpperCase() === c.code.toUpperCase() && discount > 0;
                            const isCopied = copiedCode === c.code;
                            return (
                              <div
                                key={c.code}
                                style={{
                                  background: isApplied ? "rgba(232,114,12,0.04)" : "rgba(0,0,0,0.01)",
                                  border: `1.5px dashed ${isApplied ? T.orange : "rgba(26,26,26,0.12)"}`,
                                  borderRadius: 12,
                                  padding: "12px 16px",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  position: "relative",
                                  overflow: "hidden",
                                  boxShadow: isApplied ? "0 4px 10px rgba(232,114,12,0.06)" : "none"
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor = T.orange;
                                  e.currentTarget.style.background = "rgba(232,114,12,0.03)";
                                }}
                                onMouseLeave={e => {
                                  if (!isApplied) {
                                    e.currentTarget.style.borderColor = "rgba(26,26,26,0.12)";
                                    e.currentTarget.style.background = "rgba(0,0,0,0.01)";
                                  }
                                }}
                              >
                                {/* Ticket notch left */}
                                <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: "#fff", borderRight: `1.5px dashed ${isApplied ? T.orange : "rgba(26,26,26,0.12)"}` }} />
                                {/* Ticket notch right */}
                                <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: "#fff", borderLeft: `1.5px dashed ${isApplied ? T.orange : "rgba(26,26,26,0.12)"}` }} />
                                
                                <div style={{ paddingLeft: 8, paddingRight: 8, flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span 
                                      onClick={(e) => handleCopyCode(e, c.code)}
                                      style={{ 
                                        fontSize: "0.82rem", 
                                        fontWeight: 850, 
                                        color: T.text, 
                                        letterSpacing: "0.06em",
                                        background: "rgba(0,0,0,0.04)",
                                        padding: "2px 6px",
                                        borderRadius: 6,
                                        cursor: "copy",
                                        userSelect: "all",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.2s"
                                      }}
                                      onMouseEnter={e => {
                                        e.currentTarget.style.background = "rgba(232,114,12,0.08)";
                                        e.currentTarget.style.color = T.orange;
                                      }}
                                      onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                                        e.currentTarget.style.color = T.text;
                                      }}
                                      title="Click to copy"
                                    >
                                      {c.code}
                                      <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>📋</span>
                                    </span>
                                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: T.orange }}>
                                      {c.discountType === "flat" ? `₹${c.discountValue} Off` : `${c.discountValue}% Off`}
                                    </span>
                                  </div>
                                  {c.description && <div style={{ fontSize: "0.7rem", color: T.textMid, marginTop: 4, lineHeight: 1.3 }}>{c.description}</div>}
                                  {c.minOrderValue > 0 && (
                                    <div style={{ fontSize: "0.64rem", color: "rgba(26,26,26,0.45)", marginTop: 2 }}>
                                      Min. Order: ₹{c.minOrderValue}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, zIndex: 2 }}>
                                  <button
                                    type="button"
                                    onClick={() => selectAndApplyCoupon(c.code)}
                                    style={{
                                      background: isApplied ? T.orange : "transparent",
                                      border: `1.5px solid ${T.orange}`,
                                      color: isApplied ? "#fff" : T.orange,
                                      borderRadius: 8,
                                      padding: "5px 12px",
                                      fontSize: "0.7rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      transition: "all 0.2s",
                                      boxShadow: isApplied ? "0 2px 6px rgba(232,114,12,0.15)" : "none"
                                    }}
                                  >
                                    {isApplied ? "Applied ✓" : "Apply"}
                                  </button>
                                  <span 
                                    onClick={(e) => handleCopyCode(e, c.code)}
                                    style={{ 
                                      fontSize: "0.6rem", 
                                      color: isCopied ? "#2d7a5a" : T.textMid, 
                                      fontWeight: 600, 
                                      cursor: "pointer",
                                      opacity: isCopied ? 1 : 0.6,
                                      transition: "all 0.2s"
                                    }}
                                  >
                                    {isCopied ? "Copied!" : "Copy Code"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* ─── GIFT WRAPPING ─── */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, marginBottom: "1.2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", userSelect: "none" }}>
                <div onClick={() => setIsGift(g => !g)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isGift ? T.orange : T.border}`, background: isGift ? T.orange : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                  {isGift && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1, fontWeight: 900 }}>✓</span>}
                </div>
                <div>
                  <span style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1rem", fontWeight: 700 }}>🎁 Gift Wrapping</span>
                  <span style={{ display: "block", fontSize: "0.72rem", color: T.textMid, marginTop: 2 }}>Add premium gift wrapping — ₹50 per item</span>
                </div>
              </label>
              {isGift && (
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMid, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Gift Note (optional)</label>
                  <textarea value={giftNote} onChange={e => setGiftNote(e.target.value)} placeholder="Write a personal message for the recipient..." rows={3}
                    style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.84rem", background: "#fff", color: T.text, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'Inter',sans-serif" }}
                    onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
                  <p style={{ fontSize: "0.72rem", color: T.orange, marginTop: 6, fontWeight: 600 }}>Gift wrapping charge: ₹{giftCharge} ({totalQty} item{totalQty > 1 ? "s" : ""} × ₹50)</p>
                </div>
              )}
            </div>
            {error && <div style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: "1rem", display: "flex", gap: 8 }}><span>⚠️</span><p style={{ color: "#c0392b", fontSize: "0.78rem", margin: 0 }}>{error}</p></div>}
            <button type="submit" className="btn-orange" disabled={loading} style={{ width: "100%", padding: "14px", fontSize: "0.84rem", borderRadius: 9, opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              {loading ? (
                <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTop: "2.5px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Processing Payment…</>
              ) : (
                <>
                  <span>🔒</span> 
                  Pay ₹{total.toLocaleString()} Securely {discount > 0 && `(₹${discount} Discount Applied)`}
                </>
              )}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.65rem", color: T.textMid, marginTop: "0.6rem", opacity: 0.6 }}>🔒 Secured by Razorpay — 256-bit SSL encrypted</p>
          </form>
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.2rem" }}>Order Summary</h3>
            {cart.map(i => {
              const prod = PRODUCTS.find(p => p.id === i.id);
              return (
                <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer", borderRadius: 10, padding: "6px 4px", transition: "background 0.15s" }}
                  onClick={() => navigate(`/product/${i.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(232,114,12,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}` }}>
                    <img
                      referrerPolicy="no-referrer"
                      src={prod?.image || i.image || ""}
                      alt={i.name}
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${i.id}`); }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", color: T.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.name}</div>
                    <div style={{ fontSize: "0.7rem", color: T.textMid }}>x{i.qty}</div>
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: T.text, flexShrink: 0 }}>₹{(i.price * i.qty).toLocaleString()}</span>
                </div>
              );
            })}
            {ship > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.8rem", color: T.textMid }}>Shipping</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: T.text }}>₹{ship}</span>
              </div>
            )}
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.8rem", color: "#2d7a5a" }}>Coupon Discount</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2d7a5a" }}>−₹{discount}</span>
              </div>
            )}
            {isGift && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.8rem", color: T.orange }}>🎁 Gift Wrapping</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: T.orange }}>+₹{giftCharge}</span>
              </div>
            )}
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.9rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.text, fontWeight: 700 }}>Total</span>
              <span style={{ color: T.orange, fontSize: "1.1rem", fontWeight: 800 }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────
function WishlistPage({ ids, onAdd, onWish, onClick }) {
  const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids || ids.length === 0) { setItems([]); setLoading(false); return; }

    // Fetch all wishlisted products from backend
    const fetchWishlistItems = async () => {
      setLoading(true);
      try {
        // Fetch each product by id — run in parallel
        const results = await Promise.allSettled(
          ids.map(id => fetch(`${API_BASE}/api/products/${id}`).then(r => r.json()))
        );
        const fetched = results
          .filter(r => r.status === "fulfilled" && r.value?.success && r.value?.product)
          .map(r => {
            const p = r.value.product;
            return {
              ...p,
              id: p._id,
              _id: p._id,
              image: p.images?.[0] || "",
              discount: p.discount || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0),
              isBestSeller: p.isBestSeller || false,
            };
          });

        // Fallback: for any ids that failed, try hardcoded PRODUCTS
        const fetchedIds = new Set(fetched.map(p => p._id));
        const fallbacks = ids
          .filter(id => !fetchedIds.has(id))
          .map(id => PRODUCTS.find(p => p.id === parseInt(id) || String(p.id) === id))
          .filter(Boolean)
          .map(p => ({ ...p, _id: String(p.id), image: p.image }));

        setItems([...fetched, ...fallbacks]);
      } catch {
        // Full fallback to hardcoded
        const fallback = ids
          .map(id => PRODUCTS.find(p => p.id === parseInt(id) || String(p.id) === id))
          .filter(Boolean)
          .map(p => ({ ...p, _id: String(p.id), image: p.image }));
        setItems(fallback);
      }
      setLoading(false);
    };

    fetchWishlistItems();
  }, [ids, API_BASE]);

  if (loading) return (
    <div style={{ paddingTop: 130, background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(232,114,12,0.2)", borderTop: `3px solid ${T.orange}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: T.textLight, fontSize: "0.88rem" }}>Loading wishlist…</p>
      </div>
    </div>
  );

  if (!items.length) return (
    <div style={{ paddingTop: 130, paddingBottom: 40, paddingLeft: "2rem", paddingRight: "2rem", background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
      <div style={{ fontSize: 56 }}>🤍</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.8rem", fontWeight: 900 }}>Your Wishlist is Empty</h2>
      <p style={{ color: T.textMid, fontSize: "0.9rem" }}>Save products you love and find them here.</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 900, marginBottom: "0.4rem" }}>Your Wishlist</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "0.5rem" }} />
        <p style={{ color: T.textMid, fontSize: "0.85rem", marginBottom: "1.5rem" }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid">
          {items.map(p => (
            <div key={p._id} className="prod-card" onClick={() => onClick(p)}>
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                {p.image ? (
                  <img referrerPolicy="no-referrer" src={p.image} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                ) : null}
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${T.bg},#ede8df)`, display: p.image ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>◆</div>
                {p.discount > 0 && <div style={{ position: "absolute", top: 10, left: 10, background: T.orange, color: "#fff", borderRadius: 4, padding: "3px 10px", fontSize: "0.65rem", fontWeight: 800 }}>-{p.discount}%</div>}
                <button onClick={e => { e.stopPropagation(); onWish(p._id); }}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>❤️</button>
                {p.isBestSeller && <div style={{ position: "absolute", bottom: 8, left: 8, background: T.bgDark, color: T.orange, borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em" }}>BEST SELLER</div>}
              </div>
              <div style={{ padding: "1.2rem" }}>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: T.text, marginBottom: "0.4rem" }}>{p.name}</h4>
                {p.shortDesc && <p style={{ fontSize: "0.76rem", color: T.textMid, marginBottom: "0.7rem", lineHeight: 1.5 }}>{p.shortDesc.slice(0, 65)}{p.shortDesc.length > 65 ? "..." : ""}</p>}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.8rem" }}>
                  <span style={{ fontSize: "1rem", color: T.orange, fontWeight: 700 }}>₹{p.price.toLocaleString()}</span>
                  {p.originalPrice > p.price && <span style={{ color: T.textMid, fontSize: "0.75rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>}
                </div>
                <button className="btn-orange" onClick={e => { e.stopPropagation(); onAdd(p); }} style={{ width: "100%", padding: "10px", fontSize: "0.72rem", borderRadius: 7 }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────
function SignupPage({ onSignup, onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
  const GOOGLE_CLIENT_ID = "342285664182-b68b0t0tmj66jgu9eg14hg7212a57h2r.apps.googleusercontent.com";

  useEffect(() => {
    // Load Google GSI script
    if (!document.getElementById("gsi-script")) {
      const s = document.createElement("script"); s.id = "gsi-script"; s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true; document.head.appendChild(s);
    }
    const render = () => {
      if (!window.google) { setTimeout(render, 300); return; }
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, use_fedcm_for_prompt: true, callback: async (resp) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential: resp.credential }) });
          const data = await res.json();
          if (data.success && data.token) { localStorage.setItem("ws_token", data.token); localStorage.setItem("ws_user", JSON.stringify(data.user)); onSignup({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }); }
        } catch { setError("Google sign-in failed. Please try again."); }
      }});
      const el = document.getElementById("google-signup-btn");
      if (el) window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: el.offsetWidth || 340, text: "signup_with", shape: "rectangular", logo_alignment: "left" });
    };
    setTimeout(render, 500);
  }, []);

  const handle = async e => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      const data = await res.json();
      if (data.token) { localStorage.setItem("ws_token", data.token); localStorage.setItem("ws_user", JSON.stringify(data.user)); onSignup({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }); }
      else { setError(data.message || "Registration failed. Please try again."); }
    } catch { setError("Network error. Please try again."); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, animation: "cardIn 0.5s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 40, width: "auto", display: "block", margin: "0 auto 8px" }} />
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>Create Account</h2>
        </div>
        {/* Google Sign-Up */}
        <div id="google-signup-btn" style={{ width: "100%", marginBottom: "1.25rem", minHeight: 44 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: "0.72rem", color: T.textMid, fontWeight: 600, letterSpacing: "0.08em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <form onSubmit={handle}>
          {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["password", "Password", "password"], ["confirm", "Confirm Password", "password"]].map(([k, l, t]) => (
            <div key={k} style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMid, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</label>
              <input type={k === "password" || k === "confirm" ? (showPw ? "text" : t) : t} placeholder={l} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.88rem", background: "#fff", color: T.text, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
          ))}
          {error && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" className="btn-orange" style={{ width: "100%", padding: "13px", fontSize: "0.82rem", borderRadius: 8 }}>Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: T.textMid }}>
          Already have an account? <button onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: T.orange, fontWeight: 700, fontSize: "0.82rem" }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
  const GOOGLE_CLIENT_ID = "342285664182-b68b0t0tmj66jgu9eg14hg7212a57h2r.apps.googleusercontent.com";

  useEffect(() => {
    if (!document.getElementById("gsi-script")) {
      const s = document.createElement("script"); s.id = "gsi-script"; s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.defer = true; document.head.appendChild(s);
    }
    const render = () => {
      if (!window.google) { setTimeout(render, 300); return; }
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, use_fedcm_for_prompt: true, callback: async (resp) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential: resp.credential }) });
          const data = await res.json();
          if (data.success && data.token) { localStorage.setItem("ws_token", data.token); localStorage.setItem("ws_user", JSON.stringify(data.user)); onLogin({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }); }
        } catch { setError("Google sign-in failed. Please try again."); }
      }});
      const el = document.getElementById("google-login-btn");
      if (el) window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: el.offsetWidth || 320, text: "signin_with", shape: "rectangular", logo_alignment: "left" });
    };
    setTimeout(render, 500);
  }, []);

  const handle = async e => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) return setError("Email and password are required.");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, password: form.password }) });
      const data = await res.json();
      if (data.token) { localStorage.setItem("ws_token", data.token); localStorage.setItem("ws_user", JSON.stringify(data.user)); onLogin({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }); }
      else { setError(data.message || "Invalid email or password."); }
    } catch { setError("Network error. Please try again."); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, animation: "cardIn 0.5s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>🔮</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.5rem", fontWeight: 900, margin: 0 }}>Welcome Back</h2>
        </div>
        {/* Google Sign-In */}
        <div id="google-login-btn" style={{ width: "100%", marginBottom: "1.25rem", minHeight: 44 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: "0.72rem", color: T.textMid, fontWeight: 600, letterSpacing: "0.08em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        <form onSubmit={handle}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMid, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.88rem", background: "#fff", color: T.text, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: T.textMid, marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: "100%", padding: "11px 42px 11px 13px", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: "0.88rem", background: "#fff", color: T.text, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: T.textMid }}>{showPw ? "🙈" : "👁"}</button>
            </div>
          </div>
          {error && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" className="btn-orange" style={{ width: "100%", padding: "13px", fontSize: "0.82rem", borderRadius: 8 }}>Sign In</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.82rem", color: T.textMid }}>
          New to WishStone? <button onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: T.orange, fontWeight: 700, fontSize: "0.82rem" }}>Create Account</button>
        </p>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────
function UserDashboard({ user, orders, onLogout, onNav, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [apiOrders, setApiOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  const [editSaved, setEditSaved] = useState(false);
  const [trackModal, setTrackModal] = useState(null); // order object or "empty"

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending = orders.filter(o => (o.status || "Confirmed") === "Pending").length;
  const completed = orders.filter(o => (o.status || "Confirmed") === "Delivered").length;

  // Fetch orders from backend if token exists
  useEffect(() => {
    const token = localStorage.getItem("ws_token");
    if (!token || token.startsWith("local_") || token.startsWith("google_")) return;
    const API = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
    setLoadingOrders(true);
    fetch(`${API}/api/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success && d.orders) setApiOrders(d.orders); })
      .catch(() => { })
      .finally(() => setLoadingOrders(false));
  }, []);

  const allOrders = apiOrders.length > 0 ? apiOrders : orders;

  // App theme colors
  const P = T.orange;           // #E8720C — primary accent
  const PL = "rgba(232,114,12,0.08)"; // light orange tint
  const bg = T.bg;              // #F5F0E8 — warm beige
  const card = T.white;         // #ffffff
  const border = T.border;      // rgba(26,26,26,0.12)
  const txt = T.text;           // #1a1a1a
  const sub = T.textMid;        // #4a4a4a

  const tabs = [
    { key: "orders", icon: "🛍", label: "My Orders" },
    { key: "track", icon: "📦", label: "Track Orders" },
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "wishlist", icon: "🤍", label: "Wishlist" },
    { key: "cart", icon: "🛒", label: "Cart" },
  ];

  const statCards = [
    { label: "Total Orders", value: allOrders.length, icon: "🛍", color: "#3b82f6", light: "#eff6ff" },
    { label: "Pending", value: pending, icon: "⏳", color: "#f97316", light: "#fff7ed" },
    { label: "Completed", value: completed, icon: "✅", color: "#10b981", light: "#ecfdf5" },
    { label: "Total Spent", value: "₹" + totalSpent.toLocaleString(), icon: "💰", color: P, light: PL },
  ];

  return (
    <div style={{ paddingTop: 72, background: bg, minHeight: "100vh", fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        @keyframes dashPageIn{
          from{opacity:0;transform:translateX(30px) scale(0.97);}
          to{opacity:1;transform:translateX(0) scale(1);}
        }
        .dash-nav-btn:hover{background:${PL} !important;color:${P} !important;}
        .dash-order-card:hover{box-shadow:0 8px 32px rgba(0,0,0,0.1) !important;transform:translateY(-2px);}
        .dash-stat:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,0.1) !important;}
        @media(max-width:1024px){
          .dash-main-content{animation:dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both;}
        }
        @media(max-width:768px){
          .dash-main-content{position:fixed;inset:0;top:64px;z-index:500;background:${bg};overflow-y:auto;padding:1.2rem 1rem 5rem;animation:dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both;}
          .dash-mobile-bottomnav{display:flex !important;}
        }
        .dash-mobile-bottomnav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:600;background:#fff;border-top:1px solid ${border};padding:6px 0 env(safe-area-inset-bottom,6px);}
      `}</style>

      <div style={{ maxWidth: 1450, margin: "0 auto", padding: "1.5rem clamp(1rem,2.5vw,2rem)", display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.8rem", alignItems: "start" }} className="dashboard-layout">

        {/* ── SIDEBAR ── */}
        <aside style={{ position: "sticky", top: 80 }} className="dash-sidebar">

          {/* Brand */}
          <div style={{ background: card, borderRadius: 16, padding: "1.3rem 1.5rem", marginBottom: "0.8rem", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
            <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 22, width: "auto", display: "block", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.7rem", color: sub }}>Your Dashboard</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          </div>

          {/* Nav links */}
          <div style={{ background: card, borderRadius: 16, padding: "0.7rem", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "0.8rem" }}>
            {tabs.map(t => (
              <button key={t.key} className="dash-nav-btn"
                onClick={() => { if (t.key === "wishlist") onNav("wishlist"); else if (t.key === "cart") onNav("cart"); else setActiveTab(t.key); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.9rem", fontWeight: 600, marginBottom: 3, transition: "all 0.18s",
                  background: activeTab === t.key ? `linear-gradient(135deg,${T.orangeD},${P})` : "transparent",
                  color: activeTab === t.key ? "#fff" : "#374151",
                  boxShadow: activeTab === t.key ? `0 4px 16px rgba(232,114,12,0.3)` : "none"
                }}>
                <span style={{ fontSize: 19, width: 24, textAlign: "center", flexShrink: 0 }}>{t.icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
                {activeTab === t.key && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block", flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ background: card, borderRadius: 16, padding: "0.7rem", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "0.8rem" }}>
            <button onClick={onLogout} className="dash-nav-btn"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "13px 15px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.9rem", fontWeight: 600, background: "transparent", color: "#ef4444", transition: "all 0.18s" }}>
              <span style={{ fontSize: 19, width: 24, textAlign: "center" }}>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Special offer card */}
          <div style={{ background: `linear-gradient(135deg,${T.orangeD},${P})`, borderRadius: 16, padding: "1.4rem 1.3rem", boxShadow: `0 4px 20px rgba(232,114,12,0.3)` }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff", marginBottom: 7 }}>Special Offer! 🎉</div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.88)", marginBottom: "1.1rem", lineHeight: 1.6 }}>Get ₹300 off on your next purchase.<br />Use code: <strong>WOW300</strong></div>
            <button onClick={() => onNav("products")} style={{ width: "100%", padding: "10px", background: "#fff", color: P, border: "none", borderRadius: 10, fontSize: "0.82rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "0.02em" }}>Shop Now</button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ minWidth: 0 }} className="dash-main-content">

          {/* ── MY ORDERS ── */}
          {activeTab === "orders" && (
            <div key="orders" style={{ animation: "dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.6rem", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: txt, margin: 0, letterSpacing: "-0.02em" }}>Order History</h1>
                  <p style={{ color: sub, fontSize: "0.85rem", marginTop: 4 }}>{allOrders.length} order{allOrders.length !== 1 ? "s" : ""} placed</p>
                </div>
                <button onClick={() => onNav("products")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 16px rgba(232,114,12,0.3)` }}>
                  + New Order
                </button>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.8rem" }} className="dashboard-stats">
                {statCards.map((s, i) => (
                  <div key={s.label} className="dash-stat" style={{ background: card, borderRadius: 16, padding: "1.2rem 1rem", border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", transition: "all 0.25s", animation: `popIn 0.4s ease ${i * 0.08}s both`, cursor: "default" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: s.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: sub, fontWeight: 600, letterSpacing: "0.04em" }}>{s.label}</div>
                    <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg,${s.color},transparent)`, opacity: 0.4 }} />
                  </div>
                ))}
              </div>

              {/* Order list */}
              {loadingOrders ? (
                <div style={{ background: card, borderRadius: 20, padding: "4rem", textAlign: "center", border: `1px solid ${border}` }}>
                  <div style={{ width: 44, height: 44, border: `3px solid ${PL}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                  <p style={{ color: sub, fontSize: "0.9rem" }}>Loading your orders...</p>
                </div>
              ) : allOrders.length === 0 ? (
                <div style={{ background: card, borderRadius: 20, padding: "5rem 2rem", textAlign: "center", border: `1px solid ${border}`, animation: "fadeUp 0.5s ease both" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>📦</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 800, color: txt, marginBottom: 8 }}>No orders yet</h3>
                  <p style={{ color: sub, fontSize: "0.88rem", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>Start your sacred journey and your orders will appear here.</p>
                  <button onClick={() => onNav("products")} style={{ padding: "13px 32px", fontSize: "0.88rem", borderRadius: 12, background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, boxShadow: `0 4px 20px rgba(232,114,12,0.3)` }}>Explore Products</button>
                </div>
              ) : allOrders.map((o, i) => {
                const orderImages = o.items ? o.items.slice(0, 3).map(item => {
                  const product = PRODUCTS.find(p => p.id === item.productId || p.name === item.name);
                  return product ? product.image : item.image;
                }).filter(Boolean) : [];
                const status = o.status || o.orderStatus || "Confirmed";
                const statusConfig = {
                  "Delivered": { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "Delivered" },
                  "Shipped": { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6", label: "Shipped" },
                  "Cancelled": { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444", label: "Cancelled" },
                  "Processing": { bg: "#faf5ff", color: "#7c3aed", dot: "#8b5cf6", label: "Processing" },
                }[status] || { bg: "#fff7ed", color: "#c2410c", dot: P, label: status };

                return (
                  <div key={i} className="dash-order-card" style={{ background: card, borderRadius: 18, marginBottom: "1rem", border: `1px solid ${border}`, animation: `slideUp 0.35s ease ${i * 0.07}s both`, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", transition: "all 0.25s", overflow: "hidden" }}>
                    {/* Top accent bar */}
                    <div style={{ height: 3, background: `linear-gradient(90deg,${P},${T.orangeL},transparent)` }} />

                    <div style={{ padding: "1.4rem 1.6rem", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      {/* Product images stack */}
                      <div style={{ display: "flex", flexShrink: 0 }}>
                        {orderImages.length > 0 ? orderImages.map((img, idx) => (
                          <div key={idx} style={{ width: 54, height: 54, borderRadius: 12, overflow: "hidden", border: `2.5px solid #fff`, background: "#f9fafb", marginLeft: idx > 0 ? -14 : 0, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: orderImages.length - idx }}>
                            <img referrerPolicy="no-referrer" src={img} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )) : (
                          <div style={{ width: 54, height: 54, borderRadius: 12, background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛍</div>
                        )}
                      </div>

                      {/* Order info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, color: txt, fontSize: "0.95rem" }}>#{o._id ? o._id.slice(-6).toUpperCase() : String(i + 1).padStart(6, "0")}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: statusConfig.bg, color: statusConfig.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 700 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusConfig.dot, display: "inline-block" }} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", color: sub, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ opacity: 0.6 }}>📅</span>
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: P, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ opacity: 0.7 }}>₹</span>
                            {o.totalAmount ? o.totalAmount.toLocaleString() : "—"}
                          </span>
                          {o.items && <span style={{ fontSize: "0.75rem", color: sub }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => setTrackModal(o)} style={{ padding: "8px 14px", background: PL, color: P, border: `1px solid rgba(232,114,12,0.25)`, borderRadius: 9, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = PL; e.currentTarget.style.color = P; }}>
                          Track
                        </button>
                        <button onClick={() => setSelectedOrder(o)} style={{ padding: "8px 16px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 9, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 3px 12px rgba(232,114,12,0.3)`, transition: "all 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TRACK ORDERS ── */}
          {activeTab === "track" && (
            <div key="track" style={{ animation: "dashPageIn 0.32s cubic-bezier(0.34,1.2,0.64,1) both" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: txt, margin: 0 }}>Track Orders</h1>
                <p style={{ color: sub, fontSize: "0.9rem", marginTop: 5 }}>Click on any order to view live tracking</p>
              </div>
              {allOrders.length === 0 ? (
                <div style={{ background: card, borderRadius: 18, padding: "4rem 2.5rem", textAlign: "center", border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 64, marginBottom: 18 }}>🚚</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: txt, marginBottom: 8 }}>No Orders to Track</h3>
                  <p style={{ color: sub, fontSize: "0.88rem", marginBottom: 22 }}>Place an order first to track your delivery.</p>
                  <button onClick={() => onNav("products")} style={{ padding: "13px 30px", fontSize: "0.9rem", borderRadius: 11, background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Shop Now</button>
                </div>
              ) : allOrders.map((o, i) => (
                <div key={i} style={{ background: card, borderRadius: 16, padding: "1.2rem 1.6rem", marginBottom: "1rem", border: `1px solid ${border}`, animation: `slideUp 0.3s ease ${i * 0.07}s both`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📦</div>
                    <div>
                      <div style={{ fontWeight: 800, color: txt, fontSize: "0.95rem" }}>Order #{o._id ? o._id.slice(-6).toUpperCase() : String(i + 1).padStart(6, "0")}</div>
                      <div style={{ fontSize: "0.75rem", color: sub, marginTop: 3 }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        {o.totalAmount ? ` · ₹${o.totalAmount.toLocaleString()}` : ""}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setTrackModal(o)} style={{ padding: "10px 22px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 3px 12px rgba(232,114,12,0.3)`, transition: "all 0.2s", flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    Track Order →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div key="profile" style={{ animation: "dashPageIn 0.32s cubic-bezier(0.34,1.2,0.64,1) both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: "clamp(1.3rem,4vw,1.75rem)", fontWeight: 900, color: txt, margin: 0 }}>My Profile</h1>
                  <p style={{ color: sub, fontSize: "clamp(0.78rem,2vw,0.9rem)", marginTop: 5 }}>Manage your account information</p>
                </div>
                <button onClick={() => { setEditForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" }); setEditingProfile(true); setEditSaved(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 16px rgba(232,114,12,0.3)`, transition: "all 0.2s" }}>
                  ✏️ Edit Profile
                </button>
              </div>

              {/* Avatar + Info — stacks on mobile */}
              <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }}>

                {/* Avatar card */}
                <div style={{ background: card, borderRadius: 18, padding: "2rem 1.3rem", border: `1px solid ${border}`, textAlign: "center", boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${T.orangeD},${P})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff", fontWeight: 900, margin: "0 auto 14px", boxShadow: `0 4px 22px rgba(232,114,12,0.35)` }}>
                    {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 800, color: txt, fontSize: "1.05rem", marginBottom: 5 }}>{user.name || "Member"}</div>
                  <div style={{ color: P, fontSize: "0.78rem", fontWeight: 600, marginBottom: 9 }}>Sacred Member</div>
                  <div style={{ color: sub, fontSize: "0.75rem" }}>📅 Joined {user.joinedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                </div>

                {/* Info card */}
                <div style={{ background: card, borderRadius: 18, padding: "clamp(1.2rem,3vw,2rem)", border: `1px solid ${border}`, boxShadow: "0 2px 14px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontWeight: 700, color: txt, fontSize: "1.1rem", marginBottom: "1.3rem" }}>Personal Information</div>
                  <div className="profile-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[["👤 Full Name", user.name || "—"], ["✉️ Email Address", user.email || "—"], ["📞 Phone", user.phone || "—"], ["📅 Member Since", user.joinedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })], ["🏅 Account Type", "Sacred Member"]].map(([l, v]) => (
                      <div key={l} style={{ padding: "0.9rem 1rem", background: bg, borderRadius: 11, border: `1px solid ${border}`, minWidth: 0 }}>
                        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>{l}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: txt, wordBreak: "break-word" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {/* Account stats */}
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.3rem", borderTop: `1px solid ${border}` }}>
                    <div style={{ fontWeight: 700, color: txt, fontSize: "1rem", marginBottom: "1rem" }}>Account Statistics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.8rem" }} className="dashboard-stats">
                      {statCards.map(s => (
                        <div key={s.label} style={{ background: s.light, borderRadius: 13, padding: "0.9rem 0.6rem", textAlign: "center", border: `1px solid ${border}` }}>
                          <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                          <div style={{ fontWeight: 800, color: s.color, fontSize: "1rem" }}>{s.value}</div>
                          <div style={{ fontSize: "0.6rem", color: sub, marginTop: 3 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── WISHLIST PANEL (mobile/tab inline) ── */}
          {activeTab === "wishlist" && (
            <div key="wishlist" style={{ animation: "dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: txt, margin: 0 }}>My Wishlist</h1>
                <p style={{ color: sub, fontSize: "0.85rem", marginTop: 4 }}>Items you've saved for later</p>
              </div>
              <button onClick={() => onNav("wishlist")} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 12, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 18px rgba(232,114,12,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🤍</span> View Full Wishlist →
              </button>
            </div>
          )}

          {/* ── CART PANEL (mobile/tab inline) ── */}
          {activeTab === "cart" && (
            <div key="cart" style={{ animation: "dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: txt, margin: 0 }}>My Cart</h1>
                <p style={{ color: sub, fontSize: "0.85rem", marginTop: 4 }}>Items ready for checkout</p>
              </div>
              <button onClick={() => onNav("cart")} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 12, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 18px rgba(232,114,12,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🛒</span> View Full Cart →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {editingProfile && (
        <div onClick={() => setEditingProfile(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 20, maxWidth: 480, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.22)", animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,${T.orangeD},${P})`, padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", margin: 0 }}>Edit Profile</h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", marginTop: 3 }}>Changes will be saved permanently</p>
              </div>
              <button onClick={() => setEditingProfile(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", fontSize: 20, color: "#fff", lineHeight: 1, padding: "6px 10px", borderRadius: 8 }}>×</button>
            </div>

            <div style={{ padding: "2rem" }}>
              {editSaved ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontWeight: 800, color: txt, fontSize: "1.1rem", marginBottom: 6 }}>Profile Updated!</h3>
                  <p style={{ color: sub, fontSize: "0.82rem" }}>Your changes have been saved successfully.</p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div style={{ marginBottom: "1.1rem" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>👤 Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 10, fontSize: "0.92rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", background: bg }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: "1.1rem" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>✉️ Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Enter your email"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 10, fontSize: "0.92rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", background: bg }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: "1.6rem" }}>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>📞 Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 10, fontSize: "0.92rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Inter',sans-serif", background: bg }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    <button onClick={() => setEditingProfile(false)}
                      style={{ flex: 1, padding: "12px", background: bg, color: sub, border: `1px solid ${border}`, borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                      Cancel
                    </button>
                    <button onClick={() => {
                      if (!editForm.name.trim() && !editForm.email.trim()) return;
                      const updated = { ...user, name: editForm.name.trim() || user.name, email: editForm.email.trim() || user.email, phone: editForm.phone.trim() };
                      onUpdateUser(updated);
                      setEditSaved(true);
                      setTimeout(() => setEditingProfile(false), 1400);
                    }}
                      style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 16px rgba(232,114,12,0.3)` }}>
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER DETAILS MODAL ── */}
      {selectedOrder && (
        <div onClick={() => setSelectedOrder(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", overflowY: "auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 20, maxWidth: 700, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>

            {/* Header */}
            <div style={{ position: "sticky", top: 0, background: card, borderBottom: `1px solid ${border}`, padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: txt, margin: 0 }}>Order Details</h2>
                <p style={{ fontSize: "0.8rem", color: sub, marginTop: 3 }}>Order #{selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : "N/A"}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: sub, lineHeight: 1, padding: 4 }}>×</button>
            </div>

            <div style={{ padding: "2rem" }}>
              {/* Order Status */}
              <div style={{ background: PL, borderRadius: 14, padding: "1.2rem", marginBottom: "1.5rem", border: `1px solid rgba(232,114,12,0.15)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: sub, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Order Status</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: P }}>{selectedOrder.status || "Confirmed"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: sub, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Order Date</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: txt }}>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: txt, marginBottom: "1rem" }}>Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => {
                  const product = PRODUCTS.find(p => p.id === item.productId || p.name === item.name);
                  return (
                    <div key={idx} style={{ background: bg, borderRadius: 12, padding: "1rem", marginBottom: "0.8rem", display: "flex", gap: 14, alignItems: "center", border: `1px solid ${border}` }}>
                      <div style={{ width: 70, height: 70, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#fff" }}>
                        <img referrerPolicy="no-referrer" src={product?.image || item.image || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80"} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: txt, fontSize: "0.95rem", marginBottom: 3 }}>{item.name || product?.name || "Product"}</div>
                        <div style={{ fontSize: "0.75rem", color: sub }}>Quantity: {item.quantity || item.qty || 1}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "1.05rem", fontWeight: 800, color: P }}>₹{((item.price || product?.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}</div>
                        <div style={{ fontSize: "0.7rem", color: sub, marginTop: 2 }}>₹{(item.price || product?.price || 0).toLocaleString()} each</div>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ background: bg, borderRadius: 12, padding: "2rem", textAlign: "center", border: `1px solid ${border}` }}>
                    <p style={{ color: sub, fontSize: "0.85rem" }}>No items found in this order</p>
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              <div style={{ background: `linear-gradient(135deg,${T.orangeD},${P})`, borderRadius: 14, padding: "1.5rem", color: "#fff" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "1rem", color: "#fff" }}>Bill Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.88rem" }}>
                  <span style={{ opacity: 0.9 }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.88rem" }}>
                  <span style={{ opacity: 0.9 }}>Shipping</span>
                  <span style={{ fontWeight: 700 }}>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.88rem" }}>
                  <span style={{ opacity: 0.9 }}>Tax (GST)</span>
                  <span style={{ fontWeight: 700 }}>Included</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: "0.8rem", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>Total Amount</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div style={{ marginTop: "1.5rem", background: bg, borderRadius: 14, padding: "1.3rem", border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: txt, marginBottom: "0.9rem" }}>Shipping Address</h3>
                  <div style={{ fontSize: "0.88rem", color: txt, lineHeight: 1.7 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{selectedOrder.shippingAddress.name || user.name || "Customer"}</div>
                    <div>{selectedOrder.shippingAddress.address || "—"}</div>
                    <div>{selectedOrder.shippingAddress.city || "—"}, {selectedOrder.shippingAddress.state || "—"} {selectedOrder.shippingAddress.pincode || ""}</div>
                    <div style={{ marginTop: 6, color: sub }}>📞 {selectedOrder.shippingAddress.phone || "—"}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                <button onClick={() => { setSelectedOrder(null); setTrackModal(allOrders[0] || "empty"); }} style={{ flex: 1, padding: "12px", background: PL, color: P, border: `1px solid rgba(232,114,12,0.2)`, borderRadius: 10, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Track Order</button>
                <button onClick={() => setSelectedOrder(null)} style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="dash-mobile-bottomnav" style={{ justifyContent: "space-around", alignItems: "center" }}>
        {[
          { key: "orders", icon: "🛍", label: "Orders" },
          { key: "track", icon: "📦", label: "Track" },
          { key: "profile", icon: "👤", label: "Profile" },
          { key: "wishlist", icon: "🤍", label: "Wishlist" },
          { key: "cart", icon: "🛒", label: "Cart" },
        ].map(t => (
          <button key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: "'Inter',sans-serif" }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: activeTab === t.key ? P : "#9ca3af", letterSpacing: "0.04em" }}>{t.label}</span>
            {activeTab === t.key && <span style={{ width: 18, height: 2, borderRadius: 2, background: P, display: "block" }} />}
          </button>
        ))}
      </nav>

      {/* ── TRACK ORDER MODAL ── */}
      {trackModal && (
        <div onClick={() => setTrackModal(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 24, maxWidth: 440, width: "100%", boxShadow: "0 32px 100px rgba(0,0,0,0.3)", animation: "trackModalIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both", overflow: "hidden" }}>
            <style>{`
              @keyframes trackModalIn{
                from{opacity:0;transform:translateY(40px) scale(0.93);}
                to{opacity:1;transform:translateY(0) scale(1);}
              }
              @keyframes fadeSlideUp{
                from{opacity:0;transform:translateY(18px);}
                to{opacity:1;transform:translateY(0);}
              }
              @keyframes pulseRing{
                0%{box-shadow:0 0 0 0 rgba(232,114,12,0.5);}
                70%{box-shadow:0 0 0 14px rgba(232,114,12,0);}
                100%{box-shadow:0 0 0 0 rgba(232,114,12,0);}
              }
            `}</style>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,${T.orangeD},${P},${T.orangeL})`, padding: "1.8rem 2rem 1.4rem", position: "relative", textAlign: "center" }}>
              <button onClick={() => setTrackModal(null)} style={{ position: "absolute", top: 14, right: 16, background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer", fontSize: 17, color: "#fff", lineHeight: 1, padding: "6px 10px", borderRadius: 8, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}>✕</button>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 12px", animation: "pulseRing 2s ease-out infinite" }}>📦</div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>Order Tracking</h2>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.82)", marginTop: 5 }}>Live delivery status</p>
            </div>

            <div style={{ padding: "1.6rem 1.8rem" }}>
              {trackModal === "empty" || allOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "0.8rem 0 1.2rem", animation: "fadeSlideUp 0.4s ease 0.1s both" }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🛒</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 800, color: txt, marginBottom: 8 }}>No Orders to Track</h3>
                  <p style={{ color: sub, fontSize: "0.83rem", lineHeight: 1.65, marginBottom: "1.4rem" }}>You haven't placed any orders yet. Start your sacred journey and your tracking details will appear here.</p>
                  <button onClick={() => { setTrackModal(null); onNav("products"); }} style={{ padding: "12px 28px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 11, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 18px rgba(232,114,12,0.3)` }}>
                    Shop Now →
                  </button>
                </div>
              ) : (
                <>
                  {/* Order ID row */}
                  <div style={{ background: PL, borderRadius: 12, padding: "0.9rem 1.1rem", marginBottom: "1.2rem", border: `1px solid rgba(232,114,12,0.15)`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeSlideUp 0.38s ease 0.08s both" }}>
                    <div>
                      <div style={{ fontSize: "0.62rem", color: sub, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Order ID</div>
                      <div style={{ fontWeight: 800, color: txt, fontSize: "0.98rem" }}>#{(typeof trackModal === "object" && trackModal._id) ? trackModal._id.slice(-6).toUpperCase() : "—"}</div>
                    </div>
                    <span style={{ background: "#ecfdf5", color: "#059669", padding: "4px 12px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, border: "1px solid rgba(16,185,129,0.2)" }}>✓ Confirmed</span>
                  </div>

                  {/* Delivery message */}
                  <div style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)", borderRadius: 14, padding: "1.1rem 1.3rem", marginBottom: "1.1rem", border: "1px solid rgba(16,185,129,0.18)", animation: "fadeSlideUp 0.38s ease 0.18s both" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <span style={{ fontSize: 26, flexShrink: 0 }}>🎉</span>
                      <div>
                        <div style={{ fontWeight: 800, color: "#065f46", fontSize: "0.92rem", marginBottom: 4 }}>Your item is on its way!</div>
                        <div style={{ fontSize: "0.8rem", color: "#047857", lineHeight: 1.65 }}>
                          Expected delivery within <strong>4 to 5 working days</strong> from order placement. Our team is carefully packaging your sacred items.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support row */}
                  <div style={{ background: PL, borderRadius: 10, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8, border: `1px solid rgba(232,114,12,0.13)`, marginBottom: "1.3rem", animation: "fadeSlideUp 0.38s ease 0.26s both" }}>
                    <span style={{ fontSize: 15 }}>📞</span>
                    <span style={{ fontSize: "0.76rem", color: sub }}>Need help? <strong style={{ color: P }}>support@wishstone.in</strong></span>
                  </div>

                  <button onClick={() => setTrackModal(null)} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg,${T.orangeD},${P})`, color: "#fff", border: "none", borderRadius: 11, fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 18px rgba(232,114,12,0.28)`, transition: "transform 0.15s", animation: "fadeSlideUp 0.38s ease 0.32s both" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    Got it, Thanks! 👍
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── ORDER CONFIRM MODAL ──────────────────────────────────────
function OrderConfirmModal({ order, onClose }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: 24, maxWidth: 420, width: "100%", padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", animation: "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        {/* Animated checkmark */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#2d7a5a,#10b981)", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(16,185,129,0.35)", animation: step >= 1 ? "fadeInScale 0.5s ease both" : "none", opacity: step >= 1 ? 1 : 0 }}>
          <span style={{ fontSize: 36, color: "#fff" }}>✓</span>
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#1a1a1a", marginBottom: "0.5rem", opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? "translateY(0)" : "translateY(10px)", transition: "all 0.4s ease" }}>
          Order Confirmed! 🎉
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem", opacity: step >= 2 ? 1 : 0, transition: "all 0.4s ease 0.1s" }}>
          Your sacred order has been placed successfully
        </p>

        {/* Order details */}
        <div style={{ background: "#f8fafc", borderRadius: 14, padding: "1.2rem", marginBottom: "1.5rem", opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? "translateY(0)" : "translateY(12px)", transition: "all 0.4s ease 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Order ID</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1a1a1a" }}>#{order._id.slice(-6).toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Amount Paid</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: T.orange }}>Rs.{(order.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Delivery</span>
            <span style={{ background: "rgba(16,185,129,0.1)", color: "#2d7a5a", padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700 }}>4–5 Business Days</span>
          </div>
        </div>

        {/* Delivery steps */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.8rem", opacity: step >= 3 ? 1 : 0, transition: "all 0.4s ease 0.3s" }}>
          {[["📦", "Packed"], ["🚚", "Shipped"], ["🏠", "Delivered"]].map(([icon, label], i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: "0.62rem", color: "#64748b", fontWeight: 600 }}>{label}</div>
              {i < 2 && <div style={{ position: "absolute" }} />}
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg,${T.orangeD},${T.orange})`, color: "#fff", border: "none", borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", opacity: step >= 3 ? 1 : 0, transition: "opacity 0.4s ease 0.4s" }}>
          Track My Order →
        </button>
      </div>
    </div>
  );
}

// ─── PROMO MODAL ──────────────────────────────────────────────
function PromoModal({ show, onClose, onShop, userEmail }) {
  const [email, setEmail] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");
  const COUPON = "WOW300";

  const handleClaim = () => {
    if (!email.trim()) { setEmailError("Please enter your email."); return; }
    if (userEmail && email.trim().toLowerCase() !== userEmail.toLowerCase()) {
      setEmailError("Invalid email. Please use your registered email address.");
      return;
    }
    setEmailError("");
    // Mark as permanently claimed — for logged-in users use email key, for guests use device key
    const claimKey = userEmail
      ? `ws_coupon_claimed_${userEmail}`
      : `ws_coupon_claimed_guest`;
    localStorage.setItem(claimKey, "1");
    setClaimed(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 420, width: "100%", padding: "2.5rem 2rem 2rem", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", position: "relative", animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both", textAlign: "center" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#999", lineHeight: 1 }}>✕</button>

        {/* Logo */}
        <div style={{ marginBottom: "1.4rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 36, width: "auto", display: "block" }} />
          </div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: T.textMid, marginTop: 2 }}>SACRED STORE</div>
        </div>

        {!claimed ? (
          <>
            <p style={{ fontSize: "1rem", color: T.text, lineHeight: 1.6, marginBottom: "1.6rem", fontFamily: "'Playfair Display',serif" }}>
              Start your sacred journey with us and<br />get <strong style={{ color: T.orange }}>₹300 off</strong> your first order.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(""); }}
              placeholder="Email address"
              style={{ width: "100%", padding: "13px 16px", border: `1.5px solid ${emailError ? "#c0392b" : "#e5e5e5"}`, borderRadius: 10, fontSize: "0.9rem", color: T.text, outline: "none", boxSizing: "border-box", marginBottom: "0.4rem", fontFamily: "'Inter',sans-serif" }}
              onFocus={e => e.target.style.borderColor = emailError ? "#c0392b" : T.orange}
              onBlur={e => e.target.style.borderColor = emailError ? "#c0392b" : "#e5e5e5"}
              onKeyDown={e => e.key === "Enter" && handleClaim()}
            />
            {emailError && <p style={{ fontSize: "0.72rem", color: "#c0392b", marginBottom: "0.7rem", textAlign: "left" }}>{emailError}</p>}
            {!emailError && <div style={{ marginBottom: "0.5rem" }} />}
            <button onClick={handleClaim} style={{ width: "100%", padding: "14px", background: T.text, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", letterSpacing: "0.04em", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.orange}
              onMouseLeave={e => e.currentTarget.style.background = T.text}>
              Claim Discount
            </button>
            <button onClick={onClose} style={{ marginTop: "0.8rem", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#aaa", fontFamily: "'Inter',sans-serif" }}>
              No thanks, I'll pay full price
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: "0.6rem" }}>🎉</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", color: T.text, marginBottom: "0.4rem", fontWeight: 700 }}>Your coupon is ready!</p>
            <p style={{ fontSize: "0.8rem", color: T.textMid, marginBottom: "1.4rem" }}>Copy the code below and use it at checkout</p>
            <div onClick={handleCopy} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fdf6ee", border: `2px dashed ${T.orange}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", marginBottom: "1.2rem", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fdecd6"}
              onMouseLeave={e => e.currentTarget.style.background = "#fdf6ee"}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 900, color: T.orange, letterSpacing: "0.1em" }}>{COUPON}</span>
              <span style={{ background: copied ? "#2d7a5a" : T.orange, color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: "0.72rem", fontWeight: 700, transition: "background 0.2s" }}>
                {copied ? "✓ Copied!" : "COPY"}
              </span>
            </div>
            <button className="btn-orange" onClick={() => { onClose(); onShop(); }} style={{ width: "100%", padding: "13px", fontSize: "0.85rem", borderRadius: 10 }}>
              Shop Now & Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
// ─── PRODUCT PAGE WRAPPER (reads :id from URL, fetches from backend) ──
function ProductPageWrapper({ onAdd, onAddAnim, onWish, wished, cart, onShop }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { navigate("/shop", { replace: true }); return; }

    // Try backend first
    fetch(`${API_BASE}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.product) {
          const p = data.product;
          // Normalize to match what ProductPage expects
          setProduct({
            ...p,
            id: p._id,
            image: p.images?.[0] || "",
            images: p.images || [],
            category: p.category?.slug || p.category || "",
            categoryName: p.category?.name || "",
            discount: p.discount || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0),
            isBestSeller: p.isBestSeller || false,
            bestSeller: p.isBestSeller || false,
          });
        } else {
          // Fallback: try hardcoded PRODUCTS by numeric id
          const fallback = PRODUCTS.find(p => p.id === parseInt(id) || String(p.id) === id);
          if (fallback) setProduct(fallback);
          else navigate("/shop", { replace: true });
        }
        setLoading(false);
      })
      .catch(() => {
        // Network error — try hardcoded fallback
        const fallback = PRODUCTS.find(p => p.id === parseInt(id) || String(p.id) === id);
        if (fallback) setProduct(fallback);
        else navigate("/shop", { replace: true });
        setLoading(false);
      });
  }, [id, API_BASE, navigate]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 90 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(232,114,12,0.2)", borderTop: "3px solid #E8720C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#8a8a8a", fontSize: "0.88rem" }}>Loading product…</p>
      </div>
    </div>
  );

  if (!product) return <Navigate to="/shop" replace />;
  return <ProductPage product={product} onAdd={onAdd} onAddAnim={onAddAnim} onWish={onWish} wished={wished} cart={cart} onShop={onShop} />;
}

// ─── FLY PARTICLE — heart flies from product to wishlist icon ──
function FlyParticle({ startX, startY, endX, endY, onLand }) {
  const dx = endX - startX;
  const dy = endY - startY;

  useEffect(() => {
    // Trigger icon pop + burst when particle lands
    const t = setTimeout(() => {
      const btn = document.getElementById("wishlist-nav-btn");
      if (btn) { btn.style.animation = "wishIconPop 0.45s cubic-bezier(0.36,0.07,0.19,0.97)"; setTimeout(() => { btn.style.animation = ""; }, 450); }
      if (onLand) onLand();
    }, 820);
    return () => clearTimeout(t);
  }, []);

  // Trail particles — 3 smaller hearts behind main
  const trails = [
    { delay: "0.08s", scale: 0.65, color: "#ff6b6b" },
    { delay: "0.16s", scale: 0.45, color: "#ffa0a0" },
    { delay: "0.24s", scale: 0.28, color: "#ffc0c0" },
  ];

  // Burst particles — 6 sparks on landing
  const bursts = [
    { bx: -28, by: -22, br: "-30deg", emoji: "✨" },
    { bx: 28, by: -22, br: "30deg", emoji: "💫" },
    { bx: -32, by: 8, br: "-50deg", emoji: "⭐" },
    { bx: 32, by: 8, br: "50deg", emoji: "✨" },
    { bx: -8, by: -34, br: "-10deg", emoji: "💫" },
    { bx: 8, by: -34, br: "10deg", emoji: "⭐" },
  ];

  return (
    <>
      {/* Trail hearts */}
      {trails.map((tr, i) => (
        <div key={i} style={{
          position: "fixed", left: startX, top: startY,
          width: 18, height: 18, fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 99998, pointerEvents: "none",
          animation: `flyTrail 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${tr.delay} forwards`,
          "--dx": `${dx}px`, "--dy": `${dy}px`,
          filter: `drop-shadow(0 2px 6px ${tr.color})`,
        }}>❤️</div>
      ))}

      {/* Main flying heart */}
      <div style={{
        position: "fixed", left: startX - 14, top: startY - 14,
        width: 28, height: 28, fontSize: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 99999, pointerEvents: "none",
        animation: "flyHeart 0.85s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        "--dx": `${dx}px`, "--dy": `${dy}px`,
        filter: "drop-shadow(0 4px 12px rgba(229,62,62,0.8))",
      }}>❤️</div>

      {/* Burst sparks — appear at destination */}
      {bursts.map((b, i) => (
        <div key={i} style={{
          position: "fixed", left: endX, top: endY,
          fontSize: 11, zIndex: 99999, pointerEvents: "none",
          animation: `burstPop 0.55s ease-out 0.78s forwards`,
          "--bx": `${b.bx}px`, "--by": `${b.by}px`, "--br": b.br,
          opacity: 0,
        }}>{b.emoji}</div>
      ))}
    </>
  );
}

// ─── SCROLL TO TOP ON ROUTE CHANGE ────────────────────────────
// v2.1 - routing fix
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ─── APP INNER (needs to be inside BrowserRouter) ─────────────
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [wished, setWished] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderConfirm, setOrderConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load user-specific data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ws_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        // Load this user's orders using their email as key
        const userKey = `ws_orders_${u.email || "guest"}`;
        const savedOrders = localStorage.getItem(userKey);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      } catch (e) { localStorage.removeItem("ws_user"); }
    }
  }, []);

  // Periodically verify user still exists in backend — auto-logout if deleted by admin
  useEffect(() => {
    const checkUserExists = async () => {
      const token = localStorage.getItem("ws_token");
      if (!token || token.startsWith("local_") || token.startsWith("google_")) return;
      try {
        const API = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) {
          // User deleted or token invalid — force logout
          setUser(null); setOrders([]); setCart([]); setWished([]);
          localStorage.removeItem("ws_token"); localStorage.removeItem("ws_user");
          navigate("/login");
        }
      } catch (e) { /* network error — ignore, don't logout */ }
    };
    if (user) {
      checkUserExists();
      const interval = setInterval(checkUserExists, 30000); // check every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Save orders under user-specific key
  useEffect(() => {
    if (user) {
      const userKey = `ws_orders_${user.email || "guest"}`;
      localStorage.setItem(userKey, JSON.stringify(orders));
    }
  }, [orders, user]);

  useEffect(() => {
    // Use a stable key — for logged-in users use email, for guests use a device key
    const claimKey = user?.email
      ? `ws_coupon_claimed_${user.email}`
      : `ws_coupon_claimed_guest`;

    // Never show if already claimed
    if (localStorage.getItem(claimKey)) return;

    // Show 5 sec after every page load/refresh until claimed
    const t = setTimeout(() => setShowModal(true), 5000);
    return () => clearTimeout(t);
  }, [user?.email]);

  const addToCart = p => {
    const MAX_TOTAL = 10; // Max 10 items total across all products
    if (p.qty === -1) {
      setCart(c => c.map(i => i.id === p.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
    } else {
      setCart(c => {
        const totalQty = c.reduce((sum, item) => sum + item.qty, 0);
        if (totalQty >= MAX_TOTAL) {
          alert("Cart limit reached! You can only add up to 10 items total.");
          return c; // Don't add if cart is full
        }
        const ex = c.find(i => i.id === p.id);
        if (ex) {
          if (totalQty >= MAX_TOTAL) return c;
          return c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...c, { ...p, qty: 1 }];
      });
    }
  };
  const toggleWish = id => setWished(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  // Flying heart animation from click position to wishlist icon
  const [flyParticles, setFlyParticles] = useState([]);
  const flyToWishlist = (e, id) => {
    // Only animate when adding (not removing)
    if (wished.includes(id)) { toggleWish(id); return; }
    toggleWish(id);
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    // Find wishlist icon position (top-right area)
    const wishBtn = document.getElementById("wishlist-nav-btn");
    const endX = wishBtn ? wishBtn.getBoundingClientRect().left + 11 : window.innerWidth - 80;
    const endY = wishBtn ? wishBtn.getBoundingClientRect().top + 11 : 32;
    const pid = Date.now();
    setFlyParticles(p => [...p, { id: pid, startX, startY, endX, endY }]);
    setTimeout(() => setFlyParticles(p => p.filter(x => x.id !== pid)), 1500);
  };

  // Flying bucket animation from click position to cart icon
  const [flyCartParticles, setFlyCartParticles] = useState([]);
  const flyToCart = (e, product) => {
    addToCart(product);
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const cartBtn = document.getElementById("cart-nav-btn") || document.getElementById("cart-nav-desktop");
    const endX = cartBtn ? cartBtn.getBoundingClientRect().left + 11 : window.innerWidth - 120;
    const endY = cartBtn ? cartBtn.getBoundingClientRect().top + 11 : 32;
    const pid = Date.now() + Math.random();
    setFlyCartParticles(p => [...p, { id: pid, startX, startY, endX, endY }]);
    setTimeout(() => setFlyCartParticles(p => p.filter(x => x.id !== pid)), 1200);
  }; const updateQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  const removeFromCart = id => setCart(c => c.filter(i => i.id !== id));
  const handlePlaceOrder = async data => {
    const newOrder = { ...data, _id: Date.now().toString(), status: "Confirmed", createdAt: new Date().toISOString() };
    // Save locally first (instant feedback)
    setOrders(o => {
      const updated = [newOrder, ...o];
      if (user) localStorage.setItem(`ws_orders_${user.email || "guest"}`, JSON.stringify(updated));
      return updated;
    });
    setCart([]);
    setOrderConfirm(newOrder);

    // Also send to backend so admin panel can see it
    try {
      const API = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
      const addr = data.address || {};
      const payload = {
        customer: {
          name: addr.name || user?.name || "Guest",
          email: addr.email || user?.email || "guest@wishstone.com",
          phone: addr.phone || user?.phone || "0000000000",
        },
        shippingAddress: {
          flat: addr.address || addr.flat || "",
          area: addr.city || addr.area || "",
          landmark: addr.landmark || "",
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.pincode || "",
          country: "India",
        },
        items: (data.items || []).map(i => ({
          productId: String(i.id || i.productId || ""),
          name: i.name || "Product",
          price: i.price || 0,
          quantity: i.qty || i.quantity || 1,
          image: i.image || "",
        })),
        paymentMethod: "cod",
        couponCode: data.coupon || "",
      };
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 8000);
      await fetch(`${API}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (e) {
      // Silent fail — local order already saved
    }
  };

  const handleLogin = (u) => {
    const ud = { ...u, joinedAt: u.joinedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
    setUser(ud);
    localStorage.setItem("ws_user", JSON.stringify(ud));
    if (!localStorage.getItem("ws_token")) localStorage.setItem("ws_token", "local_" + Date.now());
    // Load this user's orders
    const userKey = `ws_orders_${ud.email || "guest"}`;
    const savedOrders = localStorage.getItem(userKey);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    // Clear cart and wishlist for fresh session
    setCart([]);
    setWished([]);
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setCart([]);
    setWished([]);
    localStorage.removeItem("ws_token");
    localStorage.removeItem("ws_user");
    navigate("/");
  };

  // nav("key") called from child components → maps to URL
  const nav = pageKey => {
    const MAP = {
      home: "/", products: "/shop", rituals: "/rituals", benefits: "/benefits",
      stories: "/stories", cart: "/cart", checkout: "/checkout",
      wishlist: "/wishlist", auth: "/login", dashboard: "/dashboard",
      terms: "/terms-and-conditions", refund: "/refund-policy",
    };
    navigate(MAP[pageKey] || "/");
  };

  // derive active page key from URL so Header highlights correctly
  const currentPage = (() => {
    const p = location.pathname;
    if (p === "/") return "home";
    if (p.startsWith("/shop") || p.startsWith("/product")) return "products";
    if (p.startsWith("/rituals")) return "rituals";
    if (p.startsWith("/benefits")) return "benefits";
    if (p.startsWith("/stories")) return "stories";
    if (p.startsWith("/cart")) return "cart";
    if (p.startsWith("/wishlist")) return "wishlist";
    if (p.startsWith("/login") || p.startsWith("/signup")) return "auth";
    if (p.startsWith("/dashboard")) return "dashboard";
    return "home";
  })();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const goToProduct = p => navigate("/product/" + (p._id || p.id));

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: T.bg, minHeight: "100vh", overflowX: "hidden" }}>
      <ScrollToTop />
      <style>{GLOBAL_CSS}</style>
      <Header cartCount={cartCount} wishCount={wished.length} onNav={nav} currentPage={currentPage} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage onShop={() => nav("products")} onRitual={() => nav("rituals")} onNav={nav} />} />
        <Route path="/intention-anchoring" element={<IntentionAnchoringPage />} />
        <Route path="/shop" element={<ProductsPage onAdd={addToCart} onAddAnim={(e, p) => addToCart(p)} onWish={flyToWishlist} wished={wished} onClick={goToProduct} cart={cart} />} />
        <Route path="/product/:id" element={<ProductPageWrapper onAdd={addToCart} onAddAnim={(e, p) => addToCart(p)} onWish={flyToWishlist} wished={wished} cart={cart} onShop={() => nav("products")} />} />
        <Route path="/rituals" element={<RitualsPage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/cart" element={<CartPage cart={cart} onQty={updateQty} onRemove={removeFromCart} onCheckout={() => nav("checkout")} onProductClick={p => navigate("/product/" + p.id)} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} />} />
        <Route path="/wishlist" element={<WishlistPage ids={wished} onAdd={addToCart} onWish={toggleWish} onClick={goToProduct} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onSwitch={() => navigate("/signup")} />} />
        <Route path="/signup" element={<SignupPage onSignup={handleLogin} onSwitch={() => navigate("/login")} />} />
        <Route path="/dashboard" element={user ? <UserDashboard user={user} orders={orders} onLogout={handleLogout} onNav={nav} onUpdateUser={u => { setUser(u); localStorage.setItem("ws_user", JSON.stringify(u)); }} /> : <Navigate to="/login" replace />} />
        <Route path="/shipping-policy" element={<ModernPolicyPage title="Shipping & Cancellation Policy" lastUpdated="June 2025" sections={SHIPPING_CANCELLATION_POLICY} />} />
        <Route path="/return-policy" element={<ModernPolicyPage title="Refund & Exchange Policy" lastUpdated="June 2025" sections={REFUND_EXCHANGE_POLICY} />} />
        <Route path="/refund-policy" element={<ModernPolicyPage title="Refund, Exchange & Cancellation Policy" lastUpdated="June 2025" sections={REFUND_EXCHANGE_CANCELLATION_POLICY} />} />
        <Route path="/terms-and-conditions" element={<ModernPolicyPage title="Terms & Conditions" lastUpdated="June 2025" sections={TERMS_AND_CONDITIONS} />} />
        <Route path="/privacy-policy" element={<ModernPolicyPage title="Privacy Policy" lastUpdated="June 2025" sections={PRIVACY_POLICY} />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && <Footer />}
      {/* ── Promo Modal ── */}
      <PromoModal show={showModal} onClose={() => setShowModal(false)} onShop={() => { setShowModal(false); nav("products"); }} userEmail={user?.email} />
      {/* ── Order Confirm Modal ── */}
      {orderConfirm && <OrderConfirmModal order={orderConfirm} onClose={() => { setOrderConfirm(null); nav("dashboard"); }} />}

      {/* ── Flying Wishlist Particles ── */}
      {flyParticles.map(p => (
        <FlyParticle key={p.id} startX={p.startX} startY={p.startY} endX={p.endX} endY={p.endY} />
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function WishstoneApp() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
