import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const T = {
    bg: "#ffffff", bgDark: "#5A6651",
    text: "#000000", textMid: "#000000",
    orange: "#5A6651", orangeD: "#5A6651",
    white: "#ffffff", border: "rgba(90, 102, 81, 0.2)",
};

export default function FrequencyActivationPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Cosmic Eye: Clear Obstacles & Manifest Your Goals | WishStone";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Discover Cosmic Eye crystal energy to clear obstacles and activate abundance in your life. Combine with WishStone for powerful manifestation results. Start today.");
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
                        Cosmic Eye: Clearing the Path
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
                        Remove obstacles and activate your journey toward abundance
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
                        When Everything Feels Blocked
                    </h2>
                    <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            There are moments when everything feels blocked. Even when you try your best. Not all obstacles are visible. Some come from your thoughts, like confusion or doubt. While others come from situations around you.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
                            Keeping this problem in mind, we have come up with Cosmic Eye, a solution that helps in removing such obstacles from your life.
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
                        How Cosmic Eye Works
                    </h2>
                    <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            Cosmic Eye attracts cosmic energy and helps in removing obstacles and creating a path for your goals.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
                            With time, you may start noticing changes. Your thoughts feel lighter, and direction feels clearer. Things don't feel as complicated as before.
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
                        A Support System, Not a Shortcut
                    </h2>
                    <div style={{ background: "rgba(90, 102, 81, 0.08)", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
                            It does not force things to happen. It helps in removing what was quietly holding you back. It becomes a support system. That allows you to move forward with ease and clarity.
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
                        When Both Come Together
                    </h2>
                    <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            Using Wishstone and Cosmic Eye together. Creates an approach to manifestation. Wishstone helps you stay focused and consistent with your goal. While Cosmic Eye helps in clearing the path. By reducing obstacles.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8 }}>
                            One supports your internal mindset, and the other supports your environment. This combination makes it easier to stay aligned for a time. That is where real progress begins.
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
                        A Story You May Relate To
                    </h2>
                    <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, border: `1px solid ${T.border}` }}>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            Aarav always had goals and dreams. Something or the other would interrupt his journey. Sometimes it was life. Sometimes it was his thoughts. He would start with excitement and lose focus after a few days.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            Over the time, he began to feel that maybe things were just not meant for him. One day, he decided to try without overthinking. He started using Wishstone to stay focused and kept Cosmic Eye with him to feel clearer. Holding it daily while focusing on one goal.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, marginBottom: "1rem" }}>
                            In the beginning, nothing felt different. After a few weeks, he noticed a small change. He was less distracted, more consistent, and more focused than before. His goal no longer felt impossible. For the time, he didn't stop halfway.
                        </p>
                        <p style={{ fontSize: "1rem", color: T.textMid, lineHeight: 1.8, fontStyle: "italic", color: T.orange }}>
                            It was not magic. It was enough to change his direction.
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
                        A Thought to Take With You
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
                        Clear Your Path to Success
                    </h2>
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem", opacity: 0.9 }}>
                        Use Cosmic Eye to remove obstacles and activate the clarity you need to achieve your goals.
                    </p>
                    <button
                        onClick={() => navigate("/shop")}
                        style={{
                            background: "#ffffff",
                            border: "none",
                            color: "#000000",
                            padding: "14px 32px",
                            borderRadius: 8,
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.3s",
                            fontFamily: "'Open Sans', sans-serif",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)", e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)", e.currentTarget.style.boxShadow = "none")}
                    >
                        Explore Cosmic Eye →
                    </button>
                </section>
            </article>
        </div>
    );
}
