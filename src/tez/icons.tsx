// Tez — season icons, ported from the prototype's roundedStar/iconInner system.
// The SHAPE encodes the family (primavera 5-point, verao 12, outono 3,
// inverno 6); the TREATMENT (mod) gives sub-season rhythm. Always monochrome —
// color belongs to content, never the icon chrome.
import React from "react";
import { SEASON_BY_KEY, META, type FamilyKey } from "./data";

let _uid = 0;

function D(n: number): string {
  return Number(n).toFixed(2);
}

function roundedStar(N: number, Re: number, Ri: number): string {
  const cx = 50, cy = 50;
  const pts: [number, number][] = [];
  for (let i = 0; i < 2 * N; i++) {
    const r = i % 2 === 0 ? Re : Ri;
    const a = ((-90 + (i * 180) / N) * Math.PI) / 180;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const s = mid(pts[2 * N - 1], pts[0]);
  let d = "M " + D(s[0]) + " " + D(s[1]);
  for (let i = 0; i < 2 * N; i++) {
    const c = pts[i], n = pts[(i + 1) % (2 * N)], m = mid(c, n);
    d += " Q " + D(c[0]) + " " + D(c[1]) + " " + D(m[0]) + " " + D(m[1]);
  }
  return d + " Z";
}

const SHAPES: Record<FamilyKey, string> = {
  primavera: roundedStar(5, 37, 19),
  verao: roundedStar(12, 40, 31),
  outono: roundedStar(3, 39, 15),
  inverno: roundedStar(6, 42, 11),
};

export function iconInner(main: FamilyKey, mod: string): string {
  const P = SHAPES[main];
  const S = 'stroke="currentColor" stroke-linejoin="round" stroke-linecap="round" fill="none"';
  const ring = (sc: number, w: number) =>
    '<path d="' + P + '" ' + S + ' stroke-width="' + w + '" transform="translate(50 50) scale(' + sc + ") translate(-50 -50)\"/>";
  let defs = "", body = "";
  if (mod === "puro") body = '<path d="' + P + '" ' + S + ' stroke-width="2.4"/>';
  else if (mod === "suave") body = '<path d="' + P + '" ' + S + ' stroke-width="2.4"/><circle cx="50" cy="50" r="7" fill="currentColor"/>';
  else if (mod === "brilhante") body = '<path d="' + P + '" ' + S + ' stroke-width="1.7"/>' + ring(0.75, 1.7) + ring(0.5, 1.7) + ring(0.25, 1.7);
  else if (mod === "claro") {
    const id = "ht" + _uid++;
    defs = '<pattern id="' + id + '" width="5.6" height="5.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5.6" stroke="currentColor" stroke-width="1.3"/></pattern>';
    body = '<path d="' + P + '" fill="url(#' + id + ')" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>';
  } else if (mod === "profundo") {
    const id2 = "dr" + _uid++;
    defs = '<filter id="' + id2 + '" x="-75%" y="-75%" width="250%" height="250%"><feDropShadow dx="2.6" dy="3.4" stdDeviation="2.4" flood-color="#0c0c0c" flood-opacity="0.45"/></filter>';
    body = '<g filter="url(#' + id2 + ')"><path d="' + P + '" fill="currentColor" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></g>';
  }
  return "<defs>" + defs + "</defs>" + body;
}

export function iconSvg(main: FamilyKey, mod: string, px: number): string {
  return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 100 100" aria-hidden="true" style="display:block">' + iconInner(main, mod) + "</svg>";
}

export function IconEl({
  main,
  mod,
  px,
  color,
}: {
  main: FamilyKey | null;
  mod: string;
  px: number;
  color?: string;
}): React.ReactElement | null {
  if (!main) return null;
  return (
    <span
      style={{ display: "inline-flex", lineHeight: 0, color: color || "currentColor", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: iconSvg(main, mod, px) }}
    />
  );
}

export function SeasonIconEl({
  seasonKey,
  px,
  color,
}: {
  seasonKey: string | null;
  px: number;
  color?: string;
}): React.ReactElement | null {
  if (!seasonKey) return null;
  const s = SEASON_BY_KEY[seasonKey];
  return <IconEl main={s.main} mod={META[s.key].mod} px={px} color={color} />;
}
