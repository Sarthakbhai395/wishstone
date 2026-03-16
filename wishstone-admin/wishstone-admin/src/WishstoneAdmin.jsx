import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

// ─── THEME / GLOBALS ──────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:#0a0b0d;font-family:'Space Grotesk',sans-serif;color:#e2e8f0;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:#0a0b0d;}
  ::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:2px;}
  input,textarea,select{font-family:'Space Grotesk',sans-serif;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3)}50%{box-shadow:0 0 40px rgba(124,58,237,0.6)}}
`;

// ─── API HELPER ───────────────────────────────────────────────
const api = {
  get: (url, token) => axios.get(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` } }),
  post: (url, data, token) => axios.post(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  put: (url, data, token) => axios.put(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  delete: (url, token) => axios.delete(`${API}${url}`, { headers: { Authorization: `Bearer ${token}` } }),
  postForm: (url, data, token) => axios.post(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }),
  putForm: (url, data, token) => axios.put(`${API}${url}`, data, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }),
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────
const Badge = ({ children, color = "purple" }) => {
  const colors = {
    purple: { bg: "rgba(124,58,237,0.15)", border: "#7c3aed", text: "#a78bfa" },
    green:  { bg: "rgba(16,185,129,0.15)", border: "#10b981", text: "#34d399" },
    red:    { bg: "rgba(239,68,68,0.15)",  border: "#ef4444", text: "#f87171" },
    yellow: { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#fbbf24" },
    blue:   { bg: "rgba(59,130,246,0.15)", border: "#3b82f6", text: "#60a5fa" },
    gray:   { bg: "rgba(100,116,139,0.15)",border: "#64748b", text: "#94a3b8" },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 6, padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.05em" }}>
      {children}
    </span>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const colors = { success: "#10b981", error: "#ef4444", info: "#3b82f6" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "#1e2028", border: `1px solid ${colors[type] || colors.info}`,
      borderRadius: 12, padding: "14px 20px", minWidth: 280,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
      animation: "fadeIn 0.3s ease",
    }}>
      <span style={{ fontSize: 20 }}>{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
      <span style={{ color: "#e2e8f0", fontSize: "0.88rem" }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", marginLeft: "auto", fontSize: 18 }}>×</button>
    </div>
  );
};

const Modal = ({ title, children, onClose, width = 600 }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
  }} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={{
      background: "#13151a", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, width: "100%", maxWidth: width,
      maxHeight: "90vh", overflow: "auto",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: "#fff" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      <div style={{ padding: "2rem" }}>{children}</div>
    </div>
  </div>
);

const Stat = ({ icon, label, value, sub, color = "#7c3aed" }) => (
  <div style={{
    background: "linear-gradient(145deg, #13151a, #1a1d24)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: "1.5rem",
    animation: "fadeIn 0.4s ease",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: color, opacity: 0.08 }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ color: "#64748b", fontSize: "0.78rem", letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{value}</p>
        {sub && <p style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 4 }}>{sub}</p>}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
        {icon}
      </div>
    </div>
  </div>
);

// ─── INPUT STYLES ─────────────────────────────────────────────
const inputSx = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
  color: "#e2e8f0", padding: "10px 14px",
  fontSize: "0.9rem", outline: "none",
  transition: "border-color 0.2s",
};
const labelSx = { display: "block", color: "#64748b", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" };
const btnPrimary = {
  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  border: "none", color: "#fff", padding: "10px 24px",
  borderRadius: 10, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.88rem", fontWeight: 600, transition: "opacity 0.2s",
};
const btnGhost = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#94a3b8", padding: "10px 20px", borderRadius: 10, cursor: "pointer",
  fontSize: "0.88rem", fontWeight: 500,
};

// ─── LOGIN PAGE ───────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@wishstone.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/auth/admin/login`, { email, password });
      onLogin(res.data.token, res.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0b0d",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, padding: "0 1.5rem", animation: "fadeIn 0.5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 1rem", boxShadow: "0 0 40px rgba(124,58,237,0.4)", animation: "glow 3s ease infinite" }}>
            💎
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>Wishstone</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>Admin Control Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", color: "#fff", marginBottom: "1.5rem" }}>Sign In</h2>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelSx}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" style={inputSx} placeholder="admin@wishstone.com"
              onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelSx}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" style={inputSx} placeholder="••••••••"
              onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, width: "100%", padding: "12px", fontSize: "0.95rem", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>

          <p style={{ color: "#334155", fontSize: "0.75rem", textAlign: "center", marginTop: "1.5rem" }}>
            Default: admin@wishstone.com / wishstone@123
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "products",  icon: "💎", label: "Products" },
  { id: "orders",    icon: "📦", label: "Orders" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "coupons",   icon: "🎫", label: "Coupons" },
  { id: "categories",icon: "📂", label: "Categories" },
];

function Sidebar({ active, onNav, admin, onLogout }) {
  return (
    <aside style={{
      width: 240, minHeight: "100vh",
      background: "#0d0f13",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, bottom: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7c3aed, #a78bfa)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💎</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Wishstone</div>
            <div style={{ fontSize: "0.65rem", color: "#7c3aed", letterSpacing: "0.1em" }}>ADMIN PANEL</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
        {NAV.map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 10, marginBottom: 2,
            background: active === item.id ? "rgba(124,58,237,0.15)" : "transparent",
            border: active === item.id ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
            color: active === item.id ? "#a78bfa" : "#64748b",
            cursor: "pointer", textAlign: "left", fontSize: "0.9rem", fontWeight: 500,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { if (active !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e2e8f0"; } }}
            onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Admin info */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            {admin?.name?.[0] || "A"}
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#e2e8f0", fontWeight: 500 }}>{admin?.name || "Admin"}</div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Super Admin</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ ...btnGhost, width: "100%", fontSize: "0.8rem", padding: "8px" }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics", token)
      .then(r => { setData(r.data.analytics); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading analytics...</div>;
  if (!data) return <div style={{ padding: "4rem", textAlign: "center", color: "#f87171" }}>Could not load analytics. Make sure backend is running.</div>;

  const statusColor = { pending: "yellow", confirmed: "blue", processing: "purple", shipped: "blue", delivered: "green", cancelled: "red" };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Dashboard</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>Welcome back! Here's what's happening with Wishstone.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <Stat icon="📦" label="Total Orders" value={data.totalOrders} color="#7c3aed" />
        <Stat icon="💰" label="Total Revenue" value={`₹${(data.totalRevenue || 0).toLocaleString()}`} color="#10b981" />
        <Stat icon="💎" label="Products" value={data.totalProducts} color="#3b82f6" />
        <Stat icon="👥" label="Customers" value={data.totalUsers} color="#ec4899" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent Orders */}
        <div style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "#fff", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: 8 }}>
            📦 Recent Orders
            <Badge color="yellow">{data.pendingOrders} pending</Badge>
          </h3>
          {(data.recentOrders || []).slice(0, 6).map((o) => (
            <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#e2e8f0", fontWeight: 500 }}>{o.orderNumber || o._id.slice(-6)}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{o.customer?.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", color: "#a78bfa" }}>₹{o.totalAmount?.toLocaleString()}</div>
                <Badge color={statusColor[o.orderStatus] || "gray"}>{o.orderStatus}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", color: "#fff", marginBottom: "1.2rem" }}>🏆 Top Products</h3>
          {(data.topProducts || []).map((p, i) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "#f59e0b22" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "#f59e0b" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: i === 0 ? "#fbbf24" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>{p.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{p.totalSold} sold · {p.totalClicks} clicks</div>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#a78bfa" }}>₹{p.price?.toLocaleString()}</div>
            </div>
          ))}
          {(!data.topProducts || data.topProducts.length === 0) && <p style={{ color: "#64748b", fontSize: "0.85rem" }}>No sales data yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS ─────────────────────────────────────────────────
function Products({ token, showToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  const blank = { name: "", category: "", shortDesc: "", price: "", originalPrice: "", stock: "", isBestSeller: false, isFeatured: false, benefits: "", tags: "" };
  const [form, setForm] = useState(blank);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([api.get("/admin/products", token), api.get("/categories", token)]);
      setProducts(p.data.products); setCategories(c.data.categories);
    } catch { showToast("Failed to load products", "error"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category?._id || "", shortDesc: p.shortDesc || "", price: p.price, originalPrice: p.originalPrice, stock: p.stock, isBestSeller: p.isBestSeller, isFeatured: p.isFeatured, benefits: (p.benefits || []).join(", "), tags: (p.tags || []).join(", ") });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "benefits" || k === "tags") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (editing) { await api.putForm(`/admin/product/update/${editing._id}`, fd, token); showToast("Product updated! ✅", "success"); }
      else { await api.postForm("/admin/product/add", fd, token); showToast("Product added! 💎", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error saving product", "error"); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/product/delete/${id}`, token);
      showToast("Product removed.", "success"); setConfirm(null); load();
    } catch { showToast("Failed to delete", "error"); }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Products</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Add Product</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search products..." style={{ ...inputSx, maxWidth: 340 }}
          onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <div style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>💎</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", color: "#e2e8f0", fontWeight: 500 }}>{p.name}</div>
                        {p.isBestSeller && <Badge color="yellow">Best Seller</Badge>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#64748b", fontSize: "0.85rem" }}>{p.category?.name || "—"}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.88rem", color: "#a78bfa", fontWeight: 600 }}>₹{p.price?.toLocaleString()}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", textDecoration: "line-through" }}>₹{p.originalPrice?.toLocaleString()}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><Badge color={p.stock > 10 ? "green" : p.stock > 0 ? "yellow" : "red"}>{p.stock} units</Badge></td>
                  <td style={{ padding: "12px 16px" }}><Badge color={p.isActive ? "green" : "gray"}>{p.isActive ? "Active" : "Inactive"}</Badge></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
                      <button onClick={() => setConfirm(p._id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>No products found.</p>}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Product" : "Add New Product"} onClose={() => setShowModal(false)} width={700}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[["Product Name", "name", "text"], ["Category", "category", "select"], ["Price (₹)", "price", "number"], ["Original Price (₹)", "originalPrice", "number"], ["Stock", "stock", "number"]].map(([label, key, type]) => (
              <div key={key} style={key === "name" ? { gridColumn: "1/-1" } : {}}>
                <label style={labelSx}>{label}</label>
                {type === "select" ? (
                  <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputSx}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                ) : (
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputSx}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                )}
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSx}>Short Description</label>
              <textarea value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} rows={3} style={{ ...inputSx, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSx}>Benefits (comma separated)</label>
              <input value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} placeholder="Reduces stress, Promotes sleep, Clears energy" style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={{ ...labelSx, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} />
                Best Seller
              </label>
            </div>
            <div>
              <label style={{ ...labelSx, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured
              </label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} style={btnPrimary}>{editing ? "Update Product" : "Add Product"}</button>
          </div>
        </Modal>
      )}

      {/* Confirm delete */}
      {confirm && (
        <Modal title="Confirm Delete" onClose={() => setConfirm(null)} width={400}>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Are you sure you want to delete this product? This action cannot be undone.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={() => setConfirm(null)} style={btnGhost}>Cancel</button>
            <button onClick={() => handleDelete(confirm)} style={{ ...btnPrimary, background: "linear-gradient(135deg, #ef4444, #f87171)" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────
function Orders({ token, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNo, setTrackingNo] = useState("");

  const load = async () => {
    try {
      const r = await api.get("/admin/orders", token);
      setOrders(r.data.orders);
    } catch { showToast("Failed to load orders", "error"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async () => {
    try {
      await api.put(`/admin/orders/${selected._id}/status`, { status: newStatus, trackingNumber: trackingNo }, token);
      showToast("Order status updated! ✅", "success");
      setSelected(null); load();
    } catch { showToast("Failed to update", "error"); }
  };

  const STATUS_COLORS = { pending: "yellow", confirmed: "blue", processing: "purple", shipped: "blue", delivered: "green", cancelled: "red" };
  const PAYMENT_COLORS = { pending: "yellow", paid: "green", failed: "red", refunded: "gray" };
  const statuses = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Orders</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem", fontWeight: 500, textTransform: "capitalize",
            background: filter === s ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
            border: filter === s ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
            color: filter === s ? "#a78bfa" : "#64748b",
          }}>{s}</button>
        ))}
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <div style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#a78bfa", fontWeight: 600, fontSize: "0.85rem" }}>{o.orderNumber || o._id.slice(-8)}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>{o.customer?.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{o.customer?.email}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{o.customer?.phone}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#64748b", fontSize: "0.85rem" }}>{o.items?.length} item(s)</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.88rem" }}>₹{o.totalAmount?.toLocaleString()}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div><Badge color={PAYMENT_COLORS[o.paymentStatus] || "gray"}>{o.paymentStatus}</Badge></div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 3, textTransform: "uppercase" }}>{o.paymentMethod}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><Badge color={STATUS_COLORS[o.orderStatus] || "gray"}>{o.orderStatus}</Badge></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#64748b", fontSize: "0.78rem" }}>{new Date(o.createdAt).toLocaleDateString()}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => { setSelected(o); setNewStatus(o.orderStatus); setTrackingNo(o.trackingNumber || ""); }} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: "0.8rem" }}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>No orders found.</p>}
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <Modal title={`Order ${selected.orderNumber || selected._id.slice(-8)}`} onClose={() => setSelected(null)} width={600}>
          {/* Customer */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ color: "#64748b", fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: 8 }}>CUSTOMER INFO</p>
            <p style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{selected.customer?.name} · {selected.customer?.phone}</p>
            <p style={{ color: "#64748b", fontSize: "0.82rem" }}>{selected.customer?.email}</p>
          </div>
          {/* Address */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ color: "#64748b", fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: 8 }}>DELIVERY ADDRESS</p>
            <p style={{ color: "#e2e8f0", fontSize: "0.85rem", lineHeight: 1.7 }}>
              {selected.shippingAddress?.flat}, {selected.shippingAddress?.area}<br />
              {selected.shippingAddress?.landmark && <>{selected.shippingAddress.landmark}<br /></>}
              {selected.shippingAddress?.city}, {selected.shippingAddress?.state} — {selected.shippingAddress?.country}
            </p>
          </div>
          {/* Items */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ color: "#64748b", fontSize: "0.72rem", letterSpacing: "0.1em", marginBottom: 8 }}>ORDER ITEMS</p>
            {selected.items?.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "#e2e8f0", fontSize: "0.85rem" }}>{item.name} × {item.quantity}</span>
                <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontWeight: 600 }}>
              <span style={{ color: "#e2e8f0" }}>Total</span>
              <span style={{ color: "#10b981" }}>₹{selected.totalAmount?.toLocaleString()}</span>
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
              onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={() => setSelected(null)} style={btnGhost}>Cancel</button>
            <button onClick={updateStatus} style={btnPrimary}>Update Order</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CUSTOMERS ────────────────────────────────────────────────
function Customers({ token, showToast }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/customers", token)
      .then(r => { setCustomers(r.data.customers); setLoading(false); })
      .catch(() => { showToast("Failed to load customers", "error"); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Customers</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>{customers.length} registered users</p>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search customers..." style={{ ...inputSx, maxWidth: 340, marginBottom: "1.5rem" }}
        onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <div style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Customer", "Phone", "Joined", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", color: "#e2e8f0" }}>{c.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#64748b", fontSize: "0.85rem" }}>{c.phone || "—"}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#64748b", fontSize: "0.85rem" }}>{new Date(c.createdAt).toLocaleDateString()}</span></td>
                  <td style={{ padding: "12px 16px" }}><Badge color={c.isActive ? "green" : "red"}>{c.isActive ? "Active" : "Blocked"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>No customers found.</p>}
        </div>
      )}
    </div>
  );
}

// ─── COUPONS ─────────────────────────────────────────────────
function Coupons({ token, showToast }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { code: "", discountType: "flat", discountValue: "", minOrderValue: "", usageLimit: "", expiresAt: "", description: "", isActive: true };
  const [form, setForm] = useState(blank);

  const load = async () => {
    try { const r = await api.get("/admin/coupons", token); setCoupons(r.data.coupons); }
    catch { showToast("Failed to load coupons", "error"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(blank); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, minOrderValue: c.minOrderValue || "", usageLimit: c.usageLimit || "", expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "", description: c.description || "", isActive: c.isActive });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) { await api.put(`/admin/coupon/update/${editing._id}`, form, token); showToast("Coupon updated!", "success"); }
      else { await api.post("/admin/coupon/create", form, token); showToast("Coupon created! 🎫", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try { await api.delete(`/admin/coupon/delete/${id}`, token); showToast("Coupon deleted.", "success"); load(); }
    catch { showToast("Failed to delete", "error"); }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Coupons</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>{coupons.length} active coupons</p>
        </div>
        <button onClick={openAdd} style={btnPrimary}>+ Create Coupon</button>
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {coupons.map((c) => (
            <div key={c._id} style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.isActive ? "linear-gradient(90deg, #7c3aed, #a78bfa)" : "#334155" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#a78bfa", letterSpacing: "0.1em" }}>{c.code}</div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 2 }}>{c.description || "No description"}</div>
                </div>
                <Badge color={c.isActive ? "green" : "gray"}>{c.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div style={{ background: "rgba(124,58,237,0.08)", borderRadius: 10, padding: "12px", marginBottom: "1rem" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
                  {c.discountType === "flat" ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                </div>
                {c.minOrderValue > 0 && <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 2 }}>Min order: ₹{c.minOrderValue}</div>}
              </div>
              <div style={{ display: "flex", gap: 8, fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
                <span>Used: {c.usedCount}/{c.usageLimit || "∞"}</span>
                {c.expiresAt && <span>· Expires: {new Date(c.expiresAt).toLocaleDateString()}</span>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(c)} style={{ flex: 1, ...btnGhost, fontSize: "0.8rem", padding: "8px" }}>Edit</button>
                <button onClick={() => handleDelete(c._id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: "0.8rem" }}>Delete</button>
              </div>
            </div>
          ))}
          {coupons.length === 0 && <p style={{ color: "#64748b" }}>No coupons yet. Create your first one!</p>}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Coupon" : "Create Coupon"} onClose={() => setShowModal(false)} width={500}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={labelSx}>Coupon Code</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. WOW300" style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelSx}>Discount Type</label>
                <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} style={inputSx}>
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div>
                <label style={labelSx}>Discount Value</label>
                <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === "flat" ? "300" : "10"} style={inputSx}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelSx}>Min Order (₹)</label>
                <input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })} placeholder="0" style={inputSx}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelSx}>Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" style={inputSx}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>
            <div>
              <label style={labelSx}>Expiry Date</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={labelSx}>Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. ₹300 off on orders above ₹500" style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <label style={{ ...labelSx, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
              Active (users can apply this coupon)
            </label>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} style={btnPrimary}>{editing ? "Update Coupon" : "Create Coupon"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────
function Categories({ token, showToast }) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { name: "", description: "", sortOrder: "" };
  const [form, setForm] = useState(blank);

  const load = async () => {
    try { const r = await api.get("/categories", token); setCats(r.data.categories); }
    catch { showToast("Failed to load", "error"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (editing) { await api.putForm(`/admin/category/update/${editing._id}`, fd, token); showToast("Category updated!", "success"); }
      else { await api.postForm("/admin/category/add", fd, token); showToast("Category created!", "success"); }
      setShowModal(false); load();
    } catch (e) { showToast(e.response?.data?.message || "Error", "error"); }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Categories</h1>
        <button onClick={() => { setEditing(null); setForm(blank); setShowModal(true); }} style={btnPrimary}>+ Add Category</button>
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {cats.map((c) => (
            <div key={c._id} style={{ background: "#13151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
              {c.image && <img src={c.image} alt={c.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
              {!c.image && <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #1e1040, #4c1d95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📂</div>}
              <div style={{ padding: "1.2rem" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", color: "#fff", fontSize: "1rem", marginBottom: 6 }}>{c.name}</h3>
                <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "1rem" }}>{c.description || "No description"}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, description: c.description || "", sortOrder: c.sortOrder || "" }); setShowModal(true); }} style={{ flex: 1, ...btnGhost, fontSize: "0.8rem", padding: "8px" }}>Edit</button>
                  <Badge color={c.isActive ? "green" : "gray"}>{c.isActive ? "Active" : "Hidden"}</Badge>
                </div>
              </div>
            </div>
          ))}
          {cats.length === 0 && <p style={{ color: "#64748b" }}>No categories yet.</p>}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Category" : "Add Category"} onClose={() => setShowModal(false)} width={460}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={labelSx}>Category Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={labelSx}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputSx, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={labelSx}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} placeholder="1, 2, 3..." style={inputSx}
                onFocus={e => e.target.style.borderColor = "#7c3aed"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: "1.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => setShowModal(false)} style={btnGhost}>Cancel</button>
            <button onClick={handleSubmit} style={btnPrimary}>{editing ? "Update" : "Create"} Category</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("ws_admin_token") || "");
  const [admin, setAdmin] = useState(() => { try { return JSON.parse(localStorage.getItem("ws_admin_info") || "null"); } catch { return null; } });
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const handleLogin = (t, a) => {
    setToken(t); setAdmin(a);
    localStorage.setItem("ws_admin_token", t);
    localStorage.setItem("ws_admin_info", JSON.stringify(a));
  };

  const handleLogout = () => {
    setToken(""); setAdmin(null);
    localStorage.removeItem("ws_admin_token");
    localStorage.removeItem("ws_admin_info");
  };

  const showToast = (message, type = "info") => setToast({ message, type });

  if (!token) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={handleLogin} />
    </>
  );

  const pages = { dashboard: Dashboard, products: Products, orders: Orders, customers: Customers, coupons: Coupons, categories: Categories };
  const PageComponent = pages[page] || Dashboard;

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#0a0b0d" }}>
        <Sidebar active={page} onNav={setPage} admin={admin} onLogout={handleLogout} />
        <main style={{ flex: 1, marginLeft: 240, padding: "2rem 2.5rem", maxWidth: "calc(100vw - 240px)" }}>
          <PageComponent token={token} showToast={showToast} />
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
