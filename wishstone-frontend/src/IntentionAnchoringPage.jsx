import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const T = {
  bg: "#F5F0E8", bgDark: "#2C3320",
  text: "#1a1a1a", textMid: "#4a4a4a",
  orange: "#E8720C", orangeD: "#C45E00",
  white: "#ffffff", border: "rgba(26,26,26,0.12)",
};

export default function IntentionAnchoringPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Manifestation Tools: Turning Dreams into Reality | WishStone";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Turn dreams into reality with Wishstone and Cosmic Eye. These manifestation tools boost focus and clear obstacles from your life. Stay aligned daily. Get started today.");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Back Button */}
      <div style={{ padding: "clamp(1rem, 4vw, 2rem) clamp(1.5rem, 5vw, 3.5rem)" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.orange,
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Inter', sans-serif",
            transition: "gap 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "12px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
        >
          ← Back to Home
        </button>
      </div>

      {/* Main Content */}
      <article style={{ maxWidth: 900, margin: "0 auto", padding: "2rem clamp(1.5rem, 5vw, 3.5rem) 6rem" }}>
        {/* Hero Section */}
        <header style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              color: T.text,
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Manifestation Tools: Turning Dreams into Reality
          </h1>
          <div style={{ height: 2, width: 60, background: T.orange, margin: "1.5rem auto" }} />
          <p
            style={{
              fontSize: "1.05rem",
              color: T.textMid,
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            Transform wishes into reality through focus, consistency, and the right support
          </p>
        </header>

        {/* Content Sections */}
        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            The Challenge of Manifestation
          </h2>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              Some wishes never really leave you. They stay quietly in your mind. They appear in moments, not always there. You tell yourself someday. That someday keeps moving. Life gets busy. Distractions take over. Slowly, that wish becomes something you think about but don't fully believe in anymore.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
              Manifestation starts at that point. Not as magic. As a shift. You stop wishing. You start staying connected to what you want to achieve.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            How Manifestation Works
          </h2>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              Manifestation helps in turning your thoughts and desires into reality. Also, you stay focused, consistent, and mentally aligned with your goal. Most of the people don't fail in their goals because their goals are too big. People fail because their focus breaks, and doubts and distractions take over.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
              Manifesting something, like your thoughts, emotions, and actions, requires moving in a direction. For a time, that was not easy, but the right support makes a difference.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            A Gentle Support for Your Journey
          </h2>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              Our products, Wishstone and cosmic eye, help in your manifestation journey in a practical way. They are not any kind of shortcuts or magical tools; they will help you stay aligned with your wish. When your mind starts roaming.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
              The cosmic eye works on clearing obstacles, and the wishstone helps you stay focused on your intention. Together, they create a balance between clarity and consistency. That is essential for turning a wish into reality.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            WishStone: Staying Connected to Your Intention
          </h2>
          <div style={{ background: "linear-gradient(135deg, #fff0e8, #fff)", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              Staying focused on one goal for a time is not easy. The mind shifts, and distractions come in. And slowly, your intention fades.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              But Wishstone helps you stay connected to what matters. It is a stone that has been specially charged for over 14 years. Across parts of the country. It has no connection to any religion. Making it completely neutral.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
              Since the subconscious mind is invisible. Difficult to control directly, but Wishstone acts as an anchor for your intention. When you hold it daily and focus on your wish for 45 days. It helps build consistency, improve focus, and align your thoughts with your goal.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
              Over the time, this repeated connection strengthens your mindset. Your thoughts become more stable, more focused, and clearer. And your intention no longer feels faraway.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: T.text,
              marginBottom: "1.5rem",
            }}
          >
            The Power of Consistency
          </h2>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
              Manifestation is not about results or overnight success. It is about clarity, focus, and consistency. These tools do not replace your effort. They help you stay aligned when your mind starts to lose focus.
            </p>
            <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginTop: "1rem" }}>
              Sometimes the real change happens when you stop losing connection with what you want. When that connection stays strong. Your path begins to feel clearer. Your goals start feeling possible again.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", marginTop: "4rem", padding: "3rem 2rem", background: T.bgDark, borderRadius: 16, color: T.white }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
            Ready to Amplify Your Manifestation?
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem", opacity: 0.9 }}>
            Explore WishStone and discover how the right tools can help you stay focused and aligned with your goals.
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{
              background: `linear-gradient(135deg, #C45E00, #E8720C)`,
              border: "none",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)", e.currentTarget.style.boxShadow = "0 8px 28px rgba(232,114,12,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "none")}
          >
            Shop WishStone →
          </button>
        </section>
      </article>
    </div>
  );
}
