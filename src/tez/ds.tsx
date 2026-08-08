// Tez — brand + core primitives, ported from the design-system bundle.
// Logo (wordmark + fan), FanSymbol (fan alone), Button (the pill).
import React from "react";

const FONT_DISPLAY = '"Bodoni Moda", Georgia, serif';

type Tone = "color" | "mono" | "invert" | "invert-mono";

// ── Logo ─────────────────────────────────────────────────────────────────────
// The wordmark "tez" in Bodoni italic with the five-blade fan tucked into the z.
// The wordmark is ALWAYS ink; only the fan's four front blades may carry season
// color (pass `season` = 4 colors).
export function Logo({
  size = 68,
  tone = "color",
  season,
  style,
}: {
  size?: number;
  tone?: Tone;
  season?: string[] | null;
  style?: React.CSSProperties;
}) {
  const k = size / 68;
  let textColor = "#3f3946";
  let backBlade = "#3f3946";
  let front = ["#b884a0", "#8fa2c0", "#a9c0c4", "#d8bccb"];
  let dot = "#3f3946";
  if (tone === "mono") {
    textColor = backBlade = dot = "#1b1a18";
    front = front.map(() => "#1b1a18");
  } else if (tone === "invert") {
    textColor = backBlade = dot = "#f4f0f2";
  } else if (tone === "invert-mono") {
    textColor = backBlade = dot = "#f4f0f2";
    front = front.map(() => "#f4f0f2");
  }
  if (season && season.length >= 4 && (tone === "color" || tone === "invert")) {
    front = season.slice(0, 4);
  }
  const blades = [backBlade, ...front];
  const heights = [36, 40, 42, 40, 36];
  const rot = [56, 40, 24, 10, -3];
  return (
    <div style={{ display: "inline-block", ...style }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: size,
            color: textColor,
            lineHeight: 0.9,
            letterSpacing: "-.5px",
          }}
        >
          tez
        </span>
        <div style={{ position: "absolute", right: 7 * k, bottom: 12 * k, width: 0, height: 0 }}>
          {blades.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 5 * k,
                height: heights[i] * k,
                borderRadius: `0 0 ${4 * k}px ${4 * k}px`,
                background: c,
                transformOrigin: "bottom center",
                transform: `translateX(-50%) rotate(${rot[i]}deg)`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              bottom: -2 * k,
              left: 0,
              width: 6 * k,
              height: 6 * k,
              borderRadius: "50%",
              background: dot,
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── FanSymbol ────────────────────────────────────────────────────────────────
// The leque (fan) alone: five blades radiating from a pivot dot.
export function FanSymbol({
  size = 130,
  colors,
  tone = "color",
  pivot,
  style,
}: {
  size?: number;
  colors?: string[];
  tone?: "color" | "mono" | "invert";
  pivot?: string;
  style?: React.CSSProperties;
}) {
  const BASE = 130;
  const s = size / BASE;
  const inst = ["#d8bccb", "#a9c0c4", "#8fa2c0", "#b884a0", "#3f3946"];
  let blades = colors && colors.length >= 5 ? colors.slice(0, 5) : inst;
  let dot = pivot || "#3f3946";
  if (tone === "mono") {
    blades = blades.map(() => "#1b1a18");
    dot = "#1b1a18";
  }
  if (tone === "invert") {
    blades = blades.map(() => "#f4f0f2");
    dot = "#f4f0f2";
  }
  const heights = [54, 60, 64, 60, 54];
  const rot = [-48, -24, 0, 24, 48];
  const w = 7;
  return (
    <div style={{ position: "relative", width: 130 * s, height: 80 * s, ...style }}>
      <div style={{ position: "absolute", bottom: 8 * s, left: "50%", width: 0, height: 0 }}>
        {blades.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: w * s,
              height: heights[i] * s,
              borderRadius: `0 0 ${5 * s}px ${5 * s}px`,
              background: c,
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${rot[i]}deg)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            bottom: -3 * s,
            left: 0,
            width: 8 * s,
            height: 8 * s,
            borderRadius: "50%",
            background: dot,
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
// The Tez pill. primary = ink outline · emphasis = solid ink · text = bare label.
type ButtonProps = {
  variant?: "primary" | "emphasis" | "text";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", full = false, disabled = false, children, style, ...rest }: ButtonProps) {
  const pad = size === "sm" ? "11px 22px" : size === "lg" ? "18px 34px" : "15px 28px";
  const base: React.CSSProperties = {
    display: full ? "block" : "inline-block",
    width: full ? "100%" : undefined,
    textAlign: "center",
    boxSizing: "border-box",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 12,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    borderRadius: 30,
    padding: pad,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    border: "1px solid transparent",
    transition: "background .18s ease, color .18s ease, border-color .18s ease",
    userSelect: "none",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { border: "1px solid #3f3946", color: "#3f3946", background: "transparent" },
    emphasis: { background: "#3f3946", color: "#f4f0f2", border: "1px solid #3f3946" },
    text: {
      color: "#6f6a62",
      background: "transparent",
      borderRadius: 0,
      padding: size === "sm" ? "9px 8px" : "13px 10px",
    },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
