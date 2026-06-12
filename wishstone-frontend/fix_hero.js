const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'wishstone-frontend/src/WishstoneApp.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find exact boundaries (0-indexed)
let heroStart = -1, statsStart = -1;
lines.forEach((l, i) => {
  if (l.includes('function Hero(') && heroStart === -1) heroStart = i;
  if (l.includes('function StatsBar') && statsStart === -1) statsStart = i;
});

console.log('heroStart (0-idx):', heroStart, ' statsStart (0-idx):', statsStart);

// Keep everything before hero comment line (2 lines before function)
const before = lines.slice(0, heroStart - 1).join('\n');
// Keep everything from StatsBar onwards (1 blank line before it)
const after = lines.slice(statsStart - 1).join('\n');

const heroBlock = `
// ─── HERO ─────────────────────────────────────────────────────
function Hero({ onShop, onRitual }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
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
    setRot(r => ({ x: Math.max(-40, Math.min(40, r.x - (e.clientY - last.y) * 0.4)), y: r.y + (e.clientX - last.x) * 0.5 }));
    setLast({ x: e.clientX, y: e.clientY });
  };
  const onMouseUp = () => setDragging(false);
  const onTouchStart = e => { setDragging(true); setAutoAnim(false); setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
  const onTouchMove = e => {
    if (!dragging) return;
    setRot(r => ({ x: Math.max(-40, Math.min(40, r.x - (e.touches[0].clientY - last.y) * 0.4)), y: r.y + (e.touches[0].clientX - last.x) * 0.5 }));
    setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const onTouchEnd = () => setDragging(false);

  /* ── MOBILE ── */
  if (isMobile) return (
    <section style={{ position:"relative", width:"100%", minHeight:"100svh", background:"#F5F0E8", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {/* warm sandy bg */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 72% 60%, #ddd0b8 0%, #cfc2a8 40%, #F5F0E8 80%)", zIndex:0 }} />
      {/* big circle behind stone */}
      <div style={{ position:"absolute", right:"-15%", top:"30%", width:"80vw", height:"80vw", maxWidth:360, maxHeight:360, borderRadius:"50%", background:"rgba(196,178,152,0.38)", zIndex:0 }} />
      {/* leaf branch top-right */}
      <div style={{ position:"absolute", top:0, right:0, width:"52%", height:"55%", opacity:0.55, pointerEvents:"none", zIndex:1, overflow:"hidden" }}>
        <svg viewBox="0 0 160 240" width="100%" height="100%" preserveAspectRatio="xMaxYMin meet">
          <path d="M145,0 Q100,38 88,85 Q76,132 98,172 Q112,198 96,228 Q86,244 78,250" stroke="#4a5e38" strokeWidth="1.6" fill="none" opacity="0.55"/>
          <ellipse cx="125" cy="28" rx="26" ry="11" fill="#5c7248" transform="rotate(-30 125 28)" opacity="0.65"/>
          <ellipse cx="108" cy="52" rx="24" ry="10" fill="#4a5e38" transform="rotate(-40 108 52)" opacity="0.6"/>
          <ellipse cx="130" cy="74" rx="28" ry="12" fill="#5c7248" transform="rotate(-24 130 74)" opacity="0.62"/>
          <ellipse cx="103" cy="98" rx="22" ry="10" fill="#4a5e38" transform="rotate(-44 103 98)" opacity="0.56"/>
          <ellipse cx="125" cy="118" rx="26" ry="11" fill="#5c7248" transform="rotate(-22 125 118)" opacity="0.58"/>
          <ellipse cx="98" cy="142" rx="20" ry="9" fill="#4a5e38" transform="rotate(-42 98 142)" opacity="0.5"/>
          <ellipse cx="120" cy="162" rx="24" ry="10" fill="#5c7248" transform="rotate(-26 120 162)" opacity="0.52"/>
        </svg>
      </div>
      {/* stone + slab — bottom right */}
      <div style={{ position:"absolute", bottom:0, right:"0%", width:"62%", display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:"8%", zIndex:1 }}>
        <div style={{ width:"68%", aspectRatio:"1.3/1", borderRadius:"50% 48% 52% 50% / 48% 52% 48% 52%", background:"radial-gradient(ellipse at 35% 28%, #6e6e66 0%, #3c3c38 36%, #252522 66%, #181815 100%)", boxShadow:"0 20px 52px rgba(0,0,0,0.52), inset 0 -10px 22px rgba(0,0,0,0.34), inset 0 7px 16px rgba(255,255,255,0.07)", position:"relative", marginBottom:"-3%" }}>
          <div style={{ position:"absolute", top:"45%", left:"15%", width:"70%", height:2, background:"rgba(255,255,255,0.3)", borderRadius:2, transform:"rotate(-4deg)" }} />
          <div style={{ position:"absolute", top:"18%", left:"22%", width:"28%", height:"20%", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)", filter:"blur(3px)" }} />
          <div style={{ position:"absolute", bottom:-7, left:"10%", width:"80%", height:10, borderRadius:"50%", background:"rgba(0,0,0,0.22)", filter:"blur(6px)" }} />
        </div>
        <div style={{ width:"90%", height:"clamp(22px,7vw,40px)", background:"linear-gradient(180deg,#c4b292 0%,#b0a07e 55%,#9e8e6c 100%)", borderRadius:"5px 5px 3px 3px", boxShadow:"0 8px 24px rgba(0,0,0,0.22), inset 0 1px 5px rgba(255,255,255,0.15)" }} />
      </div>
      {/* text — left side */}
      <div style={{ position:"relative", zIndex:2, padding:"calc(64px + 1.2rem) 1.4rem 2rem", flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-start", maxWidth:"62%" }}>
        <div style={{ marginBottom:"0.9rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill="#8D7A5B" opacity="0.9"/>
          </svg>
        </div>
        <p style={{ fontSize:"0.72rem", color:"#6a6040", fontWeight:400, marginBottom:"0.55rem", lineHeight:1.4 }}>
          India's <span style={{ color:"#8D7A5B", fontStyle:"italic", fontWeight:600 }}>Sacred</span> Manifestation Stone
        </p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,9.5vw,3.2rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-0.025em", color:"#1a1a1a", margin:"0 0 0.6rem" }}>
          Turn<br />Intentions<br />
          <span style={{ color:"#8D7A5B", fontStyle:"italic" }}>into <span style={{ color:"#8D7A5B" }}>Reality</span></span>
          <sup style={{ color:"#8D7A5B", fontSize:"0.35em", fontStyle:"normal", verticalAlign:"super", marginLeft:2 }}>✦</sup>
        </h1>
        <div style={{ display:"flex", alignItems:"center", gap:7, margin:"0.75rem 0 0.85rem" }}>
          <div style={{ width:52, height:1, background:"linear-gradient(90deg,#8D7A5B,rgba(141,122,91,0.1))" }} />
          <span style={{ color:"#8D7A5B", fontSize:8, lineHeight:1 }}>✦</span>
        </div>
        <p style={{ fontSize:"0.78rem", color:"#4a4a3a", lineHeight:1.65, marginBottom:"1.4rem" }}>
          Create mindful daily rituals that help you manifest your goals, cultivate inner peace, and stay aligned with the life you want to create.
        </p>
        <button onClick={onRitual} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#1e2618", color:"#fff", border:"none", padding:"12px 18px", borderRadius:7, fontSize:"0.82rem", fontWeight:600, cursor:"pointer", letterSpacing:"0.02em", alignSelf:"flex-start" }}>
          Explore Rituals
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
      {/* scroll indicator */}
      <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, zIndex:3, pointerEvents:"none" }}>
        <div style={{ width:1, height:14, background:"rgba(76,90,67,0.4)", borderRadius:1 }} />
        <span style={{ fontSize:"0.48rem", fontWeight:700, color:"rgba(76,90,67,0.55)", letterSpacing:"0.22em", textTransform:"uppercase" }}>SCROLL</span>
      </div>
    </section>
  );

  /* ── DESKTOP (unchanged) ── */
  return (
    <section style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", paddingTop:80, paddingBottom:40, paddingLeft:"clamp(1rem,5vw,3.5rem)", paddingRight:"clamp(1rem,5vw,3.5rem)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"18%", right:"6%", width:8, height:8, borderRadius:"50%", background:"#4C5A43", opacity:0.5 }} />
      <div style={{ position:"absolute", bottom:"28%", right:"32%", width:6, height:6, borderRadius:"50%", background:"#4C5A43", opacity:0.4 }} />
      <div className="max-w hero-grid" style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2.5rem", alignItems:"center" }}>
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
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", minHeight:"clamp(320px,45vw,520px)", perspective:"900px" }} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", fontSize:"0.62rem", color:T.textMid, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, opacity:0.6, whiteSpace:"nowrap", zIndex:10 }}>↔ Drag to rotate</div>
          <div onMouseDown={onMouseDown} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ position:"relative", zIndex:2, transformStyle:"preserve-3d", transform:autoAnim?undefined:\`rotateX(\${rot.x}deg) rotateY(\${rot.y}deg)\`, animation:autoAnim?"stone3d 8s ease-in-out infinite":"none", cursor:dragging?"grabbing":"grab", transition:dragging?"none":"transform 0.4s ease", userSelect:"none" }}>
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

`;

const result = before + '\n' + heroBlock + '\n' + after;
fs.writeFileSync(filePath, result, 'utf8');
console.log('SUCCESS. Total lines:', result.split('\n').length);
