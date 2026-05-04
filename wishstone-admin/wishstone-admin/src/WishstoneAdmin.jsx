import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

// ─── API ──────────────────────────────────────────────────────
const API = process.env.REACT_APP_API_URL || "https://wishstone.onrender.com/api";
const api = {
  get:      (url, token)       => axios.get(`${API}${url}`,    { headers: { Authorization: `Bearer ${token}` }, timeout: 12000 }),
  post:     (url, data, token) => axios.post(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}` }, timeout: 12000 }),
  put:      (url, data, token) => axios.put(`${API}${url}`, data,  { headers: { Authorization: `Bearer ${token}` }, timeout: 12000 }),
  delete:   (url, token)       => axios.delete(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` }, timeout: 12000 }),
  postForm: (url, data, token) => axios.post(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, timeout: 20000 }),
  putForm:  (url, data, token) => axios.put(`${API}${url}`, data,  { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, timeout: 20000 }),
};

// ─── THEME ────────────────────────────────────────────────────
const T = {
  bg:       "#F5F0E8",
  white:    "#ffffff",
  orange:   "#E8720C",
  orangeD:  "#C45E00",
  orangeL:  "#FF9A3C",
  text:     "#1a1a1a",
  textMid:  "#4a4a4a",
  textLight:"#8a8a8a",
  border:   "rgba(26,26,26,0.10)",
  shadow:   "0 2px 16px rgba(26,26,26,0.08)",
  shadowMd: "0 8px 32px rgba(26,26,26,0.12)",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { background:${T.bg}; color:${T.text}; font-family:'Inter',sans-serif; }
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:${T.bg}; }
  ::-webkit-scrollbar-thumb { background:${T.orange}; border-radius:3px; }
  input, textarea, select { font-family:'Inter',sans-serif; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
  .ws-shimmer { background:linear-gradient(90deg,#ede8df 25%,#f5f0e8 50%,#ede8df 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; }

  /* Sidebar */
  .ws-sidebar { width:240px; min-height:100vh; background:${T.white}; border-right:1px solid ${T.border}; display:flex; flex-direction:column; position:fixed; left:0; top:0; bottom:0; z-index:200; transition:transform 0.3s ease; }
  .ws-main    { margin-left:240px; min-height:100vh; background:${T.bg}; padding:2rem 2.5rem; pointer-events:auto; }
  .ws-sidebar-overlay { position:fixed; inset:0; background:rgba(26,26,26,0.5); z-index:199; opacity:0; pointer-events:none; transition:opacity 0.3s ease; }
  .ws-sidebar-overlay.open { opacity:1; pointer-events:auto; }

  /* Table */
  .ws-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .ws-table-wrap table { min-width:680px; width:100%; border-collapse:collapse; }

  /* Grids */
  .ws-stat-row   { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
  .ws-two-col    { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
  .ws-modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .ws-coupon-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.25rem; }
  .ws-cat-grid   { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.25rem; }
  .ws-filter-tabs{ display:flex; flex-wrap:wrap; gap:8px; }
  .ws-page-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }

  /* Mobile bar */
  .ws-mobile-bar { display:none; position:fixed; top:0; left:0; right:0; height:56px; background:${T.white}; border-bottom:1px solid ${T.border}; z-index:250; align-items:center; padding:0 1rem; gap:12px; }
  .ws-close-btn  { display:none !important; }

  @media(max-width:1200px) { .ws-stat-row { grid-template-columns:repeat(2,1fr) !important; } }
  @media(max-width:1024px) {
    .ws-sidebar { width:64px !important; }
    .ws-sidebar .ws-label { display:none !important; }
    .ws-sidebar .ws-brand-text { display:none !important; }
    .ws-main { margin-left:64px !important; }
  }
  @media(max-width:768px) {
    .ws-sidebar { transform:translateX(-100%); width:75% !important; max-width:280px !important; min-width:240px !important; z-index:300; border-radius:0 16px 16px 0; box-shadow:4px 0 24px rgba(0,0,0,0.15); }
    .ws-sidebar.open { transform:translateX(0) !important; }
    .ws-sidebar .ws-label { display:inline !important; }
    .ws-sidebar .ws-brand-text { display:block !important; }
    .ws-close-btn { display:flex !important; }
    .ws-mobile-bar { display:flex !important; }
    .ws-main { margin-left:0 !important; padding:1rem !important; padding-top:4.5rem !important; }
    body:has(.ws-sidebar.open) { overflow:hidden; }
    .ws-stat-row { grid-template-columns:1fr 1fr !important; }
    .ws-two-col  { grid-template-columns:1fr !important; }
    .ws-modal-grid { grid-template-columns:1fr !important; }
    .ws-page-header { flex-direction:column; align-items:flex-start !important; }
    .ws-coupon-grid { grid-template-columns:1fr !important; }
    .ws-cat-grid    { grid-template-columns:1fr 1fr !important; }
    .ws-filter-tabs { flex-wrap:nowrap !important; overflow-x:auto; padding-bottom:4px; }
    .ws-filter-tabs::-webkit-scrollbar { height:3px; }
    .ws-filter-tabs::-webkit-scrollbar-thumb { background:${T.orange}; border-radius:2px; }
  }
  @media(max-width:480px) {
    .ws-stat-row { grid-template-columns:1fr !important; }
    .ws-cat-grid { grid-template-columns:1fr !important; }
    .ws-main { padding:0.75rem !important; padding-top:4.5rem !important; }
  }
`;

// ─── FRAMER VARIANTS ──────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};
const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.18 } },
};

// ─── SHARED STYLES ────────────────────────────────────────────
const inputSx = {
  width: "100%",
  background: T.white,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  color: T.text,
  padding: "10px 14px",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s",
};
const labelSx = {
  display: "block",
  color: T.textLight,
  fontSize: "0.72rem",
  letterSpacing: "0.08em",
  marginBottom: 6,
  textTransform: "uppercase",
  fontWeight: 600,
};
const btnPrimary = {
  background: T.orange,
  border: "none",
  color: T.white,
  padding: "10px 22px",
  borderRadius: 10,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.88rem",
  fontWeight: 600,
  transition: "background 0.2s",
  whiteSpace: "nowrap",
};
const btnGhost = {
  background: "transparent",
  border: `1px solid ${T.border}`,
  color: T.textMid,
  padding: "10px 20px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: "0.88rem",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────
const Badge = ({ children, color = "orange" }) => {
  const map = {
    orange: { bg: "rgba(232,114,12,0.12)", border: "rgba(232,114,12,0.3)", text: T.orangeD },
    green:  { bg: "rgba(22,163,74,0.10)",  border: "rgba(22,163,74,0.3)",  text: "#15803d" },
    red:    { bg: "rgba(220,38,38,0.10)",  border: "rgba(220,38,38,0.3)",  text: "#dc2626" },
    yellow: { bg: "rgba(202,138,4,0.12)",  border: "rgba(202,138,4,0.3)",  text: "#a16207" },
    blue:   { bg: "rgba(37,99,235,0.10)",  border: "rgba(37,99,235,0.3)",  text: "#1d4ed8" },
    gray:   { bg: "rgba(107,114,128,0.10)",border: "rgba(107,114,128,0.3)",text: "#6b7280" },
  };
  const c = map[color] || map.gray;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 6, padding: "2px 9px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", display: "inline-block" }}>
      {children}
    </span>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "i";
  const color = type === "success" ? T.orange : type === "error" ? "#dc2626" : "#1d4ed8";
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 10 }}
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: T.white, border: `1px solid ${T.border}`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "14px 18px", minWidth: 280, display: "flex", alignItems: "center", gap: 12, boxShadow: T.shadowMd }}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{icon}</span>
      <span style={{ color: T.text, fontSize: "0.88rem", flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: T.textLight, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
    </motion.div>
  );
};

const Modal = ({ title, children, onClose, width = 620 }) => (
  <AnimatePresence>
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(26,26,26,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div variants={modalVariants} initial="initial" animate="animate" exit="exit"
        style={{ background: T.white, borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: T.shadowMd }}>
        <div style={{ padding: "1.5rem 2rem", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: T.white, zIndex: 1 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: T.text, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.textMid, width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "1.75rem 2rem" }}>{children}</div>
      </motion.div>
    </div>
  </AnimatePresence>
);

const Spinner = ({ size = 32 }) => (
  <div style={{ width: size, height: size, border: `3px solid rgba(232,114,12,0.2)`, borderTop: `3px solid ${T.orange}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
);

const LoadingPage = ({ label = "Loading..." }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", gap: 16 }}>
    <Spinner size={36} />
    <p style={{ color: T.textLight, fontSize: "0.88rem" }}>{label}</p>
  </div>
);

const EmptyState = ({ icon, title, sub, action }) => (
  <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <p style={{ color: T.text, fontWeight: 600, fontSize: "1rem", marginBottom: 6 }}>{title}</p>
    {sub && <p style={{ color: T.textLight, fontSize: "0.85rem", marginBottom: 20 }}>{sub}</p>}
    {action}
  </div>
);

const ConfirmModal = ({ title, message, onConfirm, onCancel, danger = true }) => (
  <Modal title={title} onClose={onCancel} width={420}>
    <p style={{ color: T.textMid, marginBottom: "1.5rem", lineHeight: 1.6 }}>{message}</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
      <button onClick={onCancel} style={btnGhost}>Cancel</button>
      <button onClick={onConfirm} style={{ ...btnPrimary, background: danger ? "#dc2626" : T.orange }}>Confirm</button>
    </div>
  </Modal>
);

// ─── STATUS HELPERS ───────────────────────────────────────────
const orderStatusColor = { pending: "yellow", confirmed: "blue", processing: "orange", shipped: "blue", delivered: "green", cancelled: "red" };
const paymentStatusColor = { pending: "yellow", paid: "green", failed: "red", refunded: "gray" };

// ─── NAV CONFIG ───────────────────────────────────────────────
// SVG icons — each visually represents its section uniquely
const NAV = [
  {
    id: "dashboard", label: "Dashboard",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? "rgba(232,114,12,0.15)" : "none"}/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? "rgba(232,114,12,0.15)" : "none"}/>
      </svg>
    ),
  },
  {
    id: "products", label: "Products",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill={active ? "rgba(232,114,12,0.1)" : "none"}/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
        <path d="M12 22V12"/>
      </svg>
    ),
  },
  {
    id: "orders", label: "Orders",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" fill={active ? "rgba(232,114,12,0.1)" : "none"}/>
        <circle cx="9" cy="20" r="1.5" fill={active ? "#E8720C" : "#8a8a8a"}/>
        <circle cx="18" cy="20" r="1.5" fill={active ? "#E8720C" : "#8a8a8a"}/>
        <path d="M6 6L5 3H2"/>
        <path d="M10 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke={active ? "#22c55e" : "#8a8a8a"}/>
      </svg>
    ),
  },
  {
    id: "customers", label: "Customers",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill={active ? "rgba(232,114,12,0.1)" : "none"}/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "users", label: "Users",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <circle cx="18" cy="6" r="3" fill={active ? "rgba(232,114,12,0.2)" : "none"} stroke={active ? "#E8720C" : "#8a8a8a"}/>
        <path d="M18 4v4M16 6h4" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "coupons", label: "Coupons",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" fill={active ? "rgba(232,114,12,0.1)" : "none"} rx="2"/>
        <path d="M9 4v16" strokeDasharray="4 2"/>
        <path d="M15 9l-2 2 2 2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="15" cy="9" r="1" fill={active ? "#E8720C" : "#8a8a8a"}/>
        <circle cx="15" cy="15" r="1" fill={active ? "#E8720C" : "#8a8a8a"}/>
      </svg>
    ),
  },
  {
    id: "categories", label: "Categories",
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#E8720C" : "#8a8a8a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19V9a2 2 0 0 0-2-2h-6.3" strokeLinecap="round"/>
        <path d="M2 19V9a2 2 0 0 1 2-2h6.3" strokeLinecap="round"/>
        <path d="M12 2v6" strokeLinecap="round"/>
        <path d="M9 5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="9" width="20" height="12" rx="2" fill={active ? "rgba(232,114,12,0.1)" : "none"}/>
        <path d="M6 15h4" strokeLinecap="round"/>
        <circle cx="16" cy="15" r="2" fill={active ? "rgba(232,114,12,0.3)" : "none"}/>
      </svg>
    ),
  },
];

// ─── SIDEBAR ─────────────────────────────────────────────────
function Sidebar({ active, onNav, admin, onLogout, mobileOpen, onMobileClose }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".nav-item");
    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        if (!item.classList.contains("active")) {
          gsap.to(item, { x: 4, duration: 0.18, ease: "power2.out" });
        }
      });
      item.addEventListener("mouseleave", () => {
        gsap.to(item, { x: 0, duration: 0.18, ease: "power2.out" });
      });
    });
  }, []);

  return (
    <>
      <div
        className={`ws-sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={onMobileClose}
      />
      <aside className={`ws-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand */}
        <div style={{ padding: "1.5rem 1.25rem 1.25rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: T.orange, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: T.white, fontSize: 18, fontWeight: 700 }}>W</span>
            </div>
            <div className="ws-brand-text">
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: T.text }}>Wishstone</div>
              <div style={{ fontSize: "0.62rem", color: T.orange, letterSpacing: "0.12em", fontWeight: 600 }}>ADMIN PANEL</div>
            </div>
            <button className="ws-close-btn" onClick={onMobileClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.textLight, fontSize: 20 }}>×</button>
          </div>
        </div>

        {/* Nav */}
        <nav ref={navRef} style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
          {NAV.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => { onNav(item.id); onMobileClose(); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 2,
                  background: isActive ? `rgba(232,114,12,0.10)` : "transparent",
                  border: isActive ? `1px solid rgba(232,114,12,0.25)` : "1px solid transparent",
                  color: isActive ? T.orange : T.textLight,
                  cursor: "pointer", textAlign: "left", fontSize: "0.88rem", fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s",
                }}>
                <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{item.icon(isActive)}</span>
                <span className="ws-label">{item.label}</span>
                {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.orange, flexShrink: 0 }} />}
              </button>
            );
          })}
        </nav>

        {/* Admin footer */}
        <div style={{ padding: "1rem 1.25rem", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.orange, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
              {(admin?.name || "A")[0].toUpperCase()}
            </div>
            <div className="ws-brand-text">
              <div style={{ fontSize: "0.82rem", color: T.text, fontWeight: 600 }}>{admin?.name || "Admin"}</div>
              <div style={{ fontSize: "0.68rem", color: T.textLight }}>Super Admin</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ ...btnGhost, width: "100%", fontSize: "0.8rem", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span>↩</span><span className="ws-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@wishstone.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const logoRef = useRef(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.4)" });
    }
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/admin/login`, { email, password });
      onLogin(res.data.token, res.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(232,114,12,0.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(232,114,12,0.06) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div ref={logoRef} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: 64, height: 64, background: T.orange, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: `0 8px 24px rgba(232,114,12,0.35)` }}>
            <span style={{ color: T.white, fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>W</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: T.text }}>Wishstone</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>Admin Control Panel</p>
        </div>

        <div style={{ background: T.white, borderRadius: 20, padding: "2rem", boxShadow: T.shadowMd, border: `1px solid ${T.border}` }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: T.text, marginBottom: "1.5rem", fontWeight: 700 }}>Sign In</h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelSx}>Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputSx} placeholder="admin@wishstone.com"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelSx}>Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" style={inputSx} placeholder="••••••••"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>

            {error && (
              <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ ...btnPrimary, width: "100%", padding: "13px", fontSize: "0.95rem", opacity: loading ? 0.75 : 1, background: loading ? T.orangeD : T.orange }}>
              {loading ? "Signing in…" : "Sign In to Dashboard"}
            </button>
          </form>

          <p style={{ color: T.textLight, fontSize: "0.72rem", textAlign: "center", marginTop: "1.25rem" }}>
            Default: admin@wishstone.com / wishstone@123
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent = T.orange }) {
  const valRef = useRef(null);
  const numericVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const prefix = String(value).startsWith("₹") ? "₹" : "";

  useEffect(() => {
    if (!valRef.current || isNaN(numericVal)) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericVal, duration: 1.2, ease: "power2.out",
      onUpdate: () => {
        if (valRef.current) {
          const formatted = numericVal > 999 ? Math.round(obj.val).toLocaleString("en-IN") : Math.round(obj.val);
          valRef.current.textContent = `${prefix}${formatted}`;
        }
      },
    });
  }, [numericVal, prefix]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ background: T.white, borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, boxShadow: T.shadow, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: T.textLight, fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase", fontWeight: 600 }}>{label}</p>
          <p ref={valRef} style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: T.text, lineHeight: 1 }}>
            {isNaN(numericVal) ? value : `${prefix}0`}
          </p>
          {sub && <p style={{ color: T.textLight, fontSize: "0.75rem", marginTop: 6 }}>{sub}</p>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(232,114,12,0.10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true); setError(false);
    api.get("/admin/analytics", token)
      .then(r => { setData(r.data.analytics); setLoading(false); })
      .catch(() => { setLoading(false); setError(true); });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingPage label="Loading analytics…" />;
  if (error || !data) return (
    <EmptyState icon="⚠️" title="Could not load analytics"
      sub="Backend may be waking up (Render free tier). Try again in a moment."
      action={<button onClick={load} style={{ ...btnPrimary, margin: "0 auto" }}>↺ Retry</button>} />
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Dashboard</h1>
        <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>Welcome back — here's what's happening with Wishstone.</p>
      </div>

      {/* Stats */}
      <div className="ws-stat-row" style={{ marginBottom: "2rem" }}>
        <StatCard icon="📦" label="Total Orders"   value={data.totalOrders}                                    />
        <StatCard icon="₹"  label="Total Revenue"  value={`₹${(data.totalRevenue || 0).toLocaleString("en-IN")}`} />
        <StatCard icon="◆"  label="Products"       value={data.totalProducts}                                  />
        <StatCard icon="👥" label="Customers"       value={data.totalUsers}                                     />
      </div>

      <div className="ws-two-col">
        {/* Recent Orders */}
        <div style={{ background: T.white, borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: T.text, fontWeight: 700 }}>Recent Orders</h3>
            {data.pendingOrders > 0 && <Badge color="yellow">{data.pendingOrders} pending</Badge>}
          </div>
          {(data.recentOrders || []).slice(0, 7).map((o, i) => (
            <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 6 ? `1px solid ${T.border}` : "none" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 600 }}>{o.orderNumber || `#${o._id.slice(-6)}`}</div>
                <div style={{ fontSize: "0.75rem", color: T.textLight }}>{o.customer?.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.88rem", color: T.orange, fontWeight: 700 }}>₹{(o.totalAmount || 0).toLocaleString("en-IN")}</div>
                <Badge color={orderStatusColor[o.orderStatus] || "gray"}>{o.orderStatus}</Badge>
              </div>
            </div>
          ))}
          {(!data.recentOrders || data.recentOrders.length === 0) && (
            <p style={{ color: T.textLight, fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>No orders yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div style={{ background: T.white, borderRadius: 16, padding: "1.5rem", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: T.text, fontWeight: 700, marginBottom: "1.25rem" }}>Top Products</h3>
          {(data.topProducts || []).map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < (data.topProducts.length - 1) ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "rgba(232,114,12,0.15)" : T.bg, border: `1px solid ${i === 0 ? T.orange : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: i === 0 ? T.orange : T.textLight, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.85rem", color: T.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: "0.72rem", color: T.textLight }}>{p.totalSold} sold · {p.totalClicks} clicks</div>
              </div>
              <div style={{ fontSize: "0.88rem", color: T.orange, fontWeight: 700, flexShrink: 0 }}>₹{(p.price || 0).toLocaleString("en-IN")}</div>
            </div>
          ))}
          {(!data.topProducts || data.topProducts.length === 0) && (
            <p style={{ color: T.textLight, fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>No sales data yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────
function Products({ token, showToast }) {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [search, setSearch]       = useState("");
  const [confirm, setConfirm]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const blank = { name: "", category: "", shortDesc: "", price: "", originalPrice: "", stock: "", isBestSeller: false, isFeatured: false, benefits: "", tags: "", weight: "", suitableFor: "" };
  const [form, setForm] = useState(blank);
  const [imageFile, setImageFile] = useState(null);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.get("/admin/products", token), api.get("/categories", token)]);
      setProducts(p.data.products || []); setCategories(c.data.categories || []);
    } catch { showToast("Failed to load products", "error"); }
    setLoading(false);
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm(blank); setImageFile(null); setShowModal(true); };
  const openEdit = p => {
    setEditing(p);
    setForm({ name: p.name || "", category: p.category?._id || "", shortDesc: p.shortDesc || "", price: p.price || "", originalPrice: p.originalPrice || "", stock: p.stock || "", isBestSeller: !!p.isBestSeller, isFeatured: !!p.isFeatured, benefits: (p.benefits || []).join(", "), tags: (p.tags || []).join(", "), weight: p.weight || "", suitableFor: p.suitableFor || "" });
    setImageFile(null); setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) { showToast("Name, category and price are required", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "benefits" || k === "tags") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (imageFile) fd.append("image", imageFile);
      if (editing) { await api.putForm(`/admin/product/update/${editing._id}`, fd, token); showToast("Product updated!", "success"); }
      else          { await api.postForm("/admin/product/add", fd, token);                  showToast("Product added!", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error saving product", "error"); }
    setSaving(false);
  };

  const handleDelete = async id => {
    try { await api.delete(`/admin/product/delete/${id}`, token); showToast("Product deleted.", "success"); setConfirm(null); load(); }
    catch { showToast("Failed to delete product", "error"); }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="ws-page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Products</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add Product</button>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
          style={{ ...inputSx, maxWidth: 340, background: T.white }}
          onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
      </div>

      {loading ? <LoadingPage /> : (
        <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden" }}>
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                  {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textLight, fontSize: "0.72rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: T.bg, flexShrink: 0, border: `1px solid ${T.border}` }}>
                          {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textLight }}>◆</div>}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{p.name}</div>
                          {p.isBestSeller && <Badge color="orange">Best Seller</Badge>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><span style={{ color: T.textMid, fontSize: "0.85rem" }}>{p.category?.name || "—"}</span></td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "0.9rem", color: T.orange, fontWeight: 700 }}>₹{(p.price || 0).toLocaleString("en-IN")}</div>
                      {p.originalPrice && <div style={{ fontSize: "0.72rem", color: T.textLight, textDecoration: "line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</div>}
                    </td>
                    <td style={{ padding: "12px 16px" }}><Badge color={p.stock > 10 ? "green" : p.stock > 0 ? "yellow" : "red"}>{p.stock} units</Badge></td>
                    <td style={{ padding: "12px 16px" }}><Badge color={p.isActive ? "green" : "gray"}>{p.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", color: "#1d4ed8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Edit</button>
                        <button onClick={() => setConfirm(p._id)} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <EmptyState icon="◆" title="No products found" sub={search ? "Try a different search term" : "Add your first product"} />}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Product" : "Add New Product"} onClose={() => setShowModal(false)} width={720}>
          <div className="ws-modal-grid">
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSx}>Product Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSx} placeholder="e.g. WishStone — Rose Quartz"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputSx}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSx}>Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={inputSx} placeholder="0"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputSx} placeholder="1299"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} style={inputSx} placeholder="1799"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSx}>Short Description</label>
              <textarea value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} rows={3} style={{ ...inputSx, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSx}>Benefits (comma separated)</label>
              <input value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} style={inputSx} placeholder="Reduces stress, Promotes sleep, Clears energy"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Suitable For</label>
              <input value={form.suitableFor} onChange={e => setForm({ ...form, suitableFor: e.target.value })} style={inputSx} placeholder="Beginners, healers…"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Weight</label>
              <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} style={inputSx} placeholder="e.g. 50g"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={inputSx} placeholder="crystal, healing, love"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Product Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...inputSx, padding: "8px 14px" }} />
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: T.textMid }}>
                <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} style={{ accentColor: T.orange, width: 16, height: 16 }} />
                Best Seller
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: T.textMid }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: T.orange, width: 16, height: 16 }} />
                Featured
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.75 : 1 }}>
              {saving ? "Saving…" : editing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </motion.div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────
function Orders({ token, showToast }) {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus]   = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [updating, setUpdating]     = useState(false);

  const load = useCallback(async () => {
    try { const r = await api.get("/admin/orders", token); setOrders(r.data.orders || []); }
    catch { showToast("Failed to load orders", "error"); }
    setLoading(false);
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${selected._id}/status`, { status: newStatus, trackingNumber: trackingNo }, token);
      showToast("Order status updated!", "success"); setSelected(null); load();
    } catch { showToast("Failed to update order", "error"); }
    setUpdating(false);
  };

  const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Orders</h1>
        <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="ws-filter-tabs" style={{ marginBottom: "1.5rem" }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap",
            background: filter === s ? T.orange : T.white,
            border: `1px solid ${filter === s ? T.orange : T.border}`,
            color: filter === s ? T.white : T.textMid,
            transition: "all 0.2s",
          }}>{s} {s !== "all" && `(${orders.filter(o => o.orderStatus === s).length})`}</button>
        ))}
      </div>

      {loading ? <LoadingPage label="Loading orders…" /> : (
        <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden" }}>
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                  {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textLight, fontSize: "0.72rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o._id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ color: T.orange, fontWeight: 700, fontSize: "0.88rem" }}>{o.orderNumber || `#${o._id.slice(-8)}`}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{o.customer?.name || "—"}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textLight }}>{o.customer?.email}</div>
                      <div style={{ fontSize: "0.72rem", color: T.textLight }}>{o.customer?.phone}</div>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: 180 }}>
                      {(o.items || []).slice(0, 2).map((item, i) => (
                        <div key={i} style={{ fontSize: "0.78rem", color: T.textMid, marginBottom: 2 }}>
                          {item.name} <span style={{ color: T.textLight }}>×{item.quantity}</span>
                        </div>
                      ))}
                      {(o.items || []).length > 2 && <div style={{ fontSize: "0.72rem", color: T.orange }}>+{o.items.length - 2} more</div>}
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ color: T.text, fontWeight: 700, fontSize: "0.95rem" }}>₹{(o.totalAmount || 0).toLocaleString("en-IN")}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge color={paymentStatusColor[o.paymentStatus] || "gray"}>{o.paymentStatus}</Badge>
                      <div style={{ fontSize: "0.68rem", color: T.textLight, marginTop: 3, textTransform: "uppercase" }}>{o.paymentMethod}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><Badge color={orderStatusColor[o.orderStatus] || "gray"}>{o.orderStatus}</Badge></td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ color: T.textLight, fontSize: "0.78rem" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => { setSelected(o); setNewStatus(o.orderStatus); setTrackingNo(o.trackingNumber || ""); }}
                        style={{ background: `rgba(232,114,12,0.10)`, border: `1px solid rgba(232,114,12,0.25)`, color: T.orange, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <EmptyState icon="📦" title="No orders found" sub={filter !== "all" ? `No ${filter} orders` : "Orders will appear here"} />}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <Modal title={`Order ${selected.orderNumber || selected._id.slice(-8)}`} onClose={() => setSelected(null)} width={700}>
          <div className="ws-modal-grid" style={{ marginBottom: "1.25rem" }}>
            {/* Customer */}
            <div style={{ background: T.bg, borderRadius: 12, padding: "1rem", border: `1px solid ${T.border}` }}>
              <p style={{ color: T.orange, fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>Customer Info</p>
              {[["Name", selected.customer?.name], ["Email", selected.customer?.email], ["Phone", selected.customer?.phone], ["Age", selected.customer?.age]].map(([l, v]) => v ? (
                <div key={l} style={{ marginBottom: 6 }}>
                  <span style={{ color: T.textLight, fontSize: "0.72rem" }}>{l}: </span>
                  <span style={{ color: T.text, fontSize: "0.88rem", fontWeight: 500 }}>{v}</span>
                </div>
              ) : null)}
            </div>
            {/* Address */}
            <div style={{ background: T.bg, borderRadius: 12, padding: "1rem", border: `1px solid ${T.border}` }}>
              <p style={{ color: T.orange, fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>Delivery Address</p>
              {selected.shippingAddress ? (
                <div style={{ color: T.textMid, fontSize: "0.85rem", lineHeight: 1.8 }}>
                  {selected.shippingAddress.flat && <div>{selected.shippingAddress.flat}</div>}
                  {selected.shippingAddress.area && <div>{selected.shippingAddress.area}</div>}
                  {selected.shippingAddress.landmark && <div>Near: {selected.shippingAddress.landmark}</div>}
                  <div>{[selected.shippingAddress.city, selected.shippingAddress.state, selected.shippingAddress.pincode].filter(Boolean).join(", ")}</div>
                  {selected.shippingAddress.country && <div>{selected.shippingAddress.country}</div>}
                </div>
              ) : <p style={{ color: T.textLight, fontSize: "0.82rem" }}>No address on file</p>}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: T.bg, borderRadius: 12, padding: "1rem", marginBottom: "1.25rem", border: `1px solid ${T.border}` }}>
            <p style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>Order Items ({selected.items?.length || 0})</p>
            {(selected.items || []).map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < (selected.items.length - 1) ? `1px solid ${T.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(232,114,12,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>◆</div>
                  <div>
                    <div style={{ color: T.text, fontSize: "0.88rem", fontWeight: 500 }}>{item.name || "Product"}</div>
                    <div style={{ color: T.textLight, fontSize: "0.72rem" }}>Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString("en-IN")}</div>
                  </div>
                </div>
                <span style={{ color: T.orange, fontWeight: 700, fontSize: "0.9rem" }}>₹{((item.price || 0) * (item.quantity || 0)).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: `1px solid ${T.border}` }}>
              <span style={{ color: T.textMid, fontSize: "0.88rem" }}>Order Total</span>
              <span style={{ color: T.text, fontWeight: 800, fontSize: "1rem" }}>₹{(selected.totalAmount || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment + Date */}
          <div className="ws-modal-grid" style={{ marginBottom: "1.25rem" }}>
            <div style={{ background: T.bg, borderRadius: 10, padding: "0.8rem", border: `1px solid ${T.border}` }}>
              <p style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>Payment</p>
              <p style={{ color: T.text, fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{selected.paymentMethod || "—"}</p>
              <Badge color={paymentStatusColor[selected.paymentStatus] || "gray"}>{selected.paymentStatus}</Badge>
            </div>
            <div style={{ background: T.bg, borderRadius: 10, padding: "0.8rem", border: `1px solid ${T.border}` }}>
              <p style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase", fontWeight: 600 }}>Order Date</p>
              <p style={{ color: T.text, fontSize: "0.9rem", fontWeight: 500 }}>{new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p style={{ color: T.textLight, fontSize: "0.75rem" }}>{new Date(selected.createdAt).toLocaleTimeString("en-IN")}</p>
            </div>
          </div>

          {/* Update status */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelSx}>Update Order Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={inputSx}>
              {["pending","confirmed","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelSx}>Tracking Number (optional)</label>
            <input value={trackingNo} onChange={e => setTrackingNo(e.target.value)} placeholder="e.g. BD1234567890IN" style={inputSx}
              onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={() => setSelected(null)} style={btnGhost}>Close</button>
            <button onClick={updateStatus} disabled={updating} style={{ ...btnPrimary, opacity: updating ? 0.75 : 1 }}>
              {updating ? "Updating…" : "Update Status"}
            </button>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

// ─── CUSTOMERS ────────────────────────────────────────────────
function Customers({ token, showToast }) {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/admin/customers", token)
      .then(r => { setCustomers(r.data.customers || []); setLoading(false); })
      .catch(() => { showToast("Failed to load customers", "error"); setLoading(false); });
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await api.delete("/admin/users-clear-all", token);
      setCustomers([]); setConfirmDeleteAll(false);
      showToast("All customers deleted.", "success");
    } catch { showToast("Failed to delete customers", "error"); }
    setDeletingAll(false);
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const formatAddr = addr => {
    if (!addr) return "—";
    const parts = [addr.flat, addr.area, addr.landmark, addr.city, addr.state, addr.country].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="ws-page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Customers</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{customers.length} total customers</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: T.textLight, fontSize: "0.75rem" }}>Total</span>
            <span style={{ color: T.orange, fontWeight: 800, fontSize: "1.1rem", fontFamily: "'Playfair Display', serif" }}>{customers.length}</span>
          </div>
          {customers.length > 0 && (
            <button onClick={() => setConfirmDeleteAll(true)}
              style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", borderRadius: 10, padding: "9px 16px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
              Delete All
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or phone…"
          style={{ ...inputSx, maxWidth: 400, background: T.white }}
          onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
      </div>

      {loading ? <LoadingPage label="Loading customers…" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((c, idx) => {
            const isOpen = expanded === idx;
            return (
              <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                style={{ background: T.white, borderRadius: 14, border: `1px solid ${isOpen ? T.orange : T.border}`, boxShadow: isOpen ? `0 4px 20px rgba(232,114,12,0.10)` : T.shadow, overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                {/* Top accent */}
                <div style={{ height: 2, background: T.orange, opacity: isOpen ? 1 : 0.3, transition: "opacity 0.2s" }} />
                {/* Header row */}
                <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : idx)}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `rgba(232,114,12,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", color: T.orange, fontWeight: 800, fontSize: "1rem", flexShrink: 0 }}>
                    {(c.name || "?")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.92rem", color: T.text, fontWeight: 600 }}>{c.name || "—"}</div>
                    <div style={{ fontSize: "0.75rem", color: T.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    {c.phone && <span style={{ fontSize: "0.8rem", color: T.textMid }}>{c.phone}</span>}
                    {c.totalOrders > 0 && <Badge color="orange">{c.totalOrders} orders</Badge>}
                    <span style={{ color: T.textLight, fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 1.25rem 1.25rem", borderTop: `1px solid ${T.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                          {[
                            ["Age", c.age || "—"],
                            ["Phone", c.phone || "—"],
                            ["Total Orders", c.totalOrders || 0],
                            ["Total Spent", c.totalSpent ? `₹${c.totalSpent.toLocaleString("en-IN")}` : "₹0"],
                            ["Joined", new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
                            ["Type", c.googleId ? "Google" : "Email"],
                          ].map(([label, val]) => (
                            <div key={label}>
                              <div style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>{label}</div>
                              <div style={{ color: T.text, fontSize: "0.88rem", fontWeight: 500 }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        {c.address && Object.keys(c.address).length > 0 && (
                          <div style={{ marginTop: "1rem", padding: "0.75rem", background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
                            <div style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Saved Address</div>
                            <div style={{ color: T.textMid, fontSize: "0.85rem", lineHeight: 1.7 }}>{formatAddr(c.address)}</div>
                          </div>
                        )}
                        {c.recentOrders && c.recentOrders.length > 0 && (
                          <div style={{ marginTop: "1rem" }}>
                            <div style={{ color: T.textLight, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Recent Orders</div>
                            {c.recentOrders.slice(0, 3).map(o => (
                              <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${T.border}` }}>
                                <span style={{ color: T.orange, fontWeight: 700, fontSize: "0.82rem" }}>{o.orderNumber || `#${o._id.slice(-6)}`}</span>
                                <span style={{ color: T.textMid, fontSize: "0.82rem" }}>₹{(o.totalAmount || 0).toLocaleString("en-IN")}</span>
                                <Badge color={orderStatusColor[o.orderStatus] || "gray"}>{o.orderStatus}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          {filtered.length === 0 && <EmptyState icon="👥" title="No customers found" sub={search ? "Try a different search" : "Customers will appear here after first orders"} />}
        </div>
      )}

      {confirmDeleteAll && (
        <Modal title="Delete All Customers" onClose={() => !deletingAll && setConfirmDeleteAll(false)} width={420}>
          <p style={{ color: T.textMid, marginBottom: "1.5rem", lineHeight: 1.6 }}>
            This will permanently delete <strong style={{ color: "#dc2626" }}>{customers.length} customers</strong> and all their data. This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={() => setConfirmDeleteAll(false)} disabled={deletingAll} style={btnGhost}>Cancel</button>
            <button onClick={handleDeleteAll} disabled={deletingAll}
              style={{ ...btnPrimary, background: "#dc2626", opacity: deletingAll ? 0.75 : 1, display: "flex", alignItems: "center", gap: 8 }}>
              {deletingAll ? <><Spinner size={16} /> Deleting…</> : "Delete All"}
            </button>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

// ─── USERS ────────────────────────────────────────────────────
function Users({ token, showToast }) {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [confirm, setConfirm]   = useState(null);
  const [saving, setSaving]     = useState(false);

  const blank = { name: "", email: "", password: "", phone: "", role: "user" };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/admin/users", token);
      setUsers(r.data.users || []);
    } catch (err) {
      console.error("Users API Error:", err.response?.status, err.response?.data || err.message);
      const status = err.response?.status;
      if (status === 404) {
        showToast("Error: Users endpoint not found. Please redeploy backend.", "error");
      } else if (status === 401) {
        showToast("Session expired. Please login again.", "error");
      } else if (status === 403) {
        showToast("Admin access required.", "error");
      } else {
        showToast(err.response?.data?.message || "Failed to load users", "error");
      }
    }
    setLoading(false);
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(blank); setShowModal(true); };
  const openEdit = u => { setEditing(u); setForm({ name: u.name || "", email: u.email || "", password: "", phone: u.phone || "", role: u.role || "user" }); setShowModal(true); };

  const handleSubmit = async () => {
    if (!form.name || !form.email) { showToast("Name and email are required", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (editing) { await api.put(`/admin/users/${editing._id}`, payload, token); showToast("User updated!", "success"); }
      else          { await api.post("/admin/users", payload, token);               showToast("User created!", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error saving user", "error"); }
    setSaving(false);
  };

  const handleDelete = async id => {
    try { await api.delete(`/admin/users/${id}`, token); showToast("User deleted.", "success"); setConfirm(null); load(); }
    catch { showToast("Failed to delete user", "error"); }
  };

  const toggleActive = async u => {
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive }, token);
      showToast(`User ${!u.isActive ? "activated" : "deactivated"}.`, "success"); load();
    } catch { showToast("Failed to update user", "error"); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="ws-page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Users</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{users.length} registered users</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add User</button>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
          style={{ ...inputSx, maxWidth: 340, background: T.white }}
          onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
      </div>

      {loading ? <LoadingPage /> : (
        <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden" }}>
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                  {["User", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textLight, fontSize: "0.72rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `rgba(232,114,12,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", color: T.orange, fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                          {(u.name || "?")[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.88rem", color: T.text, fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><span style={{ color: T.textMid, fontSize: "0.85rem" }}>{u.email}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ color: T.textMid, fontSize: "0.85rem" }}>{u.phone || "—"}</span></td>
                    <td style={{ padding: "12px 16px" }}><Badge color={u.role === "admin" ? "orange" : "gray"}>{u.role}</Badge></td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => toggleActive(u)} style={{ background: u.isActive ? "rgba(22,163,74,0.10)" : "rgba(107,114,128,0.10)", border: `1px solid ${u.isActive ? "rgba(22,163,74,0.3)" : "rgba(107,114,128,0.3)"}`, color: u.isActive ? "#15803d" : "#6b7280", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700 }}>
                        {u.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ color: T.textLight, fontSize: "0.78rem" }}>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openEdit(u)} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", color: "#1d4ed8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Edit</button>
                        <button onClick={() => setConfirm(u._id)} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <EmptyState icon="👤" title="No users found" />}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit User" : "Add New User"} onClose={() => setShowModal(false)} width={560}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[["Full Name *", "name", "text"], ["Email *", "email", "email"], ["Phone", "phone", "tel"], ["Password", "password", "password"]].map(([label, key, type]) => (
              <div key={key}>
                <label style={labelSx}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputSx}
                  placeholder={key === "password" && editing ? "Leave blank to keep current" : ""}
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
            ))}
            <div>
              <label style={labelSx}>Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputSx}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.75 : 1 }}>
              {saving ? "Saving…" : editing ? "Update User" : "Create User"}
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal title="Delete User" message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </motion.div>
  );
}

// ─── COUPONS ──────────────────────────────────────────────────
function Coupons({ token, showToast }) {
  const [coupons, setCoupons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const blank = { code: "", discountType: "flat", discountValue: "", minOrderValue: "", maxDiscount: "", usageLimit: "", description: "", expiresAt: "", isActive: true };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    try { const r = await api.get("/admin/coupons", token); setCoupons(r.data.coupons || []); }
    catch { showToast("Failed to load coupons", "error"); }
    setLoading(false);
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(blank); setShowModal(true); };
  const openEdit = c => {
    setEditing(c);
    setForm({ code: c.code || "", discountType: c.discountType || "flat", discountValue: c.discountValue || "", minOrderValue: c.minOrderValue || "", maxDiscount: c.maxDiscount || "", usageLimit: c.usageLimit || "", description: c.description || "", expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "", isActive: c.isActive !== false });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue) { showToast("Code and discount value are required", "error"); return; }
    setSaving(true);
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      if (!payload.maxDiscount) delete payload.maxDiscount;
      if (!payload.usageLimit) delete payload.usageLimit;
      if (!payload.expiresAt) delete payload.expiresAt;
      if (editing) { await api.put(`/admin/coupons/${editing._id}`, payload, token); showToast("Coupon updated!", "success"); }
      else          { await api.post("/admin/coupons", payload, token);               showToast("Coupon created!", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error saving coupon", "error"); }
    setSaving(false);
  };

  const handleDelete = async id => {
    try { await api.delete(`/admin/coupons/${id}`, token); showToast("Coupon deleted.", "success"); setConfirm(null); load(); }
    catch { showToast("Failed to delete coupon", "error"); }
  };

  const toggleActive = async c => {
    try { await api.put(`/admin/coupons/${c._id}`, { isActive: !c.isActive }, token); showToast(`Coupon ${!c.isActive ? "activated" : "deactivated"}.`, "success"); load(); }
    catch { showToast("Failed to update coupon", "error"); }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="ws-page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Coupons</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{coupons.length} coupons</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Create Coupon</button>
      </div>

      {loading ? <LoadingPage /> : (
        <div className="ws-coupon-grid">
          {coupons.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: T.white, borderRadius: 16, border: `1px solid ${c.isActive ? T.border : "rgba(107,114,128,0.2)"}`, boxShadow: T.shadow, overflow: "hidden", opacity: c.isActive ? 1 : 0.65 }}>
              {/* Top stripe */}
              <div style={{ height: 4, background: c.isActive ? `linear-gradient(90deg, ${T.orange}, ${T.orangeL})` : "#d1d5db" }} />
              <div style={{ padding: "1.25rem" }}>
                {/* Code */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 800, color: T.text, letterSpacing: "0.05em" }}>{c.code}</div>
                  <Badge color={c.isActive ? "green" : "gray"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                {/* Discount */}
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: T.orange, marginBottom: "0.5rem" }}>
                  {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </div>
                {c.description && <p style={{ color: T.textMid, fontSize: "0.82rem", marginBottom: "0.75rem", lineHeight: 1.5 }}>{c.description}</p>}
                {/* Meta */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: "1rem" }}>
                  {c.minOrderValue > 0 && <div style={{ fontSize: "0.75rem", color: T.textLight }}>Min order: <strong style={{ color: T.textMid }}>₹{c.minOrderValue}</strong></div>}
                  {c.maxDiscount && <div style={{ fontSize: "0.75rem", color: T.textLight }}>Max discount: <strong style={{ color: T.textMid }}>₹{c.maxDiscount}</strong></div>}
                  {c.usageLimit && <div style={{ fontSize: "0.75rem", color: T.textLight }}>Usage: <strong style={{ color: T.textMid }}>{c.usedCount}/{c.usageLimit}</strong></div>}
                  {c.expiresAt && <div style={{ fontSize: "0.75rem", color: T.textLight }}>Expires: <strong style={{ color: T.textMid }}>{new Date(c.expiresAt).toLocaleDateString("en-IN")}</strong></div>}
                </div>
                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleActive(c)} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, color: T.textMid, borderRadius: 8, padding: "7px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(c)} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", color: "#1d4ed8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Edit</button>
                  <button onClick={() => setConfirm(c._id)} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>Del</button>
                </div>
              </div>
            </motion.div>
          ))}
          {coupons.length === 0 && (
            <div style={{ gridColumn: "1/-1" }}>
              <EmptyState icon="◇" title="No coupons yet" sub="Create your first discount coupon"
                action={<button onClick={openAdd} style={{ ...btnPrimary, margin: "0 auto" }}>+ Create Coupon</button>} />
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Coupon" : "Create Coupon"} onClose={() => setShowModal(false)} width={580}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="ws-modal-grid">
              <div>
                <label style={labelSx}>Coupon Code *</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} style={inputSx} placeholder="SAVE20"
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
              <div>
                <label style={labelSx}>Discount Type</label>
                <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} style={inputSx}>
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label style={labelSx}>Discount Value *</label>
                <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} style={inputSx} placeholder={form.discountType === "percentage" ? "20" : "200"}
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
              <div>
                <label style={labelSx}>Min Order Value (₹)</label>
                <input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} style={inputSx} placeholder="500"
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
              {form.discountType === "percentage" && (
                <div>
                  <label style={labelSx}>Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })} style={inputSx} placeholder="500"
                    onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
                </div>
              )}
              <div>
                <label style={labelSx}>Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} style={inputSx} placeholder="Unlimited"
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
              <div>
                <label style={labelSx}>Expires At</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} style={inputSx}
                  onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
              </div>
            </div>
            <div>
              <label style={labelSx}>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputSx} placeholder="e.g. 20% off on all crystals"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: T.textMid }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: T.orange, width: 16, height: 16 }} />
              Active (visible to customers)
            </label>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.75 : 1 }}>
              {saving ? "Saving…" : editing ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal title="Delete Coupon" message="Are you sure you want to delete this coupon?"
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </motion.div>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────
function Categories({ token, showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [imageFile, setImageFile]   = useState(null);

  const blank = { name: "", description: "", sortOrder: 0, isActive: true };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    try { const r = await api.get("/categories", token); setCategories(r.data.categories || []); }
    catch { showToast("Failed to load categories", "error"); }
    setLoading(false);
  }, [token, showToast]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setEditing(null); setForm(blank); setImageFile(null); setShowModal(true); };
  const openEdit = c => {
    setEditing(c);
    setForm({ name: c.name || "", description: c.description || "", sortOrder: c.sortOrder || 0, isActive: c.isActive !== false });
    setImageFile(null); setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name) { showToast("Category name is required", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      if (editing) { await api.putForm(`/admin/categories/${editing._id}`, fd, token); showToast("Category updated!", "success"); }
      else          { await api.postForm("/admin/categories", fd, token);               showToast("Category created!", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error saving category", "error"); }
    setSaving(false);
  };

  const handleDelete = async id => {
    try { await api.delete(`/admin/categories/${id}`, token); showToast("Category deleted.", "success"); setConfirm(null); load(); }
    catch { showToast("Failed to delete category", "error"); }
  };

  const toggleActive = async c => {
    try { await api.put(`/admin/categories/${c._id}`, { isActive: !c.isActive }, token); showToast(`Category ${!c.isActive ? "activated" : "deactivated"}.`, "success"); load(); }
    catch { showToast("Failed to update category", "error"); }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="ws-page-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: T.text }}>Categories</h1>
          <p style={{ color: T.textLight, fontSize: "0.85rem", marginTop: 4 }}>{categories.length} categories</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add Category</button>
      </div>

      {loading ? <LoadingPage /> : (
        <div className="ws-cat-grid">
          {categories.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden", opacity: c.isActive ? 1 : 0.6 }}>
              {/* Image */}
              <div style={{ height: 120, background: T.bg, position: "relative", overflow: "hidden" }}>
                {c.image ? (
                  <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: T.textLight }}>▣</div>
                )}
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <Badge color={c.isActive ? "green" : "gray"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: T.text, marginBottom: 4 }}>{c.name}</div>
                {c.description && <p style={{ color: T.textLight, fontSize: "0.78rem", marginBottom: 8, lineHeight: 1.5 }}>{c.description}</p>}
                <div style={{ fontSize: "0.72rem", color: T.textLight, marginBottom: "0.75rem" }}>Sort order: {c.sortOrder}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleActive(c)} style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, color: T.textMid, borderRadius: 8, padding: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(c)} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", color: "#1d4ed8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Edit</button>
                  <button onClick={() => setConfirm(c._id)} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Del</button>
                </div>
              </div>
            </motion.div>
          ))}
          {categories.length === 0 && (
            <div style={{ gridColumn: "1/-1" }}>
              <EmptyState icon="▣" title="No categories yet" sub="Add your first product category"
                action={<button onClick={openAdd} style={{ ...btnPrimary, margin: "0 auto" }}>+ Add Category</button>} />
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Category" : "Add Category"} onClose={() => setShowModal(false)} width={520}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelSx}>Category Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSx} placeholder="e.g. Manifestation Crystals"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputSx, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} style={inputSx} placeholder="0"
                onFocus={e => e.target.style.borderColor = T.orange} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <div>
              <label style={labelSx}>Category Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ ...inputSx, padding: "8px 14px" }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: T.textMid }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: T.orange, width: 16, height: 16 }} />
              Active
            </label>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.75 : 1 }}>
              {saving ? "Saving…" : editing ? "Update Category" : "Add Category"}
            </button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmModal title="Delete Category" message="Are you sure you want to delete this category? Products in this category may be affected."
          onConfirm={() => handleDelete(confirm)} onCancel={() => setConfirm(null)} />
      )}
    </motion.div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function WishstoneAdmin() {
  const [token, setToken]       = useState(() => localStorage.getItem("ws_admin_token") || "");
  const [admin, setAdmin]       = useState(() => { try { return JSON.parse(localStorage.getItem("ws_admin_user") || "null"); } catch { return null; } });
  const [page, setPage]         = useState("dashboard");
  const [toasts, setToasts]     = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Inject global CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ws-admin-global";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { const s = document.getElementById("ws-admin-global"); if (s) s.remove(); };
  }, []);

  const handleLogin = (tok, adminData) => {
    localStorage.setItem("ws_admin_token", tok);
    localStorage.setItem("ws_admin_user", JSON.stringify(adminData));
    setToken(tok); setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem("ws_admin_token");
    localStorage.removeItem("ws_admin_user");
    setToken(""); setAdmin(null);
  };

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  if (!token) return <LoginPage onLogin={handleLogin} />;

  const PAGES = { dashboard: Dashboard, products: Products, orders: Orders, customers: Customers, users: Users, coupons: Coupons, categories: Categories };
  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      {/* Mobile top bar */}
      <div className="ws-mobile-bar">
        <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: T.text, display: "flex", alignItems: "center" }}>☰</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: T.text }}>Wishstone Admin</div>
      </div>

      <Sidebar active={page} onNav={setPage} admin={admin} onLogout={handleLogout} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <main className="ws-main">
        <AnimatePresence mode="wait">
          <PageComponent key={page} token={token} showToast={showToast} />
        </AnimatePresence>
      </main>

      {/* Toasts */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
