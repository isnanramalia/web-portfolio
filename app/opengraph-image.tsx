import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Isna Nur Amalia — Quality Assurance & Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#f8f3ea",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Decorative background orbs ── */}

      {/* Large navy circle — top right */}
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -160,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "#0b1957",
          opacity: 0.06,
        }}
      />

      {/* Medium navy ring accent — top right inner */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "transparent",
          border: "2px solid #0b1957",
          opacity: 0.05,
        }}
      />

      {/* Blue orb — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: -110,
          left: -110,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#9eccfa",
          opacity: 0.22,
        }}
      />

      {/* Blue orb — mid right */}
      <div
        style={{
          position: "absolute",
          top: 210,
          right: 170,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "#9eccfa",
          opacity: 0.16,
        }}
      />

      {/* Tiny dot accents */}
      <div
        style={{
          position: "absolute",
          top: 88,
          right: 530,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#0b1957",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 118,
          right: 506,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#0b1957",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 148,
          right: 310,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#9eccfa",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 280,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#9eccfa",
          opacity: 0.4,
        }}
      />

      {/* Horizontal rule accent — left edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          width: 6,
          height: 120,
          background: "#0b1957",
          borderRadius: "0 4px 4px 0",
          marginTop: -60,
          opacity: 0.85,
        }}
      />

      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 44,
        }}
      >
        {/* Domain */}
        <span
          style={{
            color: "#0b1957",
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: 0.4,
            opacity: 0.42,
          }}
        >
          isnanramalia.vercel.app
        </span>

        {/* Logo block */}
        <div
          style={{
            width: 54,
            height: 54,
            background: "#0b1957",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f8f3ea",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          I
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Available badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 26,
            background: "rgba(34,197,94,0.10)",
            border: "1.5px solid rgba(34,197,94,0.32)",
            borderRadius: 50,
            padding: "7px 18px",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              color: "#15803d",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Open to QA & Frontend Roles
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#0b1957",
            letterSpacing: -2,
            lineHeight: 1.08,
            marginBottom: 18,
          }}
        >
          Isna Nur Amalia
        </div>

        {/* Dual role — QA first, no transition arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {/* QA — primary identity, highlighted */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(11,25,87,0.08)",
              border: "1.5px solid rgba(11,25,87,0.22)",
              borderRadius: 10,
              padding: "4px 16px",
            }}
          >
            <span
              style={{
                fontSize: 26,
                color: "#0b1957",
                fontWeight: 700,
              }}
            >
              Quality Assurance
            </span>
          </div>

          {/* Separator */}
          <span
            style={{
              fontSize: 22,
              color: "#0b1957",
              opacity: 0.25,
              fontWeight: 300,
            }}
          >
            ·
          </span>

          {/* Frontend — supporting skill, plain */}
          <span
            style={{
              fontSize: 24,
              color: "#0b1957",
              fontWeight: 500,
              opacity: 0.75,
            }}
          >
            Frontend Developer
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#0b1957",
            opacity: 0.48,
            marginBottom: 38,
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          "I Build It. Then I Break It."
        </div>

        {/* Stat chips */}
        <div
          style={{
            display: "flex",
            gap: 14,
          }}
        >
          {(
            [
              { value: "10+", label: "Projects Delivered" },
              { value: "100+", label: "Test Cases Written" },
              { value: "STLC", label: "Full Cycle QA" },
            ] as { value: string; label: string }[]
          ).map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#ffffff",
                border: "1.5px solid #d4c4b0",
                borderRadius: 16,
                padding: "12px 26px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                boxShadow: "0 2px 8px rgba(11,25,87,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#0b1957",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#4a5568",
                  fontWeight: 400,
                  marginTop: 2,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 22,
          marginTop: 28,
          borderTop: "1.5px solid #d4c4b0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4a5568">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span style={{ color: "#4a5568", fontSize: 15, fontWeight: 400 }}>
            github.com/isnanramalia
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4a5568">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span style={{ color: "#4a5568", fontSize: 15, fontWeight: 400 }}>
            linkedin.com/in/isnanramalia
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="16" viewBox="0 0 24 24" fill="#4a5568">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span style={{ color: "#4a5568", fontSize: 15, fontWeight: 400 }}>
            Semarang, Indonesia
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
