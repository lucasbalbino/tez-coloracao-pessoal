// Tez — the seasons wheel, ported from Tez.dc.html buildWheel().
// Four families around the rim, three sub-seasons per family as color blades;
// the centre plots the four shared variations + the Quente/Frio axis.
import React from "react";
import { SEASON_BY_KEY, MAIN_LABEL, META, FAM_ACCENT, WHEEL_FAMS } from "./data";
import { inkFor, type Theme } from "./logic";
import { iconInner } from "./icons";

const R = React.createElement;
const FMV = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export function Wheel({
  theme,
  pendingSeason,
  onPick,
}: {
  theme: Theme;
  pendingSeason: string | null;
  onPick: (key: string) => void;
}) {
  const cx = 200, cy = 200, rIn = 106, rColor = 148, rBand1 = 152, rBand2 = 182;
  const T = theme;
  const surface = T.surface;
  const sel = pendingSeason;
  const selFamily = sel ? SEASON_BY_KEY[sel].main : null;

  const polar = (rad: number, deg: number): [number, number] => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  const ringPath = (ro: number, ri: number, a0: number, a1: number) => {
    const p0 = polar(ro, a0), p1 = polar(ro, a1), p2 = polar(ri, a1), p3 = polar(ri, a0);
    const lg = a1 - a0 <= 180 ? 0 : 1;
    return "M" + p0[0] + " " + p0[1] + " A" + ro + " " + ro + " 0 " + lg + " 1 " + p1[0] + " " + p1[1] + " L" + p2[0] + " " + p2[1] + " A" + ri + " " + ri + " 0 " + lg + " 0 " + p3[0] + " " + p3[1] + " Z";
  };
  const span = 86, gap = 1.6, segArc = (span - 2 * gap) / 3;
  const bands: React.ReactNode[] = [];
  const segs: React.ReactNode[] = [];
  const icons: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  WHEEL_FAMS.forEach((F, f) => {
    const fs = f * 90 - 43;
    const fam = MAIN_LABEL[F.main];
    const cAng = fs + span / 2;
    const rev = cAng > 90 && cAng <= 270;
    const rArc = rev ? rBand2 - 6 : rBand1 + 22;
    const a0f = fs + 5, a1f = fs + span - 5;
    const ps = polar(rArc, rev ? a1f : a0f), pe = polar(rArc, rev ? a0f : a1f), sweep = rev ? 0 : 1;
    const pathD = "M" + ps[0].toFixed(2) + " " + ps[1].toFixed(2) + " A" + rArc + " " + rArc + " 0 0 " + sweep + " " + pe[0].toFixed(2) + " " + pe[1].toFixed(2);
    const pid = "famarc" + f;
    labels.push(
      R("g", { key: "lg" + f },
        R("defs", null, R("path", { id: pid, d: pathD, fill: "none" })),
        R("text", { textAnchor: "middle", fill: T.ink, style: { fontFamily: FMV, fontSize: 11, fontWeight: F.main === selFamily ? 700 : 400, letterSpacing: ".06em" } },
          R("textPath", { href: "#" + pid, startOffset: "50%" }, fam)),
      ),
    );
    F.keys.forEach((key, j) => {
      const s = SEASON_BY_KEY[key];
      const mod = META[key].mod;
      const a0 = fs + gap + j * (segArc + gap), a1 = a0 + segArc, mid = (a0 + a1) / 2;
      const isSel = sel === key;
      const br = ((mid - 90) * Math.PI) / 180;
      const dx = isSel ? Math.cos(br) * 4 : 0, dy = isSel ? Math.sin(br) * 4 : 0;
      const acc = s.accent;
      const c = polar((rIn + rColor) / 2, mid);
      segs.push(
        R("path", {
          key: "s" + key,
          d: ringPath(rColor, rIn, a0, a1),
          fill: acc,
          stroke: isSel ? T.ink : surface,
          strokeWidth: isSel ? 3 : 2,
          transform: "translate(" + dx + "," + dy + ")",
          style: { cursor: "pointer", transition: "transform .14s ease" },
          onClick: () => onPick(key),
        }),
      );
      if (isSel) {
        icons.push(
          R("svg", {
            key: "ic" + key,
            x: c[0] - 13,
            y: c[1] - 13,
            width: 26,
            height: 26,
            viewBox: "0 0 100 100",
            transform: "translate(" + dx + "," + dy + ")",
            style: { color: inkFor(acc), pointerEvents: "none" },
            dangerouslySetInnerHTML: { __html: iconInner(s.main, mod) },
          }),
        );
      }
    });
  });

  const hole = rIn - 3;
  const centerKids: React.ReactNode[] = [R("circle", { key: "hole", cx, cy, r: hole, fill: T.bg })];
  const tick = (x1: number, y1: number, x2: number, y2: number, k: string) =>
    R("line", { key: k, x1, y1, x2, y2, stroke: T.ink, strokeWidth: 1, strokeLinecap: "round", opacity: 0.3 });
  centerKids.push(tick(cx, cy - hole + 4, cx, cy - 22, "tkT"));
  centerKids.push(tick(cx, cy + hole - 4, cx, cy + 28, "tkB"));
  centerKids.push(tick(cx - hole + 4, cy, cx - 48, cy, "tkL"));
  centerKids.push(tick(cx + hole - 4, cy, cx + 48, cy, "tkR"));

  const selPuro = sel && META[sel].mod === "puro";
  const selWarm = selPuro && /Quente/.test(META[sel!].t);
  const selCool = selPuro && /Fria/.test(META[sel!].t);
  centerKids.push(
    R("text", { key: "puraT", x: cx, y: cy + 5, textAnchor: "middle", fill: T.ink, style: { fontFamily: FMV, fontSize: 10.5, letterSpacing: ".02em" } },
      R("tspan", { style: { fontWeight: selWarm ? 700 : 400 } }, "QUENTE"),
      R("tspan", { style: { fontWeight: 400 } }, " / "),
      R("tspan", { style: { fontWeight: selCool ? 700 : 400 } }, "FRIO")),
  );

  const claroLabel = selFamily === "primavera" ? "CLARA" : "CLARO";
  const selMod = sel ? META[sel].mod : null;
  ([[45, claroLabel, "claro"], [135, "SUAVE", "suave"], [225, "PROFUNDO", "profundo"], [315, "BRILHANTE", "brilhante"]] as [number, string, string][]).forEach((d, i) => {
    const p = polar(62, d[0]);
    centerKids.push(
      R("text", { key: "dv" + i, x: p[0], y: p[1] + 4, textAnchor: "middle", fill: T.ink, style: { fontFamily: FMV, fontWeight: selMod === d[2] ? 700 : 400, fontSize: 10.5, letterSpacing: ".02em" } }, d[1]),
    );
  });

  const extArcs: React.ReactNode[] = [];
  WHEEL_FAMS.forEach((F, f) => {
    const fs = f * 90 - 43;
    const a0 = fs + gap, a1 = fs + span - gap;
    const rArcPos = rColor + 10;
    const p0 = polar(rArcPos, a0), p1 = polar(rArcPos, a1);
    const pathD = "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A" + rArcPos + " " + rArcPos + " 0 0 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2);
    extArcs.push(R("path", { key: "arc" + f, d: pathD, stroke: T.ink, strokeWidth: 1, fill: "none", opacity: 0.3, strokeLinecap: "round" }));
  });

  const bladesEl = R("g", { key: "blades", className: "tez-blades", style: sel ? undefined : { animation: "tezPulse 2.6s ease-in-out infinite" } }, segs);

  return R(
    "svg",
    { viewBox: "0 0 400 400", width: "100%", height: "100%", style: { display: "block" }, role: "img", "aria-label": "Roda das estações" },
    bands, bladesEl, icons, centerKids, labels, extArcs,
  );
}
