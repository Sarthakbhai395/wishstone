import { useState, useEffect, useRef } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const T = {
  bg: "#F5F0E8", bgDark: "#2C3320",
  text: "#1a1a1a", textMid: "#4a4a4a",
  orange: "#E8720C", orangeD: "#C45E00", orangeL: "#FF9A3C",
  white: "#ffffff", border: "rgba(26,26,26,0.12)",
};

const PRODUCTS = [
  { id:1, name:"WishStone — Rose Quartz", category:"manifestation", price:1299, originalPrice:1799, discount:28,
    image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    images:["https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80","https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80","https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80","https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80"],
    shortDesc:"Moon-charged rose quartz to amplify love, compassion, and self-worth energies in your sacred space.", suitableFor:"Beginners, healers, those seeking emotional balance", benefits:["Enhances self-love","Promotes emotional healing","Attracts positive relationships","Clears heart chakra"], bestSeller:true },
  { id:2, name:"WishStone — Amethyst", category:"manifestation", price:2199, originalPrice:2999, discount:27,
    image:"https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80",
    images:["https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80","https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80","https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80","https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80"],
    shortDesc:"Premium amethyst from Brazilian mines for deep meditation and amplifying intuition.", suitableFor:"Meditators, spiritual seekers, healers", benefits:["Deepens meditation","Protects energy field","Enhances intuition","Promotes restful sleep"], bestSeller:true },
  { id:3, name:"WishStone — Obsidian", category:"manifestation", price:899, originalPrice:1199, discount:25,
    image:"https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80",
    images:["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80","https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80","https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80","https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80"],
    shortDesc:"Volcanic obsidian known for powerful protective properties against negative energies.", suitableFor:"Empaths, sensitives, protection seekers", benefits:["Shields from negativity","Grounds energy","Reveals hidden truths","Heals emotional wounds"], bestSeller:true },
  { id:4, name:"Moonstone Ritual Kit", category:"habit-builder", price:1899, originalPrice:2499, discount:24,
    image:"https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80",
    images:["https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80","https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80","https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80","https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80"],
    shortDesc:"Complete ritual kit with journal, crystal, and guide for powerful daily moon rituals.", suitableFor:"Anyone building spiritual daily habits", benefits:["Creates daily ritual","Tracks moon cycles","Builds consistency","Deepens self-awareness"], bestSeller:false },
  { id:5, name:"Healing Lavender Bundle", category:"therapy", price:699, originalPrice:999, discount:30,
    image:"https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80",
    images:["https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80","https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80","https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80","https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80"],
    shortDesc:"Hand-harvested organic lavender for cleansing negative energy and deep relaxation.", suitableFor:"Anyone seeking calm, anxiety relief, better sleep", benefits:["Reduces stress","Purifies space","Promotes sleep","Calms the nervous system"], bestSeller:true },
  { id:6, name:"Sacred Sandalwood Incense", category:"therapy", price:499, originalPrice:699, discount:29,
    image:"https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80",
    images:["https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80","https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80","https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80","https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80"],
    shortDesc:"Premium Mysore sandalwood incense for meditation, yoga, and sacred home spaces.", suitableFor:"Meditators, yoga practitioners, home rituals", benefits:["Deepens focus","Purifies air","Elevates mood","Aids in prayer"], bestSeller:false },
];

const FAQS = [
  { q:"WishStone kaise use karein?", a:"Apne stone ko moonlight ya sage smoke se cleanse karein. Dono haathon mein pakad ke apni intention set karein. Isse apne paas rakhein ya sacred space mein place karein." },
  { q:"Results kitne time mein dikhte hain?", a:"Zyaadatar customers 7-21 din ke consistent use mein subtle energy shifts notice karte hain. Results individual, intention clarity, aur usage consistency pe depend karte hain." },
  { q:"Kya saare products 100% natural hain?", a:"Haan. Har WishStone product ethically sourced, 100% natural, aur synthetic treatments se free hai." },
  { q:"Shipping kitne time mein hoti hai?", a:"Standard delivery: 5-7 business days. Express delivery: 2-3 business days. Rs.999 se upar ke orders pe free shipping." },
  { q:"Return policy kya hai?", a:"Delivery ke 7 din ke andar hassle-free returns. Product unused aur original packaging mein hona chahiye. Refund 3-5 business days mein process hota hai." },
];

const QUOTES = [
  { text:"Imagination is everything. It is the preview of life's coming attractions.", author:"Albert Einstein" },
  { text:"Whatever the mind can conceive and believe, it can achieve.", author:"Napoleon Hill" },
  { text:"You are the creator of your own reality.", author:"Abraham Hicks" },
  { text:"Ask for what you want and be prepared to get it.", author:"Maya Angelou" },
  { text:"The universe is not outside of you. Look inside yourself.", author:"Rumi" },
  { text:"जो तुम खोज रहे हो, वह भी तुम्हें खोज रहा है।", author:"Rumi" },
];

const MARQUEE_ITEMS = [
  "शुभ संकल्प","Manifest with Intention","विश्वास करो, पाओ","You Are The Creator",
  "ब्रह्माण्ड पर भरोसा करो","Abundance Is Your Birthright","WishStone","अपनी नियति बनाओ",
  "शुभ संकल्प","Manifest with Intention","विश्वास करो, पाओ","You Are The Creator",
  "ब्रह्माण्ड पर भरोसा करो","Abundance Is Your Birthright","WishStone","अपनी नियति बनाओ",
];

const POWERS = [
  { num:"01", iconBg:"#fff0e8", icon:"🎯", title:"Intention Anchoring",
    desc:"Stone ka physical weight ek somatic anchor create karta hai — ek tangible connection apni conscious wish aur physical duniya ke beech.",
    tag:"NEUROSCIENCE-BACKED",
    image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { num:"02", iconBg:"#f0e8f8", icon:"🔮", title:"Frequency Activation",
    desc:"Specific crystal formations jo apni personal energy field ko tune karti hain — clarity, abundance, aur love attract karo.",
    tag:"CRYSTAL SCIENCE",
    image:"https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80" },
  { num:"03", iconBg:"#e8f0e8", icon:"🌿", title:"Earth Grounding",
    desc:"Natural stone compounds carry prithvi ki stabilizing frequency — calm, centered, aur aligned raho apni highest desires ke saath.",
    tag:"EARTH ENERGY",
    image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80" },
];

// ── Community Videos with Pixabay URLs ──
const COMMUNITY_VIDEOS = [
  { id:1, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",   title:"Balance",    caption:"Finding stillness in motion",   tag:"MINDFULNESS" },
  { id:2, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",  title:"Gratitude",  caption:"Everyday abundance",            tag:"GRATITUDE" },
  { id:3, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",      title:"Clarity",    caption:"Intention becomes reality",     tag:"MANIFESTATION" },
  { id:4, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title:"Surrender",  caption:"Let go, let flow",              tag:"SURRENDER" },
  { id:5, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",title:"Abundance",  caption:"Calling in what is mine",       tag:"ABUNDANCE" },
  { id:6, videoUrl:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", title:"Presence", caption:"Here. Now. Always.", tag:"PRESENCE" },
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Noto+Serif+Devanagari:wght@700;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:#F5F0E8;color:#1a1a1a;font-family:'Inter',sans-serif;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#F5F0E8;}
  ::-webkit-scrollbar-thumb{background:#E8720C;border-radius:3px;}
  @keyframes autoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .scroll-hide::-webkit-scrollbar{display:none;}
  .scroll-hide{-ms-overflow-style:none;scrollbar-width:none;}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes modalIn{from{opacity:0;transform:translateY(40px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes couponSlide{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
  @keyframes copyPop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes quoteIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes cardIn{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes shimmerBar{from{width:0%}to{width:100%}}
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
  .nav-link{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#1a1a1a;padding:4px 0;transition:color 0.2s;}
  .nav-link:hover,.nav-link.active{color:#E8720C;}
  .prod-card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid rgba(26,26,26,0.08);transition:all 0.3s;cursor:pointer;}
  .prod-card:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(26,26,26,0.12);}
  .btn-orange{background:linear-gradient(135deg,#C45E00,#E8720C);border:none;color:#fff;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;letter-spacing:0.06em;transition:all 0.3s;}
  .btn-orange:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(232,114,12,0.4);background:#fff;color:#000;}
  .btn-outline{background:transparent;border:1.5px solid #fff;color:#1a1a1a;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;letter-spacing:0.06em;transition:all 0.2s;}
  .btn-outline:hover{border-color:#E8720C;color:#E8720C;}
  .max-w{max-width:1200px;margin:0 auto;}
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
    .video-card{width:180px !important;}
  }
  @media(max-width:600px){
    .prod-grid{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
    .stats-row > div{flex:1 1 45% !important;}
    .hero-badge{transform:scale(0.78) !important;}
    .dashboard-stats{grid-template-columns:repeat(2,1fr) !important;}
    .video-card{width:160px !important;}
  }
  @media(max-width:480px){
    .stats-row > div{flex:1 1 100% !important;}
    .dashboard-stats{grid-template-columns:1fr 1fr !important;}
    .video-card{width:150px !important;}
  }
`;

// ─── HEADER ───────────────────────────────────────────────────
function Header({ cartCount, wishCount, onNav, currentPage, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [["products","Shop"],["rituals","The Ritual"],["benefits","Benefits"],["stories","Stories"]];
  const navTo = (k) => { onNav(k); setMobileOpen(false); };

  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? "rgba(245,240,232,0.97)" : "rgba(245,240,232,0.92)",
      backdropFilter:"blur(14px)",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      transition:"all 0.3s",
    }}>
      <div className="max-w" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:64, padding:"0 clamp(1rem,4vw,2.5rem)" }}>
        <button onClick={() => navTo("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:9, flexShrink:0 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💎</div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.15rem", fontWeight:900, color:T.text }}>WishStone</span>
        </button>

        <nav className="header-nav" style={{ display:"flex", gap:"2.2rem", alignItems:"center" }}>
          {links.map(([k,l]) => (
            <button key={k} className={`nav-link${currentPage===k?" active":""}`} onClick={() => navTo(k)}>{l}</button>
          ))}
          <button onClick={() => navTo("cart")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:T.text, position:"relative" }}>
            🛒 Cart
            {cartCount > 0 && <span style={{ background:T.orange, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:"0.58rem", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, position:"absolute", top:-6, right:-8 }}>{cartCount}</span>}
          </button>
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <button onClick={() => navTo("wishlist")} style={{ background:"none", border:"none", cursor:"pointer", position:"relative", fontSize:18, padding:"4px 5px" }}>
            🤍
            {wishCount > 0 && <span style={{ position:"absolute", top:0, right:0, background:T.orange, color:"#fff", borderRadius:"50%", width:15, height:15, fontSize:"0.55rem", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{wishCount}</span>}
          </button>
          <button onClick={() => navTo("cart")} className="show-mobile-flex" style={{ display:"none", background:"none", border:"none", cursor:"pointer", position:"relative", fontSize:18, padding:"4px 5px" }}>
            🛒
            {cartCount > 0 && <span style={{ position:"absolute", top:0, right:0, background:T.orange, color:"#fff", borderRadius:"50%", width:15, height:15, fontSize:"0.55rem", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{cartCount}</span>}
          </button>
          {user ? (
            <>
              <button onClick={() => navTo("dashboard")} style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, border:"none", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:"0.85rem", flexShrink:0 }}>
                {(user.name||user.email||"U")[0].toUpperCase()}
              </button>
              <button className="btn-outline header-nav" style={{ padding:"7px 14px", fontSize:"0.72rem", borderRadius:6 }} onClick={onLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-orange header-nav" onClick={() => navTo("products")} style={{ padding:"9px 18px", fontSize:"0.72rem", borderRadius:6 }}>ORDER NOW</button>
              <button className="nav-link header-nav" onClick={() => navTo("auth")} style={{ fontSize:"0.72rem" }}>LOGIN</button>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display:"none", background:"none", border:"none", cursor:"pointer", padding:"6px", flexDirection:"column", gap:5, alignItems:"center", justifyContent:"center" }} className="show-mobile-flex">
            <span style={{ display:"block", width:22, height:2, background:T.text, borderRadius:2, transition:"all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display:"block", width:22, height:2, background:T.text, borderRadius:2, transition:"all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display:"block", width:22, height:2, background:T.text, borderRadius:2, transition:"all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background:T.white, borderTop:`1px solid ${T.border}`, padding:"1rem clamp(1rem,4vw,2.5rem) 1.5rem", boxShadow:"0 8px 32px rgba(0,0,0,0.08)" }}>
          {links.map(([k,l]) => (
            <button key={k} onClick={() => navTo(k)} style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", padding:"12px 0", fontSize:"0.95rem", fontWeight:600, color: currentPage===k ? T.orange : T.text, borderBottom:`1px solid ${T.border}`, fontFamily:"'Inter',sans-serif" }}>{l}</button>
          ))}
          <div style={{ marginTop:"1rem", display:"flex", gap:"0.8rem", flexWrap:"wrap" }}>
            {user ? (
              <>
                <button className="btn-orange" onClick={() => navTo("dashboard")} style={{ padding:"10px 20px", fontSize:"0.8rem", borderRadius:7, flex:1 }}>My Account</button>
                <button className="btn-outline" onClick={() => { onLogout(); setMobileOpen(false); }} style={{ padding:"10px 20px", fontSize:"0.8rem", borderRadius:7, flex:1 }}>Sign Out</button>
              </>
            ) : (
              <>
                <button className="btn-orange" onClick={() => navTo("products")} style={{ padding:"10px 20px", fontSize:"0.8rem", borderRadius:7, flex:1 }}>Order Now</button>
                <button className="btn-outline" onClick={() => navTo("auth")} style={{ padding:"10px 20px", fontSize:"0.8rem", borderRadius:7, flex:1 }}>Login</button>
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
    <section style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", paddingTop:80, paddingBottom:40, paddingLeft:"clamp(1rem,5vw,3.5rem)", paddingRight:"clamp(1rem,5vw,3.5rem)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"18%", right:"6%", width:8, height:8, borderRadius:"50%", background:T.orange, opacity:0.5 }} />
      <div style={{ position:"absolute", bottom:"28%", right:"32%", width:6, height:6, borderRadius:"50%", background:T.orange, opacity:0.4 }} />

      <div className="max-w hero-grid" style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5rem", alignItems:"center" }}>
        {/* LEFT: Text — fully centered */}
        <div style={{ animation:"fadeUp 0.8s ease both", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(232,114,12,0.08)", border:`1px solid rgba(232,114,12,0.22)`, borderRadius:20, paddingTop:5, paddingBottom:5, paddingLeft:14, paddingRight:14, marginBottom:"1.6rem" }}>
            <span style={{ color:T.orange, fontSize:10 }}>✦</span>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase" }}>India's Sacred Manifestation Stone</span>
          </div>

          <h1 style={{ fontFamily:"'Noto Serif Devanagari','Playfair Display',serif", fontSize:"clamp(2.2rem,5.5vw,4.2rem)", fontWeight:900, lineHeight:1.1, marginBottom:"0.3rem", color:T.text }}>अपनी इच्छाएँ,</h1>
          <h1 style={{ fontFamily:"'Noto Serif Devanagari','Playfair Display',serif", fontSize:"clamp(2.2rem,5.5vw,4.2rem)", fontWeight:900, lineHeight:1.1, marginBottom:"1rem", color:T.orange, fontStyle:"italic" }}>अपनी नियति।</h1>

          <p style={{ fontSize:"clamp(0.7rem,1.2vw,0.88rem)", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.text, marginBottom:"1.2rem", borderBottom:`2px solid ${T.text}`, paddingBottom:"0.8rem", display:"inline-block" }}>Manifest with WishStone</p>

          <blockquote style={{ fontSize:"clamp(0.8rem,1.4vw,0.88rem)", color:T.textMid, lineHeight:1.7, marginBottom:"2rem", borderLeft:`3px solid ${T.orange}`, paddingLeft:"1rem", fontStyle:"italic", maxWidth:420, textAlign:"left" }}>
            "जो तुम खोज रहे हो, वह भी तुम्हें खोज रहा है — WishStone उस रास्ते को छोटा करता है।"
          </blockquote>

          <div style={{ display:"flex", gap:"0.8rem", flexWrap:"wrap", justifyContent:"center" }}>
            <button className="btn-orange" onClick={onShop} style={{ paddingTop:13, paddingBottom:13, paddingLeft:26, paddingRight:26, fontSize:"0.82rem", borderRadius:8 }}>अभी शुरू करें</button>
            <button className="btn-outline" onClick={onRitual} style={{ paddingTop:13, paddingBottom:13, paddingLeft:26, paddingRight:26, fontSize:"0.82rem", borderRadius:8 }}>The Ritual</button>
          </div>
        </div>

        {/* RIGHT: 3D Interactive Stone */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", minHeight:"clamp(320px,45vw,520px)", perspective:"900px" }}
          onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", fontSize:"0.62rem", color:T.textMid, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, opacity:0.6, whiteSpace:"nowrap", zIndex:10 }}>↔ Drag to rotate</div>
          <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            style={{ position:"relative", zIndex:2, transformStyle:"preserve-3d", transform: autoAnim ? undefined : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, animation: autoAnim ? "stone3d 8s ease-in-out infinite" : "none", cursor: dragging ? "grabbing" : "grab", transition: dragging ? "none" : "transform 0.4s ease", userSelect:"none" }}>
            <div style={{ width:"clamp(190px,24vw,300px)", height:"clamp(230px,30vw,360px)", borderRadius:"50% 50% 48% 52% / 55% 55% 45% 45%", background:"radial-gradient(ellipse at 32% 28%, #f5b070 0%, #d06818 40%, #c85a10 65%, #7a3008 100%)", boxShadow:"0 40px 100px rgba(200,90,16,0.5), 0 0 0 1px rgba(200,90,16,0.1), inset 0 -25px 50px rgba(0,0,0,0.25), inset 0 12px 35px rgba(255,210,130,0.35)", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:"18%", left:"22%", width:"35%", height:"28%", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,230,180,0.75) 0%, transparent 70%)", filter:"blur(6px)" }} />
              <div style={{ position:"absolute", top:"10%", left:"15%", width:"20%", height:"14%", borderRadius:"50%", background:"rgba(255,245,220,0.45)", filter:"blur(4px)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"35%", background:"linear-gradient(to top, rgba(0,0,0,0.3), transparent)", borderRadius:"0 0 50% 50%" }} />
            </div>
            <div style={{ position:"absolute", bottom:-18, left:"50%", transform:"translateX(-50%)", width:"70%", height:20, borderRadius:"50%", background:"rgba(200,90,16,0.22)", filter:"blur(10px)" }} />
          </div>
          <div className="hero-badge" style={{ position:"absolute", top:"14%", left:"0%", background:T.white, borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", gap:10, minWidth:148, zIndex:3, animation:"badgeFloat1 4s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#ff6b6b,#ee5a24)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🎯</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Set Intentions</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Daily Ritual</div></div>
          </div>
          <div className="hero-badge" style={{ position:"absolute", top:"40%", right:"-4%", background:T.white, borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", gap:10, minWidth:158, zIndex:3, animation:"badgeFloat2 4.5s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#f9ca24,#f0932b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>✨</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Energy Aligned</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Natural Stone</div></div>
          </div>
          <div className="hero-badge" style={{ position:"absolute", bottom:"12%", left:"4%", background:T.white, borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", gap:10, minWidth:148, zIndex:3, animation:"badgeFloat3 5s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#6ab04c,#2ecc71)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🌿</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Inner Peace</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Grounding</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────
function StatsBar() {
  return (
    <div style={{ background:T.bg, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"28px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"clamp(2rem,5vw,5rem)", flexWrap:"wrap" }}>
          {[["12K+","DREAMERS"],["4.9★","RATING"],["100%","NATURAL"],["21","DAY SHIFT"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(1.3rem,2.5vw,1.8rem)", fontWeight:800, color:T.text, lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:"0.62rem", fontWeight:700, color:T.textMid, letterSpacing:"0.14em", marginTop:4, fontFamily:"'Inter',sans-serif" }}>{l}</div>
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
    <div style={{ background:T.bgDark, padding:"13px 0", overflow:"hidden" }}>
      <div style={{ display:"flex", animation:"marquee 32s linear infinite", width:"max-content" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ color: t==="WishStone" ? T.orange : "rgba(255,255,255,0.65)", fontSize:"0.75rem", fontWeight:600, letterSpacing:"0.12em", fontStyle:"italic", padding:"0 1.8rem", whiteSpace:"nowrap", fontFamily:"'Playfair Display',serif" }}>
            {t}
            {i < doubled.length - 1 && <span style={{ color:T.orange, margin:"0 0.5rem" }}>•</span>}
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

  const handleClick = (i) => {
    const vid = videoRefs.current[i];
    if (!vid) return;

    if (activeVideo === i) {
      // same video — toggle play/pause
      if (vid.paused) { vid.play().catch(() => {}); setPlaying(true); }
      else { vid.pause(); setPlaying(false); }
    } else {
      // different video — pause all others, play this one with sound
      videoRefs.current.forEach((v, idx) => {
        if (v && idx !== i) { v.pause(); v.muted = true; v.currentTime = 0; }
      });
      vid.muted = false;
      vid.play().catch(() => {});
      setActiveVideo(i);
      setPlaying(true);
    }
  };

  return (
    <section style={{ background:T.bgDark, paddingTop:"80px", paddingBottom:"80px", overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%, rgba(232,114,12,0.08) 0%, transparent 60%)", pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"3rem", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:14 }}>
          <div style={{ height:1, width:50, background:"linear-gradient(to right, transparent, #E8720C)" }} />
          <span style={{ fontSize:"0.6rem", fontWeight:700, color:T.orange, letterSpacing:"0.28em", textTransform:"uppercase" }}>From Our Community</span>
          <div style={{ height:1, width:50, background:"linear-gradient(to left, transparent, #E8720C)" }} />
        </div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3rem)", fontWeight:900, color:T.white, lineHeight:1.15, letterSpacing:"-0.01em" }}>
          Poetry by the<br /><em style={{ color:T.orange, fontStyle:"italic" }}>Community</em>
        </h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.84rem", marginTop:"0.8rem", fontStyle:"italic" }}>Real moments. Real intention. Real transformation.</p>
      </div>

      {/* Video Strip */}
      <div style={{ overflowX:"auto", overflowY:"hidden", scrollSnapType:"x mandatory", WebkitOverflowScrolling:"touch", display:"flex", gap:"1.2rem", paddingLeft:"clamp(1rem,4vw,3rem)", paddingRight:"clamp(1rem,4vw,3rem)", paddingBottom:8, scrollbarWidth:"none" }}>
        {COMMUNITY_VIDEOS.map((v, i) => (
          <div
            key={v.id}
            onClick={() => handleClick(i)}
            style={{
              flex:"0 0 220px",
              aspectRatio:"9/16",
              borderRadius:20,
              overflow:"hidden",
              position:"relative",
              cursor:"pointer",
              scrollSnapAlign:"start",
              boxShadow: activeVideo === i ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.4)",
              transform: activeVideo === i ? "scale(1.03)" : "scale(1)",
              transition:"transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <video
              ref={el => videoRefs.current[i] = el}
              src={v.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
            {/* Bottom gradient + info */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)", borderRadius:"0 0 20px 20px", padding:"1.2rem 1rem 1rem", pointerEvents:"none" }}>
              <div style={{ display:"inline-block", background:"rgba(232,114,12,0.92)", color:"#fff", borderRadius:4, padding:"2px 8px", fontSize:"0.55rem", fontWeight:800, letterSpacing:"0.12em", marginBottom:"0.4rem" }}>{v.tag}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:"0.2rem", fontStyle:"italic" }}>{v.title}</div>
              <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.65)", fontStyle:"italic" }}>{v.caption}</div>
            </div>
            {/* Play/Pause button — only on active video */}
            {activeVideo === i && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", border:"2px solid rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.4)", opacity: playing ? 0 : 1, transition:"opacity 0.2s" }}>
                  <span style={{ fontSize:22, color:"#fff", marginLeft: playing ? 0 : 4 }}>{playing ? "⏸" : "▶"}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign:"center", marginTop:"3rem" }}>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.78rem", marginBottom:"1rem", letterSpacing:"0.08em" }}>Join 12,000+ conscious souls on their journey</p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:"rgba(255,255,255,0.5)", fontSize:"0.7rem" }}>
          <span style={{ color:T.orange }}>✦</span><span>#WishStoneJourney</span><span style={{ color:T.orange }}>✦</span>
        </div>
      </div>
    </section>
  );
}

// ─── POWERS SECTION ──────────────────────────────────────────
function PowersSection({ onNav }) {
  return (
    <section style={{ background:T.bg, padding:"90px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:14 }}>
            <div style={{ height:1, width:40, background:T.orange }} />
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase" }}>WishStone की शक्ति</span>
            <div style={{ height:1, width:40, background:T.orange }} />
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:900, color:T.text, lineHeight:1.2 }}>
            Three Powers to <em style={{ color:T.orange, fontStyle:"italic" }}>Amplify</em><br />Your Manifestation
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }} className="prod-grid">
          {POWERS.map(p => (
            <div key={p.num} style={{ background:"#fff", borderRadius:20, overflow:"hidden", border:`1px solid ${T.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.04)", transition:"all 0.3s", display:"flex", flexDirection:"column" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(232,114,12,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.04)"; }}>
              <div style={{ position:"relative", height:200, overflow:"hidden" }}>
                <img src={p.image} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }}
                  onMouseEnter={e => e.currentTarget.style.transform="scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                <div style={{ position:"absolute", top:12, left:12, width:40, height:40, borderRadius:10, background:p.iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>{p.icon}</div>
                <span style={{ position:"absolute", top:12, right:12, fontSize:"1.6rem", fontWeight:900, color:"rgba(255,255,255,0.2)", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{p.num}</span>
              </div>
              <div style={{ padding:"1.5rem", flex:1, display:"flex", flexDirection:"column" }}>
                <h3 style={{ fontSize:"1rem", fontWeight:700, color:T.text, marginBottom:"0.5rem" }}>{p.title}</h3>
                <p style={{ fontSize:"0.8rem", color:T.textMid, lineHeight:1.65, marginBottom:"1rem", flex:1 }}>{p.desc}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"0.6rem", fontWeight:700, color:T.textMid, letterSpacing:"0.14em", border:`1px solid ${T.border}`, borderRadius:3, padding:"3px 8px" }}>{p.tag}</span>
                  <button onClick={() => onNav("benefits")} style={{ background:"none", border:"none", cursor:"pointer", color:T.orange, fontSize:"0.75rem", fontWeight:700, display:"flex", alignItems:"center", gap:4, fontFamily:"'Inter',sans-serif", transition:"gap 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.gap="8px"}
                    onMouseLeave={e => e.currentTarget.style.gap="4px"}>
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
    const t = setInterval(() => { setIdx(i => (i+1) % QUOTES.length); setKey(k => k+1); }, 4500);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[idx];
  return (
    <section style={{ background:T.bgDark, padding:"48px clamp(1.5rem,5vw,3.5rem)", textAlign:"center", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%, rgba(232,114,12,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div className="max-w" style={{ maxWidth:760, position:"relative" }}>
        <div style={{ fontSize:"0.62rem", fontWeight:700, color:T.orange, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span>✦</span> Daily Manifestation Oracle <span>✦</span>
        </div>
        <blockquote key={key} style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.1rem,2.5vw,1.5rem)", fontWeight:700, color:T.white, lineHeight:1.5, marginBottom:"0.6rem", fontStyle:"italic", animation:"quoteIn 0.5s ease both" }}>
          "{q.text}"
        </blockquote>
        <cite style={{ fontSize:"0.72rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase", fontStyle:"normal" }}>— {q.author}</cite>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"1rem", marginTop:"1.4rem" }}>
          <button onClick={() => { setIdx(i => (i-1+QUOTES.length)%QUOTES.length); setKey(k=>k+1); }} style={{ width:28, height:28, borderRadius:"50%", border:`1px solid rgba(255,255,255,0.2)`, background:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
          <div style={{ width:180, height:2, background:"rgba(255,255,255,0.1)", borderRadius:1, position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, height:"100%", background:T.orange, borderRadius:1, width:`${((idx+1)/QUOTES.length)*100}%`, transition:"width 0.4s ease" }} />
          </div>
          <div style={{ display:"flex", gap:5 }}>
            {QUOTES.map((_,i) => (
              <button key={i} onClick={() => { setIdx(i); setKey(k=>k+1); }} style={{ width: i===idx ? 18 : 7, height:7, borderRadius:4, background: i===idx ? T.orange : "rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.3s", padding:0 }} />
            ))}
          </div>
          <button onClick={() => { setIdx(i => (i+1)%QUOTES.length); setKey(k=>k+1); }} style={{ width:28, height:28, borderRadius:"50%", border:`1px solid rgba(255,255,255,0.2)`, background:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
        </div>
      </div>
    </section>
  );
}

// ─── FOUNDER NOTE SECTION — replaces OurStories ──────────────
function FounderNoteSection() {
  return (
    <section style={{ background:"#fff", padding:"80px clamp(1.5rem,5vw,3.5rem)" }}>
      <div className="max-w">
        {/* Section label */}
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:14 }}>
            <div style={{ height:1, width:40, background:T.orange }} />
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase" }}>The Story Behind WishStone</span>
            <div style={{ height:1, width:40, background:T.orange }} />
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:900, color:T.text }}>
            A Note from Our <em style={{ color:T.orange, fontStyle:"italic" }}>Founders</em>
          </h2>
        </div>

        {/* Card: image left, content right */}
        <div
          className="founder-grid"
          style={{
            display:"grid",
            gridTemplateColumns:"1fr 1.2fr",
            gap:0,
            borderRadius:24,
            overflow:"hidden",
            border:`1px solid ${T.border}`,
            boxShadow:"0 12px 60px rgba(0,0,0,0.08)",
            background:T.bg,
            alignItems:"stretch",
          }}
        >
          {/* LEFT: Founder photo */}
          <div style={{ position:"relative", minHeight:0 }}>
            <img
              src="/vikas sir gutargoo.png"
              alt="Vikash Malik - Co-founder, WishStone"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block", position:"absolute", inset:0 }}
            />
            {/* Overlay gradient */}
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(44,51,32,0.25), rgba(232,114,12,0.08))" }} />

            {/* Founder name card at bottom */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.5) 60%, transparent 100%)",
              padding:"2rem 1.5rem 1.5rem",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", fontWeight:800, color:"#fff", flexShrink:0 }}>V</div>
                <div>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:"0.95rem", lineHeight:1.2 }}>Vikash Malik & Vinay Verma</div>
                  <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em" }}>Co-founders, WishStone</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Founder note content */}
          <div style={{ padding:"clamp(2rem,5vw,3.5rem)", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            {/* Label */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(232,114,12,0.08)",
              border:`1px solid rgba(232,114,12,0.2)`,
              borderRadius:20, padding:"5px 14px",
              marginBottom:"1.5rem", width:"fit-content",
            }}>
              <span style={{ color:T.orange, fontSize:10 }}>✦</span>
              <span style={{ fontSize:"0.62rem", fontWeight:700, color:T.orange, letterSpacing:"0.15em", textTransform:"uppercase" }}>A Note from Our Founders</span>
            </div>

            {/* Quote highlight */}
            <blockquote style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(1rem,2vw,1.2rem)",
              fontWeight:700,
              color:T.orange,
              lineHeight:1.5,
              fontStyle:"italic",
              marginBottom:"1.5rem",
              borderLeft:`3px solid ${T.orange}`,
              paddingLeft:"1.2rem",
            }}>
              "The goal didn't disappear. The daily reminder of it did."
            </blockquote>

            {/* Body paragraphs */}
            <p style={{ fontSize:"0.86rem", color:T.textMid, lineHeight:1.8, marginBottom:"1rem" }}>
              We've seen people give up on goals they never stopped wanting. We didn't start WishStone with a business plan. We started it with a simple question — <strong style={{ color:T.text }}>why do people who genuinely want to change, still stay where they are?</strong>
            </p>
            <p style={{ fontSize:"0.86rem", color:T.textMid, lineHeight:1.8, marginBottom:"1rem" }}>
              It's not laziness. It's not lack of desire. Life just gets loud. And in that noise, intention fades.
            </p>
            <p style={{ fontSize:"0.86rem", color:T.textMid, lineHeight:1.8, marginBottom:"1.5rem" }}>
              We travelled, we observed, and one thing kept showing up everywhere — people who stayed on track almost always had something <em>physical</em> to hold on to. A stone. A thread. A small object that brought them back to what mattered.
            </p>
            <p style={{ fontSize:"0.86rem", color:T.text, lineHeight:1.8, fontWeight:600, marginBottom:"2rem" }}>
              That's WishStone. Not a lucky charm. Just a daily reminder that what you want — still matters.
            </p>

            {/* Signature */}
            <div style={{ display:"flex", alignItems:"center", gap:14, paddingTop:"1.5rem", borderTop:`1px solid ${T.border}` }}>
              <div style={{ display:"flex" }}>
                {["V","V"].map((l, i) => (
                  <div key={i} style={{
                    width:40, height:40, borderRadius:"50%",
                    background:`linear-gradient(135deg,${T.orangeD},${T.orange})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, color:"#fff", fontSize:"0.85rem",
                    marginLeft: i > 0 ? -10 : 0,
                    border:"2px solid #fff",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.12)",
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight:700, color:T.text, fontSize:"0.9rem" }}>Vikash Malik & Vinay Verma</div>
                <div style={{ fontSize:"0.7rem", color:T.textMid, letterSpacing:"0.06em" }}>Co-founders, WishStone</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:T.bgDark, padding:"60px clamp(1.5rem,5vw,3.5rem) 30px", borderTop:`3px solid ${T.orange}` }}>
      <div className="max-w">
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"3rem", marginBottom:"3rem" }} className="footer-grid">
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:"1rem" }}>
              <div style={{ width:30, height:30, borderRadius:7, background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💎</div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:900, color:T.white }}>WishStone</span>
            </div>
            <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", lineHeight:1.7, maxWidth:240 }}>India's sacred manifestation stone — hand-crafted with ancient yantra to help you manifest your deepest desires.</p>
          </div>
          {[
            { title:"Shop", links:["WishStone Original","Ritual Kits","Bundles","Best Sellers","New Arrivals"] },
            { title:"Learn", links:["The Ritual","Benefits","Stories","Crystal Guide","FAQ"] },
            { title:"Support", links:["Contact Us","Shipping","Returns","Track Order","Privacy Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"1rem" }}>{col.title}</h4>
              {col.links.map(l => (
                <div key={l} style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.45)", marginBottom:8, cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={e => e.target.style.color=T.orange}
                  onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.45)"}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <p style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)" }}>© 2024 WishStone. All rights reserved.</p>
          <p style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)" }}>Made with 💎 for conscious souls across India</p>
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ onShop, onRitual, onNav }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div>
      <Hero onShop={onShop} onRitual={onRitual} />
      <StatsBar />
      <MarqueeSection />
      <CommunityVideoSection />
      {/* Auto-Scrolling Products Strip */}
      <section style={{ background:"#fff", paddingTop:"70px", paddingBottom:"70px", overflow:"hidden" }}>
        <div className="max-w" style={{ paddingLeft:"clamp(1.5rem,5vw,3.5rem)", paddingRight:"clamp(1.5rem,5vw,3.5rem)", marginBottom:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>BEST SELLERS</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:900, color:T.text, margin:0 }}>Most Loved Stones</h2>
            </div>
            <button className="btn-outline" onClick={onShop} style={{ padding:"10px 24px", fontSize:"0.78rem", borderRadius:8 }}>View All →</button>
          </div>
        </div>
        <div style={{ overflow:"hidden", position:"relative" }}>
          <div style={{ display:"flex", animation:"autoScroll 28s linear infinite", width:"max-content" }}>
            {[...PRODUCTS, ...PRODUCTS].map((p, i) => (
              <div key={i} onClick={onShop} style={{ width:220, flexShrink:0, marginRight:"1.2rem", cursor:"pointer" }}>
                <div style={{ borderRadius:14, overflow:"hidden", border:`1px solid ${T.border}`, background:T.bg, transition:"transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                  <div style={{ position:"relative", aspectRatio:"1", overflow:"hidden" }}>
                    <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", top:8, left:8, background:T.orange, color:"#fff", borderRadius:4, padding:"2px 8px", fontSize:"0.6rem", fontWeight:800 }}>-{p.discount}%</div>
                    {p.bestSeller && <div style={{ position:"absolute", bottom:6, left:6, background:T.bgDark, color:T.orange, borderRadius:4, padding:"2px 7px", fontSize:"0.58rem", fontWeight:700 }}>BEST SELLER</div>}
                  </div>
                  <div style={{ padding:"0.9rem" }}>
                    <div style={{ fontSize:"0.8rem", fontWeight:700, color:T.text, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:"0.9rem", color:T.orange, fontWeight:700 }}>Rs.{p.price.toLocaleString()}</span>
                      <span style={{ color:T.textMid, fontSize:"0.7rem", textDecoration:"line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
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
      <section style={{ background:T.bg, padding:"80px clamp(1.5rem,5vw,3.5rem)" }}>
        <div className="max-w" style={{ maxWidth:720 }}>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <div style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:10 }}>FAQ</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:900, color:T.text }}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
              <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.1rem 0", textAlign:"left" }}>
                <span style={{ fontSize:"0.9rem", fontWeight:600, color:T.text }}>{f.q}</span>
                <span style={{ color:T.orange, fontSize:20, transition:"transform 0.3s", transform: openFaq===i ? "rotate(45deg)" : "rotate(0)", flexShrink:0, marginLeft:12 }}>+</span>
              </button>
              {openFaq===i && <p style={{ fontSize:"0.84rem", color:T.textMid, lineHeight:1.7, paddingBottom:"1rem" }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── BEST SELLERS STRIP (reusable) ───────────────────────────
function BestSellersStrip({ onShop }) {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  const onMouseDown = e => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseUp   = () => { isDragging.current = false; scrollRef.current.style.cursor = "grab"; };
  const onMouseLeave= () => { isDragging.current = false; scrollRef.current.style.cursor = "grab"; };
  const onMouseMove = e => {
    if (!isDragging.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft = scrollStart.current - (e.pageX - startX.current);
  };

  return (
    <section style={{ background:"#fff", paddingTop:"70px", paddingBottom:"70px" }}>
      <div className="max-w" style={{ paddingLeft:"clamp(1.5rem,5vw,3.5rem)", paddingRight:"clamp(1.5rem,5vw,3.5rem)", marginBottom:"2rem" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:"0.65rem", fontWeight:700, color:T.orange, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:8 }}>BEST SELLERS</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3.5vw,2.2rem)", fontWeight:900, color:T.text, margin:0 }}>Most Loved Stones</h2>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => scroll(-1)} style={{ width:38, height:38, borderRadius:"50%", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.orange; e.currentTarget.style.borderColor=T.orange; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color="#000"; }}>‹</button>
            <button onClick={() => scroll(1)} style={{ width:38, height:38, borderRadius:"50%", border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background=T.orange; e.currentTarget.style.borderColor=T.orange; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color="#000"; }}>›</button>
            <button className="btn-outline" onClick={onShop} style={{ padding:"10px 24px", fontSize:"0.78rem", borderRadius:8 }}>View All →</button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        style={{ overflowX:"auto", overflowY:"hidden", display:"flex", gap:"1.2rem", paddingLeft:"clamp(1rem,4vw,3rem)", paddingRight:"clamp(1rem,4vw,3rem)", paddingBottom:8, cursor:"grab", userSelect:"none", scrollbarWidth:"none", msOverflowStyle:"none", WebkitOverflowScrolling:"touch" }}
      >
        {PRODUCTS.map((p, i) => (
          <div key={i} onClick={onShop} style={{ width:220, flexShrink:0, cursor:"pointer" }}>
            <div style={{ borderRadius:14, overflow:"hidden", border:`1px solid ${T.border}`, background:T.bg, transition:"transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              <div style={{ position:"relative", aspectRatio:"1", overflow:"hidden" }}>
                <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", top:8, left:8, background:T.orange, color:"#fff", borderRadius:4, padding:"2px 8px", fontSize:"0.6rem", fontWeight:800 }}>-{p.discount}%</div>
                {p.bestSeller && <div style={{ position:"absolute", bottom:6, left:6, background:T.bgDark, color:T.orange, borderRadius:4, padding:"2px 7px", fontSize:"0.58rem", fontWeight:700 }}>BEST SELLER</div>}
              </div>
              <div style={{ padding:"0.9rem" }}>
                <div style={{ fontSize:"0.8rem", fontWeight:700, color:T.text, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:"0.9rem", color:T.orange, fontWeight:700 }}>Rs.{p.price.toLocaleString()}</span>
                  <span style={{ color:T.textMid, fontSize:"0.7rem", textDecoration:"line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// ─── PRODUCTS PAGE ────────────────────────────────────────────
function ProductsPage({ onAdd, onWish, wished, onClick, cart }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const getQty = (id) => cart.filter(i => i.id === id).reduce((s,i) => s + i.qty, 0);
  const filtered = PRODUCTS.filter(p => (filter==="all" || p.category===filter) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Sacred Collection</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"1.5rem" }} />
        <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ flex:1, minWidth:180, padding:"10px 14px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.85rem", background:"#fff", color:T.text, outline:"none" }}
            onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[["all","All"],["manifestation","Manifestation"],["therapy","Therapy"],["habit-builder","Habit Builder"]].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{ padding:"8px 16px", borderRadius:20, border:`1.5px solid ${filter===v ? T.orange : T.border}`, background: filter===v ? T.orange : "#fff", color: filter===v ? "#fff" : T.textMid, fontSize:"0.75rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }} className="prod-grid">
          {filtered.map(p => {
            const qty = getQty(p.id);
            return (
              <div key={p.id} className="prod-card" onClick={() => onClick(p)}>
                <div style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden" }}>
                  <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
                    onMouseEnter={e => e.currentTarget.style.transform="scale(1.06)"}
                    onMouseLeave={e => e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position:"absolute", top:10, left:10, background:T.orange, color:"#fff", borderRadius:4, padding:"3px 10px", fontSize:"0.65rem", fontWeight:800 }}>-{p.discount}%</div>
                  <button onClick={e => { e.stopPropagation(); onWish(p.id); }} style={{ position:"absolute", top:8, right:8, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:14, transition:"transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform="scale(1.15)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                  >{wished.includes(p.id) ? "❤️" : "🤍"}</button>
                  {p.bestSeller && <div style={{ position:"absolute", bottom:8, left:8, background:T.bgDark, color:T.orange, borderRadius:4, padding:"2px 8px", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.08em" }}>BEST SELLER</div>}
                </div>
                <div style={{ padding:"1.2rem" }}>
                  <h4 style={{ fontSize:"0.92rem", fontWeight:700, color:T.text, marginBottom:"0.4rem" }}>{p.name}</h4>
                  <p style={{ fontSize:"0.76rem", color:T.textMid, marginBottom:"0.7rem", lineHeight:1.5 }}>{p.shortDesc.slice(0,65)}...</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.8rem" }}>
                    <span style={{ fontSize:"1rem", color:T.orange, fontWeight:700 }}>Rs.{p.price.toLocaleString()}</span>
                    <span style={{ color:T.textMid, fontSize:"0.75rem", textDecoration:"line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
                  </div>
                  {qty > 0 ? (
                    <div onClick={e => e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:0, border:`1.5px solid ${T.orange}`, borderRadius:8, overflow:"hidden", width:"100%" }}>
                      <button onClick={() => onAdd({ ...p, qty:-1 })} style={{ flex:1, height:38, background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.orange, fontWeight:700 }}>−</button>
                      <span style={{ flex:1, textAlign:"center", fontWeight:800, color:T.orange, fontSize:"0.95rem" }}>{qty}</span>
                      <button onClick={() => onAdd(p)} style={{ flex:1, height:38, background:T.orange, border:"none", cursor:"pointer", fontSize:18, color:"#fff", fontWeight:700 }}>+</button>
                    </div>
                  ) : (
                    <button className="btn-orange" onClick={e => { e.stopPropagation(); onAdd(p); }} style={{ width:"100%", padding:"10px", fontSize:"0.72rem", borderRadius:7 }}>Add to Cart</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"4rem", color:T.textMid }}><div style={{ fontSize:48, marginBottom:12 }}>🔍</div><p>No products found.</p></div>}
      </div>
    </div>
  );
}
// ─── PRODUCT DETAIL ───────────────────────────────────────────
function ProductPage({ product: p, onAdd, onWish, wished, cart, onShop }) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [activeImg, setActiveImg] = useState(0);
  const cartQty = cart ? cart.filter(i => i.id === p?.id).reduce((s,i) => s + i.qty, 0) : 0;
  if (!p) return null;
  const imgs = p.images || [p.image];
  return (
    <>
    <div style={{ paddingTop:90, paddingBottom:80, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"start" }} className="prod-detail-grid">
          <div>
            <div style={{ borderRadius:16, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", marginBottom:"0.9rem", aspectRatio:"1", background:"#f0ece4" }}>
              <img src={imgs[activeImg]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"opacity 0.3s" }} />
            </div>
            <div style={{ display:"flex", gap:"0.6rem", overflowX:"auto" }} className="scroll-hide">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink:0, width:72, height:72, borderRadius:10, overflow:"hidden", padding:0, border:`2.5px solid ${activeImg===i ? T.orange : "transparent"}`, cursor:"pointer", transition:"border-color 0.2s", boxShadow: activeImg===i ? `0 0 0 1px ${T.orange}` : "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <img src={img} alt={`view ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </button>
              ))}
            </div>
          </div>
          <div>
            {p.bestSeller && <div style={{ display:"inline-block", background:T.orange, color:"#fff", borderRadius:4, padding:"3px 12px", fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.1em", marginBottom:"0.8rem" }}>BEST SELLER</div>}
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:900, color:T.text, marginBottom:"0.4rem" }}>{p.name}</h1>
            <p style={{ fontSize:"0.72rem", color:T.textMid, marginBottom:"1rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>{p.category}</p>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1.5rem" }}>
              <span style={{ fontSize:"1.5rem", color:T.orange, fontWeight:800 }}>Rs.{p.price.toLocaleString()}</span>
              <span style={{ color:T.textMid, fontSize:"0.95rem", textDecoration:"line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
              <span style={{ background:"rgba(232,114,12,0.1)", color:T.orange, borderRadius:4, padding:"3px 10px", fontSize:"0.72rem", fontWeight:700 }}>{p.discount}% OFF</span>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:"1.2rem" }}>
              {["desc","benefits","suitable"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${tab===t ? T.orange : T.border}`, background: tab===t ? T.orange : "#fff", color: tab===t ? "#fff" : T.textMid, fontSize:"0.72rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
                  {t==="desc" ? "Description" : t==="benefits" ? "Benefits" : "Suitable For"}
                </button>
              ))}
            </div>
            <div style={{ background:"#fff", borderRadius:12, padding:"1.2rem", marginBottom:"1.5rem", border:`1px solid ${T.border}`, minHeight:90 }}>
              {tab==="desc" && <p style={{ fontSize:"0.86rem", color:T.textMid, lineHeight:1.7 }}>{p.shortDesc}</p>}
              {tab==="benefits" && <ul style={{ paddingLeft:"1.2rem" }}>{p.benefits.map(b => <li key={b} style={{ fontSize:"0.86rem", color:T.textMid, marginBottom:6, lineHeight:1.6 }}>{b}</li>)}</ul>}
              {tab==="suitable" && <p style={{ fontSize:"0.86rem", color:T.textMid, lineHeight:1.7 }}>{p.suitableFor}</p>}
            </div>
            <div style={{ display:"flex", gap:"1rem", alignItems:"center", marginBottom:"1rem" }}>
              <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${T.border}`, borderRadius:8, overflow:"hidden" }}>
                <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:36, height:40, background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.text }}>−</button>
                <span style={{ width:40, textAlign:"center", fontWeight:700, color:T.text }}>{qty}</span>
                <button onClick={() => setQty(q => q+1)} style={{ width:36, height:40, background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.text }}>+</button>
              </div>
              <button className="btn-orange" onClick={() => { for(let i=0;i<qty;i++) onAdd(p); }} style={{ flex:1, padding:"12px", fontSize:"0.8rem", borderRadius:8 }}>
                Add to Cart {cartQty > 0 && <span style={{ background:"rgba(255,255,255,0.25)", borderRadius:10, padding:"1px 7px", marginLeft:6, fontSize:"0.72rem" }}>{cartQty} in cart</span>}
              </button>
              <button onClick={() => onWish(p.id)} style={{ width:44, height:44, borderRadius:8, border:`1.5px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>{wished.includes(p.id) ? "❤️" : "🤍"}</button>
            </div>
            <div style={{ display:"flex", gap:"1.2rem", flexWrap:"wrap" }}>
              {["Free shipping above Rs.999","7-day returns","100% natural"].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.7rem", color:T.textMid }}>
                  <span style={{ color:T.orange }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <BestSellersStrip onShop={onShop} />
    {/* Sticky Add to Cart Bar */}
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:999, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderTop:`1.5px solid ${T.border}`, padding:"8px clamp(0.75rem,3vw,1.5rem)", display:"flex", alignItems:"center", gap:"0.75rem", boxShadow:"0 -2px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", lineHeight:1.2 }}>{p.name}</div>
        <div style={{ fontSize:"0.82rem", color:T.orange, fontWeight:800, lineHeight:1.3 }}>Rs.{p.price.toLocaleString()}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${T.border}`, borderRadius:7, overflow:"hidden", flexShrink:0, height:34 }}>
        <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:28, height:34, background:"none", border:"none", cursor:"pointer", fontSize:14, color:T.text, lineHeight:1 }}>−</button>
        <span style={{ width:28, textAlign:"center", fontWeight:700, color:T.text, fontSize:"0.82rem" }}>{qty}</span>
        <button onClick={() => setQty(q => q+1)} style={{ width:28, height:34, background:"none", border:"none", cursor:"pointer", fontSize:14, color:T.text, lineHeight:1 }}>+</button>
      </div>
      <button className="btn-orange" onClick={() => { for(let i=0;i<qty;i++) onAdd(p); }} style={{ padding:"7px 16px", fontSize:"0.75rem", borderRadius:7, flexShrink:0, height:34 }}>
        Add to Cart{cartQty > 0 && <span style={{ background:"rgba(255,255,255,0.3)", borderRadius:8, padding:"1px 6px", marginLeft:5, fontSize:"0.68rem" }}>{cartQty}</span>}
      </button>
    </div>
    </>
  );
}
// ─── RITUALS PAGE ─────────────────────────────────────────────
function RitualsPage() {
  const rituals = [
    { icon:"🌙", title:"New Moon Ritual", time:"30 min", desc:"Set powerful intentions with your WishStone under the new moon. Write your desires, charge your stone, and visualize your manifestation.", steps:["Apne space ko sage se cleanse karein","WishStone ko dono haathon mein pakdein","3 intentions paper pe likhein","Stone ko paper pe raat bhar rakhein","10 minute meditation karein"] },
    { icon:"☀️", title:"Morning Activation", time:"10 min", desc:"Har subah WishStone activation ritual se apni energy align karein aur din ko positive tone dein.", steps:["WishStone ko dono haathon mein pakdein","5 gehri sansein lein","Apni intention zor se bolein","Stone ko apne dil pe rakhein","Isse poore din saath rakhein"] },
    { icon:"🌿", title:"Cleansing Ceremony", time:"20 min", desc:"Regular cleansing se accumulated energies remove hoti hain aur WishStone apni natural vibrational state mein wapas aata hai.", steps:["Stone ko thande paani se dhoyein","Sage smoke se pass karein","1 ghante ke liye sunlight mein rakhein","Nayi intention set karein","Sacred space mein store karein"] },
  ];
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Sacred Rituals</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"0.8rem" }} />
        <p style={{ color:T.textMid, fontSize:"0.88rem", marginBottom:"2.5rem", maxWidth:580 }}>Ancient practices adapted for modern life.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }} className="prod-grid">
          {rituals.map(r => (
            <div key={r.title} style={{ background:"#fff", borderRadius:16, padding:"1.8rem", border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:38, marginBottom:"1rem" }}>{r.icon}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.8rem" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.05rem", fontWeight:700, color:T.text }}>{r.title}</h3>
                <span style={{ background:"rgba(232,114,12,0.08)", color:T.orange, borderRadius:20, padding:"2px 10px", fontSize:"0.65rem", fontWeight:700 }}>{r.time}</span>
              </div>
              <p style={{ fontSize:"0.8rem", color:T.textMid, lineHeight:1.65, marginBottom:"1.2rem" }}>{r.desc}</p>
              {r.steps.map((s,i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                  <span style={{ width:20, height:20, borderRadius:"50%", background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, color:"#fff", fontSize:"0.6rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</span>
                  <span style={{ fontSize:"0.78rem", color:T.textMid, lineHeight:1.5 }}>{s}</span>
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
    { icon:"🧘", title:"Mental Clarity", desc:"WishStone ki sacred yantra aur crystal energy mental chatter ko quiet karti hai, focus improve karti hai, aur decision-making mein clarity laati hai." },
    { icon:"💚", title:"Emotional Healing", desc:"Rose quartz aur moonstone gently emotional blockages release karte hain, self-love promote karte hain, aur past wounds se healing support karte hain." },
    { icon:"⚡", title:"Energy Amplification", desc:"WishStone ki frequency motivation, creativity, aur life force energy boost karti hai." },
    { icon:"🛡️", title:"Protection", desc:"Obsidian aur black tourmaline powerful energetic shields create karte hain." },
    { icon:"😴", title:"Better Sleep", desc:"Amethyst aur selenite nervous system ko calm karte hain, anxiety reduce karte hain." },
    { icon:"🌟", title:"Spiritual Growth", desc:"WishStone ki sacred yantra third eye open karti hai, intuition enhance karti hai." },
  ];
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:900, marginBottom:"0.4rem" }}>WishStone Benefits</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"0.8rem" }} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", marginTop:"2rem" }} className="prod-grid">
          {benefits.map(b => (
            <div key={b.title} className="power-card">
              <div style={{ fontSize:34, marginBottom:"1rem" }}>{b.icon}</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", fontWeight:700, color:T.text, marginBottom:"0.5rem" }}>{b.title}</h3>
              <p style={{ fontSize:"0.8rem", color:T.textMid, lineHeight:1.65 }}>{b.desc}</p>
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
    { name:"Priya S.", city:"Mumbai", rating:5, text:"Pehle mujhe yakeen nahi tha, lekin Rose Quartz use karne ke 3 hafte baad, main genuinely zyada peaceful feel karti hoon.", product:"WishStone — Rose Quartz", avatar:"P" },
    { name:"Rahul M.", city:"Delhi", rating:5, text:"Amethyst WishStone ne meri meditation practice completely change kar di.", product:"WishStone — Amethyst", avatar:"R" },
    { name:"Ananya K.", city:"Bangalore", rating:5, text:"2 mahine pehle morning ritual shuru kiya WishStone ke saath. Meri productivity double ho gayi.", product:"Moonstone Ritual Kit", avatar:"A" },
    { name:"Vikram T.", city:"Pune", rating:5, text:"Obsidian WishStone mere desk pe hai aur meri workspace ki energy shift ho gayi hai.", product:"WishStone — Obsidian", avatar:"V" },
    { name:"Meera J.", city:"Chennai", rating:5, text:"Lavender Bundle bilkul divine hai. Ghar ki khushboo incredible hai.", product:"Healing Lavender Bundle", avatar:"M" },
    { name:"Arjun P.", city:"Hyderabad", rating:5, text:"Apni maa ko Sandalwood Incense gift kiya. Quality exceptional hai.", product:"Sacred Sandalwood Incense", avatar:"A" },
  ];
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Customer Stories</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"0.8rem" }} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", marginTop:"2rem" }} className="prod-grid">
          {stories.map((s,i) => (
            <div key={i} style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", gap:3, marginBottom:"1rem" }}>
                {Array(s.rating).fill(0).map((_,j) => <span key={j} style={{ color:T.orange, fontSize:13 }}>★</span>)}
              </div>
              <p style={{ fontSize:"0.84rem", color:T.textMid, lineHeight:1.7, marginBottom:"1.2rem", fontStyle:"italic" }}>"{s.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.85rem" }}>{s.avatar}</div>
                <div>
                  <div style={{ fontWeight:700, color:T.text, fontSize:"0.82rem" }}>{s.name}</div>
                  <div style={{ fontSize:"0.68rem", color:T.textMid }}>{s.city} · {s.product}</div>
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
function CartPage({ cart, onQty, onRemove, onCheckout }) {
  const sub = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const ship = sub >= 999 ? 0 : 99;
  const total = sub + ship;
  if (cart.length===0) return (
    <div style={{ paddingTop:130, paddingBottom:40, paddingLeft:"2rem", paddingRight:"2rem", background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, textAlign:"center" }}>
      <div style={{ fontSize:56 }}>🛒</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.8rem", fontWeight:900 }}>Your Cart is Empty</h2>
    </div>
  );
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Your Cart</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"1.5rem" }} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"2rem", alignItems:"start" }} className="checkout-grid">
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ background:"#fff", borderRadius:12, padding:"1.2rem", marginBottom:"1rem", display:"flex", gap:"1rem", alignItems:"center", border:`1px solid ${T.border}` }}>
                <img src={item.image} alt={item.name} style={{ width:76, height:76, objectFit:"cover", borderRadius:8, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <h4 style={{ fontSize:"0.88rem", fontWeight:700, color:T.text, marginBottom:4 }}>{item.name}</h4>
                  <p style={{ fontSize:"0.78rem", color:T.textMid, marginBottom:8 }}>Rs.{item.price.toLocaleString()} each</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", border:`1.5px solid ${T.border}`, borderRadius:6, overflow:"hidden" }}>
                      <button onClick={() => onQty(item.id,-1)} style={{ width:30, height:30, background:"none", border:"none", cursor:"pointer", fontSize:16, color:T.text }}>-</button>
                      <span style={{ width:30, textAlign:"center", fontSize:"0.85rem", fontWeight:700, color:T.text }}>{item.qty}</span>
                      <button onClick={() => onQty(item.id,1)} style={{ width:30, height:30, background:"none", border:"none", cursor:"pointer", fontSize:16, color:T.text }}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#c0392b", fontSize:"0.72rem", fontWeight:600 }}>Remove</button>
                  </div>
                </div>
                <div style={{ fontWeight:800, color:T.orange, fontSize:"0.95rem", flexShrink:0 }}>Rs.{(item.price*item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, position:"sticky", top:90 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.05rem", fontWeight:700, marginBottom:"1.2rem" }}>Order Summary</h3>
            {[["Subtotal","Rs."+sub.toLocaleString()],["Shipping",ship===0?"FREE":"Rs."+ship]].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:T.textMid, fontSize:"0.82rem" }}>{l}</span>
                <span style={{ color:T.text, fontSize:"0.82rem", fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:"0.9rem", display:"flex", justifyContent:"space-between", marginBottom:"1.2rem" }}>
              <span style={{ color:T.text, fontWeight:700 }}>Total</span>
              <span style={{ color:T.orange, fontSize:"1.1rem", fontWeight:800 }}>Rs.{total.toLocaleString()}</span>
            </div>
            <button className="btn-orange" onClick={onCheckout} style={{ width:"100%", padding:"13px", fontSize:"0.8rem", borderRadius:8 }}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────
function CheckoutPage({ cart, onPlaceOrder }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", city:"", state:"", pincode:"" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const sub = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
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
    if (!form.name||!form.email||!form.phone||!form.address||!form.city||!form.pincode) return setError("Please fill all required fields.");
    setLoading(true);
    await new Promise(r => setTimeout(r,1200));
    onPlaceOrder({ items:cart, address:form, totalAmount:total, coupon, discount, isGift, giftNote });
    setLoading(false);
  };

  const inp = (key, label, type="text", half=false) => (
    <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:T.textMid, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={label}
        style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.86rem", background:"#fff", color:T.text, outline:"none", boxSizing:"border-box" }}
        onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
    </div>
  );

  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Checkout</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"1.5rem" }} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:"2rem", alignItems:"start" }} className="checkout-grid">
          <form onSubmit={handleSubmit}>
            <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, marginBottom:"1.2rem" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1rem", fontWeight:700, marginBottom:"1.2rem" }}>Delivery Details</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {inp("name","Full Name")} {inp("email","Email Address","email")}
                {inp("phone","Phone Number","tel")} {inp("address","Street Address")}
                {inp("city","City","text",true)} {inp("state","State","text",true)}
                {inp("pincode","Pincode","text",true)}
              </div>
            </div>
            <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, marginBottom:"1.2rem" }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1rem", fontWeight:700, marginBottom:"1rem" }}>Coupon Code</h3>
              <div style={{ display:"flex", gap:8 }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code"
                  style={{ flex:1, padding:"10px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.84rem", background:"#fff", color:T.text, outline:"none" }}
                  onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
                <button type="button" className="btn-orange" onClick={applyCoupon} style={{ padding:"10px 18px", fontSize:"0.76rem", borderRadius:8 }}>Apply</button>
              </div>
              {couponMsg && <p style={{ fontSize:"0.76rem", marginTop:6, color: discount>0 ? "#2d7a5a" : "#c0392b" }}>{couponMsg}</p>}
            </div>
            {/* ─── GIFT WRAPPING ─── */}
            <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, marginBottom:"1.2rem" }}>
              <label style={{ display:"flex", alignItems:"center", gap:"0.75rem", cursor:"pointer", userSelect:"none" }}>
                <div onClick={() => setIsGift(g => !g)} style={{ width:22, height:22, borderRadius:6, border:`2px solid ${isGift ? T.orange : T.border}`, background: isGift ? T.orange : "#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                  {isGift && <span style={{ color:"#fff", fontSize:13, lineHeight:1, fontWeight:900 }}>✓</span>}
                </div>
                <div>
                  <span style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1rem", fontWeight:700 }}>🎁 Gift Wrapping</span>
                  <span style={{ display:"block", fontSize:"0.72rem", color:T.textMid, marginTop:2 }}>Add premium gift wrapping — ₹50 per item</span>
                </div>
              </label>
              {isGift && (
                <div style={{ marginTop:"1rem" }}>
                  <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:T.textMid, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Gift Note (optional)</label>
                  <textarea value={giftNote} onChange={e => setGiftNote(e.target.value)} placeholder="Write a personal message for the recipient..." rows={3}
                    style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.84rem", background:"#fff", color:T.text, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"'Inter',sans-serif" }}
                    onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
                  <p style={{ fontSize:"0.72rem", color:T.orange, marginTop:6, fontWeight:600 }}>Gift wrapping charge: ₹{giftCharge} ({totalQty} item{totalQty>1?"s":""} × ₹50)</p>
                </div>
              )}
            </div>
            {error && <p style={{ color:"#c0392b", fontSize:"0.78rem", marginBottom:"1rem" }}>{error}</p>}
            <button type="submit" className="btn-orange" disabled={loading} style={{ width:"100%", padding:"14px", fontSize:"0.84rem", borderRadius:9, opacity:loading?0.7:1 }}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
          <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", border:`1px solid ${T.border}`, position:"sticky", top:90 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.05rem", fontWeight:700, marginBottom:"1.2rem" }}>Order Summary</h3>
            {cart.map(i => (
              <div key={i.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:"0.8rem", color:T.textMid }}>{i.name} x{i.qty}</span>
                <span style={{ fontSize:"0.8rem", fontWeight:600, color:T.text }}>Rs.{(i.price*i.qty).toLocaleString()}</span>
              </div>
            ))}
            {ship > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:"0.8rem", color:T.textMid }}>Shipping</span>
                <span style={{ fontSize:"0.8rem", fontWeight:600, color:T.text }}>Rs.{ship}</span>
              </div>
            )}
            {discount > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:"0.8rem", color:"#2d7a5a" }}>Coupon Discount</span>
                <span style={{ fontSize:"0.8rem", fontWeight:600, color:"#2d7a5a" }}>−Rs.{discount}</span>
              </div>
            )}
            {isGift && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:"0.8rem", color:T.orange }}>🎁 Gift Wrapping</span>
                <span style={{ fontSize:"0.8rem", fontWeight:600, color:T.orange }}>+Rs.{giftCharge}</span>
              </div>
            )}
            <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:"0.9rem", display:"flex", justifyContent:"space-between" }}>
              <span style={{ color:T.text, fontWeight:700 }}>Total</span>
              <span style={{ color:T.orange, fontSize:"1.1rem", fontWeight:800 }}>Rs.{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────
function WishlistPage({ ids, onAdd, onWish, onClick }) {
  const items = PRODUCTS.filter(p => ids.includes(p.id));
  if (!items.length) return (
    <div style={{ paddingTop:130, paddingBottom:40, paddingLeft:"2rem", paddingRight:"2rem", background:T.bg, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, textAlign:"center" }}>
      <div style={{ fontSize:56 }}>🤍</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.8rem", fontWeight:900 }}>Your Wishlist is Empty</h2>
    </div>
  );
  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:900, marginBottom:"0.4rem" }}>Your Wishlist</h1>
        <div style={{ width:60, height:3, background:`linear-gradient(90deg,${T.orange},transparent)`, marginBottom:"1.5rem" }} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }} className="prod-grid">
          {items.map(p => (
            <div key={p.id} className="prod-card" onClick={() => onClick(p)}>
              <div style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden" }}>
                <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", top:10, left:10, background:T.orange, color:"#fff", borderRadius:4, padding:"3px 10px", fontSize:"0.65rem", fontWeight:800 }}>-{p.discount}%</div>
                <button onClick={e => { e.stopPropagation(); onWish(p.id); }} style={{ position:"absolute", top:8, right:8, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:14 }}>❤️</button>
              </div>
              <div style={{ padding:"1.2rem" }}>
                <h4 style={{ fontSize:"0.92rem", fontWeight:700, color:T.text, marginBottom:"0.4rem" }}>{p.name}</h4>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"0.8rem" }}>
                  <span style={{ fontSize:"1rem", color:T.orange, fontWeight:700 }}>Rs.{p.price.toLocaleString()}</span>
                  <span style={{ color:T.textMid, fontSize:"0.75rem", textDecoration:"line-through" }}>Rs.{p.originalPrice.toLocaleString()}</span>
                </div>
                <button className="btn-orange" onClick={e => { e.stopPropagation(); onAdd(p); }} style={{ width:"100%", padding:"10px", fontSize:"0.72rem", borderRadius:7 }}>Add to Cart</button>
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
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handle = async e => {
    e.preventDefault(); setError("");
    if (!form.name||!form.email||!form.password) return setError("All fields are required.");
    if (form.password!==form.confirm) return setError("Passwords do not match.");
    if (form.password.length<6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
      const res = await fetch(`${API_BASE}/api/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name:form.name, email:form.email, password:form.password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message||"Registration failed");
      setSuccess(true);
      setTimeout(() => onSwitch(), 2000);
    } catch(err) {
      if (err.message.includes("fetch") || err.message.includes("network") || err.message.includes("Failed")) { setSuccess(true); setTimeout(() => onSwitch(), 2000); }
      else setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:100, paddingBottom:"2rem", paddingLeft:"2rem", paddingRight:"2rem" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"2.5rem", width:"100%", maxWidth:420, boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:`1px solid ${T.border}`, animation:"cardIn 0.5s ease both" }}>
        {success ? (
          <div style={{ textAlign:"center", padding:"1rem 0" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.4rem", fontWeight:900, marginBottom:8 }}>Account Created!</h2>
            <p style={{ color:T.textMid, fontSize:"0.85rem" }}>Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:"2rem" }}>
              <div style={{ fontSize:38, marginBottom:8 }}>💎</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.5rem", fontWeight:900, margin:0 }}>Create Account</h2>
            </div>
            <form onSubmit={handle}>
              {[["name","Full Name","text"],["email","Email Address","email"],["password","Password","password"],["confirm","Confirm Password","password"]].map(([k,l,t]) => (
                <div key={k} style={{ marginBottom:"1rem" }}>
                  <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:T.textMid, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</label>
                  <input type={k==="password"||k==="confirm"?(showPw?"text":t):t} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.88rem", background:"#fff", color:T.text, outline:"none", boxSizing:"border-box" }}
                    onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
                </div>
              ))}
              {error && <p style={{ color:"#c0392b", fontSize:"0.78rem", marginBottom:"1rem" }}>{error}</p>}
              <button type="submit" className="btn-orange" disabled={loading} style={{ width:"100%", padding:"13px", fontSize:"0.82rem", borderRadius:8, opacity:loading?0.7:1 }}>{loading?"Creating Account...":"Create Account"}</button>
            </form>
            {/* Google Sign In */}
            <div style={{ margin:"1.2rem 0 0.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"0 0 1rem" }}>
                <div style={{ flex:1, height:1, background:T.border }} />
                <span style={{ fontSize:"0.7rem", color:T.textMid, fontWeight:600, whiteSpace:"nowrap" }}>OR CONTINUE WITH</span>
                <div style={{ flex:1, height:1, background:T.border }} />
              </div>
              <GoogleLogin
                onSuccess={cred => {
                  try {
                    const payload = JSON.parse(atob(cred.credential.split(".")[1]));
                    if (!localStorage.getItem("ws_token")) localStorage.setItem("ws_token", "google_" + Date.now());
                    onSignup({ name: payload.name, email: payload.email, avatar: payload.picture });
                  } catch(e) { setError("Google sign-in failed. Try again."); }
                }}
                onError={() => setError("Google sign-in failed. Try again.")}
                width="100%"
                text="signup_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
            <p style={{ textAlign:"center", marginTop:"1.5rem", fontSize:"0.82rem", color:T.textMid }}>
              Already have an account? <button onClick={onSwitch} style={{ background:"none", border:"none", cursor:"pointer", color:T.orange, fontWeight:700, fontSize:"0.82rem" }}>Sign In</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault(); setError("");
    if (!form.email||!form.password) return setError("Email and password are required.");
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
      const res = await fetch(`${API_BASE}/api/auth/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:form.email, password:form.password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message||"Login failed");
      if (data.token) localStorage.setItem("ws_token", data.token);
      onLogin(data.user || { email:form.email, name: data.user?.name || form.email.split("@")[0] });
    } catch(err) {
      if (err.message.includes("fetch") || err.message.includes("network") || err.message.includes("Failed") || err.message.includes("ERR")) {
        if (!localStorage.getItem("ws_token")) localStorage.setItem("ws_token", "local_" + Date.now());
        onLogin({ email:form.email, name: form.email.split("@")[0] });
      } else setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:100, paddingBottom:"2rem", paddingLeft:"2rem", paddingRight:"2rem" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"2.5rem", width:"100%", maxWidth:400, boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:`1px solid ${T.border}`, animation:"cardIn 0.5s ease both" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:38, marginBottom:8 }}>🔮</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.5rem", fontWeight:900, margin:0 }}>Welcome Back</h2>
        </div>
        <form onSubmit={handle}>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:T.textMid, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
              style={{ width:"100%", padding:"11px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.88rem", background:"#fff", color:T.text, outline:"none", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
          </div>
          <div style={{ marginBottom:"1rem" }}>
            <label style={{ display:"block", fontSize:"0.68rem", fontWeight:700, color:T.textMid, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPw?"text":"password"} placeholder="Enter your password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}
                style={{ width:"100%", padding:"11px 42px 11px 13px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:"0.88rem", background:"#fff", color:T.text, outline:"none", boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.border} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15, color:T.textMid }}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>
          {error && <p style={{ color:"#c0392b", fontSize:"0.78rem", marginBottom:"1rem" }}>{error}</p>}
          <button type="submit" className="btn-orange" disabled={loading} style={{ width:"100%", padding:"13px", fontSize:"0.82rem", borderRadius:8, opacity:loading?0.7:1 }}>{loading?"Signing In...":"Sign In"}</button>
        </form>
        {/* Google Sign In */}
        <div style={{ margin:"1.2rem 0 0.5rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", margin:"0 0 1rem" }}>
            <div style={{ flex:1, height:1, background:T.border }} />
            <span style={{ fontSize:"0.7rem", color:T.textMid, fontWeight:600, whiteSpace:"nowrap" }}>OR CONTINUE WITH</span>
            <div style={{ flex:1, height:1, background:T.border }} />
          </div>
          <GoogleLogin
            onSuccess={cred => {
              try {
                const payload = JSON.parse(atob(cred.credential.split(".")[1]));
                if (!localStorage.getItem("ws_token")) localStorage.setItem("ws_token", "google_" + Date.now());
                onLogin({ name: payload.name, email: payload.email, avatar: payload.picture });
              } catch(e) { setError("Google sign-in failed. Try again."); }
            }}
            onError={() => setError("Google sign-in failed. Try again.")}
            width="100%"
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>
        <div style={{ marginTop:"1rem", padding:"10px 12px", background:"rgba(232,114,12,0.06)", border:`1px solid rgba(232,114,12,0.15)`, borderRadius:8 }}>
          <p style={{ fontSize:"0.72rem", color:T.textMid, textAlign:"center" }}>💡 Demo mode: Enter any email & password to explore</p>
        </div>
        <p style={{ textAlign:"center", marginTop:"1rem", fontSize:"0.82rem", color:T.textMid }}>
          New to WishStone? <button onClick={onSwitch} style={{ background:"none", border:"none", cursor:"pointer", color:T.orange, fontWeight:700, fontSize:"0.82rem" }}>Create Account</button>
        </p>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────
function UserDashboard({ user, orders, onLogout, onNav }) {
  const [activeTab, setActiveTab] = useState("orders");
  const tabs = [{ key:"orders", icon:"📦", label:"My Orders" },{ key:"profile", icon:"👤", label:"Profile" },{ key:"wishlist", icon:"🤍", label:"Wishlist" }];
  const statCards = [{ icon:"📦", label:"Total Orders", value: orders.length },{ icon:"💰", label:"Total Spent", value: "Rs." + orders.reduce((s,o) => s+(o.totalAmount||0), 0).toLocaleString() },{ icon:"🌟", label:"Member Since", value: "2024" },{ icon:"🎯", label:"Manifestations", value: orders.length * 3 || 0 }];

  return (
    <div style={{ paddingTop:90, background:T.bg, minHeight:"100vh" }}>
      <div className="max-w" style={{ padding:"clamp(1.5rem,4vw,2.5rem)" }}>
        <div style={{ background:`linear-gradient(135deg, ${T.bgDark} 0%, #3a4a28 100%)`, borderRadius:20, padding:"clamp(1.5rem,4vw,2.5rem)", marginBottom:"1.5rem", position:"relative", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", flexWrap:"wrap", position:"relative" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg,${T.orangeD},${T.orange})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"#fff", fontWeight:900, flexShrink:0 }}>
              {(user.name||user.email||"U")[0].toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:"clamp(1.1rem,3vw,1.5rem)", fontWeight:900, margin:"0 0 4px" }}>{user.name||"WishStone Member"}</h2>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.82rem", margin:"0 0 8px" }}>{user.email}</p>
            </div>
            <div style={{ display:"flex", gap:"0.7rem", flexShrink:0 }}>
              <button className="btn-orange" onClick={() => onNav("products")} style={{ padding:"9px 18px", fontSize:"0.75rem", borderRadius:8 }}>Shop Now</button>
              <button onClick={onLogout} style={{ padding:"9px 18px", fontSize:"0.75rem", borderRadius:8, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>Sign Out</button>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }} className="dashboard-stats">
          {statCards.map(s => (
            <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"1.2rem", border:`1px solid ${T.border}`, textAlign:"center" }}>
              <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:900, color:T.text, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:"0.68rem", color:T.textMid, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", background:"#fff", borderRadius:12, padding:"0.4rem", border:`1px solid ${T.border}`, width:"fit-content" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { if(t.key==="wishlist") onNav("wishlist"); else setActiveTab(t.key); }}
              style={{ padding:"9px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:"0.78rem", fontWeight:600, fontFamily:"'Inter',sans-serif", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s", background: activeTab===t.key ? T.orange : "transparent", color: activeTab===t.key ? "#fff" : T.textMid }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {activeTab==="orders" && (
          <div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.1rem", fontWeight:900, marginBottom:"1rem" }}>Order History</h3>
            {(!orders||orders.length===0) ? (
              <div style={{ background:"#fff", borderRadius:16, padding:"3.5rem 2rem", textAlign:"center", border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:52, marginBottom:14 }}>📦</div>
                <button className="btn-orange" onClick={() => onNav("products")} style={{ padding:"12px 28px", fontSize:"0.82rem", borderRadius:8 }}>Shop Now</button>
              </div>
            ) : orders.map((o,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:14, padding:"1.4rem", marginBottom:"1rem", border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:"0.8rem" }}>
                  <div style={{ fontWeight:700, color:T.text }}>Order #{o._id ? o._id.slice(-6).toUpperCase() : String(i+1).padStart(6,"0")}</div>
                  <span style={{ background:"rgba(45,122,90,0.1)", color:"#2d7a5a", padding:"4px 14px", borderRadius:20, fontSize:"0.7rem", fontWeight:700 }}>{o.status||"Confirmed"}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", borderTop:`1px solid ${T.border}`, paddingTop:"0.7rem" }}>
                  <span style={{ fontSize:"0.78rem", color:T.textMid }}>Total Amount</span>
                  <span style={{ fontWeight:800, color:T.orange }}>Rs.{o.totalAmount ? o.totalAmount.toLocaleString() : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab==="profile" && (
          <div style={{ background:"#fff", borderRadius:16, padding:"2rem", border:`1px solid ${T.border}` }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:T.text, fontSize:"1.1rem", fontWeight:900, marginBottom:"1.5rem" }}>Profile Information</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem" }} className="checkout-grid">
              {[["Full Name", user.name||"—"],["Email Address", user.email||"—"],["Member Since","2024"],["Account Type","Sacred Member"]].map(([l,v]) => (
                <div key={l} style={{ padding:"1rem", background:T.bg, borderRadius:10, border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:"0.65rem", fontWeight:700, color:T.textMid, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>{l}</div>
                  <div style={{ fontSize:"0.9rem", fontWeight:600, color:T.text }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROMO MODAL ──────────────────────────────────────────────
function PromoModal({ show, onClose, onShop }) {
  const [email, setEmail] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const COUPON = "WOW300";

  const handleClaim = () => {
    if (!email.trim()) return;
    setClaimed(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show) return null;

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, maxWidth:420, width:"100%", padding:"2.5rem 2rem 2rem", boxShadow:"0 24px 64px rgba(0,0,0,0.18)", position:"relative", animation:"modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both", textAlign:"center" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#999", lineHeight:1 }}>✕</button>

        {/* Logo */}
        <div style={{ marginBottom:"1.4rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg,${T.bgDark},${T.orange})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💎</div>
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:900, color:T.text, letterSpacing:"0.08em", lineHeight:1 }}>WISHSTONE</div>
          <div style={{ fontSize:"0.65rem", letterSpacing:"0.22em", color:T.textMid, marginTop:2 }}>SACRED STORE</div>
        </div>

        {!claimed ? (
          <>
            <p style={{ fontSize:"1rem", color:T.text, lineHeight:1.6, marginBottom:"1.6rem", fontFamily:"'Playfair Display',serif" }}>
              Start your sacred journey with us and<br />get <strong style={{ color:T.orange }}>₹300 off</strong> your first order.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e5e5e5", borderRadius:10, fontSize:"0.9rem", color:T.text, outline:"none", boxSizing:"border-box", marginBottom:"0.9rem", fontFamily:"'Inter',sans-serif" }}
              onFocus={e => e.target.style.borderColor=T.orange}
              onBlur={e => e.target.style.borderColor="#e5e5e5"}
              onKeyDown={e => e.key==="Enter" && handleClaim()}
            />
            <button onClick={handleClaim} style={{ width:"100%", padding:"14px", background:T.text, color:"#fff", border:"none", borderRadius:10, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", letterSpacing:"0.04em", transition:"background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background=T.orange}
              onMouseLeave={e => e.currentTarget.style.background=T.text}>
              Claim Discount
            </button>
            <button onClick={onClose} style={{ marginTop:"0.8rem", background:"none", border:"none", cursor:"pointer", fontSize:"0.75rem", color:"#aaa", fontFamily:"'Inter',sans-serif" }}>
              No thanks, I'll pay full price
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize:40, marginBottom:"0.6rem" }}>🎉</div>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:T.text, marginBottom:"0.4rem", fontWeight:700 }}>Your coupon is ready!</p>
            <p style={{ fontSize:"0.8rem", color:T.textMid, marginBottom:"1.4rem" }}>Copy the code below and use it at checkout</p>
            <div onClick={handleCopy} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fdf6ee", border:`2px dashed ${T.orange}`, borderRadius:12, padding:"14px 18px", cursor:"pointer", marginBottom:"1.2rem", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="#fdecd6"}
              onMouseLeave={e => e.currentTarget.style.background="#fdf6ee"}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:900, color:T.orange, letterSpacing:"0.1em" }}>{COUPON}</span>
              <span style={{ background: copied ? "#2d7a5a" : T.orange, color:"#fff", borderRadius:7, padding:"6px 14px", fontSize:"0.72rem", fontWeight:700, transition:"background 0.2s" }}>
                {copied ? "✓ Copied!" : "COPY"}
              </span>
            </div>
            <button className="btn-orange" onClick={() => { onClose(); onShop(); }} style={{ width:"100%", padding:"13px", fontSize:"0.85rem", borderRadius:10 }}>
              Shop Now & Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}
// ─── MAIN APP ─────────────────────────────────────────────────
export default function WishstoneApp() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wished, setWished] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("ws_user");
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch(e) { localStorage.removeItem("ws_user"); } }
  }, []);

  const [showModal, setShowModal] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowModal(true), 5000); return () => clearTimeout(t); }, []);

  const addToCart = p => {
    if (p.qty === -1) {
      setCart(c => c.map(i => i.id===p.id ? {...i, qty:i.qty-1} : i).filter(i => i.qty > 0));
    } else {
      setCart(c => { const ex=c.find(i=>i.id===p.id); if(ex) return c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i); return [...c,{...p,qty:1}]; });
    }
  };
  const toggleWish = id => setWished(w => w.includes(id)?w.filter(x=>x!==id):[...w,id]);
  const updateQty = (id,delta) => setCart(c => c.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i).filter(i=>i.qty>0));
  const removeFromCart = id => setCart(c => c.filter(i=>i.id!==id));
  const handlePlaceOrder = data => { setOrders(o=>[{...data,_id:Date.now().toString(),status:"Confirmed",createdAt:new Date().toISOString()},...o]); setCart([]); nav("home"); };
  const handleLogin = (u) => { const ud = { ...u, joinedAt: u.joinedAt || new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) }; setUser(ud); localStorage.setItem("ws_user", JSON.stringify(ud)); if (!localStorage.getItem("ws_token")) localStorage.setItem("ws_token", "local_" + Date.now()); nav("home"); };
  const handleLogout = () => { setUser(null); localStorage.removeItem("ws_token"); localStorage.removeItem("ws_user"); nav("home"); };
  const nav = p => { setPage(p); window.scrollTo(0,0); };
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID||""}>
    <div style={{ fontFamily:"'Inter',sans-serif", background:T.bg, minHeight:"100vh" }}>
      <style>{GLOBAL_CSS}</style>
      <Header cartCount={cartCount} wishCount={wished.length} onNav={nav} currentPage={page} user={user} onLogout={handleLogout} />
      {page==="home"      && <HomePage onShop={()=>nav("products")} onRitual={()=>nav("rituals")} onNav={nav} />}
      {page==="products"  && <ProductsPage onAdd={addToCart} onWish={toggleWish} wished={wished} onClick={p=>{setSelectedProduct(p);nav("product");}} cart={cart} />}
      {page==="product"   && selectedProduct && <ProductPage product={selectedProduct} onAdd={addToCart} onWish={toggleWish} wished={wished} cart={cart} />}
      {page==="rituals"   && <RitualsPage />}
      {page==="benefits"  && <BenefitsPage />}
      {page==="stories"   && <StoriesPage />}
      {page==="cart"      && <CartPage cart={cart} onQty={updateQty} onRemove={removeFromCart} onCheckout={()=>nav("checkout")} />}
      {page==="checkout"  && <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} />}
      {page==="wishlist"  && <WishlistPage ids={wished} onAdd={addToCart} onWish={toggleWish} onClick={p=>{setSelectedProduct(p);nav("product");}} />}
      {page==="auth" && authMode==="signup" && <SignupPage onSignup={handleLogin} onSwitch={()=>setAuthMode("login")} />}
      {page==="auth" && authMode==="login"  && <LoginPage  onLogin={handleLogin} onSwitch={()=>setAuthMode("signup")} />}
      {page==="dashboard" && user && <UserDashboard user={user} orders={orders} onLogout={handleLogout} onNav={nav} />}
      {page!=="auth" && <Footer />}
      {/* ── Promo Modal ── */}
      <PromoModal show={showModal} onClose={() => setShowModal(false)} onShop={() => { setShowModal(false); nav("products"); }} />
    </div>
    </GoogleOAuthProvider>
  );
}
