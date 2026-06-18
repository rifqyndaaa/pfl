import { useState } from "react";
import { Outlet } from "react-router-dom";

// Multiple high-quality Pexels boutique/fashion video sources (fallback chain)
const VIDEO_SOURCES = [
  "https://videos.pexels.com/video-files/8386982/8386982-uhd_2732_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/8387356/8387356-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/7680448/7680448-hd_1920_1080_25fps.mp4",
];

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: "Build Customer Loyalty",
    sub: "CRM & retention tools built for boutique relationships",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    label: "Manage Inventory Effortlessly",
    sub: "Real-time stock across all collections & channels",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    label: "Grow Boutique Revenue",
    sub: "Analytics that reveal your most profitable opportunities",
  },
];

export default function AuthLayout() {
  const [videoError, setVideoError] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const handleVideoError = () => {
    if (videoIndex < VIDEO_SOURCES.length - 1) {
      setVideoIndex((i) => i + 1);
    } else {
      setVideoError(true);
    }
  };

  return (
    <>
      {/* Google Fonts — Playfair Display + Inter */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes buiqFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .buiq-fadein      { animation: buiqFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .buiq-fadein-d1   { animation-delay: 0.10s; }
        .buiq-fadein-d2   { animation-delay: 0.22s; }
        .buiq-fadein-d3   { animation-delay: 0.34s; }
        .buiq-fadein-d4   { animation-delay: 0.46s; }
        .buiq-fadein-d5   { animation-delay: 0.58s; }

        @media (prefers-reduced-motion: reduce) {
          .buiq-fadein { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "'Inter', system-ui, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          color: "#0A0A0A",
          backgroundColor: "#FAF9F7",
        }}
      >
        {/* ─────────────────────────────────────────────── */}
        {/* LEFT PANEL — Brand / Visual Showcase            */}
        {/* ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "none",
            flex: 1,
            position: "relative",
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 52px",
            backgroundColor: "#0C0B09",
            color: "#FFFFFF",
          }}
          className="lg-flex"
        >
          {/* ── Video background ── */}
          {!videoError ? (
            <video
              key={videoIndex}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.62,
              }}
              src={VIDEO_SOURCES[videoIndex]}
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, #1a1610 0%, #0C0B09 50%, #10140f 100%)",
              }}
            />
          )}

          {/* ── Cinematic vignette overlay — soft, not heavy ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(12,11,9,0.55) 0%, rgba(12,11,9,0.18) 38%, rgba(12,11,9,0.18) 62%, rgba(12,11,9,0.65) 100%)",
              zIndex: 1,
            }}
          />

          {/* ── Subtle left-edge darkening for text legibility ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(12,11,9,0.38) 0%, transparent 55%)",
              zIndex: 1,
            }}
          />

          {/* ── Brand header ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            className="buiq-fadein buiq-fadein-d1"
          >
            {/* Wordmark monogram */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "0.02em",
                color: "#FFFFFF",
                backgroundColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(4px)",
                flexShrink: 0,
              }}
            >
              B
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.90)",
                }}
              >
                BUIQ
              </span>
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  marginLeft: "6px",
                }}
              >
                Platform
              </span>
            </div>
          </div>

          {/* ── Central copy ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginTop: "auto",
              marginBottom: "auto",
              maxWidth: "420px",
            }}
          >
            {/* Eyebrow */}
            <p
              className="buiq-fadein buiq-fadein-d2"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "20px",
                marginTop: 0,
              }}
            >
              Fashion Retail Intelligence
            </p>

            {/* Headline — Playfair Display */}
            <h1
              className="buiq-fadein buiq-fadein-d3"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 500,
                fontSize: "clamp(36px, 3.6vw, 52px)",
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
                marginTop: 0,
                marginBottom: "28px",
              }}
            >
              The Operating System for Modern&nbsp;
              <em style={{ fontStyle: "italic", fontWeight: 400 }}>
                Fashion Retail.
              </em>
            </h1>

            {/* Supporting line */}
            <p
              className="buiq-fadein buiq-fadein-d3"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "14px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.52)",
                marginTop: 0,
                marginBottom: "44px",
                maxWidth: "360px",
              }}
            >
              Manage your boutique's inventory, customers, and revenue from one beautifully designed platform.
            </p>

            {/* Feature list */}
            <div
              className="buiq-fadein buiq-fadein-d4"
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}
                >
                  {/* Icon container */}
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "rgba(255,255,255,0.75)",
                      marginTop: "1px",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.92)",
                        margin: "0 0 2px",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {f.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.40)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="buiq-fadein buiq-fadein-d5"
          >
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "11px",
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              © 2026 BUIQ. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy", "Terms"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.22)",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────── */}
        {/* RIGHT PANEL — Authentication Forms              */}
        {/* ─────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "48px 32px",
            backgroundColor: "#FAFAF9",
            borderLeft: "1px solid rgba(0,0,0,0.06)",
            overflowY: "auto",
          }}
          className="auth-right-panel"
        >
          {/* ── Mobile brand mark ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
              width: "100%",
              maxWidth: "380px",
            }}
            className="mobile-brand buiq-fadein buiq-fadein-d1"
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                border: "1px solid rgba(0,0,0,0.10)",
                backgroundColor: "#0A0A0A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#FFFFFF",
                flexShrink: 0,
              }}
            >
              B
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#0A0A0A",
                }}
              >
                BUIQ
              </span>
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "11px",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.35)",
                }}
              >
                Platform
              </span>
            </div>
          </div>

          {/* ── Outlet (Login / Register / etc.) ── */}
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
            }}
            className="buiq-fadein buiq-fadein-d2"
          >
            <Outlet />
          </div>

          {/* ── Right panel footer ── */}
          <p
            style={{
              marginTop: "48px",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: "rgba(0,0,0,0.25)",
              textAlign: "center",
              width: "100%",
              maxWidth: "380px",
            }}
            className="buiq-fadein buiq-fadein-d3"
          >
            Secure & encrypted. © 2026 BUIQ.
          </p>
        </div>
      </div>

      {/* ── Responsive helpers (plain CSS, no Tailwind dependency) ── */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-flex {
            display: flex !important;
          }
          .auth-right-panel {
            width: 480px !important;
            max-width: 480px !important;
            flex-shrink: 0 !important;
          }
          .mobile-brand {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}