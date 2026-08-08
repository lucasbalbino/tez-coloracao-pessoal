// Tez — ProductCard, ported from ProductCard.dc.html.
import React from "react";
import type { Product } from "./data";
import type { CardTheme } from "./logic";

export function ProductCard({
  product,
  score,
  locked = false,
  theme,
  onOpen,
  style,
}: {
  product: Product;
  score: number;
  locked?: boolean;
  theme: CardTheme;
  onOpen?: () => void;
  style?: React.CSSProperties;
}) {
  const surface = theme.surface || "#fff";
  const ink = theme.ink || "#111";
  const accent = theme.accent || "#111";
  const line = theme.line || "rgba(0,0,0,.14)";
  const muted = theme.muted || "rgba(0,0,0,.5)";
  const fontDisplay = theme.fontDisplay || "'Bodoni Moda', Georgia, serif";
  const shade = product.shade || accent;

  let verdict = "evite";
  if (score >= 85) verdict = "perfeito p/ você";
  else if (score >= 70) verdict = "ótimo";
  else if (score >= 55) verdict = "ok com cautela";
  else if (score >= 40) verdict = "arriscado";

  const stripe = `repeating-linear-gradient(135deg, ${line} 0 1px, transparent 1px 9px)`;
  const mono = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  return (
    <div
      onClick={onOpen}
      style={{
        background: surface,
        border: `1px solid ${line}`,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(0,0,0,.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          width: "100%",
          backgroundColor: surface,
          backgroundImage: stripe,
          borderBottom: `1px solid ${line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: muted,
            textAlign: "center",
            background: surface,
            padding: "4px 7px",
            lineHeight: 1.3,
            maxWidth: "78%",
          }}
        >
          {product.category}
        </span>
        <span
          style={{
            position: "absolute",
            left: 10,
            bottom: -1,
            width: 26,
            height: 26,
            background: shade,
            border: `1px solid ${ink}`,
            borderBottom: "none",
          }}
        />
      </div>
      <div style={{ padding: "11px 12px 13px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: muted, lineHeight: 1.2 }}>
          {product.brand} · {product.line}
        </div>
        <div style={{ fontFamily: fontDisplay, fontStyle: "italic", fontSize: 19, lineHeight: 1.05, color: ink, letterSpacing: "-.01em", textWrap: "pretty" }}>
          {product.name}
        </div>
        {!locked && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
              <span style={{ fontFamily: fontDisplay, fontStyle: "italic", fontSize: 30, lineHeight: 0.9, color: accent, fontWeight: 600, letterSpacing: "-.02em" }}>
                {score}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: accent }}>%</span>
              <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 8.5, letterSpacing: ".08em", textTransform: "uppercase", color: muted, alignSelf: "flex-end" }}>
                {verdict}
              </span>
            </div>
            <div style={{ height: 3, background: line, width: "100%", marginTop: 2 }}>
              <div style={{ height: "100%", width: score + "%", background: accent }} />
            </div>
          </>
        )}
        {locked && (
          <div style={{ fontFamily: fontDisplay, fontStyle: "italic", fontSize: 15, lineHeight: 1.1, color: accent, marginTop: 2, textWrap: "pretty" }}>
            escolha sua cartela para o score
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${line}`,
            fontFamily: mono,
            fontSize: 9,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          <span>ver análise</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
