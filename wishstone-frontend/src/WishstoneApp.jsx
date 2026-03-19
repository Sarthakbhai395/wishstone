import { useState, useEffect, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────
const T = {
  navy:"#212842", navyD:"#161B2E", navyL:"#2D3559",
  cream:"#F0E7D5", creamD:"#E8DCC8",
  gold:"#C9A96E", goldD:"#8B6914", goldL:"#E2C58A",
  rose:"#C4747A",
};

// ─── DATA ────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"manifestation", name:"Manifestation", image:"https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80", desc:"Crystals & tools to align your energy with the universe" },
  { id:"therapy",       name:"Therapy",       image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", desc:"Natural healing aids for mind, body & soul restoration" },
  { id:"habit-builder", name:"Habit Builder", image:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", desc:"Daily rituals & tools to build powerful life habits" },
];

const PRODUCTS = [
  { id:1, name:"Celestial Rose Quartz",     category:"manifestation", price:1299, originalPrice:1799, discount:28, image:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", shortDesc:"Moon-charged rose quartz to amplify love, compassion, and self-worth energies in your sacred space.", suitableFor:"Beginners, healers, those seeking emotional balance", benefits:["Enhances self-love","Promotes emotional healing","Attracts positive relationships","Clears heart chakra"], bestSeller:true },
  { id:2, name:"Lunar Amethyst Cluster",    category:"manifestation", price:2199, originalPrice:2999, discount:27, image:"https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80", shortDesc:"Premium amethyst cluster from Brazilian mines for meditation and amplifying intuition.", suitableFor:"Meditators, spiritual seekers, healers", benefits:["Deepens meditation","Protects energy field","Enhances intuition","Promotes restful sleep"], bestSeller:true },
  { id:3, name:"Healing Lavender Bundle",   category:"therapy",       price:699,  originalPrice:999,  discount:30, image:"https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&q=80", shortDesc:"Hand-harvested organic lavender for cleansing negative energy and deep relaxation.", suitableFor:"Anyone seeking calm, anxiety relief, better sleep", benefits:["Reduces stress","Purifies space","Promotes sleep","Calms the nervous system"], bestSeller:true },
  { id:4, name:"Moonstone Ritual Kit",      category:"habit-builder", price:1899, originalPrice:2499, discount:24, image:"https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&q=80", shortDesc:"Complete ritual kit with journal, crystal, and guide for powerful daily moon rituals.", suitableFor:"Anyone building spiritual daily habits", benefits:["Creates daily ritual","Tracks moon cycles","Builds consistency","Deepens self-awareness"], bestSeller:false },
  { id:5, name:"Obsidian Protection Stone", category:"manifestation", price:899,  originalPrice:1199, discount:25, image:"https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&q=80", shortDesc:"Volcanic obsidian known for its powerful protective properties against negative energies.", suitableFor:"Empaths, sensitives, protection seekers", benefits:["Shields from negativity","Grounds energy","Reveals hidden truths","Heals emotional wounds"], bestSeller:true },
  { id:6, name:"Sacred Sandalwood Incense", category:"therapy",       price:499,  originalPrice:699,  discount:29, image:"https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80", shortDesc:"Premium Mysore sandalwood incense for meditation, yoga, and sacred home spaces.", suitableFor:"Meditators, yoga practitioners, home rituals", benefits:["Deepens focus","Purifies air","Elevates mood","Aids in prayer"], bestSeller:false },
];

const FAQS = [
  { q:"How do I use the crystals?", a:"Cleanse your crystal under moonlight or with sage smoke. Set your intention by holding it in both hands and breathing deeply. Place it in your space or carry it with you daily." },
  { q:"How long does it take to see results?", a:"Most customers notice subtle energy shifts within 7–21 days of consistent use. Results vary by individual, intention clarity, and usage consistency." },
  { q:"Are all products 100% natural?", a:"Yes. Every Wishstone product is ethically sourced, 100% natural, and free from synthetic treatments or artificial enhancements." },
  { q:"What are your shipping timelines?", a:"Standard delivery: 5–7 business days. Express delivery: 2–3 business days. Free shipping on orders above ₹999." },
  { q:"What is your return policy?", a:"We offer hassle-free returns within 7 days of delivery. Product must be unused and in original packaging. Refund processed within 3–5 business days." },
];

const VIDEOS = [
  { title:"Crystal Cleansing Ritual", thumb:"https://images.pexels.com/photos/29858947/pexels-photo-29858947.jpeg", tag:"Manifestation", src:"https://www.pexels.com/download/video/854228/" },
  { title:"Moon Water Preparation",   thumb:"https://images.pexels.com/photos/19824838/pexels-photo-19824838.jpeg", tag:"Therapy",       src:"https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4" },
  { title:"Morning Habit Ritual",     thumb:"https://images.pexels.com/photos/920534/pexels-photo-920534.jpeg",    tag:"Habit Builder", src:"https://www.pexels.com/download/video/854739/" },
  { title:"Sacred Space Setup",       thumb:"https://images.pexels.com/photos/6498990/pexels-photo-6498990.jpeg", tag:"Therapy",       src:"https://www.pexels.com/download/video/1093662/" },
];

// ─── SCROLL TO TOP UTILITY ────────────────────────────────────
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// ─── GLOBAL CSS ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;500;600;700;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:#161B2E;color:#F0E7D5;font-family:'Cormorant Garamond',serif;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#161B2E;}
  ::-webkit-scrollbar-thumb{background:#C9A96E;border-radius:3px;}
  input,select,textarea,button{font-family:'Cormorant Garamond',serif;}

  @keyframes twinkle{0%,100%{opacity:0;transform:scale(0.3);}50%{opacity:1;transform:scale(1);}}
  @keyframes floatUp{0%{transform:translateY(0) rotate(0deg);opacity:0.8;}100%{transform:translateY(-105vh) rotate(360deg);opacity:0;}}
  @keyframes moonGlow{0%,100%{box-shadow:0 0 50px rgba(240,231,213,0.2),0 0 100px rgba(201,169,110,0.12);}50%{box-shadow:0 0 80px rgba(240,231,213,0.38),0 0 150px rgba(201,169,110,0.25);}}
  @keyframes orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}
  @keyframes scrollPulse{0%,100%{transform:translateX(-50%) scaleY(1);opacity:0.7;}50%{transform:translateX(-50%) scaleY(1.3);opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}

  /* ─── RESPONSIVE ─── */
  @media(max-width:1024px){
    .footer-grid{grid-template-columns:1fr 1fr !important;}
    .cat-grid{grid-template-columns:repeat(2,1fr) !important;}
  }
  @media(max-width:768px){
    .hero-title{font-size:clamp(1.8rem,7vw,3rem) !important;}
    .hero-stats{gap:1.2rem !important;flex-wrap:wrap;justify-content:center;}
    .hero-btns{flex-direction:column;align-items:center;}
    .hero-btns button{width:100%;max-width:280px;}
    .cat-grid{grid-template-columns:1fr !important;}
    .prod-grid{grid-template-columns:repeat(2,1fr) !important;}
    .story-grid{grid-template-columns:1fr !important;gap:2rem !important;}
    .story-grid img{max-width:100%;}
    .footer-grid{grid-template-columns:1fr 1fr !important;}
    .checkout-grid{grid-template-columns:1fr !important;}
    .cart-grid{grid-template-columns:1fr !important;}
    .prod-detail-grid{grid-template-columns:1fr !important;}
    .vid-thumbs{grid-template-columns:repeat(2,1fr) !important;}
    .section-pad{padding:70px 1.5rem !important;}
    .header-nav{display:none !important;}
    .header-auth{display:none !important;}
    .header-icons{display:none !important;}
    .mobile-menu-btn{display:flex !important;}
    .cart-item-row{flex-wrap:wrap;}
    .dashboard-grid{grid-template-columns:1fr !important;}
    .dashboard-sidebar{position:static !important;height:auto !important;}
    .checkout-form-grid{grid-template-columns:1fr !important;}
    .checkout-city-grid{grid-template-columns:1fr 1fr !important;}
    .profile-grid{grid-template-columns:1fr !important;}
    .order-detail-grid{grid-template-columns:1fr !important;}
    .payment-btns{flex-direction:column !important;}
    .payment-btns button{flex:none !important;width:100% !important;}
    .prod-benefits-grid{grid-template-columns:1fr !important;}
    .cart-summary{position:static !important;top:auto !important;}
  }
  @media(max-width:480px){
    .prod-grid{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
    .section-pad{padding:60px 1rem !important;}
    .hero-stats{gap:0.8rem !important;}
    .checkout-city-grid{grid-template-columns:1fr !important;}
    .vid-thumbs{grid-template-columns:repeat(2,1fr) !important;}
    .cart-item-row{gap:0.8rem !important;}
    .cart-item-row img{width:64px !important;height:64px !important;}
    .signup-card{padding:1.5rem 1.2rem !important;}
    .login-card{padding:1.5rem 1.2rem !important;}
    .dashboard-content{padding:1.5rem !important;}
    .track-modal-inner{padding:1.2rem !important;}
    .track-steps{gap:0.5rem !important;}
    .track-steps>div{min-width:0 !important;}
    .track-steps p{font-size:0.58rem !important;}
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────
const Divider = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"0.9rem auto",width:"fit-content"}}>
    <div style={{width:32,height:1,background:`linear-gradient(to right,transparent,${T.gold})`}}/>
    <span style={{color:T.gold,fontSize:"0.85rem"}}>✦</span>
    <div style={{width:6,height:6,border:`1px solid ${T.gold}`,transform:"rotate(45deg)"}}/>
    <span style={{color:T.gold,fontSize:"0.85rem"}}>✦</span>
    <div style={{width:32,height:1,background:`linear-gradient(to left,transparent,${T.gold})`}}/>
  </div>
);

const SecHead = ({ eye, title, dark=false }) => (
  <div style={{textAlign:"center",marginBottom:"3rem"}}>
    <p style={{color:dark?T.goldD:T.gold,fontSize:"0.65rem",letterSpacing:"0.38em",fontFamily:"'Cinzel',serif",marginBottom:8,textTransform:"uppercase"}}>{eye}</p>
    <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:dark?T.navy:T.cream,fontWeight:700,lineHeight:1.25}}>{title}</h2>
    <Divider/>
  </div>
);

// ─── STARS ───────────────────────────────────────────────────
function Stars() {
  const s = Array.from({length:110},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*2+0.4,dl:Math.random()*5,dr:Math.random()*3+2}));
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {s.map(x=><div key={x.id} style={{position:"absolute",left:`${x.x}%`,top:`${x.y}%`,width:x.sz,height:x.sz,borderRadius:"50%",background:x.sz>1.5?T.gold:T.cream,opacity:0,animation:`twinkle ${x.dr}s ${x.dl}s infinite ease-in-out`}}/>)}
    </div>
  );
}

function Particles() {
  const p = Array.from({length:14},(_,i)=>({id:i,x:Math.random()*100,sz:Math.random()*4+2,dl:Math.random()*10,dr:Math.random()*12+14}));
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {p.map(x=><div key={x.id} style={{position:"absolute",left:`${x.x}%`,bottom:"-10px",width:x.sz,height:x.sz,borderRadius:"50%",background:`radial-gradient(circle,${T.gold}cc,${T.goldD}22)`,animation:`floatUp ${x.dr}s ${x.dl}s infinite linear`}}/>)}
    </div>
  );
}

// ─── MOBILE MENU ─────────────────────────────────────────────
function MobileMenu({ open, onClose, onNav, categoryRef, storyRef, cartCount, wishCount, user, onLogout }) {
  if (!open) return null;
  const go = (key) => {
    onClose();
    if (key === "category") { onNav("home"); setTimeout(()=>categoryRef.current?.scrollIntoView({behavior:"smooth"}),160); }
    else if (key === "our-story") { onNav("home"); setTimeout(()=>storyRef.current?.scrollIntoView({behavior:"smooth"}),160); }
    else onNav(key);
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(22,27,46,0.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.4rem",animation:"fadeIn 0.2s ease",overflowY:"auto",padding:"2rem 1rem"}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:T.cream,fontSize:28,cursor:"pointer",lineHeight:1}}>✕</button>
      
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.5rem"}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.goldD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>💎</div>
        <span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"1.1rem",letterSpacing:"0.14em",color:T.cream}}>WISHSTONE</span>
      </div>

      {/* Nav links */}
      {[["Home","home"],["Category","category"],["Products","products"],["Our Story","our-story"]].map(([l,k])=>(
        <button key={k} onClick={()=>go(k)} style={{background:"none",border:"none",color:T.cream,fontFamily:"'Cinzel',serif",fontSize:"1.1rem",letterSpacing:"0.2em",cursor:"pointer",padding:"0.6rem 2rem",borderBottom:`1px solid ${T.gold}22`,width:240,textAlign:"center",transition:"color 0.2s"}}
          onMouseEnter={e=>e.target.style.color=T.gold} onMouseLeave={e=>e.target.style.color=T.cream}>{l}</button>
      ))}

      {/* Cart + Wishlist */}
      <div style={{display:"flex",gap:"1rem",marginTop:"0.5rem"}}>
        <button onClick={()=>go("wishlist")} style={{background:`rgba(201,169,110,0.1)`,border:`1px solid ${T.gold}44`,color:T.cream,borderRadius:8,padding:"10px 20px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.8rem",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:6}}>
          🤍 Wishlist {wishCount>0&&<span style={{background:T.gold,color:T.navy,borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishCount}</span>}
        </button>
        <button onClick={()=>go("cart")} style={{background:`rgba(196,116,122,0.15)`,border:`1px solid ${T.rose}44`,color:T.cream,borderRadius:8,padding:"10px 20px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.8rem",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:6}}>
          🛒 Cart {cartCount>0&&<span style={{background:T.rose,color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
        </button>
      </div>

      {/* Auth */}
      <div style={{display:"flex",flexDirection:"column",gap:"0.7rem",width:240,marginTop:"0.5rem"}}>
        {user ? (
          <>
            <button onClick={()=>go("dashboard")} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"12px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:800,width:"100%"}}>👤 DASHBOARD</button>
            <button onClick={()=>{onClose();onLogout();}} style={{background:"transparent",border:`1px solid ${T.rose}66`,color:T.rose,padding:"12px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.14em",cursor:"pointer",width:"100%"}}>🚪 LOGOUT</button>
          </>
        ) : (
          <>
            <button onClick={()=>{onClose();window.location.hash="login";onNav("login");}} style={{background:"transparent",border:`1px solid ${T.gold}66`,color:T.cream,padding:"12px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.14em",cursor:"pointer",width:"100%"}}>LOGIN</button>
            <button onClick={()=>{onClose();window.location.hash="signup";onNav("signup");}} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"12px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:800,width:"100%"}}>SIGN UP</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────
function Header({ cartCount, wishCount, onNav, currentPage, categoryRef, storyRef, user, onLogout }) {
  const [scrolled,setScrolled]=useState(false);
  const [mOpen,setMOpen]=useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>50); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);

  const go = (link) => {
    const key = link.toLowerCase().replace(" ","-");
    if (key==="category") { onNav("home"); setTimeout(()=>categoryRef.current?.scrollIntoView({behavior:"smooth"}),160); }
    else if (key==="our-story") { onNav("home"); setTimeout(()=>storyRef.current?.scrollIntoView({behavior:"smooth"}),160); }
    else onNav(key);
  };

  return (
    <>
      <MobileMenu open={mOpen} onClose={()=>setMOpen(false)} onNav={onNav} categoryRef={categoryRef} storyRef={storyRef} cartCount={cartCount} wishCount={wishCount} user={user} onLogout={onLogout}/>
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"0 clamp(1rem,4vw,3rem)",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",background:`rgba(33,40,66,${scrolled?0.98:0.92})`,backdropFilter:"blur(18px)",borderBottom:`1px solid rgba(201,169,110,${scrolled?0.2:0.08})`,transition:"all 0.35s ease"}}>
        {/* Logo */}
        <div onClick={()=>{onNav("home");scrollTop();}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.goldD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 0 18px ${T.gold}44`}}>💎</div>
          <span style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"clamp(1rem,3vw,1.3rem)",letterSpacing:"0.14em",color:T.cream,textShadow:`0 0 20px ${T.gold}55`}}>WISHSTONE</span>
        </div>

        {/* Desktop Nav */}
        <nav className="header-nav" style={{display:"flex",gap:"2.5rem"}}>
          {["Home","Category","Products","Our Story"].map(link=>{
            const key=link.toLowerCase().replace(" ","-");
            const active=currentPage===key;
            return <button key={link} onClick={()=>go(link)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.7rem",letterSpacing:"0.18em",textTransform:"uppercase",color:active?T.gold:T.cream,opacity:active?1:0.75,borderBottom:active?`1px solid ${T.gold}`:"1px solid transparent",padding:"4px 0",transition:"all 0.25s"}} onMouseEnter={e=>{e.target.style.color=T.gold;e.target.style.opacity="1";}} onMouseLeave={e=>{if(!active){e.target.style.color=T.cream;e.target.style.opacity="0.75";}}}>{link}</button>;
          })}
        </nav>

        {/* Right side: icons + auth + hamburger */}
        <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
          {/* Cart + Wishlist icons — hidden on mobile via CSS */}
          <div className="header-icons" style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
            {[["wishlist","🤍",wishCount,T.gold],["cart","🛒",cartCount,T.rose]].map(([pg,ic,cnt,bc])=>(
              <button key={pg} onClick={()=>{onNav(pg);scrollTop();}} style={{background:"none",border:"none",cursor:"pointer",position:"relative",padding:4}}>
                <span style={{fontSize:20}}>{ic}</span>
                {cnt>0&&<span style={{position:"absolute",top:-2,right:-2,background:bc,color:T.navy,borderRadius:"50%",width:15,height:15,fontSize:8,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{cnt}</span>}
              </button>
            ))}
          </div>

          {/* Auth Buttons — hidden on mobile via CSS */}
          <div className="header-auth" style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
            {user ? (
              <>
                <button onClick={()=>{onNav("dashboard");scrollTop();}} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"8px 14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:700}}>DASHBOARD</button>
                <button onClick={onLogout} style={{background:"transparent",border:`1px solid ${T.cream}44`,color:T.cream,padding:"8px 14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.14em",cursor:"pointer",transition:"all 0.25s"}} onMouseEnter={e=>{e.target.style.borderColor=T.rose;e.target.style.color=T.rose;}} onMouseLeave={e=>{e.target.style.borderColor=`${T.cream}44`;e.target.style.color=T.cream;}}>LOGOUT</button>
              </>
            ) : (
              <>
                <button onClick={()=>window.location.hash="login"} style={{background:"transparent",border:`1px solid ${T.cream}44`,color:T.cream,padding:"8px 14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.14em",cursor:"pointer",transition:"all 0.25s"}} onMouseEnter={e=>{e.target.style.borderColor=T.gold;e.target.style.color=T.gold;}} onMouseLeave={e=>{e.target.style.borderColor=`${T.cream}44`;e.target.style.color=T.cream;}}>LOGIN</button>
                <button onClick={()=>window.location.hash="signup"} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"8px 14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:700}}>SIGNUP</button>
              </>
            )}
          </div>

          {/* Hamburger — shown on mobile */}
          <button className="mobile-menu-btn" onClick={()=>setMOpen(true)} style={{display:"none",background:"none",border:`1px solid ${T.gold}55`,borderRadius:6,padding:"6px 8px",cursor:"pointer",flexDirection:"column",gap:4,alignItems:"center"}}>
            {[0,1,2].map(i=><div key={i} style={{width:20,height:2,background:T.cream,borderRadius:1}}/>)}
          </button>
        </div>
      </header>
    </>
  );
}

// ─── OFFER BANNER ─────────────────────────────────────────────
function OfferBanner() {
  const txt = ["✦ Flat ₹300 OFF — coupon WOW300","✦ Free shipping above ₹999","✦ New Moon Collection","✦ Buy 2 Get 1 Free on Manifestation","✦ 100% Natural & Ethically Sourced"].join("     ");
  return (
    <div style={{position:"fixed",top:68,left:0,right:0,zIndex:999,background:`linear-gradient(90deg,${T.navyD},${T.goldD}55,${T.navyD})`,borderBottom:`1px solid ${T.gold}33`,height:32,overflow:"hidden",display:"flex",alignItems:"center"}}>
      <div style={{display:"flex",animation:"marquee 30s linear infinite",whiteSpace:"nowrap"}}>
        {[0,1,2].map(i=><span key={i} style={{color:T.goldL,fontSize:"0.65rem",letterSpacing:"0.14em",fontFamily:"'Cinzel',serif",paddingRight:"5rem"}}>{txt}</span>)}
      </div>
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────
function Hero({ onShop }) {
  const [mouse,setMouse]=useState({x:0.5,y:0.5});
  return (
    <section onMouseMove={e=>setMouse({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight})}
      style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:`radial-gradient(ellipse at ${mouse.x*100}% ${mouse.y*100}%, #2A3465 0%, ${T.navy} 40%, ${T.navyD} 100%)`,transition:"background 0.5s ease",paddingTop:100}}>
      <Stars/><Particles/>

      {/* Corner ornaments */}
      {[{top:16,left:16},{top:16,right:16},{bottom:16,left:16},{bottom:16,right:16}].map((pos,i)=>(
        <div key={i} style={{position:"absolute",...pos,width:44,height:44,borderTop:pos.top!==undefined?`1px solid ${T.gold}55`:"none",borderBottom:pos.bottom!==undefined?`1px solid ${T.gold}55`:"none",borderLeft:pos.left!==undefined?`1px solid ${T.gold}55`:"none",borderRight:pos.right!==undefined?`1px solid ${T.gold}55`:"none",pointerEvents:"none"}}/>
      ))}

      {/* Moon — hidden on small mobile */}
      <div style={{position:"absolute",top:"6%",right:"8%",width:"clamp(100px,14vw,170px)",height:"clamp(100px,14vw,170px)",borderRadius:"50%",background:"radial-gradient(circle at 32% 30%,#FAF5EC,#E8D8B4,#B8A078)",boxShadow:"0 0 60px rgba(240,231,213,0.28),0 0 120px rgba(201,169,110,0.18),inset -25px -20px 50px rgba(0,0,0,0.45)",animation:"moonGlow 7s ease-in-out infinite"}}>
        {[[30,40,16],[65,25,9],[50,65,7]].map(([x,y,s],i)=><div key={i} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:s,height:s,borderRadius:"50%",background:"rgba(0,0,0,0.11)"}}/>)}
      </div>

      {/* Orbits */}
      {[{sz:240,dur:20,off:{top:"1%",right:"4%"}},{sz:330,dur:32,off:{top:"-5%",right:"-1%"},rev:true}].map((o,i)=>(
        <div key={i} style={{position:"absolute",...o.off,width:o.sz,height:o.sz,borderRadius:"50%",border:`1px solid rgba(201,169,110,${i===0?0.22:0.1})`,animation:`orbit ${o.dur}s linear infinite ${o.rev?"reverse":""}`,display:i===0?"block":"none"}}>
          {i===0&&<div style={{position:"absolute",top:-4,left:"50%",width:8,height:8,borderRadius:"50%",background:T.gold,boxShadow:`0 0 12px ${T.gold}`}}/>}
        </div>
      ))}

      {/* Content */}
      <div style={{textAlign:"center",position:"relative",zIndex:10,padding:"0 clamp(1rem,5vw,2rem)",maxWidth:820,width:"100%"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,border:`1px solid ${T.gold}44`,borderRadius:100,padding:"6px 20px",marginBottom:"1.5rem",background:`rgba(201,169,110,0.07)`,animation:"fadeDown 0.9s ease both"}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:T.gold}}/>
          <span style={{color:T.goldL,fontSize:"0.63rem",letterSpacing:"0.32em",fontFamily:"'Cinzel',serif"}}>ALIGN WITH THE UNIVERSE</span>
          <div style={{width:4,height:4,borderRadius:"50%",background:T.gold}}/>
        </div>

        <h1 className="hero-title" style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(2.2rem,6vw,5rem)",fontWeight:900,color:T.cream,lineHeight:1.1,marginBottom:"0.8rem",animation:"fadeUp 1s 0.15s ease both"}}>
          Manifest Your<br/>
          <span style={{background:`linear-gradient(135deg,${T.cream},${T.gold},${T.goldL},${T.gold})`,backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 5s linear infinite"}}>Destiny</span>
        </h1>

        <Divider/>

        <p style={{color:"rgba(240,231,213,0.65)",fontSize:"clamp(0.95rem,2.5vw,1.08rem)",lineHeight:1.9,maxWidth:480,margin:"0 auto 2.2rem",fontStyle:"italic",animation:"fadeUp 1s 0.3s ease both"}}>
          Premium natural crystals, healing tools & ritual kits crafted to align your energy with the cosmos.
        </p>

        <div className="hero-btns" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp 1s 0.5s ease both"}}>
          <button onClick={onShop} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:`1px solid ${T.gold}`,color:T.navy,padding:"13px 36px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.2em",cursor:"pointer",fontWeight:700,boxShadow:`0 8px 28px ${T.gold}44`,transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 14px 38px ${T.gold}66`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 8px 28px ${T.gold}44`;}}>EXPLORE COLLECTION</button>
          <button style={{background:"transparent",border:`1px solid ${T.cream}44`,color:T.cream,padding:"13px 36px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.2em",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.cream}44`;e.currentTarget.style.color=T.cream;}}>OUR STORY</button>
        </div>

        <div className="hero-stats" style={{display:"flex",gap:"2.5rem",justifyContent:"center",marginTop:"3.5rem",animation:"fadeUp 1s 0.7s ease both"}}>
          {[["12K+","Happy Souls"],["100%","Natural"],["3+","Collections"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1.2rem,3vw,1.6rem)",color:T.gold,fontWeight:700}}>{v}</div>
              <div style={{color:"rgba(240,231,213,0.35)",fontSize:"0.62rem",letterSpacing:"0.16em",fontFamily:"'Cinzel',serif"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{position:"absolute",bottom:"1.5rem",left:"50%",display:"flex",flexDirection:"column",alignItems:"center",gap:5,animation:"scrollPulse 2.5s ease-in-out infinite"}}>
        <div style={{width:1,height:44,background:`linear-gradient(to bottom,transparent,${T.gold}99)`}}/>
        <span style={{color:T.gold,fontSize:"0.55rem",letterSpacing:"0.28em",fontFamily:"'Cinzel',serif"}}>SCROLL</span>
      </div>
    </section>
  );
}

// ─── CATEGORY SECTION — cream bg ─────────────────────────────
function CategorySection({ onCategoryClick, sectionRef }) {
  const [hov,setHov]=useState(null);
  return (
    <section ref={sectionRef} className="section-pad" style={{padding:"90px clamp(1.5rem,5vw,4rem)",background:T.cream,position:"relative",overflow:"hidden"}}>
      {/* Subtle pattern */}
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,${T.gold}18 1px,transparent 1px)`,backgroundSize:"32px 32px",pointerEvents:"none"}}/>
      <SecHead eye="✦ DISCOVER ✦" title="Explore Our Range" dark={true}/>
      <div className="cat-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem",maxWidth:1080,margin:"0 auto"}}>
        {CATEGORIES.map(cat=>(
          <div key={cat.id} onClick={()=>{onCategoryClick(cat);scrollTop();}} onMouseEnter={()=>setHov(cat.id)} onMouseLeave={()=>setHov(null)}
            style={{position:"relative",borderRadius:4,overflow:"hidden",cursor:"pointer",aspectRatio:"4/5",border:`1px solid ${hov===cat.id?T.goldD:T.gold+"55"}`,transform:hov===cat.id?"translateY(-8px) scale(1.01)":"translateY(0) scale(1)",boxShadow:hov===cat.id?`0 28px 70px rgba(33,40,66,0.35),0 0 0 2px ${T.goldD}55`:`0 6px 24px rgba(33,40,66,0.15)`,transition:"all 0.42s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <img src={cat.image} alt={cat.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hov===cat.id?"scale(1.07)":"scale(1)",transition:"transform 0.6s ease"}}/>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,rgba(33,40,66,0.95) 0%,rgba(33,40,66,0.25) 55%,transparent 100%)`}}/>
            <div style={{position:"absolute",top:12,left:12,border:`1px solid ${T.gold}88`,borderRadius:2,padding:"2px 10px",background:"rgba(33,40,66,0.7)"}}>
              <span style={{color:T.gold,fontSize:"0.58rem",letterSpacing:"0.22em",fontFamily:"'Cinzel',serif"}}>COLLECTION</span>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem 1.2rem 1.2rem"}}>
              <h3 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(1rem,2.5vw,1.2rem)",color:T.cream,margin:"0 0 6px",letterSpacing:"0.07em"}}>{cat.name}</h3>
              <p style={{color:"rgba(240,231,213,0.65)",fontSize:"0.8rem",lineHeight:1.6,margin:0,fontStyle:"italic"}}>{cat.desc}</p>
              <div style={{marginTop:10,color:T.gold,fontSize:"0.68rem",letterSpacing:"0.16em",fontFamily:"'Cinzel',serif",opacity:hov===cat.id?1:0.5,transform:hov===cat.id?"translateX(5px)":"translateX(0)",transition:"all 0.3s"}}>EXPLORE →</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── USES SECTION — navy, auto-looping video ──────────────────
function UsesSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // When active changes, play the new video from start
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {}); // autoplay may be blocked silently
  }, [active]);

  // Track progress bar
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  // When video ends, go to next
  const handleEnded = () => {
    setProgress(0);
    setActive(prev => (prev + 1) % VIDEOS.length);
  };

  // Fallback: if video fails to load, still auto-advance after 6s
  const handleError = () => {
    setTimeout(() => setActive(prev => (prev + 1) % VIDEOS.length), 6000);
  };

  const goTo = (i) => {
    setProgress(0);
    setActive(i);
  };

  return (
    <section
      className="section-pad"
      style={{
        padding: "90px clamp(1.5rem,5vw,4rem)",
        background: T.navy,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(201,169,110,0.025) 48px,rgba(201,169,110,0.025) 49px),
          repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(201,169,110,0.025) 48px,rgba(201,169,110,0.025) 49px)`,
      }} />

      <SecHead eye="✦ IMPACT ✦" title="Our Uses & Impact" />

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* ── Main Video Player ── */}
        <div style={{
          borderRadius: 4, overflow: "hidden", position: "relative",
          aspectRatio: "16/7", marginBottom: "0.5rem",
          boxShadow: `0 30px 70px rgba(0,0,0,0.55)`,
          border: `1px solid ${T.gold}33`,
          background: "#000",
        }}>
          {/* Actual video element */}
          <video
            ref={videoRef}
            key={active} // remounts on change so src reloads cleanly
            src={VIDEOS[active].src}
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={handleError}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(to top, rgba(22,27,46,0.85) 0%, transparent 55%)`,
          }} />

          {/* Video info bottom-left */}
          <div style={{ position: "absolute", bottom: 20, left: 20 }}>
            <div style={{
              border: `1px solid ${T.gold}77`, borderRadius: 2,
              padding: "2px 10px", display: "inline-block", marginBottom: 6,
              background: "rgba(22,27,46,0.75)",
            }}>
              <span style={{
                color: T.gold, fontSize: "0.58rem",
                letterSpacing: "0.2em", fontFamily: "'Cinzel',serif",
              }}>
                {VIDEOS[active].tag}
              </span>
            </div>
            <h3 style={{
              color: T.cream, fontFamily: "'Cinzel',serif",
              fontSize: "clamp(0.88rem,2.5vw,1.1rem)", margin: 0,
            }}>
              {VIDEOS[active].title}
            </h3>
          </div>

          {/* Dot indicators bottom-right */}
          <div style={{
            position: "absolute", bottom: 22, right: 20,
            display: "flex", gap: 6, alignItems: "center",
          }}>
            {VIDEOS.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === active ? 28 : 8, height: 8,
                  borderRadius: 4,
                  background: i === active ? T.gold : `${T.gold}44`,
                  transition: "all 0.35s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={{
          height: 3, background: `${T.gold}22`,
          borderRadius: 2, marginBottom: "1rem",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg, ${T.goldD}, ${T.gold})`,
            transition: "width 0.25s linear",
            borderRadius: 2,
          }} />
        </div>

        {/* ── Thumbnail strip ── */}
        <div
          className="vid-thumbs"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "0.8rem",
          }}
        >
          {VIDEOS.map((v, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                borderRadius: 4, overflow: "hidden", cursor: "pointer",
                aspectRatio: "16/9",
                border: `2px solid ${active === i ? T.gold : `${T.gold}22`}`,
                opacity: active === i ? 1 : 0.48,
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              <img
                src={v.thumb}
                alt={v.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: `rgba(22,27,46,${active === i ? 0.1 : 0.38})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s",
              }}>
                {active === i ? (
                  // Playing indicator — animated bars
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 16 }}>
                    {[0, 1, 2].map(b => (
                      <div key={b} style={{
                        width: 3, background: T.gold, borderRadius: 2,
                        animation: `playBar${b} 0.8s ${b * 0.15}s ease-in-out infinite alternate`,
                        height: b === 1 ? 16 : 10,
                      }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: T.gold, opacity: 0.9 }}>▶</span>
                )}
              </div>

              {/* Title tooltip */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "4px 6px",
                background: "linear-gradient(to top, rgba(22,27,46,0.85), transparent)",
              }}>
                <p style={{
                  color: T.cream, fontSize: "0.6rem", margin: 0,
                  fontFamily: "'Cinzel',serif", letterSpacing: "0.06em",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  opacity: 0.85,
                }}>
                  {v.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline keyframes for the playing bars animation */}
      <style>{`
        @keyframes playBar0 { from { height: 6px } to { height: 14px } }
        @keyframes playBar1 { from { height: 14px } to { height: 5px } }
        @keyframes playBar2 { from { height: 8px } to { height: 16px } }
      `}</style>
    </section>
  );
}


// ─── PRODUCT CARD ─────────────────────────────────────────────
function PCard({ product, onAdd, onWish, wished, onClick, dark=false, cart=[], onQty }) {
  const [hov,setHov]=useState(false);
  const [clicked,setClicked]=useState(false);
  const bg = dark ? `linear-gradient(145deg,rgba(33,40,66,0.8),rgba(22,27,46,0.9))` : `linear-gradient(145deg,${T.creamD},${T.cream})`;
  const border = dark ? `1px solid ${hov?T.gold:`${T.gold}22`}` : `1px solid ${hov?T.goldD:`${T.goldD}44`}`;
  const cartItem = cart.find(i=>i.id===product.id);
  const qty = cartItem?.qty || 0;

  const handleAdd = () => {
    setClicked(true);
    onAdd(product);
    setTimeout(()=>setClicked(false), 300);
  };

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:bg,border,borderRadius:4,overflow:"hidden",transition:"all 0.4s ease",transform:hov?"translateY(-6px)":"none",boxShadow:hov?`0 20px 50px rgba(0,0,0,${dark?0.5:0.2})`:`0 4px 16px rgba(0,0,0,${dark?0.3:0.1})`}}>
      <div onClick={()=>{ onClick(product); scrollTop(); }} style={{position:"relative",aspectRatio:"4/3",overflow:"hidden",cursor:"pointer"}}>
        <img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hov?"scale(1.06)":"scale(1)",transition:"transform 0.55s ease"}}/>
        <div style={{position:"absolute",top:10,left:10,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,color:T.navy,borderRadius:2,padding:"2px 9px",fontSize:"0.62rem",fontWeight:800,letterSpacing:"0.05em",fontFamily:"'Cinzel',serif"}}>-{product.discount}%</div>
        <button onClick={e=>{e.stopPropagation();onWish(product.id);}} style={{position:"absolute",top:8,right:8,background:`rgba(${dark?22:240},${dark?27:231},${dark?46:213},0.7)`,border:`1px solid ${T.gold}44`,borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,transition:"all 0.2s"}}>{wished?"❤️":"🤍"}</button>
        {qty>0&&(
          <div style={{position:"absolute",bottom:8,right:8,background:`linear-gradient(135deg,${T.goldD},${T.gold})`,color:T.navy,borderRadius:12,padding:"2px 8px",fontSize:"0.65rem",fontWeight:900,fontFamily:"'Cinzel',serif",boxShadow:`0 2px 8px ${T.gold}66`}}>
            {qty} in cart
          </div>
        )}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,rgba(${dark?22:33},${dark?27:40},${dark?46:66},0.75),transparent)`,opacity:hov?0.8:0.35,transition:"opacity 0.3s"}}/>
      </div>
      <div style={{padding:"1rem 1.1rem 1.1rem"}}>
        <h4 onClick={()=>{ onClick(product); scrollTop(); }} style={{fontFamily:"'Cinzel',serif",fontSize:"0.83rem",color:dark?T.cream:T.navy,margin:"0 0 5px",cursor:"pointer",letterSpacing:"0.04em",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=dark?T.gold:T.goldD} onMouseLeave={e=>e.target.style.color=dark?T.cream:T.navy}>{product.name}</h4>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.8rem"}}>
          <span style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",color:dark?T.gold:T.goldD,fontWeight:700}}>₹{product.price.toLocaleString()}</span>
          <span style={{color:dark?"rgba(240,231,213,0.3)":"rgba(33,40,66,0.35)",fontSize:"0.78rem",textDecoration:"line-through"}}>₹{product.originalPrice.toLocaleString()}</span>
        </div>

        {qty===0 ? (
          /* ── ADD TO CART button ── */
          <button
            onClick={handleAdd}
            style={{
              width:"100%",
              background:clicked?`linear-gradient(135deg,${T.gold},${T.goldD})`:`linear-gradient(135deg,${T.goldD},${T.gold})`,
              border:"none",color:T.navy,
              padding:"8px 10px",borderRadius:2,
              fontFamily:"'Cinzel',serif",fontSize:"0.62rem",
              letterSpacing:"0.12em",cursor:"pointer",fontWeight:700,
              transition:"all 0.15s ease",
              transform:clicked?"scale(0.95)":"scale(1)",
              boxShadow:clicked?`0 2px 8px ${T.gold}44`:`0 4px 14px ${T.gold}33`,
            }}
          >
            🛒 ADD TO CART
          </button>
        ) : (
          /* ── QTY COUNTER ── */
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{
              display:"flex",alignItems:"center",
              border:`1.5px solid ${dark?T.gold:T.goldD}`,
              borderRadius:2,overflow:"hidden",flex:1,
              background:dark?"rgba(201,169,110,0.08)":"rgba(139,105,20,0.06)",
            }}>
              <button
                onClick={()=>onQty&&onQty(product.id,qty-1)}
                style={{background:"none",border:"none",color:dark?T.gold:T.goldD,padding:"7px 10px",cursor:"pointer",fontSize:"1rem",fontWeight:700,lineHeight:1,transition:"background 0.15s",flexShrink:0}}
                onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(201,169,110,0.15)":"rgba(139,105,20,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >−</button>
              <span style={{flex:1,textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:"0.85rem",color:dark?T.cream:T.navy,fontWeight:700}}>{qty}</span>
              <button
                onClick={()=>onQty&&onQty(product.id,qty+1)}
                style={{background:"none",border:"none",color:dark?T.gold:T.goldD,padding:"7px 10px",cursor:"pointer",fontSize:"1rem",fontWeight:700,lineHeight:1,transition:"background 0.15s",flexShrink:0}}
                onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(201,169,110,0.15)":"rgba(139,105,20,0.1)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >+</button>
            </div>
            <button
              onClick={handleAdd}
              title="Add one more"
              style={{
                background:`linear-gradient(135deg,${T.goldD},${T.gold})`,
                border:"none",color:T.navy,
                width:32,height:32,borderRadius:2,
                cursor:"pointer",fontSize:"0.9rem",
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,transition:"all 0.15s ease",
                boxShadow:`0 2px 8px ${T.gold}33`,
                transform:clicked?"scale(0.9)":"scale(1)",
              }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 4px 14px ${T.gold}66`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=`0 2px 8px ${T.gold}33`}
            >🛒</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BEST SELLERS — cream bg ──────────────────────────────────
function BestSellers({ onAdd, onWish, wished, onClick, cart, onQty }) {
  return (
    <section className="section-pad" style={{padding:"90px clamp(1.5rem,5vw,4rem)",background:T.cream}}>
      <SecHead eye="✦ TRENDING ✦" title="Best Sellers" dark={true}/>
      <div className="prod-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.2rem",maxWidth:1200,margin:"0 auto"}}>
        {PRODUCTS.filter(p=>p.bestSeller).map(p=><PCard key={p.id} product={p} onAdd={onAdd} onWish={onWish} wished={wished.includes(p.id)} onClick={onClick} dark={false} cart={cart} onQty={onQty}/>)}
      </div>
    </section>
  );
}

// ─── OUR STORY — navy bg ──────────────────────────────────────
function StorySection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="section-pad" style={{padding:"90px clamp(1.5rem,5vw,4rem)",background:T.navy,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%,rgba(201,169,110,0.06),transparent 70%)`,pointerEvents:"none"}}/>
      <div className="story-grid" style={{maxWidth:1080,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",inset:-14,border:`1px solid ${T.gold}22`,borderRadius:4,pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:-28,border:`1px solid ${T.gold}0d`,borderRadius:4,pointerEvents:"none"}}/>
          <img src="https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80" alt="Our Story" style={{width:"100%",borderRadius:4,boxShadow:`0 36px 70px rgba(0,0,0,0.55),0 0 0 1px ${T.gold}33`,position:"relative",display:"block"}}/>
          <div style={{position:"absolute",bottom:-18,right:-18,background:`linear-gradient(135deg,${T.goldD},${T.gold})`,borderRadius:4,padding:"1rem 1.4rem",textAlign:"center",boxShadow:`0 10px 32px ${T.gold}44`}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.7rem",color:T.navy,fontWeight:900}}>2020</div>
            <div style={{color:T.navy,fontSize:"0.58rem",letterSpacing:"0.16em",fontFamily:"'Cinzel',serif",opacity:0.65}}>FOUNDED</div>
          </div>
        </div>
        <div>
          <p style={{color:T.gold,fontSize:"0.64rem",letterSpacing:"0.36em",fontFamily:"'Cinzel',serif",marginBottom:12,textTransform:"uppercase"}}>✦ OUR STORY ✦</p>
          <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(1.4rem,3vw,2.2rem)",color:T.cream,margin:"0 0 0.8rem",lineHeight:1.3}}>Born from the Earth,<br/><span style={{color:T.gold}}>Guided by the Stars</span></h2>
          <Divider/>
          <p style={{color:"rgba(240,231,213,0.65)",fontSize:"clamp(0.95rem,2vw,1.05rem)",lineHeight:1.95,fontStyle:"italic",marginBottom:"1rem"}}>Wishstone was born from a deep belief that nature holds the answers to our modern struggles. Founded in 2020 by a group of healers and naturalists, we source every crystal, herb, and ritual tool with intention and reverence.</p>
          <p style={{color:"rgba(240,231,213,0.6)",fontSize:"clamp(0.95rem,2vw,1.05rem)",lineHeight:1.95,marginBottom:"1.8rem"}}>Our mission: to make ancient healing wisdom accessible to the modern soul — ethically sourced, energetically cleansed, delivered with love.</p>
          {[["Ethically Sourced","💎"],["Moon-Charged","🌙"],["Nature-Inspired","🌿"]].map(([text,icon])=>(
            <div key={text} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:32,height:32,background:`rgba(201,169,110,0.1)`,border:`1px solid ${T.gold}44`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div>
              <span style={{color:T.creamD,fontFamily:"'Cinzel',serif",fontSize:"0.74rem",letterSpacing:"0.1em"}}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ — cream bg ───────────────────────────────────────────
function FAQSection() {
  const [open,setOpen]=useState(null);
  return (
    <section className="section-pad" style={{padding:"90px clamp(1.5rem,5vw,4rem)",background:T.cream}}>
      <SecHead eye="✦ SUPPORT ✦" title="Frequently Asked" dark={true}/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        {FAQS.map((faq,i)=>(
          <div key={i} style={{borderBottom:`1px solid ${T.goldD}33`}}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"1.2rem 0",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",textAlign:"left",gap:14}}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.84rem",color:open===i?T.goldD:T.navy,letterSpacing:"0.05em",transition:"color 0.3s"}}>{faq.q}</span>
              <span style={{color:T.goldD,fontSize:"1.2rem",transform:open===i?"rotate(45deg)":"rotate(0)",transition:"transform 0.3s",flexShrink:0}}>+</span>
            </button>
            {open===i&&<p style={{color:"rgba(33,40,66,0.7)",fontSize:"0.95rem",lineHeight:1.85,fontStyle:"italic",paddingBottom:"1.2rem",margin:0,animation:"fadeUp 0.3s ease"}}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:T.navyD,borderTop:`1px solid ${T.gold}22`,padding:"3.5rem clamp(1.5rem,5vw,4rem) 1.8rem"}}>
      <div className="footer-grid" style={{maxWidth:1080,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"2.5rem",marginBottom:"2.5rem"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:"0.8rem"}}>
            <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💎</div>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:"1.05rem",color:T.cream,letterSpacing:"0.14em"}}>WISHSTONE</span>
          </div>
          <Divider/>
          <p style={{color:"rgba(240,231,213,0.35)",fontSize:"0.85rem",lineHeight:1.85,fontStyle:"italic",maxWidth:220}}>Premium natural crystals and healing products aligned with the universe's energy.</p>
          <div style={{display:"flex",gap:8,marginTop:"1.2rem"}}>
            {["📸","📘","▶️"].map((ic,i)=><div key={i} style={{width:34,height:34,background:`rgba(201,169,110,0.07)`,border:`1px solid ${T.gold}2a`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=`${T.gold}2a`}>{ic}</div>)}
          </div>
        </div>
        {[["Policies",["Terms & Conditions","Privacy Policy","Shipping Policy","Refund Policy"]],["Shop",["All Products","Manifestation","Therapy","Habit Builder"]],["Support",["Contact Us","Track Order","FAQ","About Us"]]].map(([title,links])=>(
          <div key={title}>
            <h4 style={{fontFamily:"'Cinzel',serif",fontSize:"0.68rem",color:T.gold,letterSpacing:"0.22em",margin:"0 0 1.2rem",textTransform:"uppercase"}}>{title}</h4>
            {links.map(l=><div key={l} style={{marginBottom:8}}><a href="#" style={{color:"rgba(240,231,213,0.32)",fontSize:"0.85rem",textDecoration:"none",fontStyle:"italic",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=T.gold} onMouseLeave={e=>e.target.style.color="rgba(240,231,213,0.32)"}>{l}</a></div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${T.gold}12`,paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <span style={{color:"rgba(240,231,213,0.25)",fontSize:"0.68rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.1em"}}>© 2025 WISHSTONE. ALL RIGHTS RESERVED.</span>
        <span style={{color:"rgba(240,231,213,0.25)",fontSize:"0.78rem",fontStyle:"italic"}}>Crafted with 💛 for the universe</span>
      </div>
    </footer>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────
function CategoryPage({ category, onAdd, onWish, wished, onClick, cart, onQty }) {
  const products = PRODUCTS.filter(p=>p.category===category.id);
  return (
    <div style={{paddingTop:100}}>
      {/* Banner */}
      <div style={{position:"relative",height:"clamp(220px,35vw,340px)",overflow:"hidden"}}>
        <img src={category.image} alt={category.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to right,rgba(33,40,66,0.92),rgba(33,40,66,0.45))`,display:"flex",alignItems:"center",padding:"0 clamp(1.5rem,5vw,4rem)"}}>
          <div>
            <p style={{color:T.gold,fontSize:"0.63rem",letterSpacing:"0.36em",fontFamily:"'Cinzel',serif",marginBottom:8}}>COLLECTION</p>
            <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(1.8rem,5vw,3rem)",color:T.cream,margin:"0 0 0.4rem"}}>{category.name}</h1>
            <Divider/>
            <p style={{color:"rgba(240,231,213,0.65)",fontStyle:"italic",fontSize:"clamp(0.9rem,2vw,1.05rem)"}}>{category.desc}</p>
          </div>
        </div>
      </div>
      {/* Products on cream bg */}
      <div style={{background:T.cream,padding:"clamp(2rem,5vw,4rem)"}}>
        <p style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.68rem",letterSpacing:"0.2em",marginBottom:"1.5rem"}}>{products.length} PRODUCTS</p>
        <div className="prod-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.2rem"}}>
          {products.map(p=><PCard key={p.id} product={p} onAdd={onAdd} onWish={onWish} wished={wished.includes(p.id)} onClick={onClick} dark={false} cart={cart} onQty={onQty}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────
function ProductPage({ product, onAdd, onWish, wished }) {
  const [qty,setQty]=useState(1);
  const [added,setAdded]=useState(false);
  const [videoOpen,setVideoOpen]=useState(false);
  const handle=()=>{ for(let i=0;i<qty;i++) onAdd(product); setAdded(true); setTimeout(()=>setAdded(false),2000); };

  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh"}}>
      <div style={{maxWidth:1160,margin:"0 auto",padding:"clamp(1.5rem,4vw,3.5rem)"}}>
        <div className="prod-detail-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(2rem,5vw,4rem)"}}>

          {/* Left */}
          <div>
            <div style={{borderRadius:4,overflow:"hidden",marginBottom:"1rem",boxShadow:`0 24px 50px rgba(33,40,66,0.2),0 0 0 1px ${T.goldD}44`}}>
              <img src={product.image} alt={product.name} style={{width:"100%",display:"block"}}/>
            </div>

            {/* Small video popup trigger — like Nytarra */}
            <div onClick={()=>setVideoOpen(true)} style={{borderRadius:4,overflow:"hidden",border:`1px solid ${T.goldD}44`,cursor:"pointer",position:"relative",height:72,background:T.creamD,display:"flex",alignItems:"center",gap:14,padding:"0 16px",boxShadow:`0 4px 16px rgba(33,40,66,0.1)`,transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=T.goldD;e.currentTarget.style.boxShadow=`0 6px 22px rgba(33,40,66,0.18)`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.goldD}44`;e.currentTarget.style.boxShadow=`0 4px 16px rgba(33,40,66,0.1)`;}}>
              <div style={{width:50,height:50,borderRadius:4,overflow:"hidden",flexShrink:0,position:"relative"}}>
                <img src={product.image} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.8}}/>
              </div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.72rem",color:T.navy,margin:"0 0 3px",letterSpacing:"0.06em"}}>Product Preview</p>
                <p style={{color:"rgba(33,40,66,0.55)",fontSize:"0.75rem",margin:0,fontStyle:"italic"}}>Click to watch</p>
              </div>
              <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.goldD})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 16px ${T.gold}55`}}>
                <span style={{fontSize:13,marginLeft:2,color:T.navy}}>▶</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <div style={{display:"inline-block",border:`1px solid ${T.goldD}55`,borderRadius:2,padding:"3px 14px",marginBottom:"0.8rem",background:`rgba(201,169,110,0.1)`}}>
              <span style={{color:T.goldD,fontSize:"0.63rem",letterSpacing:"0.22em",fontFamily:"'Cinzel',serif"}}>{product.category.toUpperCase()}</span>
            </div>
            <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(1.4rem,3.5vw,1.9rem)",color:T.navy,margin:"0 0 0.4rem",lineHeight:1.3}}>{product.name}</h1>
            <Divider/>
            <p style={{color:"rgba(33,40,66,0.7)",fontSize:"clamp(0.95rem,2vw,1.05rem)",lineHeight:1.85,marginBottom:"1.2rem",fontStyle:"italic"}}>{product.shortDesc}</p>

            <div style={{marginBottom:"1rem"}}>
              <p style={{color:T.goldD,fontSize:"0.63rem",letterSpacing:"0.22em",fontFamily:"'Cinzel',serif",marginBottom:5}}>SUITABLE FOR</p>
              <p style={{color:"rgba(33,40,66,0.65)",fontSize:"0.92rem"}}>{product.suitableFor}</p>
            </div>
            <div style={{marginBottom:"1.5rem"}}>
              <p style={{color:T.goldD,fontSize:"0.63rem",letterSpacing:"0.22em",fontFamily:"'Cinzel',serif",marginBottom:8}}>BENEFITS</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}} className="prod-benefits-grid">
                {product.benefits.map(b=>(
                  <div key={b} style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:4,height:4,background:T.goldD,transform:"rotate(45deg)",flexShrink:0}}/>
                    <span style={{color:"rgba(33,40,66,0.7)",fontSize:"0.85rem"}}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{border:`1px solid ${T.goldD}33`,borderRadius:4,padding:"1.2rem",marginBottom:"1.2rem",background:`rgba(201,169,110,0.06)`}}>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:5}}>
                <span style={{fontFamily:"'Cinzel',serif",fontSize:"1.8rem",color:T.goldD,fontWeight:700}}>₹{product.price.toLocaleString()}</span>
                <span style={{color:"rgba(33,40,66,0.3)",fontSize:"0.95rem",textDecoration:"line-through"}}>₹{product.originalPrice.toLocaleString()}</span>
                <span style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,color:T.navy,borderRadius:2,padding:"2px 9px",fontSize:"0.63rem",fontWeight:800,fontFamily:"'Cinzel',serif"}}>SAVE {product.discount}%</span>
              </div>
              <p style={{color:"rgba(33,40,66,0.4)",fontSize:"0.74rem",margin:0}}>Inclusive of all taxes · Free shipping above ₹999</p>
            </div>

            <div style={{display:"flex",gap:10,marginBottom:"0.8rem",alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.goldD}44`,borderRadius:2,overflow:"hidden"}}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{background:"none",border:"none",color:T.navy,padding:"10px 14px",cursor:"pointer",fontSize:17}}>−</button>
                <span style={{color:T.navy,padding:"10px 10px",fontFamily:"'Cinzel',serif",minWidth:30,textAlign:"center"}}>{qty}</span>
                <button onClick={()=>setQty(qty+1)} style={{background:"none",border:"none",color:T.navy,padding:"10px 14px",cursor:"pointer",fontSize:17}}>+</button>
              </div>
              <button onClick={handle} style={{flex:1,minWidth:160,border:"none",color:added?"#fff":T.navy,padding:"12px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:700,transition:"all 0.3s",background:added?`linear-gradient(135deg,#2d7a5a,#3aaa7a)`:`linear-gradient(135deg,${T.goldD},${T.gold})`}}>{added?"✓ ADDED TO CART":"ADD TO CART"}</button>
              <button onClick={()=>onWish(product.id)} style={{background:`rgba(201,169,110,0.1)`,border:`1px solid ${T.goldD}44`,color:T.navy,padding:"12px 14px",borderRadius:2,cursor:"pointer",fontSize:18}}>{wished?"❤️":"🤍"}</button>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div style={{marginTop:"3rem"}}>
          <p style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.68rem",letterSpacing:"0.22em",marginBottom:"1.2rem"}}>HOW TO USE</p>
          <div style={{borderRadius:4,overflow:"hidden",border:`1px solid ${T.goldD}33`,aspectRatio:"16/6",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}} onClick={()=>setVideoOpen(true)}>
            <img src={product.image} alt="usage" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.25,position:"absolute",inset:0}}/>
            <div style={{position:"relative",textAlign:"center"}}>
              <div style={{width:70,height:70,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.goldD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:`0 0 40px ${T.gold}55`,margin:"0 auto 12px"}}>
                <span style={{color:T.navy}}>▶</span>
              </div>
              <p style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"0.8rem",letterSpacing:"0.12em"}}>WATCH HOW TO USE</p>
            </div>
          </div>
        </div>

        {/* FAQ inline */}
        <div style={{marginTop:"3rem"}}><FAQSection/></div>
      </div>

      {/* Video popup modal */}
      {videoOpen&&(
        <div onClick={()=>setVideoOpen(false)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",animation:"fadeIn 0.2s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:T.navyD,borderRadius:8,overflow:"hidden",width:"100%",maxWidth:640,border:`1px solid ${T.gold}44`,boxShadow:`0 40px 80px rgba(0,0,0,0.6)`,animation:"scaleIn 0.2s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${T.gold}22`}}>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.78rem",color:T.cream,letterSpacing:"0.12em"}}>PRODUCT PREVIEW</span>
              <button onClick={()=>setVideoOpen(false)} style={{background:"none",border:"none",color:T.cream,fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{aspectRatio:"16/9",background:"#000",position:"relative"}}>
              <img src={product.image} alt="video" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.5}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${T.gold},${T.goldD})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",boxShadow:`0 0 30px ${T.gold}66`}}><span style={{fontSize:20,color:T.navy}}>▶</span></div>
                  <p style={{color:T.cream,fontFamily:"'Cinzel',serif",fontSize:"0.75rem",letterSpacing:"0.1em",opacity:0.7}}>Video will appear here</p>
                  <p style={{color:"rgba(240,231,213,0.45)",fontSize:"0.75rem",fontStyle:"italic",marginTop:4}}>Upload your product video via Admin Panel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────
function CartPage({ cart, onQty, onRemove, onCheckout }) {
  const [coupon,setCoupon]=useState(""); const [disc,setDisc]=useState(0); const [msg,setMsg]=useState(""); const [applying,setApplying]=useState(false); const [appliedCode,setAppliedCode]=useState("");
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0); const ship=sub>=999?0:99; const total=Math.max(0,sub+ship-disc);
  const iSx={width:"100%",background:`rgba(201,169,110,0.07)`,border:`1px solid ${T.goldD}44`,borderRadius:2,color:T.navy,padding:"10px 12px",fontSize:"0.95rem",outline:"none",boxSizing:"border-box"};
  const lSx={color:"rgba(33,40,66,0.5)",fontSize:"0.63rem",letterSpacing:"0.15em",fontFamily:"'Cinzel',serif",display:"block",marginBottom:5,textTransform:"uppercase"};

  const applyC=async()=>{
    if(!coupon.trim()) return;
    setApplying(true); setMsg("");
    try{
      const res=await fetch(`http://localhost:5000/api/coupons/validate`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({code:coupon.trim().toUpperCase(),orderTotal:sub}),
      });
      const data=await res.json();
      if(!data.success) throw new Error(data.message||"Invalid coupon");
      setDisc(data.discount);
      setAppliedCode(coupon.trim().toUpperCase());
      setMsg(`✅ ${data.message||"Coupon applied!"}`);
    }catch(err){
      setDisc(0); setAppliedCode("");
      setMsg(`❌ ${err.message}`);
    }
    setApplying(false);
  };

  const removeC=()=>{ setDisc(0); setAppliedCode(""); setCoupon(""); setMsg(""); };

  if(!cart.length) return (
    <div style={{paddingTop:130,textAlign:"center",background:T.cream,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"130px 2rem"}}>
      <div style={{fontSize:56}}>🛒</div>
      <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy}}>Your Cart is Empty</h2>
      <Divider/>
      <p style={{color:"rgba(33,40,66,0.55)",fontStyle:"italic",fontSize:"1.05rem"}}>Add some magical products to begin your journey</p>
    </div>
  );

  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh"}}>
      <div style={{maxWidth:1080,margin:"0 auto",padding:"clamp(1.5rem,4vw,3rem)"}}>
        <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"clamp(1.6rem,4vw,2rem)",marginBottom:"0.4rem"}}>Your Cart</h1>
        <Divider/>
        <div className="cart-grid" style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:"1.8rem",marginTop:"1rem"}}>
          <div>
            {cart.map(item=>(
              <div key={item.id} className="cart-item-row" style={{display:"flex",gap:"1.2rem",border:`1px solid ${T.goldD}22`,borderRadius:4,padding:"1.2rem",marginBottom:"0.9rem",alignItems:"center",background:`rgba(201,169,110,0.04)`}}>
                <img src={item.image} alt={item.name} style={{width:80,height:80,objectFit:"cover",borderRadius:4,border:`1px solid ${T.goldD}33`,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <h4 style={{fontFamily:"'Cinzel',serif",color:T.navy,margin:"0 0 4px",fontSize:"0.84rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</h4>
                  <p style={{color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:"0.95rem",margin:0}}>₹{item.price.toLocaleString()}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",border:`1px solid ${T.goldD}44`,borderRadius:2,flexShrink:0}}>
                  <button onClick={()=>onQty(item.id,item.qty-1)} style={{background:"none",border:"none",color:T.navy,padding:"7px 11px",cursor:"pointer"}}>−</button>
                  <span style={{color:T.navy,padding:"7px",fontFamily:"'Cinzel',serif",minWidth:26,textAlign:"center",fontSize:"0.9rem"}}>{item.qty}</span>
                  <button onClick={()=>onQty(item.id,item.qty+1)} style={{background:"none",border:"none",color:T.navy,padding:"7px 11px",cursor:"pointer"}}>+</button>
                </div>
                <div style={{textAlign:"right",minWidth:70,flexShrink:0}}>
                  <div style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"0.9rem",marginBottom:6}}>₹{(item.price*item.qty).toLocaleString()}</div>
                  <button onClick={()=>onRemove(item.id)} style={{background:"none",border:"none",color:"rgba(33,40,66,0.3)",cursor:"pointer",fontSize:16}}>🗑</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{border:`1px solid ${T.goldD}33`,borderRadius:4,padding:"1.8rem",position:"sticky",top:110,background:`rgba(201,169,110,0.04)`}} className="cart-summary">
              <h3 style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"0.85rem",letterSpacing:"0.18em",marginTop:0}}>ORDER SUMMARY</h3>
              <Divider/>
              <div style={{display:"flex",gap:8,marginBottom:6}}>
                <input value={coupon} onChange={e=>{setCoupon(e.target.value);if(appliedCode){removeC();}}} placeholder="Coupon code" style={{...iSx,flex:1}} onKeyDown={e=>e.key==="Enter"&&applyC()}/>
                {appliedCode
                  ? <button onClick={removeC} style={{background:"rgba(192,57,43,0.1)",border:"1px solid rgba(192,57,43,0.3)",color:"#c0392b",borderRadius:2,padding:"0 12px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.65rem",fontWeight:800,whiteSpace:"nowrap"}}>REMOVE</button>
                  : <button onClick={applyC} disabled={applying} style={{background:applying?"#aaa":`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,borderRadius:2,padding:"0 14px",cursor:applying?"not-allowed":"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.65rem",fontWeight:800,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{applying?"...":"APPLY"}</button>
                }
              </div>
              {msg&&<p style={{color:disc>0?"#2d7a5a":"#c0392b",fontSize:"0.78rem",marginBottom:10}}>{msg}</p>}
              {[["Subtotal",`₹${sub.toLocaleString()}`],["Shipping",ship===0?"FREE":`₹${ship}`],...(disc>0?[["Discount",`-₹${disc}`]]:[])].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                  <span style={{color:"rgba(33,40,66,0.6)",fontSize:"0.95rem"}}>{l}</span>
                  <span style={{color:l==="Discount"?"#2d7a5a":T.navy,fontFamily:"'Cinzel',serif",fontSize:"0.82rem"}}>{v}</span>
                </div>
              ))}
              <div style={{borderTop:`1px solid ${T.goldD}22`,paddingTop:"0.9rem",marginTop:"0.4rem",display:"flex",justifyContent:"space-between",marginBottom:"1.2rem"}}>
                <span style={{color:T.navy,fontFamily:"'Cinzel',serif",fontSize:"0.95rem"}}>Total</span>
                <span style={{color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:"1.2rem",fontWeight:700}}>₹{total.toLocaleString()}</span>
              </div>
              <button onClick={()=>onCheckout({couponCode:appliedCode,discount:disc})} style={{width:"100%",background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.16em",cursor:"pointer",fontWeight:800,boxShadow:`0 6px 24px ${T.gold}44`}}>PROCEED TO CHECKOUT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────
function CheckoutPage({ cart, onPlaceOrder, couponCode="", discount=0 }) {
  const [form,setForm]=useState(()=>{
    // Pre-fill from logged-in user if available
    try{
      const u=JSON.parse(localStorage.getItem("user")||"null");
      if(u) return {name:u.name||"",age:u.age||"",email:u.email||"",phone:u.phone||"",flat:"",area:"",landmark:"",city:"",state:"",country:"India",payment:"cod"};
    }catch(e){}
    return {name:"",age:"",email:"",phone:"",flat:"",area:"",landmark:"",city:"",state:"",country:"India",payment:"cod"};
  });
  const [placed,setPlaced]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship=sub>=999?0:99;
  const total=Math.max(0,sub+ship-discount);
  const iSx={width:"100%",background:`rgba(201,169,110,0.06)`,border:`1px solid ${T.goldD}33`,borderRadius:2,color:T.navy,padding:"10px 12px",fontSize:"0.95rem",outline:"none",boxSizing:"border-box"};
  const lSx={color:"rgba(33,40,66,0.5)",fontSize:"0.63rem",letterSpacing:"0.15em",fontFamily:"'Cinzel',serif",display:"block",marginBottom:5,textTransform:"uppercase"};

  const handlePlaceOrder=async()=>{
    if(!form.name||!form.email||!form.phone||!form.flat||!form.city||!form.state){
      setError("Please fill in all required fields (name, email, phone, address).");
      return;
    }
    setLoading(true);
    setError("");
    try{
      const orderPayload={
        customer:{name:form.name,email:form.email,phone:form.phone,age:form.age||""},
        shippingAddress:{flat:form.flat,area:form.area,landmark:form.landmark,city:form.city,state:form.state,country:form.country},
        items:cart.map(i=>({productId:String(i.id),name:i.name,price:i.price,quantity:i.qty,image:i.image||""})),
        paymentMethod:form.payment,
        couponCode:couponCode||undefined,
      };
      const res=await fetch("http://localhost:5000/api/orders/create",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(orderPayload),
      });
      const data=await res.json();
      if(!data.success) throw new Error(data.message||"Order failed");
      setPlaced(true);
      setTimeout(()=>onPlaceOrder(),2500);
    }catch(err){
      setError(err.message||"Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if(placed) return (
    <div style={{paddingTop:130,textAlign:"center",background:T.cream,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"130px 2rem"}}>
      <div style={{fontSize:58}}>✨</div>
      <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.goldD,fontSize:"clamp(1.5rem,4vw,2rem)"}}>Order Placed!</h2>
      <Divider/>
      <p style={{color:"rgba(33,40,66,0.65)",fontStyle:"italic",fontSize:"1.1rem",maxWidth:400}}>Thank you, {form.name||"dear soul"}! Your magical order is on its way. 🌙</p>
    </div>
  );

  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh"}}>
      <div style={{maxWidth:880,margin:"0 auto",padding:"clamp(1.5rem,4vw,3rem)"}}>
        <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"clamp(1.5rem,4vw,2rem)",marginBottom:"0.4rem"}}>Checkout</h1>
        <Divider/>
        <div className="checkout-grid" style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"1.8rem",marginTop:"1rem"}}>
          <div style={{border:`1px solid ${T.goldD}22`,borderRadius:4,padding:"1.8rem",background:`rgba(201,169,110,0.03)`}}>
            <h3 style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.74rem",letterSpacing:"0.22em",marginTop:0}}>DELIVERY INFORMATION</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem",marginBottom:"0.9rem"}} className="checkout-form-grid">
              {[["Full Name","name","text"],["Age","age","number"],["Email","email","email"],["Phone","phone","tel"]].map(([l,k,t])=>(
                <div key={k}><label style={lSx}>{l}</label><input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={iSx}/></div>
              ))}
            </div>
            {[["Flat / House No.","flat"],["Area / Street","area"],["Landmark","landmark"]].map(([l,k])=>(
              <div key={k} style={{marginBottom:"0.9rem"}}><label style={lSx}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={iSx}/></div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.9rem",marginBottom:"1.5rem"}} className="checkout-city-grid">
              {[["City","city"],["State","state"],["Country","country"]].map(([l,k])=>(
                <div key={k}><label style={lSx}>{l}</label><input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={iSx}/></div>
              ))}
            </div>
            <h3 style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.74rem",letterSpacing:"0.22em",marginBottom:"0.9rem"}}>PAYMENT METHOD</h3>
            <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap"}} className="payment-btns">
              {[["cod","💵 Cash on Delivery"],["prepaid","💳 Online Payment"],["qr","📱 QR Code"]].map(([v,l])=>(
                <button key={v} onClick={()=>setForm({...form,payment:v})} style={{flex:1,minWidth:100,background:form.payment===v?`rgba(139,105,20,0.12)`:`rgba(201,169,110,0.04)`,border:`1px solid ${form.payment===v?T.goldD:`${T.goldD}33`}`,color:form.payment===v?T.goldD:"rgba(33,40,66,0.5)",borderRadius:2,padding:"10px 6px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.63rem",letterSpacing:"0.06em",transition:"all 0.25s"}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{border:`1px solid ${T.goldD}22`,borderRadius:4,padding:"1.8rem",height:"fit-content",background:`rgba(201,169,110,0.03)`}}>
            <h3 style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"0.82rem",letterSpacing:"0.16em",marginTop:0}}>ORDER</h3>
            <Divider/>
            {cart.map(item=>(
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <div><p style={{color:"rgba(33,40,66,0.7)",margin:0,fontSize:"0.9rem",fontStyle:"italic"}}>{item.name}</p><p style={{color:"rgba(33,40,66,0.35)",fontSize:"0.72rem",margin:"2px 0 0"}}>Qty: {item.qty}</p></div>
                <span style={{color:T.navy,fontFamily:"'Cinzel',serif",fontSize:"0.82rem",flexShrink:0}}>₹{(item.price*item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${T.goldD}22`,paddingTop:"0.9rem",marginTop:"0.4rem"}}>
              {[["Subtotal",`₹${sub.toLocaleString()}`],["Shipping",ship===0?"FREE":`₹${ship}`],...(discount>0?[["Coupon ("+couponCode+")",`-₹${discount.toLocaleString()}`]]:[])].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{color:"rgba(33,40,66,0.55)",fontSize:"0.85rem"}}>{l}</span>
                  <span style={{color:l.startsWith("Coupon")?"#2d7a5a":T.navy,fontFamily:"'Cinzel',serif",fontSize:"0.8rem",fontWeight:l.startsWith("Coupon")?700:400}}>{v}</span>
                </div>
              ))}
              {couponCode&&<div style={{background:"rgba(45,122,90,0.08)",border:"1px solid rgba(45,122,90,0.2)",borderRadius:4,padding:"6px 10px",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14}}>🎫</span>
                <span style={{color:"#2d7a5a",fontSize:"0.78rem",fontWeight:600}}>{couponCode} applied</span>
              </div>}
            </div>
            <div style={{borderTop:`1px solid ${T.goldD}22`,paddingTop:"0.9rem",display:"flex",justifyContent:"space-between",marginBottom:"1.2rem"}}>
              <span style={{color:T.navy,fontFamily:"'Cinzel',serif"}}>Total</span>
              <span style={{color:T.goldD,fontFamily:"'Cinzel',serif",fontSize:"1.15rem",fontWeight:700}}>₹{total.toLocaleString()}</span>
            </div>
            {error&&<p style={{color:"#c0392b",fontSize:"0.8rem",marginBottom:"0.8rem",background:"rgba(192,57,43,0.08)",padding:"8px 10px",borderRadius:4,border:"1px solid rgba(192,57,43,0.2)"}}>{error}</p>}
            <button onClick={handlePlaceOrder} disabled={loading} style={{width:"100%",background:loading?"#aaa":`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.16em",cursor:loading?"not-allowed":"pointer",fontWeight:800,boxShadow:loading?"none":`0 6px 24px ${T.gold}44`,transition:"all 0.3s"}}>{loading?"PLACING ORDER...":"PLACE ORDER ✨"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────
function WishlistPage({ ids, onAdd, onWish, onClick, cart, onQty }) {
  const items=PRODUCTS.filter(p=>ids.includes(p.id));
  if(!items.length) return (
    <div style={{paddingTop:130,textAlign:"center",background:T.cream,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"130px 2rem"}}>
      <div style={{fontSize:56}}>🤍</div>
      <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy}}>Your Wishlist is Empty</h2>
      <Divider/>
    </div>
  );
  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"clamp(1.5rem,4vw,3rem)"}}>
        <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"clamp(1.5rem,4vw,2rem)",marginBottom:"0.4rem"}}>Your Wishlist</h1>
        <Divider/>
        <div className="prod-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.2rem",marginTop:"1rem"}}>
          {items.map(p=><PCard key={p.id} product={p} onAdd={onAdd} onWish={onWish} wished={true} onClick={onClick} dark={false} cart={cart} onQty={onQty}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── ALL PRODUCTS PAGE ────────────────────────────────────────
function AllProductsPage({ onAdd, onWish, wished, onClick, cart, onQty }) {
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?PRODUCTS:PRODUCTS.filter(p=>p.category===filter);
  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"clamp(1.5rem,4vw,3rem)"}}>
        <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"clamp(1.5rem,4vw,2rem)",marginBottom:"0.4rem"}}>All Products</h1>
        <Divider/>
        <div style={{display:"flex",gap:8,marginBottom:"1.8rem",flexWrap:"wrap",marginTop:"1rem"}}>
          {[["all","All"],...CATEGORIES.map(c=>[c.id,c.name])].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{background:filter===v?`linear-gradient(135deg,${T.goldD},${T.gold})`:`rgba(201,169,110,0.08)`,border:`1px solid ${filter===v?"transparent":`${T.goldD}33`}`,color:filter===v?T.navy:"rgba(33,40,66,0.6)",borderRadius:2,padding:"7px 18px",fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.12em",cursor:"pointer",transition:"all 0.25s",fontWeight:filter===v?800:400}}>{l}</button>
          ))}
        </div>
        <div className="prod-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1.2rem"}}>
          {filtered.map(p=><PCard key={p.id} product={p} onAdd={onAdd} onWish={onWish} wished={wished.includes(p.id)} onClick={onClick} dark={false} cart={cart} onQty={onQty}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ onCatClick, onAdd, onWish, wished, onProdClick, catRef, storyRef, cart, onQty }) {
  return (
    <>
      <Hero onShop={()=>{}}/>
      <CategorySection onCategoryClick={onCatClick} sectionRef={catRef}/>
      <UsesSection/>
      <BestSellers onAdd={onAdd} onWish={onWish} wished={wished} onClick={onProdClick} cart={cart} onQty={onQty}/>
      <StorySection sectionRef={storyRef}/>
      <FAQSection/>
      <Footer/>
    </>
  );
}

// ─── SIGNUP PAGE ──────────────────────────────────────────────
function SignupPage({ onSignupSuccess }) {
  const [form,setForm]=useState({name:"",email:"",password:"",phone:"",age:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const iSx={width:"100%",background:"#fff",border:`2px solid ${T.goldD}`,borderRadius:4,color:T.navy,padding:"12px 14px",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",fontWeight:500};
  const lSx={color:T.navy,fontSize:"0.75rem",letterSpacing:"0.08em",fontFamily:"'Cinzel',serif",display:"block",marginBottom:6,textTransform:"uppercase",fontWeight:600};

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    if(!form.name||!form.email||!form.password) return setError("Name, email and password are required");
    setLoading(true);
    try{
      const res=await fetch("http://localhost:5000/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(!data.success) throw new Error(data.message);
      // Don't store token yet - redirect to login
      onSignupSuccess();
    }catch(err){setError(err.message);setLoading(false);}
  };

  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 1.5rem 3rem"}}>
      <div style={{maxWidth:460,width:"100%",border:`2px solid ${T.goldD}`,borderRadius:8,padding:"2.5rem 2rem",background:"#fff",boxShadow:`0 20px 60px rgba(139,105,20,0.25)`}} className="signup-card">
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:60,height:60,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",boxShadow:`0 0 30px ${T.gold}66`}}>💎</div>
          <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"2rem",margin:"0 0 6px",fontWeight:900}}>Create Account</h1>
          <Divider/>
          <p style={{color:T.goldD,fontSize:"1rem",fontStyle:"italic",fontWeight:500}}>Join the Wishstone family</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"],["Phone","phone","tel"],["Age","age","number"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:"1rem"}}><label style={lSx}>{l}{k==="age"?" (Optional)":""}</label><input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={iSx} required={k!=="age"&&k!=="phone"}/></div>
          ))}
          {error&&<p style={{color:"#c0392b",fontSize:"0.9rem",marginBottom:"1rem",textAlign:"center",fontWeight:600,background:"rgba(192,57,43,0.1)",padding:"10px",borderRadius:4}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:"100%",background:loading?"#999":`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:"#fff",padding:"14px",borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:"0.85rem",letterSpacing:"0.16em",cursor:loading?"not-allowed":"pointer",fontWeight:800,marginBottom:"1rem",boxShadow:`0 8px 28px ${T.gold}66`,transition:"transform 0.2s"}}>{loading?"CREATING...":"CREATE ACCOUNT"}</button>
        </form>
        <p style={{textAlign:"center",color:T.navy,fontSize:"0.92rem",fontWeight:500}}>Already have an account? <button onClick={()=>window.location.hash="login"} style={{background:"none",border:"none",color:T.goldD,cursor:"pointer",textDecoration:"underline",fontFamily:"inherit",fontSize:"inherit",fontWeight:700}}>Login</button></p>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ onSuccess }) {
  const [form,setForm]=useState({email:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const iSx={width:"100%",background:"#fff",border:`2px solid ${T.goldD}`,borderRadius:4,color:T.navy,padding:"12px 14px",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",fontWeight:500};
  const lSx={color:T.navy,fontSize:"0.75rem",letterSpacing:"0.08em",fontFamily:"'Cinzel',serif",display:"block",marginBottom:6,textTransform:"uppercase",fontWeight:600};

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      const res=await fetch("http://localhost:5000/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(!data.success) throw new Error(data.message);
      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));
      onSuccess(data.user);
    }catch(err){setError(err.message);setLoading(false);}
  };

  return (
    <div style={{paddingTop:100,background:T.cream,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 1.5rem 3rem"}}>
      <div style={{maxWidth:460,width:"100%",border:`2px solid ${T.goldD}`,borderRadius:8,padding:"2.5rem 2rem",background:"#fff",boxShadow:`0 20px 60px rgba(139,105,20,0.25)`}} className="login-card">
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:60,height:60,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px",boxShadow:`0 0 30px ${T.gold}66`}}>💎</div>
          <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"2rem",margin:"0 0 6px",fontWeight:900}}>Welcome Back</h1>
          <Divider/>
          <p style={{color:T.goldD,fontSize:"1rem",fontStyle:"italic",fontWeight:500}}>Login to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[["Email","email","email"],["Password","password","password"]].map(([l,k,t])=>(
            <div key={k} style={{marginBottom:"1.2rem"}}><label style={lSx}>{l}</label><input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={iSx} required/></div>
          ))}
          {error&&<p style={{color:"#c0392b",fontSize:"0.9rem",marginBottom:"1rem",textAlign:"center",fontWeight:600,background:"rgba(192,57,43,0.1)",padding:"10px",borderRadius:4}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:"100%",background:loading?"#999":`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:"#fff",padding:"14px",borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:"0.85rem",letterSpacing:"0.16em",cursor:loading?"not-allowed":"pointer",fontWeight:800,marginBottom:"1rem",boxShadow:`0 8px 28px ${T.gold}66`,transition:"transform 0.2s"}}>{loading?"LOGGING IN...":"LOGIN"}</button>
        </form>
        <p style={{textAlign:"center",color:T.navy,fontSize:"0.92rem",fontWeight:500}}>Don't have an account? <button onClick={()=>window.location.hash="signup"} style={{background:"none",border:"none",color:T.goldD,cursor:"pointer",textDecoration:"underline",fontFamily:"inherit",fontSize:"inherit",fontWeight:700}}>Sign up</button></p>
      </div>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────
function UserDashboard({ user, onLogout }) {
  const [activeTab,setActiveTab]=useState("profile");
  const [orders,setOrders]=useState([]);
  const [ordersLoaded,setOrdersLoaded]=useState(false);
  const [profile,setProfile]=useState({name:user.name,email:user.email,phone:user.phone||"",age:user.age||""});
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");
  const [trackModal,setTrackModal]=useState(false);
  const [noOrderModal,setNoOrderModal]=useState(false);

  const fetchOrders=async()=>{
    try{
      const token=localStorage.getItem("token");
      const res=await fetch("http://localhost:5000/api/orders/my-orders",{headers:{"Authorization":`Bearer ${token}`}});
      const data=await res.json();
      if(data.success){ setOrders(data.orders||[]); setOrdersLoaded(true); }
    }catch(err){console.error(err); setOrdersLoaded(true);}
  };

  useEffect(()=>{
    if(activeTab==="orders"||activeTab==="track") fetchOrders();
  },[activeTab]);

  const updateProfile=async()=>{
    setLoading(true);
    setMsg("");
    try{
      const token=localStorage.getItem("token");
      const res=await fetch("http://localhost:5000/api/auth/update-profile",{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(profile)});
      const data=await res.json();
      if(!data.success) throw new Error(data.message);
      
      // Update localStorage with new user data
      const updatedUser = {...user, name: profile.name, phone: profile.phone, age: profile.age};
      localStorage.setItem("user",JSON.stringify(updatedUser));
      
      setMsg("✅ Profile updated successfully!");
      setTimeout(()=>setMsg(""),3000);
    }catch(err){setMsg("❌ "+err.message);}
    setLoading(false);
  };

  const iSx={width:"100%",background:"#fff",border:`2px solid ${T.goldD}`,borderRadius:4,color:T.navy,padding:"12px 14px",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",fontWeight:500};
  const lSx={color:T.navy,fontSize:"0.75rem",letterSpacing:"0.08em",fontFamily:"'Cinzel',serif",display:"block",marginBottom:6,textTransform:"uppercase",fontWeight:600};

  return (
    <div style={{position:"fixed",inset:0,top:68,background:T.cream,overflow:"auto"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"2rem clamp(1.5rem,4vw,3rem)",minHeight:"100%"}}>
        <h1 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"clamp(1.6rem,4vw,2rem)",marginBottom:"0.4rem"}}>My Dashboard</h1>
        <Divider/>
        <div className="dashboard-grid" style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:"2rem",marginTop:"1.5rem"}}>
          <div className="dashboard-sidebar" style={{border:`2px solid ${T.goldD}`,borderRadius:8,padding:"1.8rem",height:"fit-content",background:"#fff",position:"sticky",top:"2rem",boxShadow:`0 8px 24px rgba(139,105,20,0.15)`}}>
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <div style={{width:90,height:90,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 14px",boxShadow:`0 0 30px ${T.gold}66`,border:"3px solid #fff"}}>👤</div>
              <h3 style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"1.1rem",margin:"0 0 6px",fontWeight:800}}>{user.name}</h3>
              <p style={{color:T.goldD,fontSize:"0.85rem",margin:0,fontWeight:500}}>{user.email}</p>
            </div>
            <Divider/>
            {[["profile","👤 Profile"],["orders","📦 My Orders"],["track","🚚 Track Order"]].map(([k,l])=>(
              <button key={k} onClick={()=>setActiveTab(k)} style={{width:"100%",background:activeTab===k?`linear-gradient(135deg,${T.goldD},${T.gold})`:"transparent",border:activeTab===k?"none":`1px solid ${T.goldD}33`,color:activeTab===k?"#fff":T.navy,padding:"14px 16px",borderRadius:6,cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.8rem",letterSpacing:"0.08em",textAlign:"left",marginBottom:"0.6rem",transition:"all 0.3s",fontWeight:activeTab===k?800:600,boxShadow:activeTab===k?`0 4px 12px ${T.gold}44`:"none"}}>{l}</button>
            ))}
          </div>
          <div style={{border:`2px solid ${T.goldD}`,borderRadius:8,padding:"2.5rem",background:"#fff",minHeight:"600px",boxShadow:`0 8px 24px rgba(139,105,20,0.15)`}} className="dashboard-content">
            {activeTab==="profile"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
                  <div style={{width:60,height:60,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:`0 0 20px ${T.gold}44`}}>✨</div>
                  <div>
                    <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"1.4rem",margin:"0 0 4px",fontWeight:900}}>Profile Information</h2>
                    <p style={{color:T.goldD,fontSize:"0.9rem",margin:0,fontWeight:500}}>Manage your personal details</p>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"2rem"}} className="profile-grid">
                  {[["Full Name","name","text"],["Email Address","email","email"],["Phone Number","phone","tel"],["Age","age","number"]].map(([l,k,t])=>(
                    <div key={k}>
                      <label style={lSx}>{l}</label>
                      <input type={t} value={profile[k]} onChange={e=>setProfile({...profile,[k]:e.target.value})} style={iSx} disabled={k==="email"}/>
                    </div>
                  ))}
                </div>
                {msg&&<div style={{background:msg.includes("✅")?"rgba(45,122,90,0.1)":"rgba(192,57,43,0.1)",border:`2px solid ${msg.includes("✅")?"#2d7a5a":"#c0392b"}`,borderRadius:6,padding:"14px 18px",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"12px"}}>
                  <span style={{fontSize:24}}>{msg.includes("✅")?"✅":"❌"}</span>
                  <p style={{color:msg.includes("✅")?"#2d7a5a":"#c0392b",fontSize:"0.95rem",margin:0,fontWeight:600}}>{msg.replace("✅ ","").replace("❌ ","")}</p>
                </div>}
                <div style={{display:"flex",gap:"1rem"}}>
                  <button onClick={updateProfile} disabled={loading} style={{background:loading?"#999":`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:"#fff",padding:"14px 32px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.85rem",letterSpacing:"0.14em",cursor:loading?"not-allowed":"pointer",fontWeight:800,boxShadow:loading?"none":`0 6px 20px ${T.gold}55`,transition:"all 0.3s"}}>{loading?"UPDATING...":"💾 SAVE CHANGES"}</button>
                  <button onClick={onLogout} style={{background:"transparent",border:`2px solid #c0392b`,color:"#c0392b",padding:"14px 32px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.85rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:800,transition:"all 0.3s"}} onMouseEnter={e=>{e.target.style.background="#c0392b";e.target.style.color="#fff";}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color="#c0392b";}}>🚪 LOGOUT</button>
                </div>
              </div>
            )}
            {activeTab==="orders"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"2rem"}}>
                  <div style={{width:60,height:60,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:`0 0 20px ${T.gold}44`}}>📦</div>
                  <div>
                    <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"1.4rem",margin:"0 0 4px",fontWeight:900}}>My Orders</h2>
                    <p style={{color:T.goldD,fontSize:"0.9rem",margin:0,fontWeight:500}}>{orders.length} orders placed</p>
                  </div>
                </div>
                {orders.length===0?<div style={{textAlign:"center",padding:"3rem 2rem"}}>
                  <div style={{fontSize:64,marginBottom:"1rem"}}>🛍️</div>
                  <p style={{color:"rgba(33,40,66,0.6)",fontStyle:"italic",fontSize:"1.1rem"}}>No orders yet. Start shopping!</p>
                </div>:orders.map(order=>(
                  <div key={order._id} style={{border:`2px solid ${T.goldD}33`,borderRadius:8,padding:"1.6rem",marginBottom:"1.5rem",background:"rgba(255,255,255,0.5)",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 8px 24px rgba(139,105,20,0.2)`} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem",paddingBottom:"1rem",borderBottom:`1px solid ${T.goldD}22`}}>
                      <div>
                        <p style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"1rem",margin:"0 0 6px",fontWeight:700}}>Order #{order.orderNumber}</p>
                        <p style={{color:"rgba(33,40,66,0.5)",fontSize:"0.85rem",margin:0}}>📅 {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"1.2rem",margin:"0 0 8px",fontWeight:800}}>₹{order.totalAmount?.toLocaleString()}</p>
                        <span style={{background:order.orderStatus==="delivered"?"#2d7a5a":order.orderStatus==="cancelled"?"#c0392b":T.goldD,color:"#fff",padding:"4px 14px",borderRadius:4,fontSize:"0.7rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.08em",fontWeight:800}}>{order.orderStatus?.toUpperCase()}</span>
                      </div>
                    </div>
                    {order.items&&order.items.length>0&&(
                      <div>
                        <p style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.75rem",letterSpacing:"0.1em",marginBottom:"1rem",fontWeight:700}}>📦 ORDER ITEMS ({order.items.length})</p>
                        {order.items.map((item,idx)=>(
                          <div key={idx} style={{display:"flex",gap:"1rem",marginBottom:"1rem",alignItems:"center",background:"rgba(255,255,255,0.8)",padding:"1rem",borderRadius:6,border:`1px solid ${T.goldD}22`}}>
                            <div style={{width:60,height:60,borderRadius:6,background:`linear-gradient(135deg,${T.gold}22,${T.goldD}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,border:`1px solid ${T.goldD}33`}}>💎</div>
                            <div style={{flex:1}}>
                              <p style={{color:T.navy,fontSize:"0.95rem",margin:"0 0 4px",fontWeight:600}}>{item.name||"Product"}</p>
                              <p style={{color:"rgba(33,40,66,0.5)",fontSize:"0.82rem",margin:0}}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <p style={{color:T.goldD,fontSize:"1rem",fontWeight:800}}>₹{((item.price||0)*(item.quantity||0)).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {activeTab==="track"&&(
              <div style={{textAlign:"center",padding:"3rem 2rem"}}>
                <div style={{width:120,height:120,background:`linear-gradient(135deg,${T.gold},${T.goldD})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,margin:"0 auto 1.5rem",boxShadow:`0 0 50px ${T.gold}66`,animation:"pulse 2s ease-in-out infinite"}}>📦</div>
                <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"1.8rem",marginBottom:"1rem",fontWeight:900}}>Track Your Order</h2>
                <p style={{color:"rgba(33,40,66,0.6)",fontSize:"1.05rem",marginBottom:"2.5rem",lineHeight:1.8}}>Click below to view delivery status and estimated arrival time</p>
                <button
                  onClick={()=>{ if(ordersLoaded && orders.length===0){ setNoOrderModal(true); } else { setTrackModal(true); } }}
                  style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:"#fff",padding:"16px 40px",borderRadius:8,fontFamily:"'Cinzel',serif",fontSize:"0.9rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:800,boxShadow:`0 8px 28px ${T.gold}66`,transition:"all 0.3s"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                >🚚 TRACK ORDER</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track Order Modal */}
      {trackModal&&(
        <div onClick={()=>setTrackModal(false)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",animation:"fadeIn 0.3s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,overflow:"hidden",width:"100%",maxWidth:500,border:`2px solid ${T.goldD}`,boxShadow:`0 40px 100px rgba(0,0,0,0.4)`,animation:"scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,padding:"1.5rem",textAlign:"center",position:"relative"}}>
              <button onClick={()=>setTrackModal(false)} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,fontWeight:700}}>×</button>
              <div style={{width:70,height:70,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 1rem",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>🚚</div>
              <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:"#fff",fontSize:"1.6rem",margin:0,textShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>Order Tracking</h2>
            </div>
            <div style={{padding:"2rem",textAlign:"center"}} className="track-modal-inner">
              <div style={{marginBottom:"1.5rem"}}>
                <div style={{width:60,height:60,background:`rgba(139,105,20,0.1)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",border:`2px solid ${T.goldD}`}}>
                  <span style={{fontSize:28}}>✨</span>
                </div>
                <h3 style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"1.2rem",marginBottom:"0.8rem",fontWeight:700}}>Your Order is On The Way!</h3>
                <p style={{color:"rgba(33,40,66,0.7)",fontSize:"1rem",lineHeight:1.8,marginBottom:"1rem"}}>Your magical products are being carefully prepared and will be delivered to your doorstep soon.</p>
              </div>
              <div style={{background:`rgba(139,105,20,0.08)`,border:`1px solid ${T.goldD}33`,borderRadius:8,padding:"1.2rem",marginBottom:"1.5rem"}}>
                <p style={{fontFamily:"'Cinzel',serif",color:T.goldD,fontSize:"0.75rem",letterSpacing:"0.12em",marginBottom:"0.5rem",fontWeight:600}}>ESTIMATED DELIVERY</p>
                <p style={{fontFamily:"'Cinzel Decorative',serif",color:T.navy,fontSize:"1.8rem",fontWeight:900,margin:0}}>4-5 Days</p>
              </div>
              <div style={{display:"flex",justifyContent:"space-around",marginBottom:"1.5rem"}} className="track-steps">
                {[["📦","Order Placed"],["🔄","Processing"],["🚚","Shipped"],["✅","Delivered"]].map(([ic,txt],i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{width:44,height:44,background:i<2?`linear-gradient(135deg,${T.goldD},${T.gold})`:i===2?"rgba(139,105,20,0.2)":"rgba(33,40,66,0.1)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,margin:"0 auto 6px",border:i===2?`2px solid ${T.goldD}`:"none"}}>{ic}</div>
                    <p style={{color:i<2?T.goldD:"rgba(33,40,66,0.5)",fontSize:"0.7rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.05em",fontWeight:i<2?700:500}}>{txt}</p>
                  </div>
                ))}
              </div>
              <button onClick={()=>setTrackModal(false)} style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:"#fff",padding:"12px 28px",borderRadius:4,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.14em",cursor:"pointer",fontWeight:800,width:"100%"}}>GOT IT</button>
            </div>
          </div>
        </div>
      )}

      {/* ── No Orders Modal ── */}
      {noOrderModal&&(
        <div onClick={()=>setNoOrderModal(false)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",animation:"fadeIn 0.3s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,overflow:"hidden",width:"100%",maxWidth:440,border:`2px solid ${T.goldD}`,boxShadow:`0 40px 100px rgba(0,0,0,0.35)`,animation:"scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
            {/* Header */}
            <div style={{background:`linear-gradient(135deg,${T.navy},${T.navyL})`,padding:"1.5rem",textAlign:"center",position:"relative"}}>
              <button onClick={()=>setNoOrderModal(false)} style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,fontWeight:700,lineHeight:1}}>×</button>
              <div style={{width:72,height:72,background:"rgba(255,255,255,0.1)",border:`2px solid ${T.gold}66`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 1rem"}}>🛍️</div>
              <h2 style={{fontFamily:"'Cinzel Decorative',serif",color:T.cream,fontSize:"1.3rem",margin:0,letterSpacing:"0.04em"}}>No Orders Yet</h2>
            </div>
            {/* Body */}
            <div style={{padding:"2rem",textAlign:"center"}}>
              <div style={{width:56,height:56,background:`rgba(201,169,110,0.1)`,border:`2px dashed ${T.goldD}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.2rem",fontSize:26}}>📦</div>
              <h3 style={{fontFamily:"'Cinzel',serif",color:T.navy,fontSize:"1.1rem",marginBottom:"0.7rem",fontWeight:800}}>Nothing to Track</h3>
              <p style={{color:"rgba(33,40,66,0.6)",fontSize:"0.95rem",lineHeight:1.8,marginBottom:"1.8rem"}}>
                You haven't placed any orders yet.<br/>
                Explore our collection and place your first order to track it here.
              </p>
              {/* Decorative divider */}
              <div style={{display:"flex",alignItems:"center",gap:8,margin:"0 auto 1.8rem",width:"fit-content"}}>
                <div style={{width:40,height:1,background:`linear-gradient(to right,transparent,${T.goldD})`}}/>
                <span style={{color:T.gold,fontSize:"0.8rem"}}>✦</span>
                <div style={{width:40,height:1,background:`linear-gradient(to left,transparent,${T.goldD})`}}/>
              </div>
              <div style={{display:"flex",gap:"0.8rem",justifyContent:"center",flexWrap:"wrap"}}>
                <button
                  onClick={()=>setNoOrderModal(false)}
                  style={{background:"transparent",border:`2px solid ${T.goldD}`,color:T.goldD,padding:"11px 24px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.12em",cursor:"pointer",fontWeight:700,transition:"all 0.25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=`rgba(139,105,20,0.08)`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                >CLOSE</button>
                <button
                  onClick={()=>{ setNoOrderModal(false); window.location.hash=""; /* navigate to shop */ document.dispatchEvent(new CustomEvent("ws-nav",{detail:"products"})); }}
                  style={{background:`linear-gradient(135deg,${T.goldD},${T.gold})`,border:"none",color:T.navy,padding:"11px 24px",borderRadius:6,fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.12em",cursor:"pointer",fontWeight:800,boxShadow:`0 4px 16px ${T.gold}44`,transition:"all 0.25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 8px 24px ${T.gold}66`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 16px ${T.gold}44`;}}
                >🛒 SHOP NOW</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function WishstoneApp() {
  const [page,setPage]=useState("home");
  const [selCat,setSelCat]=useState(null);
  const [selProd,setSelProd]=useState(null);
  const [cart,setCart]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [user,setUser]=useState(null);
  const [checkoutCoupon,setCheckoutCoupon]=useState({couponCode:"",discount:0});
  const catRef=useRef(null);
  const storyRef=useRef(null);

  useEffect(()=>{
    const hash=window.location.hash.slice(1);
    if(hash==="signup"||hash==="login") setPage(hash);

    // Validate token on mount — if user was deleted or token is invalid, clear session
    const stored=localStorage.getItem("user");
    const token=localStorage.getItem("token");
    if(stored && token){
      fetch("http://localhost:5000/api/auth/me",{
        headers:{"Authorization":`Bearer ${token}`}
      }).then(r=>r.json()).then(data=>{
        if(data.success){
          setUser(JSON.parse(stored));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }).catch(()=>{
        // Network error — still load from localStorage so app works offline
        setUser(JSON.parse(stored));
      });
    }
  },[]);

  useEffect(()=>{
    const handleHash=()=>{
      const hash=window.location.hash.slice(1);
      if(hash==="signup"||hash==="login") setPage(hash);
    };
    window.addEventListener("hashchange",handleHash);
    return()=>window.removeEventListener("hashchange",handleHash);
  },[]);

  useEffect(()=>{
    const handler=(e)=>{ handleNav(e.detail); scrollTop(); };
    document.addEventListener("ws-nav",handler);
    return()=>document.removeEventListener("ws-nav",handler);
  },[user]);

  const addToCart=p=>setCart(prev=>{ const e=prev.find(i=>i.id===p.id); return e?prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...prev,{...p,qty:1}]; });
  const updQty=(id,qty)=>qty<1?setCart(prev=>prev.filter(i=>i.id!==id)):setCart(prev=>prev.map(i=>i.id===id?{...i,qty}:i));
  const rmCart=id=>setCart(prev=>prev.filter(i=>i.id!==id));
  const togWish=id=>setWishlist(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);

  const handleNav=nav=>{
    setSelProd(null); setSelCat(null);
    if(nav==="dashboard" && !user){
      window.location.hash="signup";
      setPage("signup");
      return;
    }
    setPage(["cart","wishlist","products","dashboard"].includes(nav)?nav:"home");
  };

  const handleSignupSuccess=()=>{
    // After signup, redirect to login page
    window.location.hash="login";
    setPage("login");
  };

  const handleLogin=(userData)=>{
    setUser(userData);
    setPage("home");
    window.location.hash="";
  };

  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const renderPage=()=>{
    if(page==="signup") return <SignupPage onSignupSuccess={handleSignupSuccess}/>;
    if(page==="login") return <LoginPage onSuccess={handleLogin}/>;
    if(page==="dashboard"){
      if(!user){ return <SignupPage onSignupSuccess={handleSignupSuccess}/>; }
      return <UserDashboard user={user} onLogout={handleLogout}/>;
    }
    if(page==="product"&&selProd) return <ProductPage product={selProd} onAdd={addToCart} onWish={togWish} wished={wishlist.includes(selProd.id)}/>;
    if(page==="category"&&selCat) return <CategoryPage category={selCat} onAdd={addToCart} onWish={togWish} wished={wishlist} onClick={p=>{setSelProd(p);setPage("product");scrollTop();}} cart={cart} onQty={updQty}/>;
    if(page==="products") return <AllProductsPage onAdd={addToCart} onWish={togWish} wished={wishlist} onClick={p=>{setSelProd(p);setPage("product");scrollTop();}} cart={cart} onQty={updQty}/>;
    if(page==="cart") return <CartPage cart={cart} onQty={updQty} onRemove={rmCart} onCheckout={(couponData)=>{setCheckoutCoupon(couponData||{couponCode:"",discount:0});setPage("checkout");}}/>;
    if(page==="checkout") return <CheckoutPage cart={cart} onPlaceOrder={()=>{setCart([]);setCheckoutCoupon({couponCode:"",discount:0});setPage("home");scrollTop();}} couponCode={checkoutCoupon.couponCode} discount={checkoutCoupon.discount}/>;
    if(page==="wishlist") return <WishlistPage ids={wishlist} onAdd={addToCart} onWish={togWish} onClick={p=>{setSelProd(p);setPage("product");scrollTop();}} cart={cart} onQty={updQty}/>;
    return <HomePage onCatClick={cat=>{setSelCat(cat);setPage("category");scrollTop();}} onAdd={addToCart} onWish={togWish} wished={wishlist} onProdClick={p=>{setSelProd(p);setPage("product");scrollTop();}} catRef={catRef} storyRef={storyRef} cart={cart} onQty={updQty}/>;
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{fontFamily:"'Cormorant Garamond',serif",background:T.navyD,minHeight:"100vh"}}>
        <Header cartCount={cartCount} wishCount={wishlist.length} onNav={handleNav} currentPage={page} categoryRef={catRef} storyRef={storyRef} user={user} onLogout={handleLogout}/>
        <OfferBanner/>
        <main>{renderPage()}</main>
      </div>
    </>
  );
}
