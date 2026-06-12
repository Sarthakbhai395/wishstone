import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IntentionAnchoringPage from "./IntentionAnchoringPage";

const T = {
  bg: "#F5F0E8", bgDark: "#2C3320",
  text: "#1a1a1a", textMid: "#4a4a4a",
  orange: "#4C5A43", orangeD: "#2C3320", orangeL: "#5C6B53",
  white: "#ffffff", border: "rgba(26,26,26,0.12)",
};

const getApiBase = () => {
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
    if (isLocal) {
      return `http://${hostname}:5000`;
    }
  }
  return process.env.REACT_APP_API_URL || "https://wishstone.onrender.com";
};

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }
  const base = getApiBase();
  const cleanImg = img.startsWith("/") ? img : `/${img}`;
  return `${base}${cleanImg}`;
};

const PRODUCTS = [];

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
    num: "01",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "Intention Anchoring",
    desc: "Stone ka physical weight ek somatic anchor create karta hai — ek tangible connection apni conscious wish aur physical duniya ke beech.",
    tag: "NEUROSCIENCE-BACKED",
    image: "/wishstone-horizontal.jpeg"
  },
  {
    num: "02",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M11 3 8 9l4 13 4-13-3-6" />
        <path d="M2 9h20" />
      </svg>
    ),
    title: "Frequency Activation",
    desc: "Specific crystal formations jo apni personal energy field ko tune karti hain — clarity, abundance, aur love attract karo.",
    tag: "CRYSTAL SCIENCE",
    image: "/cosmic-eye.jpeg"
  },
  {
    num: "03",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M12 20A7 7 0 0 1 10.8 6.1C16.5 5 18 4.48 20 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
        <path d="M20 2c-2.26 4.33-5.27 7.14-8 8" />
      </svg>
    ),
    title: "Earth Grounding",
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,900&family=Noto+Serif+Devanagari:wght@700;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:#F5F0E8;color:#1a1a1a;font-family:'Open Sans',sans-serif;overflow-x:hidden;}
  body, body *, html, html * {
    font-family: 'Open Sans', sans-serif !important;
  }
  .benefits-grid-layout {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 24px;
    width: 100%;
  }
  @media (max-width: 991px) {
    .benefits-grid-layout {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#F5F0E8;}
  ::-webkit-scrollbar-thumb{background:var(--accent-color, #4C5A43);border-radius:3px;}
  @keyframes autoScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .scroll-hide::-webkit-scrollbar{display:none;}
  .scroll-hide{-ms-overflow-style:none;scrollbar-width:none;}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes navProductMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .nav-marquee-container {
    margin: 0.5rem -1.5rem 1rem -1.5rem;
    padding: 0.6rem 0;
    overflow: hidden;
    background: rgba(0,0,0,0.02);
    border-top: 1px solid rgba(0,0,0,0.05);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    position: relative;
  }
  .nav-marquee-track {
    display: flex;
    width: max-content;
    animation: navProductMarquee 18s linear infinite;
  }
  .nav-marquee-container:hover .nav-marquee-track {
    animation-play-state: paused;
  }
  .sidebar-link {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    padding: 16px 4px !important;
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    color: #1a1a1a !important;
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    border-radius: 0px !important;
    cursor: pointer !important;
    text-align: left !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    position: relative !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }
  .sidebar-link:hover {
    color: #4C5A43 !important;
    padding-left: 10px !important;
  }
  .sidebar-link.active {
    color: #4C5A43 !important;
    font-weight: 800 !important;
    padding-left: 10px !important;
  }
  .sidebar-link .chevron-icon {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
  }
  .sidebar-link:hover .chevron-icon {
    color: #4C5A43;
    transform: translateX(4px);
  }
  .sidebar-link.active .chevron-icon {
    color: #4C5A43;
  }
  .sidebar-showcase-row {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding: 0 2px;
  }
  .sidebar-showcase-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s ease;
  }
  .sidebar-showcase-card:hover {
    transform: translateY(-2px);
  }
  .sidebar-showcase-img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 10px;
    border: 1.2px solid rgba(76,90,67,0.12);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    background: #fff;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .sidebar-showcase-card:hover .sidebar-showcase-img {
    box-shadow: 0 8px 18px rgba(76,90,67,0.15);
    border-color: rgba(76, 90, 67, 0.25);
    transform: translateY(-2px);
  }
  .sidebar-showcase-title {
    margin-top: 6px;
    font-size: 0.62rem;
    font-weight: 700;
    color: #1a1a1a;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .sidebar-follow-title {
    font-size: 0.65rem;
    font-weight: 800;
    color: #8a8a7a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
    margin-top: 0.5rem;
  }
  .sidebar-social-row {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 0.2rem;
  }
  .sidebar-social-icon {
    color: #1a1a1a;
    transition: color 0.2s ease, transform 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sidebar-social-icon:hover {
    color: #4C5A43;
    transform: scale(1.15);
  }
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
  .nav-link{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#1a1a1a;padding:4px 0;transition:color 0.2s;position:relative;overflow:hidden;}
  .nav-link:hover,.nav-link.active{color:var(--accent-color, #4C5A43);}
  .nav-link::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(76,90,67,0.15),transparent);transition:left 0.4s ease;pointer-events:none;}
  .nav-link:hover::after{left:140%;}
  @keyframes navShine {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .nav-link-shine {
    position: relative;
    background: linear-gradient(120deg, #1a1a1a 30%, #5A6651 45%, #ffffff 50%, #5A6651 55%, #1a1a1a 70%) !important;
    background-size: 200% auto !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    color: transparent !important;
    animation: navShine 3s linear infinite !important;
  }
  .nav-link-shine:hover, .nav-link-shine.active {
    background: linear-gradient(120deg, #4C5A43 30%, #5A6651 45%, #ffffff 50%, #5A6651 55%, #4C5A43 70%) !important;
    background-size: 200% auto !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    color: transparent !important;
  }
  .prod-card{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,0.03);transition:transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);cursor:pointer;}
  .prod-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 24px 60px rgba(0,0,0,0.08);}
  .btn-orange{background:linear-gradient(135deg,#4C5A43,#5C6B53);border:none;color:#fff;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;letter-spacing:0.06em;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);box-shadow:0 4px 14px rgba(76,90,67,0.2);}
  .btn-orange:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 30px rgba(76,90,67,0.45);background:linear-gradient(135deg,#5C6B53,#4C5A43);filter:brightness(1.05);}
  .btn-orange:active{transform:translateY(-1px) scale(0.98);box-shadow:0 6px 18px rgba(76,90,67,0.3);}
  .btn-outline{background:transparent;border:1.5px solid #1a1a1a;color:#1a1a1a;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;letter-spacing:0.06em;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);}
  .btn-outline:hover{background:#1a1a1a;color:#F5F0E8;border-color:#1a1a1a;transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.08);}
  .btn-outline:active{transform:translateY(-1px);}
  .max-w{max-width:1200px;margin:0 auto;width:100%;}
  .power-card{background:#fff;border-radius:16px;padding:1.8rem 1.6rem;box-shadow:0 12px 32px rgba(0,0,0,0.03);transition:transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);}
  .power-card:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 20px 48px rgba(76,90,67,0.08);}
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
    transition:transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    background:#1a1a1a;
  }
  .video-card:hover{
    transform:scale(1.03) translateY(-6px);
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
    .hero-badge{display:none !important;}
    .hero-mobile-badges{display:flex !important;}
    .hero-right-col{flex-direction:column !important; min-height:auto !important; padding-bottom: 2rem !important;}
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
    .hero-text-col{text-align:left !important; align-items:flex-start !important;}
    .hero-divider-mobile{display:flex !important;}
    .hero-right-col{justify-content:center; margin-top:2rem;}
  }
  @media(max-width:600px){
    .prod-grid{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
    .stats-row > div{flex:1 1 45% !important;}
    .hero-badge{display:none !important;}
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
  }
  .homepage-font-override,
  .homepage-font-override * {
    font-family: 'Open Sans', sans-serif !important;
  }
  .homepage-font-override h1,
  .homepage-font-override h1 *,
  .homepage-font-override h2,
  .homepage-font-override h2 *,
  .homepage-font-override h3,
  .homepage-font-override h3 *,
  .homepage-font-override h4,
  .homepage-font-override h4 *,
  .homepage-font-override h5,
  .homepage-font-override h5 *,
  .homepage-font-override h6,
  .homepage-font-override h6 * {
    font-family: 'Open Sans', sans-serif !important;
    letter-spacing: -0.015em !important;
    line-height: 1.25 !important;
  }
  .cta-link {
    position: relative;
    padding-bottom: 2px;
  }
  .cta-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1.5px;
    background: currentColor;
    transition: width 0.3s ease;
    transform: translateX(-50%);
  }
  .cta-link:hover::after {
    width: 100%;
  }
  .hero-mobile-badges {
    display: none;
  }
  @keyframes premiumFadeUp {
    0% {
      opacity: 0;
      transform: translateY(24px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .premium-fade-up {
    animation: premiumFadeUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @media (max-width: 768px) {
    .wishlist-features-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .wishlist-divider {
      display: none !important;
    }
  }
  @keyframes badgeFloat1{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
  @keyframes badgeFloat2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
  @keyframes badgeFloat3{0%,100%{transform:translateY(0px)}50%{transform:translateY(-5px)}}
  .sidebar-promo-glass:hover .shine-effect {
    left: 150% !important;
    transition: left 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .hero-text-col { text-align: center; display: flex; flex-direction: column; align-items: center; }
  .hero-divider-mobile { display: none; }`;

// ─── HEADER ───────────────────────────────────────────────────
function Header({ cartCount, wishCount, onNav, currentPage, user, onLogout }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);
  const [cartAnim, setCartAnim] = useState(false);
  const prevWishCount = useRef(wishCount);
  const prevCartCount = useRef(cartCount);
  const [navProducts, setNavProducts] = useState([]);

  useEffect(() => {
    if (mobileOpen) {
      const API = getApiBase();
      fetch(`${API}/api/products?limit=8`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.products) {
            setNavProducts(d.products);
          }
        })
        .catch(() => { });
    }
  }, [mobileOpen]);

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

  // Prevent background scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [["products", "Our Collection"], ["rituals", "The Ritual"], ["benefits", "Benefits"], ["stories", "Stories"]];
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
            <button
              key={k}
              className={`nav-link${currentPage === k ? " active" : ""}${l === "Our Collection" ? " nav-link-shine" : ""}`}
              onClick={() => navTo(k)}
            >
              {l}
            </button>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={wishCount > 0 ? "3" : "2"} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.25s ease", display: "block", animation: wishAnim ? "wishJump 0.6s cubic-bezier(0.36,0.07,0.19,0.97)" : "none" }}>
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

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#000000",
                zIndex: 9999,
              }}
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "300px",
                maxWidth: "85vw",
                height: "100dvh",
                background: T.white,
                boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
                borderLeft: "1px solid rgba(76, 90, 67, 0.12)",
                zIndex: 10000,
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem 1.25rem",
                boxSizing: "border-box",
                overflow: "hidden"
              }}
            >
              {/* Soft Leaf Shadow Overlay - Top Right */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "220px",
                pointerEvents: "none",
                opacity: 0.04,
                zIndex: 0,
                overflow: "hidden"
              }}>
                <svg width="100%" height="100%" viewBox="0 0 120 180" fill="#4C5A43">
                  <path d="M120,0 Q60,60 0,90" stroke="#4C5A43" strokeWidth="1.5" fill="none" />
                  <path d="M100,20 C85,25 75,15 80,5 C85,-5 95,5 100,20 Z" />
                  <path d="M85,35 C70,40 60,30 65,20 C70,10 80,20 85,35 Z" />
                  <path d="M70,50 C55,55 45,45 50,35 C55,25 65,35 70,50 Z" />
                  <path d="M55,65 C40,70 30,60 35,50 C40,40 50,50 55,65 Z" />
                  <path d="M40,80 C25,85 15,75 20,65 C25,55 35,65 40,80 Z" />
                </svg>
              </div>

              {/* Soft Leaf Shadow Overlay - Bottom Left */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "150px",
                height: "200px",
                pointerEvents: "none",
                opacity: 0.04,
                zIndex: 0,
                overflow: "hidden"
              }}>
                <svg width="100%" height="100%" viewBox="0 0 120 160" fill="#4C5A43" style={{ transform: "scaleX(-1) scaleY(-1)" }}>
                  <path d="M120,0 Q60,60 0,90" stroke="#4C5A43" strokeWidth="1.5" fill="none" />
                  <path d="M100,20 C85,25 75,15 80,5 C85,-5 95,5 100,20 Z" />
                  <path d="M85,35 C70,40 60,30 65,20 C70,10 80,20 85,35 Z" />
                  <path d="M70,50 C55,55 45,45 50,35 C55,25 65,35 70,50 Z" />
                  <path d="M55,65 C40,70 30,60 35,50 C40,40 50,50 55,65 Z" />
                </svg>
              </div>

              {/* Close Button & Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexShrink: 0, zIndex: 1 }}>
                <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 24, width: "auto" }} />
                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "1.5rem", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Scrollable middle container (Logo ke niche and Shop links ke upar marquee showcase) */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.2rem", paddingRight: 2, zIndex: 1 }} className="scroll-hide">
                {/* 3 Square Category Cards */}
                <div className="sidebar-showcase-row">
                  {[
                    { name: "WishStone", key: "wishstone", slug: "manifestation", image: "/wishstone-horizontal.jpeg", title: "Wishstone" },
                    { name: "Cosmic Eye", key: "cosmic", slug: "therapy", image: "/cosmic-eye.jpeg", title: "Cosmic Eye" },
                    { name: "Habit Builder", key: "habit", slug: "habit-builder", image: "/defuser-product.jpeg", title: "Habit Builder" }
                  ].map((item, idx) => {
                    const matchedProduct = navProducts.find(p => p.name.toLowerCase().includes(item.key));
                    const targetAction = () => {
                      if (matchedProduct) {
                        navigate("/product/" + (matchedProduct._id || matchedProduct.id));
                      } else {
                        navigate("/shop", { state: { category: item.slug } });
                      }
                      setMobileOpen(false);
                    };
                    return (
                      <div key={idx} className="sidebar-showcase-card" onClick={targetAction}>
                        <img src={`${process.env.PUBLIC_URL || ""}${item.image}`} alt={item.name} className="sidebar-showcase-img" />
                        <div className="sidebar-showcase-title">{item.title}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Promotional Banner */}
                <motion.div
                  className="sidebar-promo-glass"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 12px 30px rgba(76, 90, 67, 0.12)"
                  }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  style={{
                    flexShrink: 0,
                    margin: "0.2rem 0 0.8rem 0",
                    width: "100%",
                    height: "115px",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 6px 20px rgba(76, 90, 67, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    background: "linear-gradient(135deg, #C1C6B4 0%, #9FA693 100%)",
                    display: "flex",
                    position: "relative",
                    cursor: "pointer"
                  }}
                >
                  {/* Shining sweep effect overlay */}
                  <div
                    className="shine-effect"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-150%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
                      transform: "skewX(-20deg)",
                      transition: "none",
                      pointerEvents: "none",
                      zIndex: 3
                    }}
                  />

                  {/* Left Side: HTML Text */}
                  <div style={{
                    width: "58%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: "14px",
                    textAlign: "left",
                    zIndex: 2,
                    position: "relative"
                  }}>
                    {/* Lotus + Tag */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "8px" }}>🧘</span>
                      <span style={{ fontSize: "7.5px", fontWeight: 700, color: "#4C5A43", letterSpacing: "1.2px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                        Meditation • Wellness
                      </span>
                    </div>

                    {/* Title */}
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#2C3320",
                      marginTop: "5px",
                      letterSpacing: "0.2px",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      SACRED DISCOUNT
                    </h4>

                    {/* Subtitle / Value */}
                    <div style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#ffffff",
                      marginTop: "2px",
                      letterSpacing: "0.5px",
                      textShadow: "0 1px 2px rgba(44,51,32,0.15)",
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      UP TO 40% OFF
                    </div>

                    {/* Quote */}
                    <div style={{
                      fontSize: "7.5px",
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.85)",
                      marginTop: "5px",
                      lineHeight: "1.2",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      What you seek is seeking you.<br />Align your frequency.
                    </div>
                  </div>

                  {/* Right Side: Image and Overlay */}
                  <div style={{
                    width: "42%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <img
                      src={`${process.env.PUBLIC_URL || ""}/wishstone-promo-banner.png?v=1.1`}
                      alt="Promo Man"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "85% center",
                        display: "block"
                      }}
                    />
                    {/* Soft gradient blend on the left of the image */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, #9FA693 0%, transparent 35%)",
                      pointerEvents: "none"
                    }} />
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0px", width: "100%" }}>
                  {links.map(([k, l]) => (
                    <button
                      key={k}
                      onClick={() => navTo(k)}
                      className={`sidebar-link${currentPage === k ? " active" : ""}`}
                    >
                      <span>{l}</span>
                      {k === "products" ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9381e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      ) : (
                        <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons and Follow Us at the bottom (always visible) */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.8rem", flexShrink: 0, paddingTop: "1rem", borderTop: `1px solid ${T.border}` }}>
                {user ? (
                  <button className="btn-orange" onClick={() => navTo("dashboard")} style={{ padding: "12px", fontSize: "0.8rem", borderRadius: 8, width: "100%", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>My Account</button>
                ) : (
                  <button className="btn-outline" onClick={() => navTo("auth")} style={{ padding: "12px", fontSize: "0.8rem", borderRadius: 8, width: "100%", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Log In</button>
                )}

                {/* "Follow Us" social icons */}
                <div style={{ textAlign: "center", marginTop: "0.1rem" }}>
                  <div className="sidebar-follow-title" style={{ marginBottom: "0.4rem", marginTop: "0.2rem" }}>Follow Us</div>
                  <div className="sidebar-social-row" style={{ justifyContent: "center", gap: "14px" }}>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="sidebar-social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="sidebar-social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="sidebar-social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="sidebar-social-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                      </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="sidebar-social-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── HERO — TEXT CENTERED ─────────────────────────────────────
function Hero({ onShop, onRitual }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  const [rot, setRot] = useState({ x: 6, y: -18 });
  const [dragging, setDragging] = useState(false);
  const [last, setLast] = useState({ x: 0, y: 0 });
  const [autoAnim, setAutoAnim] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  /* ── MOBILE HERO ── */
  if (isMobile) return (
    <section style={{ background:T.bg, display:"flex", flexDirection:"column", minHeight:"100svh", position:"relative", overflow:"hidden" }}>

      {/* TOP — text */}
      <div style={{ padding:"80px 1.4rem 1.6rem", flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-start", position:"relative", zIndex:2 }}>

        {/* 4-pointed star */}
        <div style={{ marginBottom:"1rem" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="#8D7A5B" opacity="0.9"/>
          </svg>
        </div>

        {/* Sub-label */}
        <p style={{ fontSize:"0.8rem", color:"#5a5a4a", fontWeight:400, marginBottom:"0.6rem", lineHeight:1.4 }}>
          India's <span style={{ color:"#8D7A5B", fontStyle:"italic", fontWeight:600 }}>Sacred</span> Manifestation Stone
        </p>

        {/* Big heading */}
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.8rem,11vw,3.6rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-0.025em", color:"#1a1a1a", margin:"0 0 0.7rem" }}>
          Turn<br />Intentions<br /><span style={{ color:"#8D7A5B", fontStyle:"italic" }}>into{" "}
          <span style={{ color:"#8D7A5B" }}>Reality</span></span><sup style={{ color:"#8D7A5B", fontSize:"0.38em", fontStyle:"normal", verticalAlign:"super", marginLeft:2 }}>✦</sup>
        </h1>

        {/* Gold divider */}
        <div style={{ display:"flex", alignItems:"center", gap:8, margin:"0.85rem 0 1rem" }}>
          <div style={{ width:60, height:1, background:"linear-gradient(90deg,#8D7A5B,rgba(141,122,91,0.1))" }} />
          <span style={{ color:"#8D7A5B", fontSize:9, lineHeight:1 }}>✦</span>
        </div>

        {/* Paragraph */}
        <p style={{ fontSize:"0.9rem", color:"#4a4a3a", lineHeight:1.7, marginBottom:"1.6rem", maxWidth:340 }}>
          Create mindful daily rituals that help you manifest your goals, cultivate inner peace, and stay aligned with the life you want to create.
        </p>

        {/* CTA */}
        <button
          onClick={onRitual}
          style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#1e2618", color:"#fff", border:"none", padding:"14px 22px", borderRadius:8, fontSize:"0.88rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em", alignSelf:"flex-start" }}
        >
          Explore Rituals
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* BOTTOM — stone scene */}
      <div style={{ position:"relative", width:"100%", height:"58vw", minHeight:220, overflow:"hidden", flexShrink:0 }}>

        {/* Sandy warm bg */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 65% 40%, #e2d5c0 0%, #cfc0a8 45%, #bfae98 100%)" }} />

        {/* Large soft circle behind stone */}
        <div style={{ position:"absolute", right:"-8%", top:"50%", transform:"translateY(-50%)", width:"72vw", height:"72vw", maxWidth:300, maxHeight:300, borderRadius:"50%", background:"rgba(200,185,162,0.45)", pointerEvents:"none" }} />

        {/* Leaf branch — right side */}
        <div style={{ position:"absolute", top:"-4%", right:"-2%", width:"48%", height:"110%", opacity:0.5, pointerEvents:"none", overflow:"hidden" }}>
          <svg viewBox="0 0 160 260" width="100%" height="100%" preserveAspectRatio="xMaxYMin meet">
            <path d="M140,0 Q95,45 85,95 Q75,145 100,185 Q115,210 100,240 Q88,258 80,260" stroke="#4a5e38" strokeWidth="1.8" fill="none" opacity="0.6"/>
            <ellipse cx="122" cy="30" rx="25" ry="12" fill="#5a7048" transform="rotate(-28 122 30)" opacity="0.62"/>
            <ellipse cx="105" cy="55" rx="23" ry="11" fill="#4a5e38" transform="rotate(-38 105 55)" opacity="0.58"/>
            <ellipse cx="128" cy="78" rx="27" ry="12" fill="#5a7048" transform="rotate(-22 128 78)" opacity="0.6"/>
            <ellipse cx="100" cy="102" rx="22" ry="10" fill="#4a5e38" transform="rotate(-42 100 102)" opacity="0.55"/>
            <ellipse cx="122" cy="124" rx="25" ry="11" fill="#5a7048" transform="rotate(-20 122 124)" opacity="0.58"/>
            <ellipse cx="96" cy="148" rx="20" ry="9" fill="#4a5e38" transform="rotate(-40 96 148)" opacity="0.5"/>
            <ellipse cx="118" cy="168" rx="23" ry="10" fill="#5a7048" transform="rotate(-25 118 168)" opacity="0.52"/>
          </svg>
        </div>

        {/* CSS Wishstone on slab */}
        <div style={{ position:"absolute", bottom:0, right:"10%", display:"flex", flexDirection:"column", alignItems:"center", width:"50%", paddingBottom:"2%" }}>
          {/* Stone */}
          <div style={{ width:"62%", aspectRatio:"1.25/1", borderRadius:"48% 52% 50% 50% / 50% 50% 52% 48%", background:"radial-gradient(ellipse at 35% 28%, #6e6e66 0%, #3c3c38 38%, #252522 68%, #18181520 100%)", boxShadow:"0 16px 44px rgba(0,0,0,0.48), inset 0 -8px 18px rgba(0,0,0,0.32), inset 0 6px 14px rgba(255,255,255,0.06)", position:"relative", marginBottom:"-3%" }}>
            {/* White stripe line */}
            <div style={{ position:"absolute", top:"46%", left:"16%", width:"68%", height:"1.5px", background:"rgba(255,255,255,0.28)", borderRadius:2, transform:"rotate(-4deg)" }} />
            {/* Subtle top highlight */}
            <div style={{ position:"absolute", top:"18%", left:"22%", width:"28%", height:"20%", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)", filter:"blur(3px)" }} />
            {/* Drop shadow */}
            <div style={{ position:"absolute", bottom:-6, left:"12%", width:"76%", height:8, borderRadius:"50%", background:"rgba(0,0,0,0.2)", filter:"blur(5px)" }} />
          </div>
          {/* Slab */}
          <div style={{ width:"100%", height:"clamp(24px,7vw,38px)", background:"linear-gradient(180deg,#c2b090 0%,#ae9b7c 55%,#9e8b6c 100%)", borderRadius:"5px 5px 3px 3px", boxShadow:"0 6px 20px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,255,0.14)" }} />
        </div>

        {/* SCROLL indicator */}
        <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, pointerEvents:"none" }}>
          <div style={{ width:1, height:16, background:"rgba(76,90,67,0.4)", borderRadius:1 }} />
          <span style={{ fontSize:"0.5rem", fontWeight:700, color:"rgba(76,90,67,0.6)", letterSpacing:"0.22em", textTransform:"uppercase" }}>SCROLL</span>
        </div>
      </div>
    </section>
  );

  /* ── DESKTOP HERO (unchanged) ── */
  return (
    <section style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", paddingTop:80, paddingBottom:40, paddingLeft:"clamp(1rem,5vw,3.5rem)", paddingRight:"clamp(1rem,5vw,3.5rem)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"18%", right:"6%", width:8, height:8, borderRadius:"50%", background:"#4C5A43", opacity:0.5 }} />
      <div style={{ position:"absolute", bottom:"28%", right:"32%", width:6, height:6, borderRadius:"50%", background:"#4C5A43", opacity:0.4 }} />
      <div className="max-w hero-grid" style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5rem", alignItems:"center" }}>
        {/* LEFT */}
        <div style={{ animation:"fadeUp 0.8s ease both", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(76,90,67,0.08)", border:"1px solid rgba(76,90,67,0.22)", borderRadius:20, paddingTop:5, paddingBottom:5, paddingLeft:14, paddingRight:14, marginBottom:"1.2rem" }}>
            <span style={{ color:"#4C5A43", fontSize:10 }}>✦</span>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#4C5A43", letterSpacing:"0.18em", textTransform:"uppercase" }}>India's Sacred Manifestation Stone</span>
          </div>
          <h1 style={{ fontSize:"clamp(2.2rem,5.2vw,3.8rem)", fontWeight:900, lineHeight:1.18, letterSpacing:"-0.02em", marginBottom:"1.2rem", color:T.text }}>
            Turn Intentions <br />
            <span style={{ color:"#4C5A43", fontStyle:"italic" }}>into Reality</span>
          </h1>
          <p style={{ fontSize:"clamp(0.85rem,1.2vw,0.96rem)", color:T.textMid, lineHeight:1.6, marginBottom:"1.6rem", maxWidth:500 }}>
            Create mindful daily rituals that help you manifest your goals, cultivate inner peace, and stay aligned with the life you want to create.
          </p>
          <div style={{ display:"flex", gap:"0.8rem", flexWrap:"wrap", justifyContent:"center" }}>
            <button className="btn-orange" onClick={onShop} style={{ paddingTop:13, paddingBottom:13, paddingLeft:26, paddingRight:26, fontSize:"0.82rem", borderRadius:8 }}>Begin Your Journey</button>
            <button className="btn-outline" onClick={onRitual} style={{ paddingTop:13, paddingBottom:13, paddingLeft:26, paddingRight:26, fontSize:"0.82rem", borderRadius:8 }}>The Ritual</button>
          </div>
        </div>
        {/* RIGHT: 3D Stone */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", minHeight:"clamp(320px,45vw,520px)", perspective:"900px" }}
          onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", fontSize:"0.62rem", color:T.textMid, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, opacity:0.6, whiteSpace:"nowrap", zIndex:10 }}>↔ Drag to rotate</div>
          <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            style={{ position:"relative", zIndex:2, transformStyle:"preserve-3d", transform:autoAnim?undefined:`rotateX(${rot.x}deg) rotateY(${rot.y}deg)`, animation:autoAnim?"stone3d 8s ease-in-out infinite":"none", cursor:dragging?"grabbing":"grab", transition:dragging?"none":"transform 0.4s ease", userSelect:"none" }}>
            <div style={{ width:"clamp(190px,24vw,300px)", height:"clamp(230px,30vw,360px)", borderRadius:"50% 50% 48% 52% / 55% 55% 45% 45%", background:"radial-gradient(ellipse at 32% 28%, #f5b070 0%, #38271a 40%, #120c08 65%, #181716 100%)", boxShadow:"0 40px 100px rgba(76,90,67,0.55), 0 0 0 1px rgba(76,90,67,0.12), inset 0 -25px 50px rgba(0,0,0,0.25), inset 0 12px 35px rgba(255,210,130,0.35)", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:"18%", left:"22%", width:"35%", height:"28%", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,230,180,0.75) 0%, transparent 70%)", filter:"blur(6px)" }} />
              <div style={{ position:"absolute", top:"10%", left:"15%", width:"20%", height:"14%", borderRadius:"50%", background:"rgba(255,245,220,0.45)", filter:"blur(4px)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"35%", background:"linear-gradient(to top, rgba(0,0,0,0.3), transparent)", borderRadius:"0 0 50% 50%" }} />
            </div>
            <div style={{ position:"absolute", bottom:-18, left:"50%", transform:"translateX(-50%)", width:"70%", height:20, borderRadius:"50%", background:"rgba(76,90,67,0.22)", filter:"blur(10px)" }} />
          </div>
          <div className="hero-badge" style={{ position:"absolute", top:"14%", left:"0%", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.08)", display:"flex", alignItems:"center", gap:10, minWidth:148, zIndex:3, animation:"badgeFloat1 4s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#6C7E61,#4C5A43)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🧘</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Mental Peace</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Inner Clarity</div></div>
          </div>
          <div className="hero-badge" style={{ position:"absolute", top:"40%", right:"-4%", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.08)", display:"flex", alignItems:"center", gap:10, minWidth:158, zIndex:3, animation:"badgeFloat2 4.5s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#7E8F73,#5F6E54)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🎯</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Manifestation</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Intention Setting</div></div>
          </div>
          <div className="hero-badge" style={{ position:"absolute", bottom:"12%", left:"4%", background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:14, paddingTop:10, paddingBottom:10, paddingLeft:14, paddingRight:14, boxShadow:"0 8px 32px rgba(0,0,0,0.08)", display:"flex", alignItems:"center", gap:10, minWidth:148, zIndex:3, animation:"badgeFloat3 5s ease-in-out infinite" }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#8D9F83,#6D7F64)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>✨</div>
            <div><div style={{ fontSize:"0.78rem", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>Positive Energy</div><div style={{ fontSize:"0.63rem", color:T.textMid }}>Mindfulness</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────
function StatsBar() {
  return (
    <div className="premium-fade-up" style={{ background: T.bg, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "28px clamp(1.5rem,5vw,3.5rem)" }}>
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
          <span key={i} style={{ color: t === "WishStone" ? "#4C5A43" : "rgba(255,255,255,0.65)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", fontStyle: "italic", padding: "0 1.8rem", whiteSpace: "nowrap", fontFamily: "'Playfair Display',serif" }}>
            {t}
            {i < doubled.length - 1 && <span style={{ color: "#4C5A43", margin: "0 0.5rem" }}>•</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

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
    <section style={{ background: "linear-gradient(180deg, #F4F6F2 0%, #EAEFE7 100%)", paddingTop: "90px", paddingBottom: "90px", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div className="premium-fade-up" style={{ textAlign: "center", marginBottom: "3.5rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ height: 1, width: 50, background: "linear-gradient(to right, transparent, #4C5A43)" }} />
          <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#4C5A43", letterSpacing: "0.28em", textTransform: "uppercase" }}>From Our Community</span>
          <div style={{ height: 1, width: 50, background: "linear-gradient(to left, transparent, #4C5A43)" }} />
        </div>
        <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#2C3320", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
          Poetry by the<br /><em style={{ color: "#4C5A43", fontStyle: "italic" }}>Community</em>
        </h2>
        <p style={{ color: "#5C6654", fontSize: "0.86rem", marginTop: "0.8rem", fontStyle: "italic", fontWeight: 500 }}>Real moments. Real intention. Real transformation.</p>
      </div>

      {/* Video Strip */}
      <div className="premium-fade-up" style={{ overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", display: "flex", gap: "1.5rem", paddingLeft: "clamp(1rem,4vw,3rem)", paddingRight: "clamp(1rem,4vw,3rem)", paddingBottom: 12, scrollbarWidth: "none" }}>
        {COMMUNITY_VIDEOS.map((v, i) => (
          <div
            key={v.id}
            onClick={() => handleClick(i)}
            style={{
              flex: "0 0 220px",
              aspectRatio: "9/16",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              scrollSnapAlign: "start",
              border: activeVideo === i ? "2px solid #4C5A43" : "1px solid rgba(76, 90, 67, 0.15)",
              boxShadow: activeVideo === i ? "0 20px 48px rgba(76, 90, 67, 0.25)" : "0 8px 30px rgba(0,0,0,0.08)",
              transform: activeVideo === i ? "scale(1.04) translateY(-4px)" : "scale(1)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease",
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
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)", borderRadius: "0 0 24px 24px", padding: "1.4rem 1.1rem 1.1rem", pointerEvents: "none" }}>
              <div style={{ display: "inline-block", background: "rgba(76, 90, 67, 0.92)", color: "#fff", borderRadius: 4, padding: "3px 8px", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{v.tag}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "0.2rem", fontStyle: "italic" }}>{v.title}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{v.caption}</div>
            </div>
            {/* Play/Pause button — only on active video */}
            {activeVideo === i && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.35)", opacity: playing ? 0 : 1, transition: "opacity 0.3s" }}>
                  <span style={{ fontSize: 22, color: "#fff", marginLeft: playing ? 0 : 4 }}>{playing ? "⏸" : "▶"}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: "center", marginTop: "3.5rem" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#4C5A43", fontSize: "0.72rem", fontWeight: 700 }}>

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
        <div className="premium-fade-up" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 40, background: "#4C5A43" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase" }}>WishStone की शक्ति</span>
            <div style={{ height: 1, width: 40, background: "#4C5A43" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: T.text, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
            Three Powers to <em style={{ color: "#4C5A43", fontStyle: "italic" }}>Amplify</em><br />Your Manifestation
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="prod-grid premium-fade-up">
          {POWERS.map(p => (
            <div key={p.num} className="power-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}>
              <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                <img referrerPolicy="no-referrer" src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
                <div style={{ position: "absolute", top: 12, left: 12, width: 38, height: 38, borderRadius: "50%", background: "#ffffff", border: "1.5px solid #000000", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>{p.icon}</div>
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: "1.6rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{p.num}</span>
              </div>
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.8rem", color: T.textMid, lineHeight: 1.65, marginBottom: "1rem", flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: T.textMid, letterSpacing: "0.14em", border: `1px solid ${T.border}`, borderRadius: 3, padding: "3px 8px" }}>{p.tag}</span>
                  <button onClick={() => handleLearnMore(p.num)} className="cta-link" style={{ background: "none", border: "none", cursor: "pointer", color: "#4C5A43", fontSize: "0.75rem", fontWeight: 700, display: "inline-flex", alignItems: "center", fontFamily: "'Inter',sans-serif" }}>
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
    <section style={{ background: "radial-gradient(circle at center, #2e3b24 0%, #171d11 100%)", padding: "64px clamp(1.5rem,5vw,3.5rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(232,114,12,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="max-w" style={{ maxWidth: 760, position: "relative" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#F48B29", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ color: "#F48B29" }}>✦</span> Daily Manifestation Oracle <span style={{ color: "#F48B29" }}>✦</span>
        </div>
        <blockquote key={key} style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.2rem,2.8vw,1.75rem)", fontWeight: 700, color: "#F5F0E8", lineHeight: 1.6, marginBottom: "1.2rem", fontStyle: "italic", animation: "quoteIn 0.5s ease both" }}>
          "{q.text}"
        </blockquote>
        <cite style={{ fontSize: "0.8rem", fontWeight: 700, color: "#F48B29", letterSpacing: "0.2em", textTransform: "uppercase", fontStyle: "normal", display: "block", marginBottom: "1.8rem" }}>— {q.author}</cite>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.2rem" }}>
          <button onClick={() => { setIdx(i => (i - 1 + QUOTES.length) % QUOTES.length); setKey(k => k + 1); }}
            style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid rgba(244,139,41,0.4)`, background: "none", color: "#F48B29", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F48B29"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#F48B29"; }}>‹</button>
          <div style={{ width: 180, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 1.5, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: "#F48B29", borderRadius: 1.5, width: `${((idx + 1) / QUOTES.length) * 100}%`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {QUOTES.map((_, i) => (
              <button key={i} onClick={() => { setIdx(i); setKey(k => k + 1); }} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 4, background: i === idx ? "#F48B29" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
          <button onClick={() => { setIdx(i => (i + 1) % QUOTES.length); setKey(k => k + 1); }}
            style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid rgba(244,139,41,0.4)`, background: "none", color: "#F48B29", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F48B29"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#F48B29"; }}>›</button>
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
        <div className="premium-fade-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ height: 1, width: 40, background: "#4C5A43" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase" }}>The Story Behind WishStone</span>
            <div style={{ height: 1, width: 40, background: "#4C5A43" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: T.text, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
            A Note from Our <em style={{ color: "#4C5A43", fontStyle: "italic" }}>Founders</em>
          </h2>
        </div>

        {/* Card: image left, content right */}
        <div
          className="founder-grid premium-fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 0,
            borderRadius: 24,
            overflow: "hidden",
            border: "none",
            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
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
            <div style={{ display: "none", position: "absolute", inset: 0, background: `linear-gradient(135deg,${T.bgDark},#4C5A43)`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", opacity: 0.8 }}>Vikash Malik</div>
            </div>
            {/* Overlay gradient */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(44,51,32,0.25), rgba(76, 90, 67, 0.08))" }} />

            {/* Founder name card at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.5) 60%, transparent 100%)",
              padding: "2rem 1.5rem 1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#384332,#4C5A43)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>V</div>
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
              background: "rgba(76, 90, 67, 0.08)",
              border: "1px solid rgba(76, 90, 67, 0.2)",
              borderRadius: 20, padding: "5px 14px",
              marginBottom: "1.5rem", width: "fit-content",
            }}>
              <span style={{ color: "#4C5A43", fontSize: 10 }}>✦</span>
              <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.15em", textTransform: "uppercase" }}>A Note from Our Founders</span>
            </div>

            {/* Quote highlight */}
            <blockquote style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1rem,2vw,1.2rem)",
              fontWeight: 700,
              color: "#4C5A43",
              lineHeight: 1.5,
              fontStyle: "italic",
              marginBottom: "1.5rem",
              borderLeft: "3px solid #4C5A43",
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
                    background: "linear-gradient(135deg,#384332,#4C5A43)",
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
    "Our Collection": [
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
              <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 24, width: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 240 }}>India's sacred manifestation stone — hand-crafted with ancient yantra to help you manifest your deepest desires.</p>
            <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.8rem", maxWidth: 240 }}>
              Email: support@wishstone.in<br />
              WhatsApp / Phone: +91 81714 40017
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "0.7rem", fontWeight: 800, color: T.orangeL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.2rem" }}>{title}</h4>
              {links.map(({ label, action }) => (
                <div key={label}
                  onClick={action}
                  style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = T.orangeL}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
                >{label}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>© 2026 WishStone. All rights reserved.</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}></p>
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
    const API_BASE = getApiBase();
    fetch(`${API_BASE}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.products) {
          const mapped = data.products.map(p => ({
            ...p,
            image: getImageUrl(p.images?.[0] || p.image || ""),
            images: (p.images || [p.image]).filter(Boolean).map(getImageUrl),
          }));
          setBackendProducts(mapped);
        }
      })
      .catch(() => { });
  }, []);

  const displayProducts = backendProducts;
  const goToProduct = (p) => {
    const match = backendProducts.find(bp => bp.slug === p.slug || bp.name === p.name || bp.images?.[0] === p.image);
    const realId = match?._id || p._id || p.id;
    navigate(`/product/${realId}`);
  };
  return (
    <div className="homepage-font-override">
      <Hero onShop={onShop} onRitual={onRitual} />
      <StatsBar />
      <MarqueeSection />
      <CommunityVideoSection />
      {/* Auto-Scrolling Products Strip */}
      <section style={{ background: "#fff", paddingTop: "70px", paddingBottom: "70px", overflow: "hidden" }}>
        <div className="max-w premium-fade-up" style={{ paddingLeft: "clamp(1.5rem,5vw,3.5rem)", paddingRight: "clamp(1.5rem,5vw,3.5rem)", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>BEST SELLERS</div>
              <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: T.text, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0 }}>Most Loved Stones</h2>
            </div>
            <button className="btn-outline" onClick={onShop} style={{ padding: "10px 24px", fontSize: "0.78rem", borderRadius: 8 }}>View All →</button>
          </div>
        </div>
        <div className="premium-fade-up" style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", animation: "autoScroll 28s linear infinite", width: "max-content" }}>
            {[...displayProducts, ...displayProducts].map((p, i) => (
              <div key={i} onClick={() => goToProduct(p)} style={{ width: 220, flexShrink: 0, marginRight: "1.2rem", cursor: "pointer" }}>
                <div style={{ borderRadius: 14, overflow: "hidden", border: "none", background: T.bg, boxShadow: "0 12px 32px rgba(0,0,0,0.03)", transition: "transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(76,90,67,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.03)"; }}>
                  <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                    <img referrerPolicy="no-referrer" src={p.image || p.images?.[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {((p.discount !== undefined && p.discount !== null) || (p.originalPrice > p.price)) && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "#4C5A43", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 800 }}>
                        -{p.discount ?? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                      </div>
                    )}
                    {(p.isBestSeller || p.bestSeller) && <div style={{ position: "absolute", bottom: 6, left: 6, background: T.bgDark, color: "#ffffff", borderRadius: 4, padding: "2px 7px", fontSize: "0.58rem", fontWeight: 700 }}>BEST SELLER</div>}
                  </div>
                  <div style={{ padding: "0.9rem" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: "0.9rem", color: "#4C5A43", fontWeight: 700 }}>Rs.{p.price.toLocaleString()}</span>
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
        <div className="max-w premium-fade-up" style={{ maxWidth: 720 }}>
          <div className="premium-fade-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, color: T.text, lineHeight: 1.25, letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
          </div>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 0", textAlign: "left" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: T.text }}>{f.q}</span>
                <span style={{ color: "#4C5A43", fontSize: 20, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, marginLeft: 12 }}>+</span>
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
    const API_BASE = getApiBase();
    fetch(`${API_BASE}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.products) {
          const mapped = data.products.map(p => ({
            ...p,
            image: getImageUrl(p.images?.[0] || p.image || ""),
            images: (p.images || [p.image]).filter(Boolean).map(getImageUrl),
          }));
          setBackendProducts(mapped);
        }
      })
      .catch(() => { });
  }, []);
  const displayProducts = backendProducts;
  const goToProduct = (p) => {
    const match = backendProducts.find(bp => bp.slug === p.slug || bp.name === p.name || bp.images?.[0] === p.image);
    const realId = match?._id || p._id || p.id;
    navigate(`/product/${realId}`);
  };

  return (
    <section style={{ background: "#FFFFFF", paddingTop: "70px", paddingBottom: "70px", overflow: "hidden" }}>
      <div className="max-w" style={{ paddingLeft: "clamp(1.5rem,5vw,3.5rem)", paddingRight: "clamp(1.5rem,5vw,3.5rem)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>BEST SELLERS</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 900, color: "#000000", margin: 0 }}>Most Loved Stones</h2>
          </div>
          <button className="ep-secondary-btn" onClick={onShop} style={{ padding: "10px 24px", fontSize: "0.78rem", borderRadius: 8, cursor: "pointer" }}>View All →</button>
        </div>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", animation: "autoScrollStrip 25s linear infinite", width: "max-content" }}>
          {[...displayProducts, ...displayProducts, ...displayProducts].map((p, i) => (
            <div key={i} onClick={() => goToProduct(p)} style={{ width: 220, flexShrink: 0, marginRight: "1.2rem", cursor: "pointer" }}>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #D9DDD5", background: "#ffffff", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(76,90,67,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                  <img referrerPolicy="no-referrer" src={p.image || p.images?.[0] || ""} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"; }} />
                  <div style={{ width: "100%", height: "100%", background: "#ece9e3", display: "none", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#5A6651" }}>◆</div>
                  {((p.discount !== undefined && p.discount !== null) || (p.originalPrice > p.price)) && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: "#4C5A43", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.6rem", fontWeight: 800 }}>
                      -{p.discount ?? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                    </div>
                  )}
                  {(p.isBestSeller || p.bestSeller) && <div style={{ position: "absolute", bottom: 6, left: 6, background: "#F0F2EE", color: "#4C5A43", border: "1px solid #D9DDD5", borderRadius: 4, padding: "2px 7px", fontSize: "0.58rem", fontWeight: 700 }}>BEST SELLER</div>}
                </div>
                <div style={{ padding: "0.9rem" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#000000", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.9rem", color: "#4C5A43", fontWeight: 700 }}>₹{p.price.toLocaleString()}</span>
                    <span style={{ color: "#4b5563", fontSize: "0.7rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>
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
  const location = useLocation();
  const API_BASE = getApiBase();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (location.state && location.state.category) setFilter(location.state.category);
  }, [location.state]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch { setProducts([]); }
      setLoading(false);
    };
    fetchData();
  }, [API_BASE]);

  const getQty = id => cart.filter(i => i.id === id || i.id === String(id)).reduce((s, i) => s + i.qty, 0);

  const normalize = p => ({
    id: p._id || p.id,
    _id: p._id || String(p.id),
    name: p.name,
    category: p.category?.slug || p.category || "",
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discount: p.discount || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0),
    image: getImageUrl(p.images?.[0] || p.image || ""),
    images: (p.images || [p.image]).filter(Boolean).map(getImageUrl),
    shortDesc: p.shortDesc || "",
    isBestSeller: p.isBestSeller || p.bestSeller || false,
    stock: p.stock ?? 99,
    benefits: p.benefits || [],
  });

  const normalized = products.map(normalize);
  const filtered = normalized.filter(p => filter === "all" || p.category === filter);

  const catTabs = [{ value: "all", label: "All" }, ...categories.map(c => ({ value: c.slug, label: c.name }))];
  const tabs = catTabs.length > 1 ? catTabs : [
    { value: "all", label: "All" },
    { value: "manifestation", label: "Manifestation" },
    { value: "therapy", label: "Therapy" },
    { value: "habit-builder", label: "Habit Builder" },
  ];

  // ── Design constants ──────────────────────────────────────
  const G = "#5A6651";   // green accent
  const GB = "#F5F3EF";   // page bg
  const CR = 16;          // card radius

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');
    .ws-collection-page * { font-family: 'Open Sans', sans-serif !important; }

    @keyframes wsCardIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes wsFadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes wsShimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
    @keyframes wsPulse   { 0%,100%{opacity:1} 50%{opacity:.55} }

    /* ── Page wrapper ── */
    .ws-collection-page { box-sizing:border-box; width:100%; }
    .ws-collection-page *, .ws-collection-page *::before, .ws-collection-page *::after { box-sizing:border-box; }

    /* ── Grid container ── */
    .ws-prod-grid {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1.1rem;
      width:100%;
      max-width:1280px;
      margin:0 auto;
      padding:0 clamp(1rem,3vw,2.5rem) 4rem;
    }

    /* ── Card ── */
    .ws-collection-card {
      display:flex;
      flex-direction:row;
      background:#fff;
      border-radius:${CR}px;
      overflow:hidden;
      border:1px solid rgba(90,102,81,0.12);
      box-shadow:0 4px 20px rgba(90,102,81,0.06);
      cursor:pointer;
      animation:wsCardIn 0.45s ease both;
      transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      min-height:320px;
    }
    .ws-collection-card:hover {
      box-shadow:0 20px 40px rgba(90,102,81,0.18);
      transform:translateY(-6px);
      border-color:#5A6651 !important;
    }

    /* ── Card image column ── */
    .ws-card-img {
      position:relative;
      width:42%;
      min-width:42%;
      margin:12px 0 12px 12px;
      border-radius:12px;
      overflow:hidden;
      border:1px solid rgba(90,102,81,0.12);
      flex-shrink:0;
    }
    .ws-card-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s ease; }
    .ws-collection-card:hover .ws-card-img img { transform:scale(1.07); }
    .ws-card-img::after {
      content:''; position:absolute; inset:0; opacity:0;
      background:linear-gradient(180deg, transparent 50%, rgba(90,102,81,0.18) 100%);
      transition:opacity 0.4s ease; pointer-events:none;
    }
    .ws-collection-card:hover .ws-card-img::after { opacity:1; }

    /* ── Card body column ── */
    .ws-card-body {
      flex:1;
      min-width:0;
      padding:1.1rem 1.1rem 1rem;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      transition:background 0.4s ease;
    }
    .ws-collection-card:hover .ws-card-body { background:linear-gradient(135deg,#fafaf8 0%,#f5f2ec 100%); }
    .ws-collection-card:hover .ws-add-btn { background:#3d4938; }

    /* ── Category pill ── */
    .ws-cat-pill {
      padding:6px 16px; border-radius:20px; font-size:0.72rem; font-weight:600;
      cursor:pointer; transition:all 0.2s;
      border:1.5px solid rgba(90,102,81,0.28);
      background:#fff; color:${G};
      flex-shrink:0;
    }
    .ws-cat-pill.active { background:${G}; color:#fff; border-color:${G}; }

    /* ── Category Row ── */
    .ws-cat-row {
      display:flex;
      gap:8px;
      padding:0 1.5rem 1.5rem;
      justify-content:center;
      flex-wrap:wrap;
    }

    /* ── Add to Cart button ── */
    .ws-add-btn {
      width:100%; padding:12px 0; border-radius:10px;
      background:${G}; color:#fff; border:none; cursor:pointer;
      font-size:0.8rem; font-weight:600; letter-spacing:0.04em;
      display:flex; align-items:center; justify-content:center; gap:7px;
      transition:background 0.2s, transform 0.15s;
    }
    .ws-add-btn:hover { background:#4a5542; transform:translateY(-1px); }

    /* ── Qty row ── */
    .ws-qty-row { width:100%; border-radius:10px; overflow:hidden; display:flex; border:2px solid ${G}; }
    .ws-qty-btn { flex:1; height:40px; background:none; border:none; cursor:pointer; font-size:18px; color:${G}; font-weight:700; transition:background 0.15s; }
    .ws-qty-btn:hover { background:rgba(90,102,81,0.08); }

    /* ── Shimmer ── */
    .ws-shimmer { background:linear-gradient(90deg,#ece9e3 25%,#f5f3ef 50%,#ece9e3 75%); background-size:600px 100%; animation:wsShimmer 1.4s infinite; }
    .ws-shimmer-img-skeleton {
      width:42%;
      min-width:42%;
      margin:12px 0 12px 12px;
      border-radius:12px;
      overflow:hidden;
      flex-shrink:0;
    }

    /* ── Shimmer grid (same as prod grid) ── */
    .ws-shimmer-grid {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:1.1rem;
      width:100%;
      max-width:1280px;
      margin:0 auto;
      padding:0 clamp(1rem,3vw,2.5rem) 4rem;
    }
    .ws-shimmer-card { display:flex; border-radius:${CR}px; overflow:hidden; background:#fff; min-height:320px; box-shadow:0 2px 10px rgba(90,102,81,0.07); }

    /* ── Tablet ── */
    @media(max-width:900px) {
      .ws-prod-grid, .ws-shimmer-grid { gap:0.9rem; }
      .ws-card-img, .ws-shimmer-img-skeleton { width:40% !important; min-width:40% !important; margin:12px 0 12px 12px !important; }
    }

    /* ── Mobile ── */
    @media(max-width:600px) {
      .ws-prod-grid, .ws-shimmer-grid { grid-template-columns:1fr; padding:0 0.85rem 3rem; }
      .ws-collection-card, .ws-shimmer-card { flex-direction:row; min-height:230px; }
      .ws-card-img, .ws-shimmer-img-skeleton { width:42% !important; min-width:42% !important; margin:12px 0 12px 12px !important; }
      .ws-cat-row { justify-content:flex-start; flex-wrap:nowrap; overflow-x:auto; -webkit-overflow-scrolling:touch; }
    }

    /* ── Small phone ── */
    @media(max-width:400px) {
      .ws-collection-card, .ws-shimmer-card { min-height:210px; }
      .ws-card-img, .ws-shimmer-img-skeleton { width:40% !important; min-width:40% !important; margin:10px 0 10px 10px !important; }
      .ws-card-body { padding:0.75rem 0.75rem 0.7rem; }
    }
  `;

  const BenefitIcon = ({ idx }) => {
    const icons = [
      // sun rays
      <svg key={0} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>,
      // target
      <svg key={1} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
      // lotus / flower
      <svg key={2} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c0 0-8-4-8-10a8 8 0 0 1 16 0c0 6-8 10-8 10z" /><path d="M12 22V12" /></svg>,
      // star
      <svg key={3} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
      // heart
      <svg key={4} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    ];
    return icons[idx % icons.length];
  };

  return (
    <div className="ws-collection-page" style={{ background: GB, minHeight: "100vh", paddingTop: 80 }}>
      <style>{css}</style>

      {/* ── PAGE HEADER ── */}
      <div style={{ textAlign: "center", padding: "2rem 1.5rem 1.5rem", animation: "wsFadeIn 0.6s ease" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.22em", color: G, textTransform: "uppercase", marginBottom: "0.6rem" }}>
          HANDPICKED FOR YOU
        </p>
        <h1 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "clamp(1.7rem,5vw,2.6rem)", fontWeight: 700, color: "#2c2c2c", lineHeight: 1.15, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
          Manifest. Believe. Receive.
        </h1>
        {/* decorative diamond */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1 L15 8 L8 15 L1 8 Z" stroke={G} strokeWidth="1.2" fill="none" /><circle cx="8" cy="8" r="1.5" fill={G} /></svg>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#8a8a7a", lineHeight: 1.75, maxWidth: 280, margin: "0 auto" }}>
          Objects with purpose. Energy with intention.<br />Bring meaning into your space and life.
        </p>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="ws-cat-row scroll-hide">
        {tabs.map(({ value, label }) => (
          <button key={value} className={`ws-cat-pill${filter === value ? " active" : ""}`} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      {/* ── PRODUCT LIST ── */}
      <div>
        {loading ? (
          <div className="ws-shimmer-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="ws-shimmer-card">
                <div className="ws-shimmer ws-shimmer-img-skeleton" />
                <div style={{ flex: 1, padding: "1.1rem" }}>
                  <div className="ws-shimmer" style={{ height: 10, borderRadius: 4, marginBottom: 10, width: "55%" }} />
                  <div className="ws-shimmer" style={{ height: 16, borderRadius: 4, marginBottom: 8, width: "80%" }} />
                  <div className="ws-shimmer" style={{ height: 2, borderRadius: 2, marginBottom: 10, width: "20%" }} />
                  <div className="ws-shimmer" style={{ height: 8, borderRadius: 4, marginBottom: 5, width: "95%" }} />
                  <div className="ws-shimmer" style={{ height: 8, borderRadius: 4, marginBottom: 12, width: "70%" }} />
                  <div className="ws-shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 12, width: "40%" }} />
                  <div className="ws-shimmer" style={{ height: 38, borderRadius: 10, width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#8a8a7a" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>No products found.</p>
          </div>
        ) : (
          <div className="ws-prod-grid">
            {filtered.map((p, idx) => {
              const qty = getQty(p.id);
              const delay = `${idx * 0.06}s`;
              return (
                <div key={p._id} className="ws-collection-card" style={{ animationDelay: delay }} onClick={() => onClick(p)}>

                  {/* LEFT — Image */}
                  <div className="ws-card-img">
                    {p.image ? (
                      <img src={p.image} alt={p.name} referrerPolicy="no-referrer"
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = ""; e.currentTarget.style.display = "none"; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <div style={{ width: "100%", height: "100%", background: "#ece9e3", display: p.image ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: G }}>◆</div>
                    {p.discount > 0 && (
                      <div style={{ position: "absolute", top: 10, left: 10, background: G, color: "#fff", borderRadius: 6, padding: "3px 9px", fontSize: "0.68rem", fontWeight: 700, zIndex: 2 }}>
                        -{p.discount}%
                      </div>
                    )}
                    <button onClick={e => { e.stopPropagation(); onWish(e, p.id); }}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(0,0,0,0.12)", zIndex: 2 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth={wished.includes(p.id) ? "3.2" : "2"} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  {/* RIGHT — Details (Minimal) */}
                  <div className="ws-card-body">
                    {p.isBestSeller && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: "0.35rem" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: G, letterSpacing: "0.14em", textTransform: "uppercase" }}>BEST SELLER</span>
                      </div>
                    )}
                    <h3 style={{ fontSize: "clamp(0.92rem,1.4vw,1.05rem)", fontWeight: 600, color: "#2c2c2c", marginBottom: "0.28rem", lineHeight: 1.25 }}>{p.name}</h3>
                    <div style={{ width: 22, height: 2, background: G, borderRadius: 2, marginBottom: "0.4rem", opacity: 0.55 }} />
                    <p style={{ fontSize: "0.72rem", color: G, fontWeight: 700, letterSpacing: "0.06em", marginBottom: "0.6rem", fontStyle: "italic" }}>
                      {(() => {
                        const n = (p.name || "").toLowerCase();
                        if (n.includes("wishstone")) return "Deep Calm";
                        if (n.includes("cosmic")) return "Pure Focus";
                        if (n.includes("diffuser") || n.includes("reed")) return "Vital Energy";
                        if (n.includes("camphor") || n.includes("kapoor")) return "Sacred Purity";
                        if (n.includes("habit")) return "Inner Growth";
                        if (n.includes("candle")) return "Warm Glow";
                        if (n.includes("incense")) return "Soul Cleanse";
                        return "Sacred Energy";
                      })()}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: "0.55rem" }}>
                      <span style={{ fontSize: "clamp(1rem,1.6vw,1.2rem)", fontWeight: 700, color: "#2c2c2c" }}>₹{p.price.toLocaleString("en-IN")}</span>
                      {p.originalPrice > p.price && <span style={{ fontSize: "0.75rem", color: "#b0a89a", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</span>}
                    </div>
                    {p.stock === 0 ? (
                      <button disabled style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#e5e7e3", color: "#9ca3af", border: "none", fontSize: "0.72rem", cursor: "not-allowed" }}>Out of Stock</button>
                    ) : qty > 0 ? (
                      <div className="ws-qty-row" onClick={e => e.stopPropagation()}>
                        <button className="ws-qty-btn" onClick={() => onAdd({ ...p, qty: -1 })}>−</button>
                        <span style={{ flex: 1, textAlign: "center", fontWeight: 700, color: G, fontSize: "0.92rem", display: "flex", alignItems: "center", justifyContent: "center" }}>{qty}</span>
                        <button className="ws-qty-btn" onClick={e => { e.stopPropagation(); onAdd(p); }}>+</button>
                      </div>
                    ) : (
                      <button className="ws-add-btn" onClick={e => { e.stopPropagation(); onAdd(p); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── FOOTER TAGLINE ── */}
        {!loading && (
          <div style={{ textAlign: "center", paddingTop: "1rem", paddingBottom: "2rem", animation: "wsFadeIn 0.8s ease" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginBottom: 8 }}><path d="M8 1 L15 8 L8 15 L1 8 Z" stroke={G} strokeWidth="1.2" fill="none" /><circle cx="8" cy="8" r="1.5" fill={G} /></svg>
            <p style={{ fontSize: "0.75rem", color: "#8a8a7a", lineHeight: 1.7 }}>
              Your intention is the beginning.<br />
              <span style={{ color: G }}>These stones are here to support your journey.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
// ─── PRODUCT DETAIL ───────────────────────────────────────────
function ProductPage({ product: p, onAdd, onAddAnim, onWish, wished, cart, onShop }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("desc");
  const [hoveredCat, setHoveredCat] = useState(null);

  const getCategoryIcon = (slug, color) => {
    if (slug === "manifestation") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transition: "stroke 0.2s ease" }}>
          <path d="M6 3h12l4 6-10 13L2 9z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    }
    if (slug === "therapy") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transition: "stroke 0.2s ease" }}>
          <path d="M12 20A7 7 0 0 1 10.8 6.1C16.5 5 18 4.48 20 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
          <path d="M20 2c-2.26 4.33-5.27 7.14-8 8" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", transition: "stroke 0.2s ease" }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    );
  };

  const categoryMap = {
    "manifestation": {
      slug: "manifestation",
      label: "Manifestation"
    },
    "therapy": {
      slug: "therapy",
      label: "Therapy"
    },
    "habit-builder": {
      slug: "habit-builder",
      label: "Habit Builder"
    }
  };

  const currentCat = p?.category || "manifestation";
  let displayCats = [];
  if (currentCat === "manifestation") {
    displayCats = [categoryMap["therapy"], categoryMap["habit-builder"]];
  } else if (currentCat === "therapy") {
    displayCats = [categoryMap["manifestation"], categoryMap["habit-builder"]];
  } else {
    displayCats = [categoryMap["manifestation"], categoryMap["therapy"]];
  }
  const [activeImg, setActiveImg] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);
  const [faqOpen, setFaqOpen] = useState(-1);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const scrollContainerRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    setIsMouseDown(true);
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const cartQty = cart ? cart.filter(i => i.id === p?.id).reduce((s, i) => s + i.qty, 0) : 0;

  // Sync scroll position when activeImg changes (programmatic transitions only)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isProgrammaticScroll.current) {
      const targetScroll = activeImg * container.clientWidth;
      if (Math.abs(container.scrollLeft - targetScroll) > 10) {
        container.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
      // Reset programmatic flag after smooth scroll completes
      const t = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 350);
      return () => clearTimeout(t);
    }
  }, [activeImg]);

  if (!p) return null;
  const imgs = p.images || [p.image];

  // Add one to cart with animation
  const handleAdd = (e) => { onAddAnim ? onAddAnim(e, p) : onAdd(p); };
  // Remove one from cart
  const handleDec = () => { onAdd({ ...p, qty: -1 }); };

  // Navigate images
  const nextImage = () => {
    isProgrammaticScroll.current = true;
    setActiveImg((prev) => (prev + 1) % imgs.length);
  };
  const prevImage = () => {
    isProgrammaticScroll.current = true;
    setActiveImg((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

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

  // Rich copy generator for SEO
  const getProductRichSEOData = (p) => {
    const slug = p?.slug || "";
    const name = p?.name || "";

    // Wishstone Website 7 Active Products Mapping
    if (slug === "wishstone" || name.toLowerCase().includes("wishstone")) {
      return {
        description: "Wishstone is more than a rock. It's a story. Its been on a 14-year journey across India getting charged at places so now it holds a unique kind of energy. This stone works on two ideas: energy and how your subconscious mind really works. Since your subconscious is a bit mysterious, Wishstone acts as a link. A bridge connecting what you want with the deeper part of you that makes things happen. Use it every day for 45 days with focus and see what happens. There's no religion or rituals involved. Pure energy and your own belief.",
        benefits: [
          { title: "14-Year Sacred Charging", text: "Charged at high-energy places across India for 14 years to hold a potent, unique energy field." },
          { title: "Subconscious Connection", text: "Acts as a physical link, helping your subconscious mind pick up on visual/tactile objects faster than vague thoughts." },
          { title: "45-Day Habit Building", text: "Consistent focus for 45 days helps you form new positive habits, turning your intention into instinct." },
          { title: "Science & Energy-Based", text: "Works purely on energy and belief without any mantras, rituals, or religious requirements." },
          { title: "Clarity, Confidence & Shift", text: "Users typically notice positive shifts, enhanced mental clarity, and deeper confidence over time." },
          { title: "Versatile Placement", text: "Can be easily kept in your pocket, placed on your desk, or tucked under your pillow to keep it close." }
        ],
        suitable: "If you have a meaningful goal like a new job, better relationships, or improved health, this is your tool. It's great for people who meditate or are into the Law of Attraction who want something to focus on. It's also perfect as a gift for big life moments or for anyone who wants something.",
        ritual: "Hold your WishStone daily. Spend 5 minutes focusing deeply on your desired outcome, letting the stone act as a tangible bridge to your subconscious.",
        chakra: "Solar Plexus & Third Eye",
        origin: "Sacred Sites, India",
        element: "Earth & Spirit",
        science: { title: "Cognitive Priming", text: "Tactile interaction with the stone triggers neurological priming, keeping your conscious intentions active in daily decision-making." },
        intention: { title: "Subconscious Anchoring", text: "Provides a somatic anchor that translates abstract intentions into concrete psychological cues." },
        vibration: { title: "Charged Resonant Frequency", text: "Maintains a high vibrational state from its 14-year sacred charging journey, elevating your personal energy field." }
      };
    }

    if (slug === "cosmic-eye" || name.toLowerCase().includes("cosmic eye")) {
      return {
        description: "The Cosmic Eye is more than a tool. It's a way to connect with a special kind of energy that can help shape your life. You're probably holding onto a dream or a big goal. Sometimes it feels like something is getting in the way. The Cosmic Eye helps clear those hidden obstacles so you can actually achieve what you want. It uses wisdom about energy alignment and acts like an antenna for good vibes sending that positive energy straight to your deepest desires. It's really helpful for you. It's even better as a gift for someone you care about.",
        benefits: [
          { title: "Energy Magnetism", text: "Pulls in ambient frequencies and directs them toward your goal, helping make your intentions clear and focused." },
          { title: "Obstacle Clearing", text: "Helps dissolve hidden energy blocks, negative patterns, or bad luck that might be holding you back." },
          { title: "Subconscious Activation", text: "Holding the eye while thinking of your goal prompts your subconscious mind to register and align with it." },
          { title: "Protective Energy Field", text: "Gradually builds a protective, high-frequency energy field that keeps negativity at bay." },
          { title: "Perfect Gift of Intention", text: "Giving it to someone else passes on genuine positive energy, care, and supportive intentions." }
        ],
        suitable: "It's perfect for people who're new to energy tools but want something easy to use and powerful. If you're chasing a dream like a new job, better health or financial freedom, or if you feel like something is always stopping you, this eye can help. It also makes a gift for coworkers because its both high-quality and interesting to talk about. Its designed for ambitious people who are open to new possibilities.",
        ritual: "Sit in a quiet space, hold the Cosmic Eye, and visualize any hidden barriers in your path clearing away. Focus on sending your goals into the eye.",
        chakra: "Third Eye (Ajna)",
        origin: "Ethically Sourced",
        element: "Light & Ether",
        science: { title: "Neuro-Attentional Bias", text: "Focusing on the eye creates a visual and somatic cue that helps your brain prioritize goal-relevant opportunities." },
        intention: { title: "Obstacle Dissolution", text: "Mentally separating goals from barriers while holding the eye aids in cognitive reframing and reduces stress." },
        vibration: { title: "High-Frequency Antenna", text: "Acts as an energetic resonator to align your personal aura with positive frequencies." }
      };
    }

    if (slug.includes("diffuser") || name.toLowerCase().includes("diffuser") || name.toLowerCase().includes("earth essence")) {
      return {
        description: "Earth Essence is more than a home fragrance. It's an experience. This luxury reed diffuser blends a fragrance formula with natural reed sticks letting a pleasant scent fill your space day and night. No flame, no plugs needed. When your home smells great it feels like the energy lifts your mind. Your goals have room to grow. Earth Essence helps recalibrate your energy, one breath at a time.",
        benefits: [
          { title: "Set-and-Forget Upkeep", text: "Set it up once and let it work continuously day and night without flame, plugs, or daily maintenance." },
          { title: "Nervous System Balancing", text: "The premium fragrance activates your sensory system, boosting mood, easing anxiety, and sharpening cognitive focus." },
          { title: "Vessel for Manifestation", text: "Cleanses and elevates the atmosphere so your space becomes receptive to positive intentions and manifestation work." },
          { title: "Clean & Premium Scent", text: "Features a consistent, elegant scent profile that is natural, soothing, and completely free of harsh chemicals." },
          { title: "Aesthetic Home Upgrade", text: "The beautifully crafted glass bottle complements any interior design, upgrading your decor while adding warmth." }
        ],
        suitable: "It's a fit for homemakers who care about their spaces energy, professionals who want a calm environment after work or anyone setting up a meditation or yoga zone. It also makes a premium memorable gift. Ideal for newlyweds or new homeowners who want to curate their space.",
        ritual: "Place the diffuser in your favorite room. Take a slow, deep breath of the scent whenever you enter, centering your thoughts and goals.",
        chakra: "Root (Muladhara) & Heart (Anahata)",
        origin: "Pure Aromatics",
        element: "Earth & Air",
        science: { title: "Olfactory Relaxation Path", text: "Natural aromatic compounds activate olfactory receptors that directly communicate with the limbic system, reducing cortisol." },
        intention: { title: "Spatial Attunement", text: "Creates a sensory boundary that marks your home as a sanctuary of peace, facilitating mindfulness." },
        vibration: { title: "Ambient Harmonic Resonance", text: "Maintains a constant, gentle frequency of peace throughout your living space 24/7." }
      };
    }

    if (slug.includes("camphor") || name.toLowerCase().includes("camphor") || name.toLowerCase().includes("kapoor")) {
      return {
        description: "Forget the sharp-smelling camphor you're used to. Our camphor is a premium upgrade to a ritual made for modern homes. Traditional camphor purifies the air. Ours does that and more releasing a soothing fragrance as it burns. Light it. Instantly your space feels cleansed, warm and filled with a calming scent.",
        benefits: [
          { title: "Natural Air Purification", text: "Camphor's natural properties are proven to help clear and sanitize the air, zapping germs and bacteria as it burns." },
          { title: "Aromatic Energy Cleansing", text: "Cleanses stale or negative energy while releasing an exquisite, soothing fragrance that upgrades traditional rituals." },
          { title: "Anxiety & Stress Relief", text: "The gentle therapeutic scent helps quiet the mind, ease daily stress, and calm nervous system tension." },
          { title: "Enhanced Meditative Focus", text: "Makes your daily prayers or meditation sessions feel deeper and more sensorially connected." },
          { title: "Instant Ambient Shift", text: "Works incredibly fast—simply light a piece and instantly feel a warm, purifying shift in your home's vibe." }
        ],
        suitable: "Perfect for anyone with a ritual wanting to upgrade, people who dislike harsh traditional camphor, or those who believe in vastu and regularly cleanse their space. It's great for festivals, housewarming, special occasions or everyday moments that need a sacred touch.",
        ritual: "Light a tablet in your burner during twilight or before meditation. Sit quietly and let the rising purification smoke calm your thoughts.",
        chakra: "Crown (Sahasrara) & Third Eye",
        origin: "Himachal, India",
        element: "Fire & Air",
        science: { title: "Microbial Reduction", text: "Burning premium camphor releases compounds that reduce airborne bacterial counts, physically purifying the air you breathe." },
        intention: { title: "Rapid Sensory Cleansing", text: "The immediate visual and olfactory change signals the brain to release stress and focus on current sacred moments." },
        vibration: { title: "Aura Cleansing Fire", text: "The fire and air elements combined work rapidly to lift heavy, stagnant energies from walls and corners." }
      };
    }

    if (slug.includes("habit") || name.toLowerCase().includes("habit builder")) {
      return {
        description: "21 cards, 21 days. A brand new you. The Habit Builder deck makes self-improvement easy not overwhelming. Each card has one powerful habit. No complicated programs, no apps. Just pick a card each morning and focus on that one thing. By the end of three weeks you'll have swapped chaos for structure and wishful thinking for action. If your routine has totally fallen apart or you want a start this is your reset.",
        benefits: [
          { title: "21-Day Habit Science", text: "Grounded in behavioral psychology, which suggests it takes 21 days of repetition to turn a new action into a natural habit." },
          { title: "Micro-Step Focus", text: "Prevents overwhelm by prompting you to change just one habit per day, avoiding the trap of trying to change everything at once." },
          { title: "Screen-Free Interaction", text: "No apps, screens, or notifications—just a physical card on your desk keeping you focused and mindful all day." },
          { title: "Curated Life Areas", text: "Habits are carefully designed to improve key aspects of life: productivity, mental mindset, physical health, and relationships." },
          { title: "Highly Reusable", text: "Designed to be used repeatedly for personal resets, or passed along as a meaningful gift once you complete the cycle." }
        ],
        suitable: "Students struggling with routines, professionals feeling stuck, people who've tried app after app and need something, anyone facing major life changes, or parents seeking a meaningful gift for their teens.",
        ritual: "Draw one card every morning. Place it in a visible spot on your workspace and commit to practicing that single habit throughout the day.",
        chakra: "Solar Plexus (Manipura)",
        origin: "Somatic Design",
        element: "Earth & Fire",
        science: { title: "Reduced Cognitive Load", text: "Focusing on a single physical cue removes the decision fatigue of modern self-improvement apps, aiding neuroplasticity." },
        intention: { title: "Visual Friction & Prompts", text: "A physical card creates visual friction, interrupting mindless routines and forcing conscious behavioral choices." },
        vibration: { title: "Structured Daily Flow", text: "Establishes a regular cadence of self-improvement, harmonizing your solar plexus energy and personal power." }
      };
    }

    if (slug === "combo-1" || name.toLowerCase().includes("combo 1") || (name.toLowerCase().includes("wishstone") && name.toLowerCase().includes("diffuser"))) {
      return {
        description: "Manifestation takes more than thinking. It needs the right environment. With Wishstone and Earth Essence Diffuser you're aligning your mind and your space. Wishstone embeds your goal in your subconscious while Earth Essence makes your home positive and full of energy. This combo isn't two items. It's a complete system. It's your 360-degree manifestation setup.",
        benefits: [
          { title: "360-Degree Manifestation System", text: "Aligns both your internal mindset (Wishstone) and your external home environment (Diffuser) for full synergy." },
          { title: "Mind and Space Anchoring", text: "Wishstone keeps your goals anchored in your subconscious, while the Diffuser keeps your home's energy uplifted 24/7." },
          { title: "Amplified Positive Energy", text: "Combines the two items to build a continuous, high-frequency energy field around you to accelerate your intentions." },
          { title: "Exceptional Value Starter Pack", text: "Buying the combo is better value than getting each one alone, making it the perfect kit to begin real life changes." }
        ],
        suitable: "Best for people who want solutions, not stuff. First-timers serious about manifesting and anyone gifting something complete.",
        ritual: "Set up the Diffuser in your sacred space. Hold the Wishstone daily inside this aromatic atmosphere to supercharge your subconscious intentions.",
        chakra: "Root, Solar Plexus, & Heart",
        origin: "India & Pure Aromatics",
        element: "Earth, Air, & Spirit",
        science: { title: "Multisensory Cue Congruency", text: "Combining tactile anchors (stone) and olfactory primes (diffuser) leads to stronger cognitive associations and intention retention." },
        intention: { title: "Environmental Optimization", text: "Modifying your physical environment creates a psychological safe haven, allowing high-focus manifestation." },
        vibration: { title: "Inner/Outer Energy Loop", text: "Creates a feedback loop between your personal frequency and the ambient space, maintaining alignment." }
      };
    }

    if (slug === "combo-2" || name.toLowerCase().includes("combo 2") || (name.toLowerCase().includes("cosmic eye") && name.toLowerCase().includes("diffuser"))) {
      return {
        description: "The Cosmic Eye draws in the energy. The Earth Essence Diffuser holds it. When you use them together your place turns into a circuit. Cosmic Eye pulls positive vibes into your space Diffuser keeps your homes atmosphere so good that energy stays put and keeps working. On their own both are strong. Combined the effect multiplies.",
        benefits: [
          { title: "Attract & Anchor Circuit", text: "The Cosmic Eye acts as an antenna drawing energy in, while the Earth Essence Diffuser locks it into your home's atmosphere." },
          { title: "Continuous High Frequency", text: "Keeps your home environment at a high vibration, preventing energy dips and keeping negative patterns away." },
          { title: "Synergistic Energy Practice", text: "The perfect pair for meditation, yoga, visualization, and intention-setting. The individual effects multiply when used together." },
          { title: "Premium and Purposeful Gift", text: "Looks extremely high-end and luxurious, making an unforgettable, deeply meaningful gift for loved ones." }
        ],
        suitable: "Great, for folks, meditation fans and anyone wanting a complete home wellness upgrade. If you're gifting it stands out as truly purposeful and premium.",
        ritual: "Place the Cosmic Eye next to the Earth Essence Diffuser. Sit near them during your daily alignment exercises to benefit from the active circuit.",
        chakra: "Heart, Third Eye, & Crown",
        origin: "Ethically Sourced & Pure Extracts",
        element: "Light, Air, & Ether",
        science: { title: "Ambient Cognitive Framing", text: "The combination of olfactory and visual cues reduces distractibility and shifts the brain into a state of relaxed focus." },
        intention: { title: "Doubled Intention Magnet", text: "Creates a dedicated mental association with the physical alignment space, lowering the barrier to daily practice." },
        vibration: { title: "Multiplying Energy Circuit", text: "The antenna-like properties of the Cosmic Eye charge the diffused air, resulting in a vibrant home environment." }
      };
    }

    if (slug.includes("rose") || name.includes("Rose")) {
      return {
        description: "Discover the ultimate stone of unconditional love and emotional healing. Sourced from the premium heartlands of Madagascar, each Celestial Rose Quartz WishStone is ethically mined, hand-polished to a smooth tactile finish, and charged under the full moon's light to amplify its high-vibration healing frequency. As a powerful activator of the Heart Chakra (Anahata), this premium rose quartz dissolves deeply rooted emotional blocks, releases stress, and opens the heart to foster self-compassion, inner peace, and harmonious relationships. Whether placed in your sacred space, held during heart-centered meditation, or integrated into your daily manifestation rituals, it serves as a beautiful physical anchor for love, peace, and spiritual alignment.",
        benefits: [
          { title: "Heart Chakra Activation", text: "Opens and balances the heart chakra, encouraging receptivity and trust." },
          { title: "Emotional Trauma Cleansing", text: "Helps dissolve old wounds, resentment, and blockages to invite healing." },
          { title: "Somatic Calm & Stress Relief", text: "Emits a gentle, soothing energy that calms the nervous system and lowers anxiety." },
          { title: "Magnetizing Positive Relationships", text: "Vibrates at the frequency of love, attracting pure, authentic connections." }
        ],
        suitable: "Ideal for spiritual seekers looking to heal past emotional trauma, individuals practicing daily positive affirmations, heart-chakra meditation practitioners, and anyone wishing to cultivate self-acceptance, deep inner peace, and emotional balance.",
        ritual: "Hold in your left hand (receptive side) during meditation. Visualize a warm, soothing pink light surrounding your chest. Repeat the intention: 'I am open to receiving and radiating unconditional love.'",
        chakra: "Heart Chakra (Anahata)",
        origin: "Madagascar",
        element: "Water & Earth",
        science: { title: "Tactile Somatic Calm", text: "Physical touch of the hand-polished quartz stimulates somatic receptors, triggering vagus nerve activation to soothe anxiety and calm the heart rate." },
        intention: { title: "Heart-Centered Focus", text: "Acting as a physical reminder of self-love, the stone helps break negative thought patterns and rewires the neural pathways of self-worth." },
        vibration: { title: "Hexagonal Harmony", text: "The natural crystalline structure of Rose Quartz radiates a constant, gentle frequency that balances the emotional body and Heart Chakra." }
      };
    }

    if (slug.includes("amethyst") || name.includes("Amethyst")) {
      return {
        description: "Elevate your spiritual consciousness and mental clarity with our Lunar Amethyst Cluster WishStone. Sourced from deep crystalline chambers in Brazil, this premium amethyst cluster acts as a natural tranquilizer, neutralizing geopathic stress and clearing negative energy from your surroundings. By aligning and stimulating the Third Eye and Crown Chakras, it enhances intuition, boosts cognitive focus, and aids in accessing higher meditative states of awareness. Perfect for placing on your desk to filter digital fatigue, or on your bedroom nightstand to cultivate restful sleep and clear, prophetic dreams.",
        benefits: [
          { title: "Third Eye & Crown Alignment", text: "Stimulates spiritual wisdom, intuition, and a connection to higher guidance." },
          { title: "Aura Purification", text: "Cleanses the personal energy field, neutralizing psychic pollutants." },
          { title: "Insomnia & Sleep Therapy", text: "Promotes a peaceful mind, facilitating deep, restful sleep and vivid dreams." },
          { title: "Digital & Stress Filter", text: "Soothes everyday anxiety, transmuting mental clutter into quiet focus." }
        ],
        suitable: "Perfect for advanced meditators, those seeking relief from sleep disruptions or insomnia, creative professionals looking for cognitive focus, and anyone wishing to cleanse their home of digital stress.",
        ritual: "Place near your bedside or hold gently on your forehead before sleeping. Intend: 'My mind is calm, my vision is clear, and I trust my inner guidance.'",
        chakra: "Third Eye (Ajna) & Crown (Sahasrara)",
        origin: "Brazil",
        element: "Air",
        science: { title: "Neural Sleep Regulation", text: "Deep purple iron impurities filter electromagnetic frequencies from nearby devices, clearing mental stress to prepare the brain for deep, restorative sleep cycles." },
        intention: { title: "Intuitive Awareness", text: "Focusing on the third eye chakra during meditation with Amethyst helps access alpha and theta brain waves, promoting creative insights." },
        vibration: { title: "High-Frequency Calm", text: "Amethyst clusters radiate high-vibrational energy that purifies the aura and shields your personal environment from negative psychic impacts." }
      };
    }

    if (slug.includes("obsidian") || name.includes("Obsidian")) {
      return {
        description: "Ground your energy system and secure your spiritual boundaries with our Volcanic Obsidian Protection Stone. Sourced from raw volcanic fields, this glossy, jet-black crystal is a master purifier of psychic smog. It acts as an energetic shield, absorbing negativity, stress, and toxic behaviors from your immediate environment. By stimulating the Root Chakra (Muladhara), Obsidian anchors you firmly to the earth, giving you the grounding strength needed to explore and integrate shadow aspects of the self. Use it to banish fear, release resentment, and hold your intentions with unshakeable stability.",
        benefits: [
          { title: "Root Chakra Grounding", text: "Firmly anchors your energy, reducing scattered thoughts and instability." },
          { title: "Psychic Shielding", text: "Absorbs negative environmental energies and prevents emotional drainage." },
          { title: "Shadow Work Integration", text: "Encourages deep self-reflection, bringing hidden truths and blockages to light." },
          { title: "Toxic Pattern Release", text: "Helps cut cords with toxic relationships, energy vampires, and bad habits." }
        ],
        suitable: "Indispensable for empaths, highly sensitive persons (HSPs), individuals navigating major life transitions, and anyone conducting grounding rituals or shadow work.",
        ritual: "Hold during grounding exercises. Feel all physical and mental tension draining from your feet into the center of the earth. Intend: 'I am grounded, protected, and free from negative influences.'",
        chakra: "Root Chakra (Muladhara)",
        origin: "Mexico",
        element: "Fire & Earth",
        science: { title: "Sensory Grounding", text: "The high density and cool surface of volcanic glass provide intense tactile grounding, immediately centering the nervous system during fight-or-flight states." },
        intention: { title: "Shadow Work Anchor", text: "By acting as a psychological shield, Obsidian encourages honest introspection, allowing the mind to process suppressed emotions safely." },
        vibration: { title: "Root Chakra Shield", text: "Obsidian's rapid volcanic cooling creates a protective resonance that absorbs negative energy and builds a strong energetic boundary." }
      };
    }

    if (slug.includes("moonstone") || name.includes("Moonstone")) {
      return {
        description: "Harness the ancient magic of cosmic cycles with the Moonstone Ritual Kit. This luxury kit features a hand-selected, high-flash Moonstone crystal, a premium intention-journal, and a manifestation guide. Moonstone is the crystal of new beginnings, intuition, and feminine receptivity. Connected directly with the Crown Chakra and the moon's rhythmic pull, it assists in setting intentions aligned with lunar phases. The daily journaling practice acts as a somatic habit-builder, bridging your conscious desires with daily actions to manifest clarity, abundance, and self-awareness.",
        benefits: [
          { title: "Cosmic Lunar Alignment", text: "Synchronizes your personal growth cycles with new moon and full moon energies." },
          { title: "Intuitive Awakening", text: "Fosters sensitivity to synchronicities, inner guidance, and deep dreams." },
          { title: "Somatic Habit Anchoring", text: "The kit journal builds daily consistency and structured self-reflection." },
          { title: "Emotional Re-centering", text: "Soothes stress and emotional instability, welcoming fluid adjustments." }
        ],
        suitable: "Ideal for manifestation beginners, ritual enthusiasts, individuals looking to build consistent journaling habits, and those seeking to connect with their inner feminine cycles.",
        ritual: "On the night of a New Moon, write three wishes in the journal and place the Moonstone on top. Intend: 'I flow with the rhythm of the universe and welcome new beginnings.'",
        chakra: "Crown Chakra (Sahasrara)",
        origin: "India",
        element: "Water",
        science: { title: "Circadian Rhythm Sync", text: "Using the ritual journal and stone creates a structured bedtime routine, aligning the circadian rhythm and improving sleep latency." },
        intention: { title: "Subconscious Manifestation", text: "Writing intentions during lunar shifts anchors conscious goals into the subconscious mind, promoting habit consistency and self-awareness." },
        vibration: { title: "Feminine Fluidity", text: "Moonstone is deeply attuned to the water element, facilitating emotional transitions and opening the mind to intuitive guidance." }
      };
    }

    if (slug.includes("lavender") || name.includes("Lavender")) {
      return {
        description: "Purify your sanctuary and soothe your nervous system with our Hand-Harvested Organic Lavender Bundle. Sourced from high-altitude, family-run lavender fields, each stem is dried naturally to preserve its pure therapeutic essential oils. Lavender has been revered for millennia for its ability to clear heavy energies, induce deep somatic relaxation, and calm the central nervous system. Perfect for cleansing your home before meditation, burning during smoke rituals, or placing under your pillow to cultivate a serene, stress-free space.",
        benefits: [
          { title: "Somatic Nervous Relaxation", text: "Instantly relaxes the physical body, lowering cortisol and physical tension." },
          { title: "Sacred Smoke Cleansing", text: "Displaces stagnant, stale energies to create a fresh, peaceful environment." },
          { title: "Inhalation Mindfulness Anchor", text: "Aromatic properties act as a perfect focus point for breathing exercises." },
          { title: "Natural Stress Therapy", text: "Eases emotional fatigue, anxiety, and tension headaches." }
        ],
        suitable: "Perfect for anyone seeking natural anxiety relief, a restorative sleep aid, a smoke-cleansing alternative, or a simple sensory ritual for home relaxation.",
        ritual: "Light the tip and gently fan the smoke, or place the bundle near your meditation cushion. Inhale slowly for 4 seconds, hold for 4, exhale for 6. Intend: 'I release all tension and welcome serenity into my space.'",
        chakra: "Third Eye (Ajna) & Crown (Sahasrara)",
        origin: "France",
        element: "Air",
        science: { title: "Olfactory Vagus Trigger", text: "Linalool and linalyl acetate molecules in lavender oil directly stimulate the olfactory bulb, reducing blood pressure and inducing physiological calm." },
        intention: { title: "Mindfulness Reset", text: "Lighting the bundle marks a clear boundary between busy schedules and quiet reflection, focusing the mind through aroma and breath." },
        vibration: { title: "Aura Purification", text: "Cleansing your space with lavender smoke removes stagnant, heavy energies, restoring a light and peaceful ambient vibration." }
      };
    }

    if (slug.includes("sandalwood") || name.includes("Sandalwood")) {
      return {
        description: "Elevate your focus and invite sacred temple vibes with our Premium Mysore Sandalwood Incense. Handcrafted using authentic, sustainably harvested Sandalwood powder from Karnataka, this incense produces a rich, woody, and warm aroma. Sandalwood has been utilized in Indian temples for millennia due to its grounding qualities and its ability to gather mental focus. It is the ultimate scent for deep spiritual connection, prayer, yoga, and meditation practices, purifying the air while setting a royal, serene atmosphere.",
        benefits: [
          { title: "Cognitive Focus & Devotion", text: "Clarifies the mind, gathering focus for deep work, yoga, or meditation." },
          { title: "Temple Space Cleansing", text: "Instantly transforms any room into a high-vibration, sacred temple space." },
          { title: "Air Purification", text: "Naturally cleanses ambient air of impurities, bacteria, and stale odors." },
          { title: "Mood & Centering Therapy", text: "Promotes emotional centering, stimulating feelings of deep gratitude." }
        ],
        suitable: "Yoga practitioners, serious meditators, home altars, and anyone desiring a rich, woody olfactory anchor for focus, calm, and daily spiritual connection.",
        ritual: "Light a stick at the beginning of your spiritual practice. Focus on the rising smoke as a symbol of your intentions ascending. Intend: 'My focus is unwavering, and my space is sacred.'",
        chakra: "Root Chakra (Muladhara) & Third Eye (Ajna)",
        origin: "Mysore, India",
        element: "Earth",
        science: { title: "Neuro-Cognitive Focus", text: "The warm aroma of alpha-santalol acts on brain receptors to quiet mental chatter, facilitating deep concentration without drowsiness." },
        intention: { title: "Sacred Intention Setting", text: "Burning sandalwood creates an immediate association with spiritual practice, anchoring the mind to prayer, yoga, or intention work." },
        vibration: { title: "Root & Third Eye Bridge", text: "Sandalwood aligns the physical ground with higher spiritual vision, stabilizing the emotional field and purifying the atmosphere." }
      };
    }

    // Fallback
    return {
      description: p?.shortDesc || "A premium manifestation tool designed to align your subconscious mind with your highest intentions. Ethically sourced and carefully selected to match the vibrational frequencies of clarity, abundance, and inner peace. Ideal for daily meditation, somatic grounding, and creating a sacred environment.",
      benefits: (p?.benefits || ["Enhances focus", "Promotes peace"]).map(b => ({ title: b, text: "Supports your daily alignment and creates a positive environmental shift." })),
      suitable: p?.suitableFor || "Perfect for spiritual seekers, healers, meditators, and anyone looking to cultivate positive daily habits and emotional balance.",
      ritual: "Hold the stone in your hands during daily intention-setting. Repeat your core wish to anchor it in your subconscious.",
      chakra: "Varies",
      origin: "Ethically Sourced",
      element: "Spirit",
      science: { title: "Somatic Centering", text: "Holding the physical material brings immediate awareness to the present moment, lowering overall stress and calming the mind." },
      intention: { title: "Intention Alignment", text: "Daily interaction with your WishStone creates a psychological anchor, keeping your focus aligned with your key lifetime goals." },
      vibration: { title: "Stable Natural Energy", text: "Ethically mined crystals carry earth's ancient grounding frequencies, harmonizing and stabilizing your personal energetic field." }
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const seoData = getProductRichSEOData(p);

  return (
    <div className="ep-product-page-wrapper">
      <div style={{ paddingTop: 90, paddingBottom: 80, background: "#FFFFFF", minHeight: "100vh", overflowX: "hidden", width: "100%", boxSizing: "border-box" }}>
        <div className="max-w ep-product-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: "3rem", alignItems: "start", width: "100%", minWidth: 0 }} className="prod-detail-grid">
            {/* Left Side - Image Gallery Nike Style */}
            <div style={{ minWidth: 0, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
              {/* Main Image with Native Scroll & Snap */}
              <div className="ep-main-gallery-wrapper" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #D9DDD5", boxShadow: "0 12px 48px rgba(90,102,81,0.04)", marginBottom: "1.2rem", aspectRatio: "1", background: "#FFFFFF", position: "relative", isolation: "isolate" }}>
                <div
                  ref={scrollContainerRef}
                  onScroll={(e) => {
                    if (isProgrammaticScroll.current) return;
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.clientWidth;
                    if (width > 0) {
                      const newIndex = Math.round(scrollLeft / width);
                      if (newIndex !== activeImg && newIndex >= 0 && newIndex < imgs.length) {
                        setActiveImg(newIndex);
                      }
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                    cursor: isMouseDown ? "grabbing" : "grab"
                  }}
                >
                  {imgs.map((img, i) => (
                    <motion.img
                      key={i}
                      referrerPolicy="no-referrer"
                      src={img}
                      alt={p.name}
                      animate={{
                        filter: activeImg === i ? "blur(0px)" : "blur(12px)"
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        scrollSnapAlign: "start",
                        flexShrink: 0,
                        userSelect: "none"
                      }}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(90, 102, 81, 0.85)", backdropFilter: "blur(4px)", color: "#ffffff", borderRadius: 20, padding: "6px 14px", fontSize: "0.72rem", fontWeight: 600, zIndex: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                  {activeImg + 1} / {imgs.length}
                </div>
              </div>

              {/* Thumbnail Strip — Square Boxes, Max 4, Fill Width */}
              <div style={{
                display: "flex",
                gap: "0.5rem",
                padding: "8px 0",
                justifyContent: "stretch",
                alignItems: "center",
                width: "100%"
              }} className="scroll-hide ep-thumb-strip">
                {imgs.slice(0, 4).map((img, i) => (
                  <motion.div
                    key={i}
                    role="button"
                    onClick={() => {
                      isProgrammaticScroll.current = true;
                      setActiveImg(i);
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className={`ep-thumb-btn ${activeImg === i ? "active" : ""}`}
                    style={{
                      flex: "1 1 0px",
                      aspectRatio: "1 / 1",
                      borderRadius: 8,
                      overflow: "hidden",
                      padding: 3,
                      background: activeImg === i ? "#ffffff" : "transparent",
                      cursor: "pointer",
                      boxShadow: activeImg === i ? "0 4px 16px rgba(90,102,81,0.18)" : "0 1px 4px rgba(0,0,0,0.04)",
                      border: activeImg === i ? "2px solid #5A6651" : "2px solid transparent"
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
                        borderRadius: 5
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ minWidth: 0, overflow: "hidden", wordBreak: "break-word" }}>
              {p.bestSeller && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0F2EE", color: "#5A6651", border: "1px solid #D9DDD5", borderRadius: 30, padding: "4px 14px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.8rem", textTransform: "uppercase" }}>
                  <span>✦</span> BEST SELLER
                </div>
              )}
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3.5vw,2.4rem)", fontWeight: 900, color: "#000000", marginBottom: "0.4rem", lineHeight: 1.2, wordBreak: "break-word", overflowWrap: "break-word" }}>{p.name}</h1>
              <p style={{ fontSize: "0.75rem", color: "#5A6651", fontWeight: "600", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.15em", wordBreak: "break-word", overflowWrap: "break-word" }}>{p.category}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "1.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "1.8rem", color: "#5A6651", fontWeight: 800 }}>₹{p.price.toLocaleString()}</span>
                  {p.originalPrice > p.price && <span style={{ color: "#9ca3af", fontSize: "1rem", textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString()}</span>}
                  {p.discount > 0 && <span style={{ background: "#F0F2EE", color: "#5A6651", border: "1px solid #D9DDD5", borderRadius: 6, padding: "4px 10px", fontSize: "0.75rem", fontWeight: 700 }}>{p.discount}% OFF</span>}
                </div>
                <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>(incl. of all taxes)</span>
              </div>

              {/* Unified Vertical Tabs Layout Card */}
              {/* Unified Vertical Tabs Layout Parent Grid */}
              <div
                className="tabs-parent-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "24px",
                  marginTop: "1.5rem",
                  marginBottom: "1.5rem",
                  alignItems: "start"
                }}
              >
                {/* Left Card: Vertical Tab Buttons & You May Also Like */}
                <div
                  className="tabs-sidebar-card"
                  style={{
                    background: "#F0F2EE",
                    borderRadius: "16px",
                    border: "1px solid #D9DDD5",
                    padding: "1.6rem",
                    boxShadow: "0 10px 30px rgba(90,102,81,0.02)",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} className="vertical-tabs-col">
                    {[
                      {
                        id: "desc",
                        label: "Description",
                        icon: (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        )
                      },
                      {
                        id: "benefits",
                        label: "Benefits",
                        icon: (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                        )
                      },
                      {
                        id: "suitable",
                        label: "Suitable For",
                        icon: (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                        )
                      }
                    ].map(t => (
                      <motion.button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        whileHover={{ x: 6 }}
                        whileTap={{ scale: 0.98 }}
                        className={`ep-tab-btn-vertical ${tab === t.id ? "active" : ""}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          border: "1px solid #D9DDD5",
                          background: "#FFFFFF",
                          color: tab === t.id ? "#FFFFFF" : "#000000",
                          textAlign: "left",
                          position: "relative",
                          transition: "color 0.25s, border-color 0.25s, box-shadow 0.25s",
                          boxShadow: tab === t.id ? "0 4px 14px rgba(90,102,81,0.12)" : "none"
                        }}
                      >
                        {tab === t.id && (
                          <motion.div
                            layoutId="activeVerticalTabBg"
                            style={{
                              position: "absolute",
                              top: -1,
                              left: -1,
                              right: -1,
                              bottom: -1,
                              background: "#5A6651",
                              borderRadius: "12px",
                              zIndex: 1,
                              border: "1px solid #5A6651"
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span style={{ flexShrink: 0, position: "relative", zIndex: 2 }}>{t.icon}</span>
                        <span style={{ position: "relative", zIndex: 2 }}>{t.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* You May Also Like Section */}
                  <div className="you-may-like-left-col">
                    <div style={{ fontSize: "0.68rem", fontWeight: "800", color: "#5A6651", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>
                      You May Also Like
                    </div>
                    <div className="recommendation-icons-wrapper">
                      {displayCats.map(cat => {
                        const isHovered = hoveredCat === cat.slug;
                        const accentColor = "#5A6651";
                        const iconColor = isHovered ? "#FFFFFF" : accentColor;
                        return (
                          <div
                            key={cat.slug}
                            onClick={() => navigate("/shop", { state: { category: cat.slug } })}
                            onMouseEnter={() => setHoveredCat(cat.slug)}
                            onMouseLeave={() => setHoveredCat(null)}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.96 }}
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                border: `1.5px solid ${accentColor}`,
                                boxShadow: isHovered ? "0 4px 12px rgba(90,102,81,0.18)" : "0 2px 6px rgba(90,102,81,0.04)",
                                background: isHovered ? accentColor : "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background-color 0.25s, border-color 0.25s, box-shadow 0.25s"
                              }}
                            >
                              {getCategoryIcon(cat.slug, iconColor)}
                            </motion.div>
                            <span style={{
                              fontSize: "0.6rem",
                              fontWeight: "800",
                              color: accentColor,
                              textTransform: "uppercase",
                              letterSpacing: "0.03em",
                              textAlign: "center",
                              width: "74px",
                              lineHeight: 1.2,
                              wordBreak: "break-word",
                              borderBottom: isHovered ? `1px solid ${accentColor}` : "1px solid transparent",
                              transition: "border-color 0.25s"
                            }}>
                              {cat.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Card: Content */}
                <motion.div
                  layout
                  className="tabs-content-card"
                  style={{
                    background: "#F0F2EE",
                    borderRadius: "16px",
                    border: "1px solid #D9DDD5",
                    padding: "1.6rem",
                    boxShadow: "0 10px 30px rgba(90,102,81,0.02)",
                    height: "fit-content",
                    minHeight: "180px",
                    minWidth: 0,
                    overflow: "hidden"
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 8, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.99 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        minHeight: "180px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                        minWidth: 0,
                        overflow: "hidden",
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                      }}
                    >
                      {tab === "desc" && (
                        <motion.div
                          key="desc-content"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", flexGrow: 1 }}
                        >
                          <p style={{ fontSize: "0.86rem", color: "#000000", lineHeight: 1.7, margin: 0 }}>
                            {seoData.description}
                          </p>
                        </motion.div>
                      )}

                      {tab === "benefits" && (
                        <motion.div
                          key="benefits-content"
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          className="benefits-grid-layout"
                        >
                          {seoData.benefits.map((b, idx) => (
                            <motion.div
                              key={idx}
                              variants={itemVariants}
                              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #D9DDD5", flexShrink: 0, marginTop: "2px" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5A6651" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.86rem", fontWeight: "700", color: "#000000" }}>{b.title}</div>
                                <div style={{ fontSize: "0.78rem", color: "#4b5563", marginTop: "2px", lineHeight: "1.5" }}>{b.text}</div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {tab === "suitable" && (
                        <motion.div
                          key="suitable-content"
                          variants={containerVariants}
                          initial="hidden"
                          animate="show"
                          style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", flexGrow: 1 }}
                        >
                          <motion.p variants={itemVariants} style={{ fontSize: "0.86rem", color: "#000000", lineHeight: 1.7, margin: 0 }}>
                            {seoData.suitable}
                          </motion.p>
                          <motion.div
                            variants={itemVariants}
                            style={{ marginTop: "1.2rem", borderTop: "1px solid #D9DDD5", paddingTop: "1rem" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                              <span style={{ fontSize: "1rem" }}>✨</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "#5A6651", letterSpacing: "0.06em", textTransform: "uppercase" }}>Activation Ritual</span>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "#4b5563", lineHeight: "1.5", fontStyle: "italic", margin: 0 }}>
                              {seoData.ritual}
                            </p>
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>



              {/* Trust Badges Section */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem", width: "100%", marginTop: "1.8rem" }}>
                {[
                  {
                    title: "Free Shipping",
                    desc: "On orders above ₹999",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A6651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    )
                  },
                  {
                    title: "7-Day Returns",
                    desc: "Hassle-free process",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A6651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                    )
                  },
                  {
                    title: "100% Natural",
                    desc: "Ethically sourced",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A6651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                        <path d="M2 22C2 12 10 4 22 2c0 12-8 20-18 20z" />
                        <path d="M9 15l7-7" />
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#F0F2EE",
                      border: "1px solid #D9DDD5",
                      borderRadius: "12px",
                      padding: "16px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      textAlign: "center",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      boxShadow: "0 2px 8px rgba(90,102,81,0.02)"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(90,102,81,0.06)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(90,102,81,0.02)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #D9DDD5", boxShadow: "0 2px 8px rgba(90,102,81,0.04)" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#000000" }}>{item.title}</div>
                      <div style={{ fontSize: "0.68rem", color: "#4b5563", marginTop: "2px" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: "4rem 0", height: "1px", background: "linear-gradient(90deg, transparent, #D9DDD5, transparent)" }} />

          {/* SEO Content Section: Science, Intention & Ritual */}
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span style={{ color: "#5A6651", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>Holistic Energy Integration</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#000000", marginTop: "0.5rem", marginBottom: "0.8rem" }}>Ritual, Science & Intention</h2>
              <p style={{ color: "#4b5563", fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>Discover how ancient holistic wisdom and modern cognitive science combine to make this stone a powerful anchor for your daily manifestations.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1.5rem" }}>
              {[
                {
                  title: seoData.science?.title || "Somatic Anchoring",
                  text: seoData.science?.text || "Tactile stimulation that centers the mind.",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 18h8" />
                      <path d="M3 22h18" />
                      <path d="M14 22a7 7 0 1 0-7-7" />
                      <path d="M9 14h2" />
                      <path d="M9 12a3 3 0 0 1-3-3V5a3 3 0 0 1 6 0v4a3 3 0 0 1-3 3Z" />
                      <path d="m12 6 3 3" />
                    </svg>
                  ),
                  tag: "THE SCIENCE"
                },
                {
                  title: seoData.intention?.title || "Cognitive Focus",
                  text: seoData.intention?.text || "Clear mental projection of goals.",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                  tag: "THE INTENTION"
                },
                {
                  title: seoData.vibration?.title || "Natural Vibration",
                  text: seoData.vibration?.text || "Resonant crystal frequency fields.",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="10" r="6" />
                      <path d="M12 2v2" />
                      <path d="M12 16v2" />
                      <path d="M4.93 4.93l1.41 1.41" />
                      <path d="M17.66 17.66l1.41 1.41" />
                      <path d="M2 10h2" />
                      <path d="M20 10h2" />
                      <path d="M19.07 4.93l-1.41 1.41" />
                      <path d="M6.34 17.66l-1.41 1.41" />
                      <path d="M8 21h8" />
                      <path d="M12 17v4" />
                    </svg>
                  ),
                  tag: "THE VIBRATION"
                }
              ].map((card, idx) => (
                <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #D9DDD5", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(90,102,81,0.02)", display: "flex", flexDirection: "column", gap: "12px", position: "relative", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(90,102,81,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(90,102,81,0.02)";
                  }}
                >
                  <div style={{ position: "absolute", top: "1.8rem", right: "1.8rem", opacity: 0.2 }}>{card.icon}</div>
                  <span style={{ color: "#5A6651", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.08em" }}>{card.tag}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 800, color: "#000000", margin: 0 }}>{card.title}</h3>
                  <p style={{ color: "#4b5563", fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ maxWidth: "800px", margin: "0 auto 2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span style={{ color: "#5A6651", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase" }}>Common Queries</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#000000", marginTop: "0.5rem" }}>Frequently Asked Questions</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  q: "How does the WishStone facilitate manifestation and subconscious alignment?",
                  a: "The WishStone functions as a somatic anchoring tool that bridges cognitive intent with sensory experience. In cognitive behavioral practice, holding a physical object while focusing on a specific goal activates the brain's Reticular Activating System (RAS). This sharpens your selective attention, allowing you to recognize opportunities and align your subconscious behavior with your manifestation goals."
                },
                {
                  q: "What is the best way to cleanse and charge my high-vibration crystal stone?",
                  a: "To maintain the energetic purity and high-vibrational frequency of your crystal stone, we recommend regular cleansing and charging. Cleanse your stone by running it under cool, natural water or passing it through the smoke of organic sage or sacred sandalwood incense. To charge and amplify its natural energy fields, place it under the direct light of a full moon for 8-12 hours."
                },
                {
                  q: "Are WishStone crystals ethically sourced and 100% authentic?",
                  a: "Yes, every single WishStone crystal—whether Madagascar Rose Quartz, Brazilian Amethyst, or Volcanic Obsidian—is 100% authentic, raw, and ethically sourced from verified mines around the world. We work directly with local artisans to ensure sustainable mining practices, preserving the natural geological properties and energetic structural integrity of each unique specimen."
                },
                {
                  q: "Can I combine multiple intention-anchoring stones for different manifestation goals?",
                  a: "Absolutely. Combining different crystals can create a harmonious energetic ecosystem that supports multiple facets of your life. For instance, pairing Volcanic Obsidian for root grounding and protection with Celestial Rose Quartz for heart chakra activation and self-love creates a balanced, safe space for emotional growth and manifestation work."
                }
              ].map((faq, idx) => {
                const isOpen = faqOpen === idx;
                return (
                  <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #D9DDD5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(90,102,81,0.01)" }}>
                    <button
                      onClick={() => setFaqOpen(isOpen ? -1 : idx)}
                      style={{ width: "100%", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#000000", paddingRight: "16px", wordBreak: "break-word", overflowWrap: "break-word" }}>{faq.q}</span>
                      <span style={{ color: "#5A6651", fontSize: "1.2rem", fontWeight: "300", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s ease", flexShrink: 0 }}>+</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div style={{ padding: "0 24px 24px 24px", fontSize: "0.82rem", color: "#4b5563", lineHeight: 1.6, borderTop: "1px solid #D9DDD5" }}>
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      <BestSellersStrip onShop={onShop} />
      {/* Sticky Add to Cart Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(14px)", borderTop: "1px solid #D9DDD5", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", boxShadow: "0 -4px 20px rgba(90,102,81,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", maxWidth: "500px", width: "100%" }}>
          {cartQty > 0 ? (
            <>
              {/* Compact qty counter */}
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #5A6651", background: "#F0F2EE", borderRadius: 8, overflow: "hidden", flexShrink: 0, height: 44 }}>
                <button onClick={handleDec} style={{ width: 38, height: 44, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#5A6651", fontWeight: 700 }}>−</button>
                <span style={{ width: 32, textAlign: "center", fontWeight: 800, color: "#5A6651", fontSize: "0.95rem" }}>{cartQty}</span>
                <button onClick={handleAdd} disabled={cart?.reduce((s, i) => s + i.qty, 0) >= 10} style={{ width: 38, height: 44, background: cart?.reduce((s, i) => s + i.qty, 0) >= 10 ? "#e5e7eb" : "#5A6651", border: "none", cursor: cart?.reduce((s, i) => s + i.qty, 0) >= 10 ? "not-allowed" : "pointer", fontSize: 16, color: "#fff", fontWeight: 700 }}>+</button>
              </div>
              {/* View Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="ep-primary-btn"
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 8,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  animation: "stickyBtnIn 0.3s ease both"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                View Cart • ₹{(cartQty * p.price).toLocaleString()}
              </button>
            </>
          ) : (
            /* Add to Cart Button */
            <button
              className="ep-primary-btn"
              onClick={handleAdd}
              style={{
                flex: 1,
                height: 44,
                fontSize: "0.9rem",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                animation: "stickyBtnIn 0.3s ease both"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart — ₹{p.price.toLocaleString()}
            </button>
          )}
          {/* Wishlist heart */}
          <button
            onClick={e => onWish(e, p.id)}
            className="ep-secondary-btn"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth={wished.includes(p.id) ? "3.2" : "2"} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes stickyBtnIn{from{opacity:0;transform:scale(0.94) translateY(4px);}to{opacity:1;transform:scale(1) translateY(0);}}
        
        .ep-nav-btn {
          background: rgba(255,255,255,0.95) !important;
          border: 1px solid #D9DDD5 !important;
          color: #5A6651 !important;
          transition: all 0.2s ease !important;
        }
        .ep-nav-btn:hover {
          background: #5A6651 !important;
          color: #ffffff !important;
          border-color: #5A6651 !important;
        }
        .ep-thumb-btn {
          border: 2px solid transparent !important;
          transition: all 0.2s ease !important;
        }
        .ep-thumb-btn.active {
          border-color: #5A6651 !important;
          box-shadow: 0 8px 24px rgba(90,102,81,0.15) !important;
        }
        .ep-tab-btn-vertical {
          border: 1px solid #D9DDD5 !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .ep-tab-btn-vertical:hover {
          background: #F0F2EE !important;
          border-color: #5A6651 !important;
          color: #5A6651 !important;
        }
        .ep-tab-btn-vertical.active {
          background: #5A6651 !important;
          color: #ffffff !important;
          border-color: #5A6651 !important;
          box-shadow: 0 4px 14px rgba(90, 102, 81, 0.2) !important;
        }
        .ep-tab-btn-vertical.active svg {
          stroke: #ffffff !important;
        }
        .ep-primary-btn {
          background: linear-gradient(135deg, #5A6651, #454F3F) !important;
          color: #ffffff !important;
          border: none !important;
          transition: all 0.2s ease !important;
        }
        .ep-primary-btn:hover {
          background: linear-gradient(135deg, #454F3F, #323B2F) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(90, 102, 81, 0.3) !important;
        }
        .ep-secondary-btn {
          background: #ffffff !important;
          border: 1.5px solid #D9DDD5 !important;
          color: #5A6651 !important;
          transition: all 0.2s ease !important;
        }
        .ep-secondary-btn:hover {
          border-color: #5A6651 !important;
          background: #F0F2EE !important;
          color: #454F3F !important;
        }

        .you-may-like-left-col {
          margin-top: 0.8rem;
          width: 100%;
          border-top: 1px solid #D9DDD5;
          padding-top: 0.8rem;
        }
        .recommendation-icons-wrapper {
          display: flex;
          flex-direction: row !important;
          gap: 12px;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
        }

        .ep-product-page-wrapper,
        .ep-product-page-wrapper * {
          font-family: 'Open Sans', sans-serif !important;
        }

        .ep-product-container {
          padding: 3rem 1.5rem !important;
          width: 100% !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }
        .prod-detail-grid {
          width: 100% !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }
        .ep-thumb-strip {
          justify-content: flex-start !important;
          align-items: center !important;
        }

        @media (max-width: 768px) {
          .ep-product-container {
            padding: 1.2rem 16px !important;
          }
          .prod-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
          }
          .ep-main-gallery-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            aspect-ratio: 1 !important;
            border-radius: 14px !important;
          }
          .ep-thumb-strip {
            justify-content: center !important;
            gap: 0.6rem !important;
            padding: 6px 0 !important;
          }
          .ep-thumb-strip .ep-thumb-btn {
            width: 56px !important;
            height: 56px !important;
            border-radius: 10px !important;
          }
          .tabs-parent-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .tabs-sidebar-card, .tabs-content-card {
            padding: 1rem !important;
            border-radius: 12px !important;
          }
          .vertical-tabs-col {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 4px !important;
            gap: 8px !important;
          }
          .ep-tab-btn-vertical {
            padding: 8px 12px !important;
            white-space: nowrap !important;
            font-size: 0.72rem !important;
            border-radius: 8px !important;
          }
          .tab-content-col {
            min-height: 140px !important;
            min-width: 0 !important;
            overflow: hidden !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .tab-content-col p,
          .tab-content-col div,
          .tab-content-col span {
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
          }
          .ep-product-page-wrapper h1 {
            font-size: clamp(1.3rem, 5vw, 1.8rem) !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
          }
          .ep-product-page-wrapper h2 {
            font-size: clamp(1.2rem, 4.5vw, 1.6rem) !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .ep-product-page-wrapper p,
          .ep-product-page-wrapper span,
          .ep-product-page-wrapper div {
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .you-may-like-left-col {
            display: none !important;
          }
          .recommendation-icons-wrapper {
            flex-direction: row !important;
            justify-content: center !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .ep-product-container {
            padding: 1rem 14px !important;
          }
          .ep-main-gallery-wrapper {
            border-radius: 12px !important;
          }
          .ep-thumb-strip .ep-thumb-btn {
            width: 48px !important;
            height: 48px !important;
            border-radius: 8px !important;
          }
          .tabs-sidebar-card, .tabs-content-card {
            padding: 0.8rem !important;
          }
          .ep-tab-btn-vertical {
            padding: 7px 10px !important;
            font-size: 0.68rem !important;
          }
        }
      `}</style>
    </div>
  );
}
// ─── RITUALS PAGE ─────────────────────────────────────────────
function RitualsPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState({});
  const refs = useRef([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisible(v => ({ ...v, [i]: true }));
      }, { threshold: 0.15 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  const rituals = [
    {
      label: "01 — New Moon",
      title: "New Moon Ritual",
      time: "15–20 min",
      desc: "Manifest New Beginnings & Inner Clarity",
      steps: [
        { step: "Settle", text: "Hold your WishStone and take a few mindful breaths to arrive fully in the present." },
        { step: "Intend", text: "Write down three clear intentions you wish to call into your life this month." },
        { step: "Visualise", text: "Close your eyes. See your goals unfolding with vivid clarity and quiet confidence." },
        { step: "Anchor", text: "Place the stone beside your written intentions and let it rest there overnight." },
        { step: "Release", text: "End with a moment of genuine gratitude and surrender to what is on its way." },
      ]
    },
    {
      label: "02 — Morning",
      title: "Morning Activation",
      time: "5–10 min",
      desc: "Begin Your Day with Peace & Purpose",
      steps: [
        { step: "Breathe", text: "Hold your WishStone in both palms. Inhale slowly for four counts, exhale for six." },
        { step: "Set", text: "Choose one meaningful intention to carry with you through the day ahead." },
        { step: "Affirm", text: "Speak a calm, positive affirmation aloud — let your own voice make it real." },
        { step: "Carry", text: "Keep the stone close in your pocket or on your desk as a gentle daily anchor." },
        { step: "Return", text: "Whenever focus drifts, hold the stone and return quietly to your morning intention." },
      ]
    },
    {
      label: "03 — Cleansing",
      title: "Cleansing Ritual",
      time: "10–15 min",
      desc: "Release Stress & Restore Balance",
      steps: [
        { step: "Acknowledge", text: "Sit quietly and name the stress, emotion or energy you are ready to release today." },
        { step: "Cleanse", text: "Rinse your WishStone gently under cool water or hold it briefly in morning sunlight." },
        { step: "Breathe Out", text: "With each exhale, consciously let go of the weight you acknowledged. Repeat three times." },
        { step: "Renew", text: "Set a simple, grounded intention for how you wish to feel for the rest of your day." },
        { step: "Store", text: "Place the stone mindfully in a clean, quiet spot until your next ritual session." },
      ]
    }
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    .rituals-page { font-family: 'Open Sans', sans-serif; }
    .rituals-page * { font-family: 'Open Sans', sans-serif; }
    .ritual-card-enter { opacity: 0; transform: translateY(40px); }
    .ritual-card-visible { opacity: 1; transform: translateY(0); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .ritual-step-row { display: flex; gap: 1.5rem; align-items: flex-start; padding: 1.2rem 0; border-bottom: 1px solid rgba(76,90,67,0.08); }
    .ritual-step-row:last-child { border-bottom: none; }
    @keyframes ritualGlow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
  `;

  return (
    <div className="rituals-page" style={{ paddingTop: 80, background: "#F9F7F3", minHeight: "100vh" }}>
      <style>{css}</style>

      {/* Hero header */}
      <div style={{ background: "linear-gradient(180deg, #2C3320 0%, #3a4329 100%)", padding: "5rem clamp(1.5rem,6vw,5rem) 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(141,122,91,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", opacity: 0.7 }}>
          <div style={{ height: 1, width: 40, background: "#8D7A5B" }} />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#8D7A5B", letterSpacing: "0.28em", textTransform: "uppercase" }}>SACRED RITUALS</span>
          <div style={{ height: 1, width: 40, background: "#8D7A5B" }} />
        </div>
        <h1 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 700, color: "#F9F7F3", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.01em" }}>
          Ancient Practices,<br /><span style={{ color: "#C8B89A", fontStyle: "italic" }}>Modern Life.</span>
        </h1>
        <p style={{ fontSize: "clamp(0.85rem,1.2vw,0.96rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
          Three rituals. Five steps each. A complete daily practice for clarity, intention, and inner renewal.
        </p>
      </div>

      {/* Ritual cards */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem clamp(1.5rem,5vw,3rem) 5rem" }}>
        {rituals.map((r, idx) => (
          <div
            key={r.title}
            ref={el => refs.current[idx] = el}
            className={visible[idx] ? "ritual-card-visible" : "ritual-card-enter"}
            style={{ marginBottom: idx < rituals.length - 1 ? "5rem" : 0, transitionDelay: `${idx * 0.1}s` }}
          >
            {/* Card label */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#8D7A5B", letterSpacing: "0.22em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{r.label}</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #8D7A5B44, transparent)" }} />
              <span style={{ fontSize: "0.65rem", color: "#4C5A43", fontWeight: 600, letterSpacing: "0.1em", background: "rgba(76,90,67,0.08)", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{r.time}</span>
            </div>

            {/* Title */}
            <h2 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#2C3320", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{r.title}</h2>
            <p style={{ fontSize: "0.85rem", color: "#8D7A5B", fontStyle: "italic", marginBottom: "2rem", fontWeight: 500 }}>{r.desc}</p>

            {/* Steps */}
            <div>
              {r.steps.map((s, si) => (
                <div key={si} className="ritual-step-row">
                  <div style={{ minWidth: 80, paddingTop: "0.15rem" }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#4C5A43", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>{s.step}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.9rem", color: "#3a3a2e", lineHeight: 1.75, margin: 0 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ background: "#2C3320", padding: "3.5rem clamp(1.5rem,5vw,3rem)", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Ready to begin?</p>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 700, color: "#F9F7F3", marginBottom: "1.5rem" }}>
          Your first ritual starts with a single breath.
        </h3>
        <button
          onClick={() => navigate("/shop")}
          style={{ background: "#C8B89A", color: "#2C3320", border: "none", padding: "13px 32px", borderRadius: 30, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#d4c4a6"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#C8B89A"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Find Your WishStone →
        </button>
      </div>
    </div>
  );
}

// ─── BENEFITS PAGE ────────────────────────────────────────────
function BenefitsPage() {
  const benefits = [
    { icon: "🧠", title: "Mental Clarity & Focus", desc: "A crowded mind can make it difficult for one to make even the most basic decisions. It is difficult to remain focused when there are many distractions around you. The WishStone aims to create opportunities for individuals to pause and focus on their inner peace and become clear-minded about their life objectives." },
    { icon: "🌿", title: "Stress Relief & Inner Peace", desc: "Nervous energy and daily stressors can build up, disrupting your peace. WishStone acts as a grounding anchor, helping you release tension, slow down your breathing, and return to a state of calm." },
    { icon: "💚", title: "Emotional Wellness", desc: "Gentle crystal healing helps release deep-seated emotional blockages, promoting self-forgiveness and heart-opening energy. Fosters a strong foundation of self-love and empathy." },
    { icon: "🛡️", title: "Reducing Anxiety & Overthinking", desc: "When anxious thoughts spiral, the tactile feeling of holding your stone provides an immediate somatic anchor, bringing your focus back to the present moment and quietening mental chatter." },
    { icon: "⚡", title: "Motivation & Positive Energy", desc: "Boosts your personal vibrational frequency, infusing your space with inspiration and positive energy. Perfect for overcoming procrastination and igniting creative flow." },
    { icon: "🌸", title: "Self-Love & Self-Worth", desc: "Strengthens your relationship with yourself. Replaces self-doubt with confidence, reminding you of your inherent value and capability to manifest your desires." },
    { icon: "🔋", title: "Burnout Recovery & Mental Recharging", desc: "A dedicated tool to step away from daily responsibilities. Gives your mind the space to recharge, restore cognitive resources, and prevent mental exhaustion." },
    { icon: "😴", title: "Better Sleep & Evening Relaxation", desc: "Helps transition your mind from busy daytime energy to peaceful evening rest. Prepares the nervous system for deep, restorative sleep by letting go of the day's worries." },
    { icon: "📱", title: "Digital Detox & Mindful Living", desc: "Acts as a physical prompt to step away from screens. Encourages brief periods of quiet mindfulness, connecting you back to your immediate environment." },
    { icon: "📈", title: "Intentional Living & Personal Growth", desc: "Keeps your daily intentions top of mind. By consistently focusing on your goals, you align your daily actions with the future you are actively creating." }
  ];
  return (
    <div style={{ paddingTop: 90, background: T.bg, minHeight: "100vh" }}>
      <div className="max-w" style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 900, marginBottom: "0.4rem" }}>WishStone Benefits</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg,${T.orange},transparent)`, marginBottom: "1.2rem" }} />

        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.1rem,2vw,1.35rem)", color: T.orange, fontWeight: 700, marginBottom: "0.8rem", lineHeight: 1.4 }}>
          Supporting Your Journey Toward Mental Peace, Emotional Balance & Intentional Living
        </h3>

        <p style={{ color: T.textMid, fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "3rem", maxWidth: 780 }}>
          Manifestation begins with intention. In a world filled with distractions, WishStone helps you pause, gain clarity, and focus your energy on what truly matters. Through mindful daily rituals, it encourages positive thinking, purposeful action, and alignment with the life you wish to create.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.8rem", marginTop: "2rem" }} className="prod-grid">
          {benefits.map((b, i) => (
            <div key={b.title} style={{
              padding: "1.8rem 1.6rem",
              background: "#fff",
              borderRadius: 16,
              borderLeft: "3px solid #4C5A43",
              boxShadow: "0 2px 16px rgba(76,90,67,0.06)",
              transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(76,90,67,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(76,90,67,0.06)"; }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "0.9rem", lineHeight: 1 }}>{b.icon}</div>
              <h3 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#2C3320", marginBottom: "0.7rem", letterSpacing: "-0.005em" }}>{b.title}</h3>
              <p style={{ fontSize: "0.8rem", color: "#5C6654", lineHeight: 1.75, margin: 0 }}>{b.desc}</p>
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
    {
      name: "Neha R.",
      city: "Mumbai",
      rating: 5,
      text: "Having WishStone with me has helped me take moments for reflection when I'm feeling too caught up in the hustle of my day.",
      product: "WishStone",
      avatar: "N"
    },
    {
      name: "Arjun",
      city: "Bangalore",
      rating: 5,
      text: "My biggest problem has always been overthinking and reflecting on the events of the day too late at night. Having started using WishStone during the evenings, I find it much easier to disconnect and clear my head.",
      product: "WishStone",
      avatar: "A"
    },
    {
      name: "Priya",
      city: "Pune",
      rating: 5,
      text: "As someone who is not really into spirituality, the only thing I care about is my intention setting practice which is easy and straightforward to incorporate into your daily routine.",
      product: "WishStone",
      avatar: "P"
    },
    {
      name: "Vikram",
      city: "Gurgaon",
      rating: 5,
      text: "The diffuser is responsible for an entire change in the atmosphere of my bedroom. Even after long hours at work, switching on the diffuser for just 20 minutes enables me to relax.",
      product: "WishStone Diffuser",
      avatar: "V"
    },
    {
      name: "Meera",
      city: "Chennai",
      rating: 5,
      text: "The reason I bought the Cosmic Eye is that I needed something spiritually meaningful in my meditation zone. This piece of art acts as a constant reminder for staying present and trusting the process.",
      product: "Cosmic Eye",
      avatar: "M"
    },
    {
      name: "Ananya",
      city: "Pune",
      rating: 5,
      text: "The Habit Builder has been a game-changer for my daily routine. It helps me stay mindful and grounded as I work towards my long-term goals.",
      product: "Habit Builder",
      avatar: "A"
    }
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

  const cartCss = `
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap');
    .cart-page { font-family: 'Open Sans', sans-serif; }
    .cart-item-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.1rem;
      margin-bottom: 0.85rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      border: 1px solid rgba(76,90,67,0.1);
      box-shadow: 0 2px 12px rgba(76,90,67,0.04);
      transition: box-shadow 0.2s;
    }
    .cart-item-card:hover { box-shadow: 0 6px 24px rgba(76,90,67,0.09); }
    .cart-qty-btn {
      width: 32px; height: 32px;
      border: 1.5px solid rgba(76,90,67,0.25);
      background: #fff; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 1.1rem; color: #4C5A43; font-weight: 700;
      transition: all 0.15s;
    }
    .cart-qty-btn:hover { background: #4C5A43; color: #fff; border-color: #4C5A43; }
    .cart-summary-card {
      background: linear-gradient(160deg, #2C3320 0%, #3a4329 100%);
      border-radius: 20px;
      padding: 1.8rem 1.5rem;
      color: #fff;
    }
    .cart-checkout-btn {
      width: 100%; padding: 15px;
      background: #4C5A43; color: #fff;
      border: none; border-radius: 14px;
      font-size: 0.9rem; font-weight: 700;
      cursor: pointer; font-family: 'Open Sans', sans-serif;
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      letter-spacing: 0.02em; transition: all 0.25s;
      margin-top: 1.2rem;
    }
    .cart-checkout-btn:hover { background: #384332; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(76,90,67,0.25); }
    .cart-trust-row {
      display: flex; justify-content: center; gap: 1.5rem;
      flex-wrap: wrap; margin-top: 1rem;
    }
    .cart-trust-item {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    @media(max-width:768px) {
      .cart-page-grid { grid-template-columns: 1fr !important; }
      .cart-summary-sticky { position: static !important; }
    }
  `;

  if (cart.length === 0) return (
    <div className="cart-page" style={{ paddingTop: 130, paddingBottom: 40, background: "#F9F7F3", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
      <style>{cartCss}</style>
      <div style={{ fontSize: 52, marginBottom: 8 }}>🛒</div>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", color: "#2C3320", fontSize: "1.6rem", fontWeight: 700 }}>Your Cart is Empty</h2>
      <p style={{ color: "#5C6654", fontSize: "0.88rem" }}>Add some sacred products to get started.</p>
    </div>
  );

  return (
    <div className="cart-page" style={{ paddingTop: 90, background: "#F9F7F3", minHeight: "100vh" }}>
      <style>{cartCss}</style>
      <div className="max-w" style={{ padding: "clamp(1.2rem,4vw,2.5rem)" }}>

        {/* Page header */}
        <div style={{ marginBottom: "1.8rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4C5A43", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>SHOPPING CART</p>
          <h1 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 700, color: "#2C3320", lineHeight: 1.1 }}>Your Cart</h1>
          <div style={{ width: 48, height: 3, background: "#C8B89A", borderRadius: 2, marginTop: 8 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.8rem", alignItems: "start" }} className="cart-page-grid checkout-grid">

          {/* Items */}
          <div>
            {cart.map(item => (
              <div key={item.id} className="cart-item-card">
                {/* Image */}
                <div style={{ width: 88, height: 88, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#ece9e3", cursor: onProductClick ? "pointer" : "default" }}
                  onClick={() => onProductClick && onProductClick(item)}>
                  {item.image ? (
                    <img referrerPolicy="no-referrer" src={item.image} alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                  ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#4C5A43" }}>◆</div>}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 onClick={() => onProductClick && onProductClick(item)}
                    style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2C3320", marginBottom: 3, cursor: onProductClick ? "pointer" : "default", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    onMouseEnter={e => { if (onProductClick) e.currentTarget.style.color = "#4C5A43"; }}
                    onMouseLeave={e => e.currentTarget.style.color = "#2C3320"}
                  >{item.name}</h4>
                  <p style={{ fontSize: "0.75rem", color: "#8D9A84", marginBottom: 10 }}>Sacred Stone Accessory</p>

                  {/* Qty + Remove */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="cart-qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
                      <span style={{ minWidth: 24, textAlign: "center", fontSize: "0.9rem", fontWeight: 700, color: "#2C3320" }}>{item.qty}</span>
                      <button className="cart-qty-btn" onClick={() => onQty(item.id, 1)}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price + Badge */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2C3320" }}>Rs.{(item.price * item.qty).toLocaleString()}</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(76,90,67,0.07)", borderRadius: 10, padding: "6px 8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    <span style={{ fontSize: "0.52rem", fontWeight: 700, color: "#4C5A43", marginTop: 3, textAlign: "center", lineHeight: 1.2 }}>Handcrafted<br/>Quality</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary-sticky" style={{ position: "sticky", top: 90 }}>
            <div className="cart-summary-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Order Summary</span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 80, height: 1, background: "rgba(200,184,154,0.3)" }} />
                  <span style={{ color: "#C8B89A", fontSize: 10 }}>✦</span>
                </div>
              </div>

              {[["Subtotal", `Rs.${sub.toLocaleString()}`], ["Shipping", ship === 0 ? "FREE ✓" : `Rs.${ship}`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem" }}>{l}</span>
                  <span style={{ color: ship === 0 && l === "Shipping" ? "#C8B89A" : "#fff", fontSize: "0.84rem", fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
                <div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Total</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem", marginLeft: 6 }}>(Inclusive of all taxes)</span>
                </div>
                <span style={{ color: "#C8B89A", fontSize: "1.2rem", fontWeight: 800 }}>Rs.{total.toLocaleString()}</span>
              </div>

              <button className="cart-checkout-btn" onClick={onCheckout}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Proceed to Checkout
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "1rem", marginTop: "0.85rem", border: "1px solid rgba(76,90,67,0.1)" }}>
              <div className="cart-trust-row">
                {[
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Secure", sub: "Checkout" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: "Fast & Safe", sub: "Delivery" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>, label: "Premium", sub: "Quality" },
                ].map((t, i) => (
                  <div key={i} className="cart-trust-item">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(76,90,67,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>{t.icon}</div>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2C3320" }}>{t.label}</span>
                    <span style={{ fontSize: "0.6rem", color: "#8D9A84" }}>{t.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.65rem", color: "#8D9A84", marginTop: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              100% Secure Payments
            </p>
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
  const [payMethod, setPayMethod] = useState("razorpay"); // razorpay, qr, cod
  const [utr, setUtr] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      setFetchingCoupons(true);
      try {
        const API_BASE = getApiBase();
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
      const API_BASE = getApiBase();
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
      const API_BASE = getApiBase();
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

    const API_BASE = getApiBase();
    const token = localStorage.getItem("ws_token") || "";
    const orderPayload = {
      items: cart.map(i => ({ productId: String(i._id || i.id || ""), name: i.name || "Product", price: i.price || 0, quantity: i.qty || 1, image: i.image || "" })),
      couponCode: coupon || "",
      customer: { name: form.name, email: form.email, phone: form.phone },
      shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode, country: "India" },
    };

    if (payMethod === "qr") {
      if (!utr.trim()) {
        setError("Please enter your 12-digit UPI Transaction ID (UTR) to complete your order.");
        setLoading(false);
        return;
      }
      if (utr.trim().length !== 12 || isNaN(Number(utr.trim()))) {
        setError("UTR number must be exactly 12 digits.");
        setLoading(false);
        return;
      }
    }

    if (payMethod === "cod" || payMethod === "qr") {
      try {
        const ordRes = await fetch(`${API_BASE}/api/orders/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderPayload,
            paymentMethod: payMethod,
            razorpayPaymentId: payMethod === "qr" ? utr.trim() : "",
          })
        });
        const ordData = await ordRes.json();
        if (ordData.success) {
          onPlaceOrder({
            items: cart,
            address: form,
            totalAmount: ordData.order?.totalAmount || total,
            coupon,
            discount,
            isGift,
            giftNote,
            paymentMethod: payMethod,
            razorpayPaymentId: payMethod === "qr" ? utr.trim() : "",
            backendOrder: ordData.order
          });
        } else {
          setError(ordData.message || "Failed to place order.");
        }
      } catch (err) {
        setError("Error connecting to server. Please try again.");
      }
      setLoading(false);
      return;
    }

    try {
      // Load Razorpay script if not loaded
      if (!window.Razorpay && !document.getElementById("rzp-script")) {
        await new Promise((res, rej) => {
          const s = document.createElement("script"); s.id = "rzp-script";
          s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; s.onerror = rej;
          document.body.appendChild(s);
        });
      }

      const createRes = await fetch(`${API_BASE}/api/payment/create-order`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(orderPayload) });
      const createData = await createRes.json();
      if (!createData.success) { setError(createData.message || "Could not create payment order."); setLoading(false); return; }

      const verifyPayment = async (response) => {
        try {
          const vRes = await fetch(`${API_BASE}/api/payment/verify`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, items: orderPayload.items, customer: orderPayload.customer, shippingAddress: orderPayload.shippingAddress, couponCode: coupon || "" }) });
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
                <>
                  <div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTop: "2.5px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  {payMethod === "razorpay" ? "Processing Payment…" : "Placing Order…"}
                </>
              ) : (
                <>
                  <span>🔒</span>
                  {payMethod === "razorpay" ? `Pay ₹${total.toLocaleString()} Securely` : payMethod === "qr" ? `Confirm & Place Order (UPI)` : `Confirm & Place Order (COD)`}
                  {discount > 0 && ` (₹${discount} Discount)`}
                </>
              )}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.65rem", color: T.textMid, marginTop: "0.6rem", opacity: 0.6 }}>🔒 Secured by Razorpay — 256-bit SSL encrypted</p>
          </form>
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, position: "sticky", top: 90 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.text, fontSize: "1.05rem", fontWeight: 700, marginBottom: "1.2rem" }}>Order Summary</h3>
            {cart.map(i => {
              return (
                <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer", borderRadius: 10, padding: "6px 4px", transition: "background 0.15s" }}
                  onClick={() => navigate(`/product/${i.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(232,114,12,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${T.border}` }}>
                    <img
                      referrerPolicy="no-referrer"
                      src={i.image || ""}
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
  const API_BASE = getApiBase();
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

        setItems(fetched);
      } catch (err) {
        console.error("Failed to load wishlist items:", err);
        setItems([]);
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
    <div style={{ paddingTop: 64, height: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", boxSizing: "border-box" }}>

      {/* Dynamic Animated Entrance Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 420, textAlign: "center", padding: "0 1.5rem" }}
      >
        {/* Heart Badge with Sparkles */}
        <div style={{ position: "relative", width: 110, height: 110, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(76, 90, 67, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(76, 90, 67, 0.08)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div style={{ position: "absolute", top: 8, left: 12, fontSize: "14px", opacity: 0.8, animation: "badgeFloat1 3s ease-in-out infinite" }}>✨</div>
          <div style={{ position: "absolute", bottom: 16, right: 8, fontSize: "11px", opacity: 0.6, animation: "badgeFloat3 4s ease-in-out infinite" }}>✦</div>
          <div style={{ position: "absolute", top: 22, right: 12, fontSize: "10px", opacity: 0.7, animation: "badgeFloat2 3.5s ease-in-out infinite" }}>✦</div>
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#2C3320", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
          Your Wishlist is<br /><span style={{ color: "#4C5A43" }}>Empty</span>
        </h2>

        {/* Description */}
        <p style={{ color: "#5C6654", fontSize: "clamp(0.8rem, 1.1vw, 0.88rem)", lineHeight: 1.5, marginBottom: "1.2rem", maxWidth: 340 }}>
          Looks like you haven't saved anything yet. Explore our collections and add your favorites to your wishlist.
        </p>

        {/* Explore Button */}
        <button
          onClick={() => navigate("/shop")}
          className="btn-orange"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 24px", fontSize: "0.82rem", borderRadius: 30,
            background: "#4C5A43", color: "#fff", border: "none", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.05em",
            boxShadow: "0 8px 20px rgba(76, 90, 67, 0.18)", transition: "all 0.3s ease"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#384332"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#4C5A43"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          Explore Products
        </button>

        {/* Compact Features Row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "2rem", flexWrap: "wrap" }}>
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, label: "Save with Ease", sub: "Add items you love and keep them all in one place." },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>, label: "Stay Notified", sub: "Get alerts when your saved items go on sale." },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, label: "Secure & Private", sub: "Your wishlist is safe and visible only to you." }
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 110 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(76, 90, 67, 0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2C3320", marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: "0.65rem", color: "#5C6654", lineHeight: 1.4, textAlign: "center" }}>{f.sub}</div>
            </div>
          ))}
        </div>

        {/* Find what you love branding */}
        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#8D7A5B" }}>
            <span style={{ fontSize: 12 }}>🌿</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#2C3320" }}>Find what you love</span>
            <span style={{ fontSize: 12 }}>🌿</span>
          </div>
          <p style={{ color: "#5C6654", fontSize: "0.72rem" }}>Discover something special, just for you.</p>
        </div>

      </motion.div>
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
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "all 0.2s ease" }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
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

// ─── GOOGLE ACCOUNT CHOOSER MODAL ─────────────────────────────
function GoogleChooserModal({ open, onClose, onSelect, mode }) {
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  if (!open) return null;

  const accounts = [
    { email: "sb1258954@gmail.com", name: "Sandeep Singh", avatar: "S", color: "#4285F4" },
    { email: "testuser@gmail.com", name: "Test User", avatar: "T", color: "#34A853" },
  ];

  const handleSelect = (account) => {
    const payload = { sub: account.email.replace(/[^a-z0-9]/gi, ""), email: account.email, name: account.name, picture: "" };
    const credential = "mock_google_" + btoa(JSON.stringify(payload));
    onSelect(credential);
    onClose();
  };

  const handleCustom = () => {
    if (!customEmail) return;
    const nm = customName || customEmail.split("@")[0];
    const payload = { sub: customEmail.replace(/[^a-z0-9]/gi, ""), email: customEmail, name: nm, picture: "" };
    const credential = "mock_google_" + btoa(JSON.stringify(payload));
    onSelect(credential);
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn 0.2s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 400, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.25)", animation: "cardIn 0.35s ease both" }}>
        {/* Header */}
        <div style={{ padding: "28px 28px 0", textAlign: "center" }}>
          <svg width="30" height="30" viewBox="0 0 48 48" style={{ marginBottom: 10 }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <h3 style={{ fontFamily: "'Open Sans',sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "#202124", margin: "0 0 4px" }}>
            {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          </h3>
          <p style={{ fontFamily: "'Open Sans',sans-serif", fontSize: "0.82rem", color: "#5f6368", margin: "0 0 18px" }}>Choose an account to continue to WishStone</p>
        </div>

        {/* Account List */}
        <div style={{ padding: "0 12px" }}>
          {accounts.map(acc => (
            <button key={acc.email} onClick={() => handleSelect(acc)}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", border: "none", borderRadius: 12, background: "transparent", cursor: "pointer", transition: "background 0.15s", textAlign: "left", fontFamily: "'Open Sans',sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: acc.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", fontWeight: 700, flexShrink: 0 }}>{acc.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#202124", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#5f6368", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{acc.email}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 28px" }}>
          <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
          <span style={{ fontSize: "0.72rem", color: "#9aa0a6", fontWeight: 600, letterSpacing: "0.05em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
        </div>

        {/* Custom email */}
        {!showCustom ? (
          <div style={{ padding: "0 12px 8px" }}>
            <button onClick={() => setShowCustom(true)}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 16px", border: "none", borderRadius: 12, background: "transparent", cursor: "pointer", transition: "background 0.15s", textAlign: "left", fontFamily: "'Open Sans',sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "#1a73e8" }}>Use another account</div>
            </button>
          </div>
        ) : (
          <div style={{ padding: "0 28px 8px" }}>
            <input type="email" placeholder="Email address" value={customEmail} onChange={e => setCustomEmail(e.target.value)}
              style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #dadce0", borderRadius: 8, fontSize: "0.88rem", marginBottom: 8, outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans',sans-serif" }}
              onFocus={e => e.target.style.borderColor = "#1a73e8"} onBlur={e => e.target.style.borderColor = "#dadce0"} />
            <input type="text" placeholder="Full name (optional)" value={customName} onChange={e => setCustomName(e.target.value)}
              style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #dadce0", borderRadius: 8, fontSize: "0.88rem", marginBottom: 10, outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans',sans-serif" }}
              onFocus={e => e.target.style.borderColor = "#1a73e8"} onBlur={e => e.target.style.borderColor = "#dadce0"} />
            <button onClick={handleCustom}
              style={{ width: "100%", padding: "10px", background: "#1a73e8", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Open Sans',sans-serif", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1557b0"}
              onMouseLeave={e => e.currentTarget.style.background = "#1a73e8"}>Continue</button>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "14px 28px 20px", borderTop: "1px solid #e0e0e0", marginTop: 8 }}>
          <p style={{ fontFamily: "'Open Sans',sans-serif", fontSize: "0.72rem", color: "#9aa0a6", margin: 0, lineHeight: 1.5, textAlign: "center" }}>
            To continue, Google will share your name, email, and profile picture with WishStone.
          </p>
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
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const API_BASE = getApiBase();

  const GOOGLE_CLIENT_ID = "342285664182-b68b0t0tmj66jgu9eg14hg7212a57h2r.apps.googleusercontent.com";

  useEffect(() => {
    // google gsi script initialization removed to prevent GSI initialization warnings and errors
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
    <div style={{ minHeight: "100vh", background: "#5A6651", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1rem, 3vw, 2.5rem)", boxSizing: "border-box", paddingTop: 90, position: "relative", overflow: "hidden" }}>
      <GoogleChooserModal
        open={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        mode="signup"
        onSelect={async (credential) => {
          setGoogleLoading(true); setError("");
          try {
            const res = await fetch(`${API_BASE}/api/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential })
            });
            const data = await res.json();
            if (data.success && data.token) {
              localStorage.setItem("ws_token", data.token);
              localStorage.setItem("ws_user", JSON.stringify(data.user));
              onSignup({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) });
            } else {
              setError(data.message || "Google sign-up failed.");
            }
          } catch {
            setError("Google sign-up failed. Please try again.");
          }
          setGoogleLoading(false);
        }}
      />
      {/* Background glass blur glows for mobile */}
      <div className="login-bg-glow-1" style={{ position: "absolute", top: "15%", left: "5%", width: "clamp(240px, 50vw, 400px)", height: "clamp(240px, 50vw, 400px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="login-bg-glow-2" style={{ position: "absolute", bottom: "10%", right: "-10%", width: "clamp(280px, 60vw, 480px)", height: "clamp(280px, 60vw, 480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(245, 176, 112, 0.15) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        .login-card {
          font-family: 'Open Sans', sans-serif;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          width: 100%;
          max-width: 900px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
          min-height: 520px;
          transition: all 0.3s ease;
        }
        .login-form-side {
          flex: 1.1;
          padding: clamp(1.5rem, 5vw, 3.2rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-image-side {
          flex: 0.9;
          padding: 1.25rem;
          display: flex;
          align-items: stretch;
        }
        .login-image-container {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .login-image-src {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-image-container:hover .login-image-src {
          transform: scale(1.05);
        }
        .login-main-title {
          font-family: 'Open Sans', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: #000000;
          margin: 0 0 0.4rem 0;
          text-align: center;
        }
        .login-sub-title {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.84rem;
          color: #666666;
          margin-bottom: 1.8rem;
          text-align: center;
          font-weight: 500;
        }
        .login-or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.4rem;
        }
        .login-or-line {
          flex: 1;
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
        }
        .login-or-text {
          font-size: 0.78rem;
          color: #999999;
          font-weight: 500;
          font-family: 'Open Sans', sans-serif;
        }
        .login-input-group {
          margin-bottom: 1.1rem;
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #777777;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s;
        }
        .login-input-group:focus-within .login-input-icon {
          color: #4C5A43;
        }
        .login-custom-input {
          width: 100%;
          padding: 13px 20px 13px 48px;
          border: 1.2px solid rgba(0,0,0,0.2);
          border-radius: 9999px;
          font-size: 0.9rem;
          background: #ffffff;
          color: #1a1a1a;
          outline: none;
          box-sizing: border-box;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .login-custom-input::placeholder {
          color: #888888;
        }
        .login-custom-input:focus {
          border-color: #4C5A43;
          box-shadow: 0 0 0 3px rgba(76, 90, 67, 0.08);
        }
        .login-pw-toggle {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: #777777;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }
        .login-pw-toggle:hover {
          color: #4C5A43;
        }
        .login-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 0.94rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          background: linear-gradient(135deg, #5A6651 0%, #3e4836 100%);
          color: #ffffff;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 12px rgba(90, 102, 81, 0.2);
        }
        .login-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(90, 102, 81, 0.35);
          filter: brightness(1.08);
        }
        .login-submit-btn:active {
          transform: translateY(0);
        }
        .login-signup-prompt {
          text-align: center;
          margin-top: 1.4rem;
          font-size: 0.84rem;
          color: #666666;
          font-family: 'Open Sans', sans-serif;
        }
        .login-signup-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #4C5A43;
          font-weight: 700;
          font-size: 0.84rem;
          padding: 0;
          margin-left: 4px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-signup-link:hover {
          color: #2C3320;
          text-decoration: underline;
        }
        @media (max-width: 992px) {
          .login-card {
            max-width: 800px;
            min-height: 480px;
          }
          .login-form-side {
            padding: 2rem;
          }
        }
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            width: 90%;
            max-width: 400px;
            min-height: auto;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.55);
            backdrop-filter: blur(24px) saturate(120%);
            -webkit-backdrop-filter: blur(24px) saturate(120%);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.12);
          }
          .login-form-side {
            width: 100%;
            flex: none;
            padding: 2.2rem 1.8rem;
          }
          .login-image-side {
            display: none;
          }
          .login-main-title {
            font-size: 1.6rem;
            margin-bottom: 0.3rem;
          }
          .login-sub-title {
            font-size: 0.8rem;
            margin-bottom: 1.4rem;
          }
          .google-login-custom-btn {
            padding: 9px 12px;
            font-size: 0.8rem;
            margin-bottom: 0.8rem;
          }
          .login-or-divider {
            margin-bottom: 1.1rem;
          }
          .login-input-group {
            margin-bottom: 0.9rem;
          }
          .login-input-icon {
            left: 16px;
          }
          .login-custom-input {
            padding: 12px 18px 12px 42px;
            font-size: 0.88rem;
            background: rgba(255, 255, 255, 0.65);
            border: 1.2px solid rgba(255, 255, 255, 0.35);
            color: #000000;
          }
          .login-custom-input:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: #4C5A43;
            box-shadow: 0 0 0 3px rgba(76, 90, 67, 0.12);
          }
          .login-pw-toggle {
            right: 18px;
            font-size: 1rem;
          }
          .login-forgot-pw-link {
            margin-top: -0.4rem;
            margin-bottom: 1.2rem;
            font-size: 0.74rem;
          }
          .login-submit-btn {
            padding: 12px;
            font-size: 0.9rem;
          }
          .login-signup-prompt {
            margin-top: 1.1rem;
            font-size: 0.82rem;
          }
        }
      `}</style>
      <motion.div className="login-card" style={{ zIndex: 1, position: "relative" }}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Form Column */}
        <div className="login-form-side">
          <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: "clamp(32px, 5vw, 44px)", width: "auto", display: "block", margin: "0 auto 1rem" }} />
          <h2 className="login-main-title">Create Account</h2>
          <p className="login-sub-title">Please enter your details</p>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "1.4rem" }}>
            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="google-login-custom-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? "Loading..." : "Sign up with Google"}
            </button>
          </div>

          <div className="login-or-divider">
            <div className="login-or-line" />
            <span className="login-or-text">or</span>
            <div className="login-or-line" />
          </div>

          <form onSubmit={handle}>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="login-custom-input" required />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="login-custom-input" required />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="login-custom-input" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="login-pw-toggle">
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input type={showPw ? "text" : "password"} placeholder="Confirm Password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="login-custom-input" required />
            </div>

            {error && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

            <button type="submit" className="login-submit-btn">Create Account</button>
          </form>

          <p className="login-signup-prompt">
            Already have an account? <button onClick={onSwitch} className="login-signup-link">Sign In</button>
          </p>
        </div>

        {/* Image Column */}
        <div className="login-image-side">
          <div className="login-image-container">
            <img src={`${process.env.PUBLIC_URL || ""}/wishstone-product-login.png`} alt="Wishstone Manifest Crystal" className="login-image-src" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoginPage({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const API_BASE = getApiBase();
  const GOOGLE_CLIENT_ID = "342285664182-b68b0t0tmj66jgu9eg14hg7212a57h2r.apps.googleusercontent.com";

  useEffect(() => {
    // google gsi script initialization removed to prevent GSI initialization warnings and errors
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
    <div style={{ minHeight: "100vh", background: "#5A6651", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1rem, 3vw, 2.5rem)", boxSizing: "border-box", paddingTop: 90, position: "relative", overflow: "hidden" }}>
      <GoogleChooserModal
        open={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        mode="login"
        onSelect={async (credential) => {
          setGoogleLoading(true); setError("");
          try {
            const res = await fetch(`${API_BASE}/api/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential })
            });
            const data = await res.json();
            if (data.success && data.token) {
              localStorage.setItem("ws_token", data.token);
              localStorage.setItem("ws_user", JSON.stringify(data.user));
              onLogin({ ...data.user, joinedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) });
            } else {
              setError(data.message || "Google sign-in failed.");
            }
          } catch {
            setError("Google sign-in failed. Please try again.");
          }
          setGoogleLoading(false);
        }}
      />
      {/* Background glass blur glows for mobile */}
      <div className="login-bg-glow-1" style={{ position: "absolute", top: "15%", left: "5%", width: "clamp(240px, 50vw, 400px)", height: "clamp(240px, 50vw, 400px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="login-bg-glow-2" style={{ position: "absolute", bottom: "10%", right: "-10%", width: "clamp(280px, 60vw, 480px)", height: "clamp(280px, 60vw, 480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(245, 176, 112, 0.15) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        .login-card {
          font-family: 'Open Sans', sans-serif;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 28px;
          width: 100%;
          max-width: 900px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
          min-height: 520px;
          transition: all 0.3s ease;
        }
        .login-form-side {
          flex: 1.1;
          padding: clamp(1.5rem, 5vw, 3.2rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-image-side {
          flex: 0.9;
          padding: 1.25rem;
          display: flex;
          align-items: stretch;
        }
        .login-image-container {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .login-image-src {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .login-image-container:hover .login-image-src {
          transform: scale(1.05);
        }
        .login-main-title {
          font-family: 'Open Sans', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: #000000;
          margin: 0 0 0.4rem 0;
          text-align: center;
        }
        .login-sub-title {
          font-family: 'Open Sans', sans-serif;
          font-size: 0.84rem;
          color: #666666;
          margin-bottom: 1.8rem;
          text-align: center;
          font-weight: 500;
        }
        .google-login-custom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(0, 0, 0, 0.8);
          border-radius: 9999px;
          background: #ffffff;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          color: #000000;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          margin-bottom: 1.4rem;
          box-sizing: border-box;
        }
        .google-login-custom-btn:hover {
          background: #f8f9fa;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .google-login-custom-btn:active {
          transform: translateY(0);
        }
        .login-or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1.4rem;
        }
        .login-or-line {
          flex: 1;
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
        }
        .login-or-text {
          font-size: 0.78rem;
          color: #999999;
          font-weight: 500;
          font-family: 'Open Sans', sans-serif;
        }
        .login-input-group {
          margin-bottom: 1.1rem;
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #777777;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s;
        }
        .login-input-group:focus-within .login-input-icon {
          color: #4C5A43;
        }
        .login-custom-input {
          width: 100%;
          padding: 13px 20px 13px 48px;
          border: 1.2px solid rgba(0,0,0,0.2);
          border-radius: 9999px;
          font-size: 0.9rem;
          background: #ffffff;
          color: #1a1a1a;
          outline: none;
          box-sizing: border-box;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .login-custom-input::placeholder {
          color: #888888;
        }
        .login-custom-input:focus {
          border-color: #4C5A43;
          box-shadow: 0 0 0 3px rgba(76, 90, 67, 0.08);
        }
        .login-pw-toggle {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: #777777;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }
        .login-pw-toggle:hover {
          color: #4C5A43;
        }
        .login-forgot-pw-link {
          display: block;
          text-align: right;
          font-size: 0.78rem;
          color: #999999;
          text-decoration: none;
          margin-top: -0.5rem;
          margin-bottom: 1.6rem;
          font-weight: 500;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif;
        }
        .login-forgot-pw-link:hover {
          color: #4C5A43;
        }
        .login-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 0.94rem;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          background: linear-gradient(135deg, #5A6651 0%, #3e4836 100%);
          color: #ffffff;
          cursor: pointer;
          font-family: 'Open Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 12px rgba(90, 102, 81, 0.2);
        }
        .login-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(90, 102, 81, 0.35);
          filter: brightness(1.08);
        }
        .login-submit-btn:active {
          transform: translateY(0);
        }
        .login-signup-prompt {
          text-align: center;
          margin-top: 1.4rem;
          font-size: 0.84rem;
          color: #666666;
          font-family: 'Open Sans', sans-serif;
        }
        .login-signup-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #4C5A43;
          font-weight: 700;
          font-size: 0.84rem;
          padding: 0;
          margin-left: 4px;
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-signup-link:hover {
          color: #2C3320;
          text-decoration: underline;
        }
        @media (max-width: 992px) {
          .login-card {
            max-width: 800px;
            min-height: 480px;
          }
          .login-form-side {
            padding: 2rem;
          }
        }
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            width: 90%;
            max-width: 400px;
            min-height: auto;
            border-radius: 28px;
            border: 1px solid rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.55);
            backdrop-filter: blur(24px) saturate(120%);
            -webkit-backdrop-filter: blur(24px) saturate(120%);
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.12);
          }
          .login-form-side {
            width: 100%;
            flex: none;
            padding: 2.2rem 1.8rem;
          }
          .login-image-side {
            display: none;
          }
          .login-main-title {
            font-size: 1.6rem;
            margin-bottom: 0.3rem;
          }
          .login-sub-title {
            font-size: 0.8rem;
            margin-bottom: 1.4rem;
          }
          .google-login-custom-btn {
            padding: 9px 12px;
            font-size: 0.8rem;
            margin-bottom: 0.8rem;
          }
          .login-or-divider {
            margin-bottom: 1.1rem;
          }
          .login-input-group {
            margin-bottom: 0.9rem;
          }
          .login-input-icon {
            left: 16px;
          }
          .login-custom-input {
            padding: 12px 18px 12px 42px;
            font-size: 0.88rem;
            background: rgba(255, 255, 255, 0.65);
            border: 1.2px solid rgba(255, 255, 255, 0.35);
            color: #000000;
          }
          .login-custom-input:focus {
            background: rgba(255, 255, 255, 0.95);
            border-color: #4C5A43;
            box-shadow: 0 0 0 3px rgba(76, 90, 67, 0.12);
          }
          .login-pw-toggle {
            right: 18px;
            font-size: 1rem;
          }
          .login-forgot-pw-link {
            margin-top: -0.4rem;
            margin-bottom: 1.2rem;
            font-size: 0.74rem;
          }
          .login-submit-btn {
            padding: 12px;
            font-size: 0.9rem;
          }
          .login-signup-prompt {
            margin-top: 1.1rem;
            font-size: 0.82rem;
          }
        }
      `}</style>
      <motion.div className="login-card" style={{ zIndex: 1, position: "relative" }}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Form Column */}
        <div className="login-form-side">
          <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: "clamp(32px, 5vw, 44px)", width: "auto", display: "block", margin: "0 auto 1rem" }} />
          <h2 className="login-main-title">Welcome Back !!</h2>
          <p className="login-sub-title">Please enter your details</p>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "1.4rem" }}>
            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="google-login-custom-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? "Loading..." : "Continue with Google"}
            </button>
          </div>

          <div className="login-or-divider">
            <div className="login-or-line" />
            <span className="login-or-text">or</span>
            <div className="login-or-line" />
          </div>

          <form onSubmit={handle}>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="login-custom-input" required />
            </div>
            <div className="login-input-group">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="login-custom-input" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="login-pw-toggle">
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>

            <button type="button" onClick={() => alert("Password reset link has been sent to your email (mock).")} className="login-forgot-pw-link">Forgot password</button>

            {error && <p style={{ color: "#c0392b", fontSize: "0.78rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

            <button type="submit" className="login-submit-btn">Log In</button>
          </form>

          <p className="login-signup-prompt">
            Don't have an account? <button onClick={onSwitch} className="login-signup-link">Sign Up</button>
          </p>
        </div>

        {/* Image Column */}
        <div className="login-image-side">
          <div className="login-image-container">
            <img src={`${process.env.PUBLIC_URL || ""}/wishstone-product-login.png`} alt="Wishstone Manifest Crystal" className="login-image-src" />
          </div>
        </div>
      </motion.div>
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
    const API = getApiBase();
    setLoadingOrders(true);
    fetch(`${API}/api/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success && d.orders) setApiOrders(d.orders); })
      .catch(() => { })
      .finally(() => setLoadingOrders(false));
  }, []);

  const allOrders = apiOrders.length > 0 ? apiOrders : orders;

  // App theme colors
  const P = T.orange;                 // #4C5A43 — primary accent
  const PL = "rgba(76,90,67,0.08)";   // light green tint
  const bg = T.bg;                    // #F5F0E8 — warm beige
  const card = T.white;               // #ffffff
  const border = "rgba(76,90,67,0.12)"; // Very thin premium olive border
  const txt = T.text;                 // #1a1a1a
  const sub = "#5C6B53";              // Elegant theme olive/mid text

  const tabs = [
    {
      key: "orders",
      label: "My Orders",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      key: "track",
      label: "Track Orders",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      )
    },
    {
      key: "profile",
      label: "Profile",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      )
    },
    {
      key: "cart",
      label: "Cart",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
  ];

  const statCards = [
    {
      label: "Total Orders",
      value: allOrders.length,
      color: P,
      light: PL,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      )
    },
    {
      label: "Pending",
      value: pending,
      color: P,
      light: PL,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      label: "Completed",
      value: completed,
      color: P,
      light: PL,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    {
      label: "Total Spent",
      value: "₹" + totalSpent.toLocaleString(),
      color: P,
      light: PL,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    },
  ];

  return (
    <div style={{ paddingTop: 72, background: bg, minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
        @keyframes dashPageIn{
          from{opacity:0;transform:translateX(30px) scale(0.97);}
          to{opacity:1;transform:translateX(0) scale(1);}
        }
        .dash-nav-btn:hover{background:${PL} !important;color:${P} !important;}
        .dash-order-card:hover{box-shadow:0 12px 32px rgba(76,90,67,0.08) !important;transform:translateY(-2px);}
        .dash-stat:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(76,90,67,0.08) !important;}
        @media(max-width:1024px){
          .dash-main-content{animation:dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both;}
        }
        @media(max-width:768px){
          .dash-main-content{position:fixed;inset:0;top:64px;z-index:500;background:${bg};overflow-y:auto;padding:1.2rem 1rem 5rem;animation:dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both;}
          .dash-mobile-bottomnav{display:flex !important;}
        }
        .dash-mobile-bottomnav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:600;background:#fff;border-top:1px solid ${border};padding:6px 0 env(safe-area-inset-bottom,6px);}
        .dash-main-content::-webkit-scrollbar {
          width: 4px;
        }
        .dash-main-content::-webkit-scrollbar-thumb {
          background: ${P};
          border-radius: 2px;
        }
      `}</style>

      <div style={{ maxWidth: 1450, margin: "0 auto", padding: "1.5rem clamp(1rem,2.5vw,2rem)", display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.8rem", alignItems: "start" }} className="dashboard-layout">

        {/* ── SIDEBAR ── */}
        <aside style={{ position: "sticky", top: 80 }} className="dash-sidebar">

          {/* Brand */}
          <div style={{ background: card, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "0.8rem", border: `1px solid ${border}`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", display: "flex", alignItems: "center", gap: 12 }}>
            <img src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`} alt="WishStone" style={{ height: 18, width: "auto", display: "block", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: sub, letterSpacing: "0.1em", textTransform: "uppercase" }}>Your Dashboard</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "'Open Sans', sans-serif" }}>
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          </div>

          {/* Nav links */}
          <div style={{ background: card, borderRadius: 12, padding: "0.5rem", border: `1px solid ${border}`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", marginBottom: "0.8rem" }}>
            {tabs.map(t => (
              <button key={t.key} className="dash-nav-btn"
                onClick={() => { if (t.key === "wishlist") onNav("wishlist"); else if (t.key === "cart") onNav("cart"); else setActiveTab(t.key); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Open Sans', sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3, transition: "all 0.18s",
                  background: activeTab === t.key ? P : "transparent",
                  color: activeTab === t.key ? "#fff" : "#2C3320",
                }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, flexShrink: 0, color: activeTab === t.key ? "#fff" : P, transition: "color 0.2s" }}>{t.icon}</span>
                <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
                {activeTab === t.key && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block", flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ background: card, borderRadius: 12, padding: "0.5rem", border: `1px solid ${border}`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", marginBottom: "0.8rem" }}>
            <button onClick={onLogout} className="dash-nav-btn"
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Open Sans', sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "#c0392b", transition: "all 0.18s" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, flexShrink: 0, color: "#c0392b" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span style={{ flex: 1, textAlign: "left" }}>Sign Out</span>
            </button>
          </div>

          {/* Special offer card */}
          <div style={{ background: T.bgDark, borderRadius: 12, padding: "1.25rem 1.15rem", border: `1px solid rgba(255,255,255,0.08)` }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: T.orangeL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 7 }}>Special Promotion</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", marginBottom: "1.1rem", lineHeight: 1.6, fontFamily: "'Open Sans', sans-serif" }}>Get ₹300 off on your next purchase.<br />Use code: <strong>WOW300</strong></div>
            <button onClick={() => onNav("products")} style={{ width: "100%", padding: "10px", background: "#fff", color: T.bgDark, border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
              onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>Shop Now</button>
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
                  <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: txt, margin: 0, letterSpacing: "-0.02em", fontFamily: "'Open Sans', sans-serif" }}>Order History</h1>
                  <p style={{ color: sub, fontSize: "0.82rem", marginTop: 4, fontFamily: "'Open Sans', sans-serif" }}>{allOrders.length} order{allOrders.length !== 1 ? "s" : ""} placed</p>
                </div>
                <button onClick={() => onNav("products")} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)`, transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.orangeD}
                  onMouseLeave={e => e.currentTarget.style.background = P}>
                  + New Order
                </button>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.8rem" }} className="dashboard-stats">
                {statCards.map((s, i) => (
                  <div key={s.label} className="dash-stat" style={{ background: card, borderRadius: 12, padding: "1.2rem 1rem", border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", transition: "all 0.25s", animation: `popIn 0.4s ease ${i * 0.08}s both`, cursor: "default" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: P }}>{s.icon}</span>
                        <div style={{ fontSize: "0.68rem", color: sub, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Open Sans', sans-serif" }}>{s.label}</div>
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: P, lineHeight: 1, fontFamily: "'Open Sans', sans-serif" }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order list */}
              {loadingOrders ? (
                <div style={{ background: card, borderRadius: 12, padding: "4rem", textAlign: "center", border: `1px solid ${border}` }}>
                  <div style={{ width: 44, height: 44, border: `3px solid ${PL}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                  <p style={{ color: sub, fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>Loading your orders...</p>
                </div>
              ) : allOrders.length === 0 ? (
                <div style={{ background: card, borderRadius: 12, padding: "5rem 2rem", textAlign: "center", border: `1px solid ${border}`, animation: "fadeUp 0.5s ease both" }}>
                  <h3 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: txt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>No orders yet</h3>
                  <p style={{ color: sub, fontSize: "0.82rem", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px", fontFamily: "'Open Sans', sans-serif" }}>Start your manifestation journey and your orders will appear here.</p>
                  <button onClick={() => onNav("products")} style={{ padding: "13px 32px", fontSize: "0.72rem", borderRadius: 8, background: P, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Open Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)` }}>Explore Products</button>
                </div>
              ) : allOrders.map((o, i) => {
                const orderImages = o.items ? o.items.slice(0, 3).map(item => item.image).filter(Boolean) : [];
                const status = o.status || o.orderStatus || "Confirmed";
                const statusConfig = {
                  "Delivered": { bg: "rgba(46,125,50,0.05)", color: "#2e7d32", dot: "#2e7d32", label: "DELIVERED" },
                  "Shipped": { bg: "rgba(37,99,235,0.05)", color: "#2563eb", dot: "#2563eb", label: "SHIPPED" },
                  "Cancelled": { bg: "rgba(192,57,43,0.05)", color: "#c0392b", dot: "#c0392b", label: "CANCELLED" },
                  "Processing": { bg: "rgba(124,58,237,0.05)", color: "#7c3aed", dot: "#7c3aed", label: "PROCESSING" },
                }[status] || { bg: "rgba(76,90,67,0.05)", color: "#4c5a43", dot: P, label: status.toUpperCase() };

                return (
                  <div key={i} className="dash-order-card" style={{ background: card, borderRadius: 12, marginBottom: "1rem", border: `1px solid ${border}`, animation: `slideUp 0.35s ease ${i * 0.07}s both`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", transition: "all 0.25s", overflow: "hidden" }}>
                    <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      {/* Product images stack */}
                      <div style={{ display: "flex", flexShrink: 0 }}>
                        {orderImages.length > 0 ? orderImages.map((img, idx) => (
                          <div key={idx} style={{ width: 50, height: 50, borderRadius: 8, overflow: "hidden", border: `2px solid #fff`, background: "#f9fafb", marginLeft: idx > 0 ? -12 : 0, boxShadow: "0 2px 6px rgba(0,0,0,0.08)", zIndex: orderImages.length - idx }}>
                            <img referrerPolicy="no-referrer" src={img} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )) : (
                          <div style={{ width: 50, height: 50, borderRadius: 8, background: PL, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: P, fontFamily: "'Open Sans', sans-serif" }}>ITEM</div>
                        )}
                      </div>

                      {/* Order info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: txt, fontSize: "0.85rem", fontFamily: "'Open Sans', sans-serif" }}>ORDER #{o._id ? o._id.slice(-6).toUpperCase() : String(i + 1).padStart(6, "0")}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.dot}33`, padding: "2px 8px", borderRadius: 4, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.04em", fontFamily: "'Open Sans', sans-serif" }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusConfig.dot, display: "inline-block" }} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: "'Open Sans', sans-serif" }}>
                          <span style={{ fontSize: "0.72rem", color: sub, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontWeight: 600 }}>DATE:</span>
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </span>
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: P, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontWeight: 600 }}>AMOUNT:</span>
                            ₹{o.totalAmount ? o.totalAmount.toLocaleString() : "—"}
                          </span>
                          {o.items && <span style={{ fontSize: "0.72rem", color: sub }}><span style={{ fontWeight: 600 }}>ITEMS:</span> {o.items.length}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => setTrackModal(o)} style={{ padding: "8px 14px", background: "transparent", color: P, border: `1px solid ${P}`, borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = PL; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                          Track
                        </button>
                        <button onClick={() => setSelectedOrder(o)} style={{ padding: "8px 16px", background: P, color: "#fff", border: "none", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: `0 3px 10px rgba(76,90,67,0.15)`, transition: "all 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = T.orangeD}
                          onMouseLeave={e => e.currentTarget.style.background = P}>
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
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: txt, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>Track Orders</h1>
                <p style={{ color: sub, fontSize: "0.82rem", marginTop: 5, fontFamily: "'Open Sans', sans-serif" }}>Click on any order to view live tracking</p>
              </div>
              {allOrders.length === 0 ? (
                <div style={{ background: card, borderRadius: 12, padding: "4rem 2.5rem", textAlign: "center", border: `1px solid ${border}` }}>
                  <h3 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: txt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>No Orders to Track</h3>
                  <p style={{ color: sub, fontSize: "0.82rem", marginBottom: 22, fontFamily: "'Open Sans', sans-serif" }}>Place an order first to track your delivery.</p>
                  <button onClick={() => onNav("products")} style={{ padding: "13px 30px", fontSize: "0.72rem", borderRadius: 8, background: P, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Open Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)` }}>Shop Now</button>
                </div>
              ) : allOrders.map((o, i) => (
                <div key={i} style={{ background: card, borderRadius: 12, padding: "1.1rem 1.4rem", marginBottom: "1rem", border: `1px solid ${border}`, animation: `slideUp 0.3s ease ${i * 0.07}s both`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: PL, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: P, fontFamily: "'Open Sans', sans-serif", flexShrink: 0 }}>SHIP</div>
                    <div>
                      <div style={{ fontWeight: 700, color: txt, fontSize: "0.88rem", fontFamily: "'Open Sans', sans-serif" }}>ORDER #{o._id ? o._id.slice(-6).toUpperCase() : String(i + 1).padStart(6, "0")}</div>
                      <div style={{ fontSize: "0.72rem", color: sub, marginTop: 3, fontFamily: "'Open Sans', sans-serif" }}>
                        DATE: {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        {o.totalAmount ? ` · AMOUNT: ₹${o.totalAmount.toLocaleString()}` : ""}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setTrackModal(o)} style={{ padding: "10px 22px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 3px 10px rgba(76,90,67,0.15)`, transition: "all 0.2s", flexShrink: 0 }}
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
                  <h1 style={{ fontSize: "clamp(1.3rem,4vw,1.75rem)", fontWeight: 700, color: txt, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>My Profile</h1>
                  <p style={{ color: sub, fontSize: "clamp(0.78rem,2vw,0.82rem)", marginTop: 5, fontFamily: "'Open Sans', sans-serif" }}>Manage your account information</p>
                </div>
                <button onClick={() => { setEditForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" }); setEditingProfile(true); setEditSaved(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)`, transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.orangeD}
                  onMouseLeave={e => e.currentTarget.style.background = P}>
                  Edit Profile
                </button>
              </div>

              {/* Avatar + Info — stacks on mobile */}
              <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem", alignItems: "start" }}>

                {/* Avatar card */}
                <div style={{ background: card, borderRadius: 12, padding: "2rem 1.3rem", border: `1px solid ${border}`, textAlign: "center", boxShadow: "0 4px 16px rgba(76,90,67,0.02)" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "#fff", fontWeight: 700, margin: "0 auto 14px", boxShadow: `0 4px 16px rgba(76,90,67,0.15)`, fontFamily: "'Open Sans', sans-serif" }}>
                    {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 700, color: txt, fontSize: "1rem", marginBottom: 5, fontFamily: "'Open Sans', sans-serif" }}>{user.name || "Member"}</div>
                  <div style={{ color: P, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 9, fontFamily: "'Open Sans', sans-serif" }}>Sacred Member</div>
                  <div style={{ color: sub, fontSize: "0.72rem", fontFamily: "'Open Sans', sans-serif" }}>Joined {user.joinedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                </div>

                {/* Info card */}
                <div style={{ background: card, borderRadius: 12, padding: "clamp(1.2rem,3vw,2rem)", border: `1px solid ${border}`, boxShadow: "0 4px 16px rgba(76,90,67,0.02)" }}>
                  <div style={{ fontWeight: 700, color: txt, fontSize: "1rem", marginBottom: "1.3rem", fontFamily: "'Open Sans', sans-serif" }}>Personal Information</div>
                  <div className="profile-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[["Full Name", user.name || "—"], ["Email Address", user.email || "—"], ["Phone", user.phone || "—"], ["Member Since", user.joinedAt || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })], ["Account Type", "Sacred Member"]].map(([l, v]) => (
                      <div key={l} style={{ padding: "0.9rem 1rem", background: "#ffffff", border: `1px solid ${border}`, borderRadius: 8, minWidth: 0 }}>
                        <div style={{ fontSize: "0.62rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, fontFamily: "'Open Sans', sans-serif" }}>{l}</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: txt, wordBreak: "break-word", fontFamily: "'Open Sans', sans-serif" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {/* Account stats */}
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.3rem", borderTop: `1px solid ${border}` }}>
                    <div style={{ fontWeight: 700, color: txt, fontSize: "0.9rem", marginBottom: "1rem", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Statistics</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.8rem" }} className="dashboard-stats">
                      {statCards.map(s => (
                        <div key={s.label} style={{ background: "#ffffff", border: `1px solid ${border}`, borderRadius: 8, padding: "0.9rem 0.6rem", textAlign: "center" }}>
                          <div style={{ fontWeight: 800, color: P, fontSize: "1rem", fontFamily: "'Open Sans', sans-serif" }}>{s.value}</div>
                          <div style={{ fontSize: "0.6rem", color: sub, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700, marginTop: 4, fontFamily: "'Open Sans', sans-serif" }}>{s.label}</div>
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
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: txt, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>My Wishlist</h1>
                <p style={{ color: sub, fontSize: "0.82rem", marginTop: 4, fontFamily: "'Open Sans', sans-serif" }}>Items you've saved for later</p>
              </div>
              <button onClick={() => onNav("wishlist")} style={{ width: "100%", padding: "14px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                View Full Wishlist →
              </button>
            </div>
          )}

          {/* ── CART PANEL (mobile/tab inline) ── */}
          {activeTab === "cart" && (
            <div key="cart" style={{ animation: "dashPageIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: txt, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>My Cart</h1>
                <p style={{ color: sub, fontSize: "0.82rem", marginTop: 4, fontFamily: "'Open Sans', sans-serif" }}>Items ready for checkout</p>
              </div>
              <button onClick={() => onNav("cart")} style={{ width: "100%", padding: "14px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                View Full Cart →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {editingProfile && (
        <div onClick={() => setEditingProfile(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 12, maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(44,51,32,0.15)", border: `1px solid ${border}`, animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ background: T.bgDark, padding: "1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${border}` }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Open Sans', sans-serif" }}>Edit Profile</h2>
                <p style={{ fontSize: "0.72rem", color: T.orangeL, marginTop: 3, fontFamily: "'Open Sans', sans-serif" }}>Changes will be saved permanently</p>
              </div>
              <button onClick={() => setEditingProfile(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: 6, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ padding: "2rem" }}>
              {editSaved ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <h3 style={{ fontWeight: 700, color: txt, fontSize: "1.1rem", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Open Sans', sans-serif" }}>Profile Updated!</h3>
                  <p style={{ color: sub, fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>Your changes have been saved successfully.</p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div style={{ marginBottom: "1.1rem" }}>
                    <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Open Sans', sans-serif" }}>Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 8, fontSize: "0.85rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans', sans-serif", background: "#ffffff" }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: "1.1rem" }}>
                    <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Open Sans', sans-serif" }}>Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Enter your email"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 8, fontSize: "0.85rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans', sans-serif", background: "#ffffff" }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: "1.6rem" }}>
                    <label style={{ display: "block", fontSize: "0.62rem", fontWeight: 700, color: sub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'Open Sans', sans-serif" }}>Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${border}`, borderRadius: 8, fontSize: "0.85rem", color: txt, outline: "none", boxSizing: "border-box", fontFamily: "'Open Sans', sans-serif", background: "#ffffff" }}
                      onFocus={e => e.target.style.borderColor = P}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    <button onClick={() => setEditingProfile(false)}
                      style={{ flex: 1, padding: "12px", background: "transparent", color: sub, border: `1px solid ${border}`, borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Cancel
                    </button>
                    <button onClick={() => {
                      if (!editForm.name.trim() && !editForm.email.trim()) return;
                      const updated = { ...user, name: editForm.name.trim() || user.name, email: editForm.email.trim() || user.email, phone: editForm.phone.trim() };
                      onUpdateUser(updated);
                      setEditSaved(true);
                      setTimeout(() => setEditingProfile(false), 1400);
                    }}
                      style={{ flex: 2, padding: "12px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)` }}>
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
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 12, maxWidth: 700, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(44,51,32,0.15)", border: `1px solid ${border}`, animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>

            {/* Header */}
            <div style={{ position: "sticky", top: 0, background: T.bgDark, borderBottom: `1px solid ${border}`, padding: "1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Open Sans', sans-serif" }}>Order Details</h2>
                <p style={{ fontSize: "0.72rem", color: T.orangeL, marginTop: 3, fontFamily: "'Open Sans', sans-serif" }}>Order #{selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : "N/A"}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: 6, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ padding: "2rem" }}>
              {/* Order Status */}
              <div style={{ background: PL, borderRadius: 8, padding: "1.2rem", marginBottom: "1.5rem", border: `1px solid ${border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: sub, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Open Sans', sans-serif" }}>Order Status</div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: P, fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>{selectedOrder.status || "Confirmed"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: sub, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Open Sans', sans-serif" }}>Order Date</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: txt, fontFamily: "'Open Sans', sans-serif" }}>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: txt, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Open Sans', sans-serif" }}>Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => {
                  return (
                    <div key={idx} style={{ background: "#ffffff", borderRadius: 8, padding: "1rem", marginBottom: "0.8rem", display: "flex", gap: 14, alignItems: "center", border: `1px solid ${border}` }}>
                      <div style={{ width: 64, height: 64, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#fff", border: `1px solid ${border}` }}>
                        <img referrerPolicy="no-referrer" src={item.image || "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80"} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: txt, fontSize: "0.88rem", marginBottom: 3, fontFamily: "'Open Sans', sans-serif" }}>{item.name || "Product"}</div>
                        <div style={{ fontSize: "0.72rem", color: sub, fontFamily: "'Open Sans', sans-serif" }}>QUANTITY: {item.quantity || item.qty || 1}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: P, fontFamily: "'Open Sans', sans-serif" }}>₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()}</div>
                        <div style={{ fontSize: "0.72rem", color: sub, marginTop: 2, fontFamily: "'Open Sans', sans-serif" }}>₹{(item.price || 0).toLocaleString()} each</div>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ background: "#ffffff", borderRadius: 8, padding: "2rem", textAlign: "center", border: `1px solid ${border}` }}>
                    <p style={{ color: sub, fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>No items found in this order</p>
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              <div style={{ background: T.bgDark, borderRadius: 8, padding: "1.5rem", color: "#fff", border: `1px solid ${border}` }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Open Sans', sans-serif" }}>Bill Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>
                  <span style={{ opacity: 0.8 }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>
                  <span style={{ opacity: 0.8 }}>Shipping</span>
                  <span style={{ fontWeight: 700 }}>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem", fontSize: "0.82rem", fontFamily: "'Open Sans', sans-serif" }}>
                  <span style={{ opacity: 0.8 }}>Tax (GST)</span>
                  <span style={{ fontWeight: 700 }}>Included</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: "0.8rem", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>Total Amount</span>
                  <span style={{ fontSize: "1.35rem", fontWeight: 800, fontFamily: "'Open Sans', sans-serif" }}>₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
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
                    <div style={{ marginTop: 6, color: sub, fontSize: "0.78rem", fontWeight: 600, fontFamily: "'Open Sans', sans-serif" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, opacity: 0.65, marginRight: 5 }}>PHONE:</span>
                      {selectedOrder.shippingAddress.phone || "—"}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                <button onClick={() => { setSelectedOrder(null); setTrackModal(selectedOrder); }}
                  style={{ flex: 1, padding: "12px", background: PL, color: P, border: `1px solid ${border}`, borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(76,90,67,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = PL}>
                  Track Order
                </button>
                <button onClick={() => setSelectedOrder(null)}
                  style={{ flex: 1, padding: "12px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)` }}
                  onMouseEnter={e => e.currentTarget.style.background = "#384332"}
                  onMouseLeave={e => e.currentTarget.style.background = P}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="dash-mobile-bottomnav" style={{ justifyContent: "space-around", alignItems: "center", background: "#ffffff", borderTop: `1px solid ${border}`, padding: "8px 0" }}>
        {[
          { key: "orders", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>, label: "Orders" },
          { key: "track", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>, label: "Track" },
          { key: "profile", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>, label: "Profile" },
          { key: "wishlist", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>, label: "Wishlist" },
          { key: "cart", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>, label: "Cart" },
        ].map(t => (
          <button key={t.key}
            onClick={() => { if (t.key === "wishlist") onNav("wishlist"); else if (t.key === "cart") onNav("cart"); else setActiveTab(t.key); }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 0",
              fontFamily: "'Open Sans', sans-serif"
            }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20, color: activeTab === t.key ? P : "#8a8a7a", transition: "color 0.2s" }}>
              {t.icon}
            </span>
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: activeTab === t.key ? P : "#8a8a7a", letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ── TRACK ORDER MODAL ── */}
      {trackModal && (
        <div onClick={() => setTrackModal(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: card, borderRadius: 12, maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(44,51,32,0.15)", border: `1px solid ${border}`, animation: "trackModalIn 0.35s cubic-bezier(0.34,1.2,0.64,1) both", overflow: "hidden" }}>
            <style>{`
              @keyframes trackModalIn{
                from{opacity:0;transform:translateY(30px) scale(0.96);}
                to{opacity:1;transform:translateY(0) scale(1);}
              }
              @keyframes fadeSlideUp{
                from{opacity:0;transform:translateY(12px);}
                to{opacity:1;transform:translateY(0);}
              }
            `}</style>

            {/* Header */}
            <div style={{ background: "#2C3320", padding: "1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${border}` }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Open Sans', sans-serif" }}>Order Tracking</h2>
                <p style={{ fontSize: "0.72rem", color: "#a2b097", marginTop: 3, fontFamily: "'Open Sans', sans-serif" }}>Live delivery status</p>
              </div>
              <button onClick={() => setTrackModal(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", borderRadius: 6, transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ padding: "1.6rem 2rem" }}>
              {trackModal === "empty" || allOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1rem 0", animation: "fadeSlideUp 0.3s ease both" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: txt, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>No Orders to Track</h3>
                  <p style={{ color: sub, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "1.5rem", fontFamily: "'Open Sans', sans-serif" }}>You haven't placed any orders yet. Start your manifestation journey and your tracking details will appear here.</p>
                  <button onClick={() => { setTrackModal(null); onNav("products"); }} style={{ padding: "12px 28px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)` }}>
                    Shop Now
                  </button>
                </div>
              ) : (
                <>
                  {/* Order ID row */}
                  <div style={{ background: PL, borderRadius: 8, padding: "0.9rem 1.1rem", marginBottom: "1.2rem", border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeSlideUp 0.3s ease both" }}>
                    <div>
                      <div style={{ fontSize: "0.62rem", color: sub, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2, fontFamily: "'Open Sans', sans-serif" }}>Order ID</div>
                      <div style={{ fontWeight: 800, color: txt, fontSize: "0.95rem", fontFamily: "'Open Sans', sans-serif" }}>#{(typeof trackModal === "object" && trackModal._id) ? trackModal._id.slice(-6).toUpperCase() : "—"}</div>
                    </div>
                    <span style={{ background: "rgba(46,125,50,0.05)", color: "#2e7d32", padding: "4px 12px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700, border: "1px solid rgba(46,125,50,0.15)", letterSpacing: "0.04em", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase" }}>Confirmed</span>
                  </div>

                  {/* Delivery message */}
                  <div style={{ background: "rgba(46,125,50,0.04)", borderRadius: 8, padding: "1.1rem 1.3rem", marginBottom: "1.1rem", border: "1px solid rgba(46,125,50,0.12)", animation: "fadeSlideUp 0.3s ease 0.08s both" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(46,125,50,0.1)", borderRadius: "50%", padding: 6, flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: "#2e7d32", fontSize: "0.88rem", marginBottom: 4, fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.03em" }}>Your item is on its way</div>
                        <div style={{ fontSize: "0.8rem", color: "#2e7d32", lineHeight: 1.6, fontFamily: "'Open Sans', sans-serif" }}>
                          Expected delivery within <strong>4 to 5 working days</strong> from order placement. Our team is carefully packaging your sacred items.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support row */}
                  <div style={{ background: PL, borderRadius: 8, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${border}`, marginBottom: "1.3rem", animation: "fadeSlideUp 0.3s ease 0.16s both" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: sub, letterSpacing: "0.05em", fontFamily: "'Open Sans', sans-serif" }}>SUPPORT:</span>
                    <span style={{ fontSize: "0.76rem", color: txt, fontWeight: 600, fontFamily: "'Open Sans', sans-serif" }}>support@wishstone.in</span>
                  </div>

                  <button onClick={() => setTrackModal(null)} style={{ width: "100%", padding: "12px", background: P, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", boxShadow: `0 4px 12px rgba(76,90,67,0.15)`, animation: "fadeSlideUp 0.3s ease 0.24s both" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#384332"}
                    onMouseLeave={e => e.currentTarget.style.background = P}>
                    Got it, Thanks
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
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "#fff", borderRadius: 12, maxWidth: 420, width: "100%", padding: "2.5rem 2rem", textAlign: "center", border: `1px solid rgba(76, 90, 67, 0.12)`, boxShadow: "0 20px 60px rgba(44,51,32,0.12)", animation: "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        {/* Animated checkmark */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#4C5A43,#5C6B53)", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(76,90,67,0.2)", animation: step >= 1 ? "fadeInScale 0.5s ease both" : "none", opacity: step >= 1 ? 1 : 0 }}>
          <span style={{ fontSize: 36, color: "#fff" }}>✓</span>
        </div>

        <h2 style={{ fontFamily: "'Open Sans', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "#1a1a1a", marginBottom: "0.5rem", opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? "translateY(0)" : "translateY(10px)", transition: "all 0.4s ease", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Order Confirmed
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem", opacity: step >= 2 ? 1 : 0, transition: "all 0.4s ease 0.1s", fontFamily: "'Open Sans', sans-serif" }}>
          Your sacred order has been placed successfully
        </p>

        {/* Order details */}
        <div style={{ background: "rgba(76, 90, 67, 0.04)", border: "1px solid rgba(76, 90, 67, 0.08)", borderRadius: 8, padding: "1.2rem", marginBottom: "1.5rem", opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? "translateY(0)" : "translateY(12px)", transition: "all 0.4s ease 0.2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "'Open Sans', sans-serif" }}>Order ID</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1a1a1a", fontFamily: "'Open Sans', sans-serif" }}>#{order._id.slice(-6).toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "'Open Sans', sans-serif" }}>Amount Paid</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#4C5A43", fontFamily: "'Open Sans', sans-serif" }}>Rs.{(order.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "'Open Sans', sans-serif" }}>Delivery</span>
            <span style={{ background: "rgba(76, 90, 67, 0.08)", color: "#4C5A43", padding: "3px 10px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700, fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>4–5 Business Days</span>
          </div>
        </div>

        {/* Delivery steps */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.8rem", opacity: step >= 3 ? 1 : 0, transition: "all 0.4s ease 0.3s" }}>
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              ),
              label: "Packed"
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              ),
              label: "Shipped"
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C5A43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              ),
              label: "Delivered"
            }
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Open Sans', sans-serif" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "#4C5A43", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", opacity: step >= 3 ? 1 : 0, transition: "opacity 0.4s ease 0.4s", boxShadow: "0 4px 12px rgba(76, 90, 67, 0.15)" }}>
          Track My Order
        </button>
      </div>
    </div>
  );
}

// ─── PROMO MODAL ──────────────────────────────────────────────
function PromoModal({ onClose, onShop, userEmail }) {
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

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          zIndex: 1,
        }}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #F9F6F0 0%, #EDE6DB 100%)",
          borderRadius: 28,
          maxWidth: 440,
          width: "100%",
          padding: "2.8rem 2.2rem 1.8rem",
          boxShadow: "0 30px 70px rgba(44,51,32,0.22)",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          fontFamily: "'Open Sans', sans-serif",
          border: "1px solid rgba(76, 90, 67, 0.12)",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2C3320",
            opacity: 0.6,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Logo & Header */}
        <div style={{ marginBottom: "1.2rem" }}>
          <img
            src={`${process.env.PUBLIC_URL || ""}/wishstone svg.svg`}
            alt="WishStone"
            style={{ height: 26, width: "auto", margin: "0 auto", display: "block" }}
          />
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.25rem", color: "#8D7A5B", marginTop: 6, fontWeight: 800 }}>
            SACRED STORE
          </div>
        </div>

        {!claimed ? (
          <>
            {/* Title */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 4vw, 1.8rem)", color: "#2C3320", fontWeight: 400, lineHeight: 1.3, marginBottom: "0.6rem" }}>
              Begin your <span style={{ fontStyle: "italic", color: "#8D7A5B", fontFamily: "'Playfair Display', serif" }}>sacred</span> journey with us
            </h3>

            {/* Sparkle Divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", margin: "0.6rem 0 0.8rem 0" }}>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, transparent, rgba(141,122,91,0.22))" }} />
              <span style={{ color: "#8D7A5B", fontSize: "12px" }}>✦</span>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(270deg, transparent, rgba(141,122,91,0.22))" }} />
            </div>

            {/* Subheader */}
            <p style={{ fontSize: "0.85rem", color: "#5C6654", lineHeight: 1.5, marginBottom: "1.4rem", padding: "0 10px" }}>
              Unlock <span style={{ color: "#8D7A5B", fontWeight: 700 }}>₹300 OFF</span> on your first order and step into something meaningful.
            </p>

            {/* Input field wrapper */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.45)",
              border: `1px solid ${emailError ? "#c0392b" : "rgba(76, 90, 67, 0.18)"}`,
              borderRadius: 12,
              padding: "0 14px",
              height: "46px",
              marginBottom: emailError ? "0.3rem" : "1rem",
              transition: "border-color 0.2s",
              width: "100%",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8D7A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="Email address"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "0.88rem",
                  color: "#2C3320",
                  fontFamily: "'Open Sans', sans-serif"
                }}
                onKeyDown={e => e.key === "Enter" && handleClaim()}
              />
            </div>
            {emailError && <p style={{ fontSize: "0.72rem", color: "#c0392b", marginBottom: "0.8rem", textAlign: "left", paddingLeft: 4 }}>{emailError}</p>}

            {/* Submit Button */}
            <button
              onClick={handleClaim}
              style={{
                width: "100%",
                height: "46px",
                background: "#4C5A43",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Open Sans', sans-serif",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 20px rgba(76, 90, 67, 0.15)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#384332"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#4C5A43"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Unlock My Offer ✦
            </button>

            {/* Reject Link */}
            <div style={{ marginTop: "0.8rem" }}>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  color: "#7C8675",
                  fontFamily: "'Open Sans', sans-serif",
                  textDecoration: "underline",
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#4C5A43"}
                onMouseLeave={e => e.currentTarget.style.color = "#7C8675"}
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Coupon State */}
            <div style={{ fontSize: 40, marginBottom: "0.6rem" }}>🎉</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#2C3320", marginBottom: "0.4rem", fontWeight: 700 }}>
              Your coupon is ready!
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#7C8675", marginBottom: "1.4rem" }}>
              Copy the code below and use it at checkout
            </p>
            <div
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(76, 90, 67, 0.05)",
                border: `2px dashed #4C5A43`,
                borderRadius: 14,
                padding: "12px 18px",
                cursor: "pointer",
                marginBottom: "1.4rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(76, 90, 67, 0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(76, 90, 67, 0.05)"}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4C5A43", letterSpacing: "0.1em" }}>
                {COUPON}
              </span>
              <span style={{ background: copied ? "#2d7a5a" : "#4C5A43", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: "0.7rem", fontWeight: 700, transition: "background 0.2s" }}>
                {copied ? "✓ Copied!" : "COPY"}
              </span>
            </div>
            <button
              onClick={() => { onClose(); onShop(); }}
              style={{
                width: "100%",
                height: "46px",
                fontSize: "0.85rem",
                borderRadius: 12,
                background: "#4C5A43",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 8px 20px rgba(76, 90, 67, 0.15)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#384332"}
              onMouseLeave={e => e.currentTarget.style.background = "#4C5A43"}
            >
              Shop Now & Save
            </button>
          </>
        )}

        {/* Realistic Stone Image Container */}
        <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "18px", overflow: "hidden", marginTop: "1.4rem", border: "1px solid rgba(76, 90, 67, 0.08)" }}>
          <img
            src={`${process.env.PUBLIC_URL || ""}/wishstone-product-login.png`}
            alt="Sacred stone"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "block"; }}
          />
          <div style={{ display: "none", position: "absolute", inset: 0, margin: "auto", width: "60%", height: "80%", background: "radial-gradient(ellipse at 60% 40%, #d4c5a9 0%, #c4a882 40%, #8d7355 100%)", borderRadius: "50% 45% 55% 48%" }} />
          {/* Leaf shadow overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(135deg, rgba(76,90,67,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
          {/* Concentric gold rings overlay */}
          <div style={{ position: "absolute", border: "1px solid rgba(141,122,91,0.22)", borderRadius: "50%", width: "180px", height: "180px", top: "-30px", right: "-30px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", border: "1px solid rgba(141,122,91,0.14)", borderRadius: "50%", width: "240px", height: "240px", top: "-60px", right: "-60px", pointerEvents: "none" }} />
        </div>

        {/* Features Row Pill at the very bottom */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.78)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          padding: "8px 12px",
          width: "100%",
          marginTop: "1.2rem",
          boxShadow: "0 8px 24px rgba(44, 51, 32, 0.06)"
        }}>
          {/* Item 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, textAlign: "left" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8D7A5B" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#2C3320", lineHeight: 1.25 }}>
              Handpicked<br />with Intention
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: "1px", height: "22px", background: "rgba(76, 90, 67, 0.12)", margin: "0 4px" }} />
          {/* Item 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1.2, textAlign: "left" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8D7A5B" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#2C3320", lineHeight: 1.25 }}>
              Made to Elevate<br />Your Energy
            </div>
          </div>
          {/* Divider */}
          <div style={{ width: "1px", height: "22px", background: "rgba(76, 90, 67, 0.12)", margin: "0 4px" }} />
          {/* Item 3 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1.2, textAlign: "left" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8D7A5B" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#2C3320", lineHeight: 1.25 }}>
              For Your Journey<br />of Manifestation
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
// ─── PRODUCT PAGE WRAPPER (reads :id from URL, fetches from backend) ──
function ProductPageWrapper({ onAdd, onAddAnim, onWish, wished, cart, onShop }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = getApiBase();
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
          console.error("Product not found in backend");
          navigate("/shop", { replace: true });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Network error fetching product:", err);
        navigate("/shop", { replace: true });
        setLoading(false);
      });
  }, [id, API_BASE, navigate]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 90 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(5,150,105,0.2)", borderTop: "3px solid #059669", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#000000", fontSize: "0.88rem", fontWeight: 500 }}>Loading product…</p>
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

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", "#F5F0E8");
    }
  }, []);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ws_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem("ws_user");
      }
    }
    return null;
  });
  const [orders, setOrders] = useState(() => {
    const savedUser = localStorage.getItem("ws_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const userKey = `ws_orders_${u.email || "guest"}`;
        const savedOrders = localStorage.getItem(userKey);
        return savedOrders ? JSON.parse(savedOrders) : [];
      } catch (e) { }
    }
    return [];
  });
  const [orderConfirm, setOrderConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load user-specific data on mount (handled synchronously above)
  useEffect(() => { }, []);

  // Periodically verify user still exists in backend — auto-logout if deleted by admin
  useEffect(() => {
    const checkUserExists = async () => {
      const token = localStorage.getItem("ws_token");
      if (!token || token.startsWith("local_") || token.startsWith("google_")) return;
      try {
        const API = getApiBase();
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

    const shownKey = user?.email
      ? `ws_coupon_shown_${user.email}`
      : `ws_coupon_shown_guest`;

    // Never show if already claimed or already shown
    if (localStorage.getItem(claimKey) || localStorage.getItem(shownKey)) return;

    // Show 5 sec after page load/refresh
    const t = setTimeout(() => {
      setShowModal(true);
      localStorage.setItem(shownKey, "true");
    }, 5000);
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

    // If backendOrder already exists, do not create duplicate order
    if (data.backendOrder) return;

    // Also send to backend so admin panel can see it
    try {
      const API = getApiBase();
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
        paymentMethod: data.paymentMethod || "cod",
        razorpayPaymentId: data.razorpayPaymentId || "",
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

  const isHome = currentPage === "home";

  return (
    <div style={{
      fontFamily: "'Inter',sans-serif",
      background: T.bg,
      minHeight: "100vh",
      overflowX: "hidden",
      "--accent-color": isHome ? "#4C5A43" : "#E8720C",
      "--accent-hover": isHome ? "#384332" : "#C45E00",
      "--accent-bg-tint": isHome ? "rgba(76, 90, 67, 0.08)" : "rgba(232, 114, 12, 0.08)",
      "--accent-border-tint": isHome ? "rgba(76, 90, 67, 0.22)" : "rgba(232, 114, 12, 0.22)",
      "--accent-shadow-tint": isHome ? "rgba(76, 90, 67, 0.12)" : "rgba(232, 114, 12, 0.12)",
    }}>
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
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} onSwitch={() => navigate("/signup")} />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage onSignup={handleLogin} onSwitch={() => navigate("/login")} />} />
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
      <AnimatePresence>
        {showModal && (
          <PromoModal
            onClose={() => setShowModal(false)}
            onShop={() => { setShowModal(false); nav("products"); }}
            userEmail={user?.email}
          />
        )}
      </AnimatePresence>
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
