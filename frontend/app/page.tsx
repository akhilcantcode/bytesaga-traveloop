'use client'

import { useState } from "react";
import Link from 'next/link';

const slides = [
  {
    title: "INDONESIA",
    cardTitle: "Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    description:
      "As the largest archipelagic country in the world, Indonesia is blessed with so many different people, cultures, customs, traditions, artworks, food, animals, plants, landscapes, and everything that made it almost like 100 (or even 200) countries melted beautifully into one.",
  },
  {
    title: "THAILAND",
    cardTitle: "Buddha temple, Thailand",
    img: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80",
    description:
      "Thailand is a Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins and ornate temples displaying figures of Buddha. In Bangkok, the capital, an ultramodern cityscape rises next to quiet riverside communities.",
  },
  {
    title: "BALI",
    cardTitle: "Broken Beach, Bali",
    img: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80",
    description:
      "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars.",
  },
  {
    title: "KERALA",
    cardTitle: "Kerala",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80",
    description:
      "Kerala, a state on India's tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline. It's known for its palm-lined beaches and backwaters, a network of canals. Inland are the Western Ghats, mountains whose slopes support tea, coffee and spice plantations.",
  },
];

// Inline SVG icons (no lucide dependency needed)
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const Bookmark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const styles = {
  heroBlue: "oklch(0.55 0.18 255)",
  heroBlueFg: "oklch(0.98 0 0)",
  darkOverlay: "oklch(0.18 0.05 240 / 0.55)",
};

export default function TraveloopApp() {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = slides[index];
  const next = (n: number) => setIndex((i) => (i + n + total) % total);
  const cards = [1, 2, 3].map((o) => slides[(index + o) % total]);

  return (
    <div style={{ minHeight: "100vh", width: "100%", fontFamily: "system-ui, sans-serif", color: "white" }}>
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          overflow: "hidden",
          backgroundImage: `linear-gradient(180deg, ${styles.darkOverlay}, ${styles.darkOverlay}), url(${current.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.7s ease",
        }}
      >
        {/* Top nav */}
        <header style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 40px", zIndex: 20 }}>
          <span style={{ fontSize: "20px", fontWeight: 700 }}>Traveloop</span>
          <Link href="/login">
            <button
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, background: styles.heroBlue, color: styles.heroBlueFg, border: "none", cursor: "pointer" }}
            >
              Start Exploring <ArrowRight />
            </button>
          </Link>
        </header>

        {/* Left vertical pagination */}
        <div style={{ position: "absolute", left: "40px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", zIndex: 10 }}>
          {slides.map((s, i) => (
            <div key={s.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              {i === index ? (
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
              )}
              {i < slides.length - 1 && <span style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.3)" }} />}
            </div>
          ))}
        </div>

        {/* Background watermark */}
        <span style={{ position: "absolute", bottom: "64px", left: "40px", fontSize: "80px", fontWeight: 900, color: "rgba(255,255,255,0.1)", userSelect: "none", pointerEvents: "none" }}>
          {current.title.charAt(0) + current.title.slice(1).toLowerCase()}
        </span>

        {/* Left content */}
        <div style={{ position: "absolute", left: "96px", top: "50%", transform: "translateY(-50%)", maxWidth: "400px", zIndex: 10 }}>
          <h1 style={{ fontSize: "clamp(56px, 8vw, 96px)", fontWeight: 900, letterSpacing: "-2px", margin: 0, lineHeight: 1 }}>{current.title}</h1>
          <p style={{ marginTop: "20px", fontSize: "12px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: "340px" }}>
            {current.description}
          </p>
          <Link href="/login">
            <button
              style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", gap: "12px", padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, background: styles.heroBlue, color: styles.heroBlueFg, border: "none", cursor: "pointer" }}
            >
              Explore <ArrowRight />
            </button>
          </Link>
        </div>

        {/* Right cards */}
        <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "20px", zIndex: 10 }}>
          {cards.map((c) => (
            <article key={c.title} style={{ flexShrink: 0, width: "180px" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>{c.cardTitle}</div>
              <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", background: i === 0 ? "white" : "rgba(255,255,255,0.4)" }} />
                ))}
              </div>
              <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "3/4", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                <button style={{ position: "absolute", top: "12px", right: "12px", width: "32px", height: "32px", borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(0.18 0.05 240)" }}>
                  <Bookmark />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom carousel arrows */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "12px", zIndex: 10 }}>
          <button onClick={() => next(-1)} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <ChevronLeft />
          </button>
          <button onClick={() => next(1)} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <ChevronRight />
          </button>
        </div>

        {/* Bottom right pagination */}
        <div style={{ position: "absolute", bottom: "40px", right: "40px", display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", zIndex: 10 }}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ width: "48px", height: "1px", background: "rgba(255,255,255,0.6)" }} />
          <span style={{ opacity: 0.6 }}>{String(total).padStart(2, "0")}</span>
        </div>
      </section>
    </div>
  );
}
