// Tez — Coloração Pessoal. React port of the Claude Design prototype (Tez.dc.html).
// A calm, editorial personal-color app: onboarding → auth → season wheel → app
// (home / search / curation / account) with product compatibility scoring.
import React, { useState } from "react";
import {
  SEASON_BY_KEY,
  PRODUCT_BY_ID,
  PRODUCTS,
  POSTS,
  BRAND_INFO,
  PROD_DESC,
  SEASON_INFO,
  META,
  FONT_MONO,
  FONT_EDITORIAL,
  type Product,
} from "./tez/data";
import { makeTheme, scoreOf, resultAccent, cardTheme, ranking, mix, type Theme } from "./tez/logic";
import { Logo, FanSymbol, Button } from "./tez/ds";
import { IconEl, SeasonIconEl } from "./tez/icons";
import { Wheel } from "./tez/Wheel";
import { ProductCard } from "./tez/ProductCard";
import { AndroidDevice } from "./tez/Device";

type Screen = "onboarding" | "auth" | "pick" | "app";
type Tab = "home" | "search" | "curation" | "account";
type AuthMode = "signup" | "login";
type SearchMode = "texto" | "foto";

interface AppState {
  screen: Screen;
  pendingSeason: string | null;
  season: string | null;
  tab: Tab;
  searchMode: SearchMode;
  searchQuery: string;
  result: string | null;
  openPost: string | null;
  openProduct: string | null;
  stationMore: boolean;
  openCartela: boolean;
  authMode: AuthMode;
  authName: string;
  authEmail: string;
  authPhone: string;
  authPass: string;
  notif: Record<string, boolean>;
}

const INITIAL: AppState = {
  screen: "onboarding",
  pendingSeason: null,
  season: null,
  tab: "home",
  searchMode: "texto",
  searchQuery: "",
  result: null,
  openPost: null,
  openProduct: null,
  stationMore: false,
  openCartela: false,
  authMode: "signup",
  authName: "",
  authEmail: "",
  authPhone: "",
  authPass: "",
  notif: { curadoria: true, novos: true, ofertas: false, email: true },
};

const stripe = (line: string, gap = 9) => `repeating-linear-gradient(135deg, ${line} 0 1px, transparent 1px ${gap}px)`;

export default function App() {
  const [st, setSt] = useState<AppState>(INITIAL);
  const set = (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) =>
    setSt((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));

  const T = makeTheme(st.season);
  const fm = FONT_MONO;
  const fd = T.fontDisplay;
  const resAcc = resultAccent(st.season, T);
  const ct = cardTheme(st.season, T);
  const seasonLabel = st.season ? SEASON_BY_KEY[st.season].label : "tez";
  const logoSeason = st.season ? T.swatches : null;

  // ── actions ────────────────────────────────────────────────────────────────
  const googleAuth = () => set({ screen: "pick" });
  const start = () => set({ screen: "auth", authMode: "login" });
  const backToOnboarding = () => set({ screen: "onboarding" });
  const toggleAuthMode = () => set((s) => ({ authMode: s.authMode === "signup" ? "login" : "signup" }));
  const submitAuth = () => set({ screen: "pick" });
  const chooseSkip = () => set({ screen: "app", season: null, pendingSeason: null, tab: "home", result: null, openPost: null, openProduct: null, searchQuery: "" });
  const goToPick = () => set({ screen: "pick", openProduct: null, openPost: null });
  const pick = (k: string) => set({ pendingSeason: k, stationMore: false });
  const confirm = () => st.pendingSeason && set({ season: st.pendingSeason, screen: "app", tab: "home" });
  const setTab = (t: Tab) => set({ tab: t, openPost: null, openProduct: null, openCartela: false });
  const setMode = (m: SearchMode) => set({ searchMode: m });
  const doSearch = (name?: string) => {
    const q = ((typeof name === "string" ? name : st.searchQuery) || "").toLowerCase();
    let p: Product | null | undefined = PRODUCTS.find((x) => (x.name + " " + x.brand + " " + x.line + " " + x.category).toLowerCase().includes(q));
    if (!q) p = null;
    if (q && !p) p = PRODUCTS[0];
    set({ result: p ? p.id : null, searchQuery: typeof name === "string" ? name : st.searchQuery });
  };
  const scan = () => set({ result: "p8", searchMode: "foto", searchQuery: "cód. 7891000 · escaneado" });
  const clearSearch = () => set({ result: null, searchQuery: "" });
  const openProductFn = (id: string) => set({ openProduct: id });
  const closeProduct = () => set({ openProduct: null });
  const openPostFn = (id: string) => set({ openPost: id });
  const closePost = () => set({ openPost: null });
  const openCartelaFn = () => set({ openCartela: true, openProduct: null, openPost: null });
  const closeCartela = () => set({ openCartela: false });
  const toggleNotif = (k: string) => set((s) => ({ notif: { ...s.notif, [k]: !s.notif[k] } }));
  const openLatest = () => set({ tab: "curation", openPost: POSTS[0].id });
  const goSearchTab = () => setTab("search");
  const logout = () => set(INITIAL);

  const screenStyle: React.CSSProperties = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: T.bg,
    color: T.ink,
    fontFamily: fm,
    overflow: "hidden",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100dvh",
        padding: 28,
        background: "#d6d2ca",
        fontFamily: fm,
        boxSizing: "border-box",
      }}
    >
      <AndroidDevice bg={T.bg}>
        <div style={screenStyle}>
          {st.screen === "onboarding" && <Onboarding T={T} fm={fm} onGoogle={googleAuth} onStart={start} />}
          {st.screen === "auth" && (
            <Auth st={st} set={set} T={T} fd={fd} fm={fm} onBack={backToOnboarding} onSubmit={submitAuth} onToggle={toggleAuthMode} onGoogle={googleAuth} />
          )}
          {st.screen === "pick" && <Pick st={st} T={T} fd={fd} fm={fm} onPick={pick} onSkip={chooseSkip} onConfirm={confirm} />}
          {st.screen === "app" && (
            <AppScreen
              st={st}
              T={T}
              fd={fd}
              fm={fm}
              ct={ct}
              resAcc={resAcc}
              seasonLabel={seasonLabel}
              logoSeason={logoSeason}
              actions={{ goToPick, openCartelaFn, closeCartela, setTab, setMode, doSearch, scan, clearSearch, openProductFn, closeProduct, openPostFn, closePost, toggleNotif, openLatest, goSearchTab, logout, onQuery: (e: React.ChangeEvent<HTMLInputElement>) => set({ searchQuery: e.target.value }) }}
            />
          )}
        </div>
      </AndroidDevice>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────────
function Onboarding({ T, fm, onGoogle, onStart }: { T: Theme; fm: string; onGoogle: () => void; onStart: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 14, minHeight: 0 }}>
      <div style={{ flex: 1, border: `1px solid ${T.line}`, background: T.surface, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,.08)", display: "flex", flexDirection: "column", padding: "22px 18px 18px", minHeight: 0 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <Logo size={118} />
          <div style={{ fontFamily: fm, fontSize: 11, letterSpacing: ".36em", marginTop: 18 }}>COLORAÇÃO PESSOAL</div>
          <div style={{ width: 42, height: 1, background: T.ink, marginTop: 22 }} />
          <p style={{ fontFamily: fm, fontSize: 13.5, lineHeight: 1.5, color: T.muted, maxWidth: "32ch", margin: "22px auto 0", textWrap: "pretty" }}>
            O Tez mostra a maquiagem que combina com você. Escolha a sua cartela de coloração pessoal e receba recomendações feitas para as suas cores.
          </p>
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <Button variant="emphasis" full onClick={onGoogle}>continuar com Google</Button>
          <Button variant="primary" full onClick={onStart}>continuar com e-mail</Button>
        </div>
      </div>
    </div>
  );
}

// ── Auth ───────────────────────────────────────────────────────────────────────
function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 8.5, letterSpacing: ".16em", color: "#6f6a62" }}>{label}</span>
      <input
        {...rest}
        style={{ width: "100%", border: "none", borderBottom: "1px solid #e6e0d6", background: "transparent", padding: "9px 0", fontFamily: FONT_MONO, fontSize: 15, color: "#1b1a18", outline: "none" }}
      />
    </label>
  );
}

function Auth({ st, set, T, fd, fm, onBack, onSubmit, onToggle, onGoogle }: any) {
  const isSignup = st.authMode === "signup";
  const isLogin = st.authMode === "login";
  const eyebrow = isSignup ? "CRIAR CONTA" : "ENTRAR";
  const title = isSignup ? "crie a sua conta" : "bem-vinda de volta";
  const sub = isSignup ? "Guarde a sua cartela e receba as recomendações feitas para as suas cores." : "Entre para reencontrar a sua cartela e as suas recomendações.";
  const cta = isSignup ? "criar conta →" : "entrar →";
  const switchText = isSignup ? "Já tem conta?" : "Novo por aqui?";
  const switchCta = isSignup ? "entrar" : "criar conta";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 14, minHeight: 0 }}>
      <div style={{ flex: 1, border: `1px solid ${T.line}`, background: T.surface, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,.08)", display: "flex", flexDirection: "column", padding: "20px 18px 18px", minHeight: 0, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span onClick={onBack} style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".14em", color: T.muted, cursor: "pointer" }}>← VOLTAR</span>
          <Logo size={30} />
        </div>
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".2em", color: T.muted }}>{eyebrow}</div>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 34, lineHeight: 1, letterSpacing: "-.02em", marginTop: 9, textWrap: "pretty" }}>{title}</div>
          <p style={{ fontFamily: fm, fontSize: 13, lineHeight: 1.5, color: T.muted, margin: "10px 0 0", maxWidth: "34ch", textWrap: "pretty" }}>{sub}</p>
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignup && <Field label="NOME" value={st.authName} onChange={(e) => set({ authName: e.target.value })} placeholder="como quer ser chamada" />}
          <Field label="E-MAIL" type="email" value={st.authEmail} onChange={(e) => set({ authEmail: e.target.value })} placeholder="voce@email.com" />
          {isSignup && <Field label="TELEFONE" type="tel" value={st.authPhone} onChange={(e) => set({ authPhone: e.target.value })} placeholder="(11) 99999-9999" />}
          {isLogin && (
            <>
              <Field label="SENHA" type="password" value={st.authPass} onChange={(e) => set({ authPass: e.target.value })} placeholder="••••••••" />
              <div style={{ textAlign: "right", marginTop: -8 }}>
                <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".12em", color: T.accent, cursor: "pointer" }}>ESQUECI MINHA SENHA</span>
              </div>
            </>
          )}
        </div>
        <div style={{ marginTop: 22 }}>
          <Button variant="emphasis" full onClick={onSubmit}>{cta}</Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <span style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".18em", color: T.faint }}>OU</span>
          <span style={{ flex: 1, height: 1, background: T.line }} />
        </div>
        <Button variant="primary" full onClick={onGoogle}>continuar com Google</Button>
        <div style={{ marginTop: "auto", paddingTop: 22, textAlign: "center" }}>
          <span style={{ fontFamily: fm, fontSize: 12.5, color: T.muted }}>{switchText} </span>
          <span onClick={onToggle} style={{ fontFamily: fd, fontStyle: "italic", fontSize: 15, color: T.ink, cursor: "pointer", borderBottom: `1px solid ${T.ink}`, paddingBottom: 1 }}>{switchCta}</span>
        </div>
      </div>
    </div>
  );
}

// ── Pick (season wheel) ─────────────────────────────────────────────────────────
function Pick({ st, T, fd, fm, onPick, onSkip, onConfirm }: any) {
  const pend = st.pendingSeason ? SEASON_BY_KEY[st.pendingSeason] : null;
  const chooseHi = (st.authName || "").trim() ? "OLÁ, " + (st.authName || "").trim().split(" ")[0].toUpperCase() : "SUA CARTELA";
  const pInfo = pend ? SEASON_INFO[pend.key] || { desc: pend.blurb, more: [] } : null;
  const pillStyle: React.CSSProperties = { fontFamily: fm, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: T.muted, border: `1px solid ${T.line}`, padding: "5px 9px" };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: "18px 18px 12px", borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".2em", color: T.muted }}>{chooseHi}</div>
          <span onClick={onSkip} style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".12em", color: T.muted, cursor: "pointer", borderBottom: `1px solid ${T.line}`, paddingBottom: 2, whiteSpace: "nowrap", flexShrink: 0 }}>ENTRAR SEM SELECIONAR →</span>
        </div>
        <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 34, lineHeight: 0.98, letterSpacing: "-.02em", marginTop: 10 }}>qual é a sua<br />estação?</div>
        <div style={{ fontFamily: fm, fontSize: 12, lineHeight: 1.45, color: T.muted, marginTop: 9, maxWidth: "36ch" }}>
          As quatro famílias ficam ao redor da roda e cada uma reúne três variações no interior. Toque na variação da sua estação para revelar as cores da sua cartela, ou entre sem selecionar e escolha depois.
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <div style={{ padding: "16px 8px 4px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 392, aspectRatio: "1 / 1", margin: "0 auto" }}>
            <Wheel theme={T} pendingSeason={st.pendingSeason} onPick={onPick} />
          </div>
        </div>
        {pend && (
          <div style={{ margin: "6px 16px 0", padding: 16, border: `1px solid ${T.line}`, animation: "tezUp .22s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ lineHeight: 0 }}><IconEl main={pend.main} mod={META[pend.key].mod} px={30} color={pend.accent} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 23, lineHeight: 1.02, letterSpacing: "-.01em" }}>{pend.label}</div>
              </div>
            </div>
            <div style={{ display: "flex", height: 42, border: `1px solid ${T.line}`, marginTop: 14 }}>
              {pend.swatches.map((c: string, i: number) => <span key={i} style={{ background: c, flex: 1, height: "100%" }} />)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {[META[pend.key].t, META[pend.key].v, META[pend.key].i].map((pl, i) => <span key={i} style={pillStyle}>{pl}</span>)}
            </div>
            <div style={{ fontFamily: fm, fontSize: 13, color: T.ink, marginTop: 13, lineHeight: 1.55, textWrap: "pretty" }}>{pInfo!.desc}</div>
          </div>
        )}
        <div style={{ height: 96 }} />
      </div>
      {pend && (
        <div style={{ position: "sticky", bottom: 0, display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: pend.accent, boxShadow: "0 -8px 24px rgba(0,0,0,.12)", animation: "tezUp .25s ease both" }}>
          <span style={{ lineHeight: 0 }}><IconEl main={pend.main} mod={META[pend.key].mod} px={22} color="#fff" /></span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".16em", opacity: 0.85, color: "#fff" }}>SUA ESTAÇÃO</div>
            <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 20, lineHeight: 1, marginTop: 2, color: "#fff" }}>{pend.label}</div>
          </div>
          <button onClick={onConfirm} style={{ marginLeft: "auto", height: 44, padding: "0 20px", background: "#fff", color: "#111", border: "none", borderRadius: 30, fontFamily: fm, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer" }}>entrar →</button>
        </div>
      )}
    </div>
  );
}

// ── App (tabbed) ────────────────────────────────────────────────────────────────
function AppScreen({ st, T, fd, fm, ct, resAcc, seasonLabel, logoSeason, actions }: any) {
  const hasSeason = !!st.season;
  const headerIcon = <SeasonIconEl seasonKey={st.season} px={15} color={T.seasonInk} />;

  let body: React.ReactNode = null;
  if (st.openCartela && st.season) body = <CartelaView st={st} T={T} fd={fd} fm={fm} seasonLabel={seasonLabel} onBack={actions.closeCartela} onSwap={actions.goToPick} headerIcon={headerIcon} />;
  else if (st.openProduct) body = <ProductDetail st={st} T={T} fd={fd} fm={fm} ct={ct} resAcc={resAcc} seasonLabel={seasonLabel} actions={actions} />;
  else if (st.tab === "home") body = <Home st={st} T={T} fd={fd} fm={fm} actions={actions} />;
  else if (st.tab === "search") body = <Search st={st} T={T} fd={fd} fm={fm} ct={ct} actions={actions} />;
  else if (st.tab === "curation") body = <Curation st={st} T={T} fd={fd} fm={fm} ct={ct} actions={actions} />;
  else if (st.tab === "account") body = <Account st={st} T={T} fd={fd} fm={fm} seasonLabel={seasonLabel} actions={actions} headerIcon={headerIcon} />;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "13px 16px 11px", borderBottom: `1px solid ${T.line}` }}>
        <Logo size={30} season={logoSeason} />
        {hasSeason ? (
          <div onClick={actions.openCartelaFn} style={{ textAlign: "right", cursor: "pointer" }}>
            <div style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".16em", color: T.muted }}>SUA CARTELA ›</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              <span style={{ lineHeight: 0 }}>{headerIcon}</span>
              <span style={{ fontFamily: fd, fontStyle: "italic", fontSize: 15, lineHeight: 1.1, color: T.seasonInk }}>{seasonLabel}</span>
            </div>
          </div>
        ) : (
          <div onClick={actions.goToPick} style={{ textAlign: "right", cursor: "pointer" }}>
            <div style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".16em", color: T.muted }}>SUA CARTELA</div>
            <div style={{ fontFamily: fm, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: T.accent, marginTop: 3 }}>escolher →</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>{body}</div>

      <BottomNav tab={st.tab} T={T} fm={fm} onGo={actions.setTab} />
    </div>
  );
}

function BottomNav({ tab, T, fm, onGo }: any) {
  const item = (active: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    flex: 1,
    cursor: "pointer",
    padding: "10px 0 8px",
    color: active ? T.accent : T.muted,
    borderTop: `2px solid ${active ? T.accent : "transparent"}`,
  });
  const glyph = (g: string) => <span style={{ fontFamily: fm, fontSize: 14, lineHeight: 1 }}>{g}</span>;
  const label = (l: string) => <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".1em" }}>{l}</span>;
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${T.line}`, background: T.bg }}>
      <div onClick={() => onGo("home")} style={item(tab === "home")}>{glyph("◆")}{label("INÍCIO")}</div>
      <div onClick={() => onGo("search")} style={item(tab === "search")}>{glyph("◎")}{label("BUSCA")}</div>
      <div onClick={() => onGo("curation")} style={item(tab === "curation")}>{glyph("▦")}{label("CURADORIA")}</div>
      <div onClick={() => onGo("account")} style={item(tab === "account")}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="5.2" r="2.7" />
          <path d="M2.8 13.4c0-2.9 2.3-4.5 5.2-4.5s5.2 1.6 5.2 4.5" />
        </svg>
        {label("CONTA")}
      </div>
    </div>
  );
}

// ── Home ────────────────────────────────────────────────────────────────────────
function Home({ st, T, fd, fm, actions }: any) {
  const latest = POSTS[0];
  return (
    <div>
      <div style={{ padding: "22px 16px 18px" }}>
        <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".16em", color: T.muted }}>BEM-VINDA DE VOLTA</div>
        <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 33, lineHeight: 1, letterSpacing: "-.02em", marginTop: 9, textWrap: "pretty" }}>a maquiagem que combina com você.</div>
      </div>
      {!st.season && (
        <div onClick={actions.goToPick} style={{ margin: "0 16px", border: `1px solid ${T.line}`, padding: "15px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted }}>SUA PALETA PESSOAL</div>
            <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 20, lineHeight: 1.05, marginTop: 5, textWrap: "pretty" }}>descubra a cartela que já é sua</div>
          </div>
          <span style={{ fontFamily: fm, fontSize: 16, color: T.accent, flexShrink: 0 }}>→</span>
        </div>
      )}
      <div onClick={actions.goSearchTab} style={{ margin: "22px 16px 0", border: `1px solid ${T.line}`, padding: 16, cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".16em", color: T.muted }}>01 — BUSCA</span>
          <span style={{ fontFamily: fm, fontSize: 14, color: T.accent }}>↗</span>
        </div>
        <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 23, marginTop: 8, lineHeight: 1 }}>busque um produto</div>
        <div style={{ fontFamily: fm, fontSize: 12, color: T.muted, marginTop: 6 }}>Pela foto do código de barras ou pelo nome — receba o score com a sua paleta.</div>
        <div style={{ marginTop: 13, border: `1px solid ${T.line}`, padding: "11px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: fm, fontSize: 12.5, color: T.muted }}>marca, linha ou produto…</span>
          <span style={{ fontFamily: fm, fontSize: 11, color: T.accent }}>buscar</span>
        </div>
      </div>
      <div onClick={actions.openLatest} style={{ margin: "14px 16px 24px", border: `1px solid ${T.line}`, cursor: "pointer" }}>
        <div style={{ aspectRatio: "16 / 9", backgroundColor: T.surface, backgroundImage: stripe(T.line), display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${T.line}` }}>
          <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted, background: T.surface, padding: "4px 8px" }}>CAPA · {latest.title}</span>
        </div>
        <div style={{ padding: "14px 14px 15px" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.accent }}>02 — CURADORIA · {latest.kind} · {latest.date}</div>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 22, marginTop: 7, lineHeight: 1.02 }}>{latest.title}</div>
          <div style={{ fontFamily: fm, fontSize: 12, color: T.muted, marginTop: 6, lineHeight: 1.4 }}>{latest.dek}</div>
          <div style={{ fontFamily: fm, fontSize: 11, color: T.accent, marginTop: 11 }}>ler edição →</div>
        </div>
      </div>
    </div>
  );
}

// ── Search ──────────────────────────────────────────────────────────────────────
function Search({ st, T, fd, fm, ct, actions }: any) {
  const noSeason = !st.season;
  const modeStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: fm,
    fontSize: 10.5,
    letterSpacing: ".04em",
    textTransform: "uppercase",
    background: active ? T.btnBg : "transparent",
    color: active ? T.btnFg : T.muted,
  });
  const result = st.result ? PRODUCT_BY_ID[st.result] : null;
  const similars = result ? PRODUCTS.filter((x) => x.id !== result.id).slice(0, 2) : [];
  const browse = PRODUCTS.slice(0, 2);
  return (
    <div style={{ padding: "24px 16px 24px" }}>
      <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".16em", color: T.muted }}>BUSCA DE PRODUTOS</div>
      <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 44, lineHeight: 0.94, marginTop: 8, letterSpacing: "-.02em" }}>combina<br />comigo?</div>
      <div style={{ fontFamily: fm, fontSize: 13, lineHeight: 1.45, color: T.muted, marginTop: 11, maxWidth: "32ch" }}>Escaneie o código de barras ou digite a marca, a linha ou o produto — o score com a sua paleta aparece na hora.</div>

      {noSeason && (
        <div onClick={actions.goToPick} style={{ marginTop: 16, border: `1px solid ${T.line}`, padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: fm, fontSize: 12.5, lineHeight: 1.4, color: T.muted }}>Escolha sua cartela para ver o quanto cada produto combina com você.</span>
          <span style={{ fontFamily: fm, fontSize: 11, letterSpacing: ".12em", color: T.accent, whiteSpace: "nowrap" }}>ESCOLHER →</span>
        </div>
      )}

      <div style={{ display: "flex", border: `1px solid ${T.line}`, marginTop: 18 }}>
        <div onClick={() => actions.setMode("texto")} style={modeStyle(st.searchMode === "texto")}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <line x1="2.5" y1="4.5" x2="13.5" y2="4.5" /><line x1="2.5" y1="8" x2="13.5" y2="8" /><line x1="2.5" y1="11.5" x2="9.5" y2="11.5" />
          </svg>
          Texto
        </div>
        <div onClick={() => actions.setMode("foto")} style={modeStyle(st.searchMode === "foto")}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="1.2" height="10" /><rect x="4.4" y="3" width="0.8" height="10" /><rect x="6.4" y="3" width="1.6" height="10" /><rect x="9" y="3" width="0.8" height="10" /><rect x="10.8" y="3" width="1.4" height="10" /><rect x="13" y="3" width="0.8" height="10" />
          </svg>
          Foto · Código de barras
        </div>
      </div>

      {st.searchMode === "texto" && (
        <div style={{ border: `1px solid ${T.line}`, borderTop: "none", padding: 16, display: "flex", flexDirection: "column", minHeight: 216 }}>
          <div style={{ flex: 1, border: `1px solid ${T.line}`, display: "flex", alignItems: "flex-start" }}>
            <input value={st.searchQuery} onChange={actions.onQuery} placeholder="marca, linha ou produto…" style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", padding: "15px 14px", fontFamily: fm, fontSize: 15, color: T.ink, outline: "none" }} />
          </div>
          <button onClick={() => actions.doSearch()} style={{ marginTop: 14, width: "100%", height: 50, border: "none", borderRadius: 30, background: T.btnBg, color: T.btnFg, fontFamily: fm, fontSize: 12, letterSpacing: ".14em", cursor: "pointer" }}>BUSCAR</button>
        </div>
      )}
      {st.searchMode === "foto" && (
        <div style={{ border: `1px solid ${T.line}`, borderTop: "none", padding: 16, display: "flex", flexDirection: "column", minHeight: 216 }}>
          <div style={{ flex: 1, border: `1px dashed ${T.muted}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 20 }}>
            <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted, textAlign: "center" }}>APONTE PARA O CÓDIGO DE BARRAS</span>
          </div>
          <button onClick={actions.scan} style={{ marginTop: 14, width: "100%", height: 50, border: "none", borderRadius: 30, background: T.btnBg, color: T.btnFg, fontFamily: fm, fontSize: 12, letterSpacing: ".14em", cursor: "pointer" }}>ESCANEAR</button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <span style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.muted, whiteSpace: "nowrap" }}>ENCONTRADO · TOQUE PARA ANÁLISE</span>
            <span style={{ flex: 1, height: 1, background: T.line }} />
          </div>
          <ProductCard product={result} score={scoreOf(result, T)} locked={noSeason} theme={ct} onOpen={() => actions.openProductFn(result.id)} style={{ display: "block" }} />
          <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.muted, margin: "22px 0 8px" }}>PARECIDOS PARA VOCÊ</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {similars.map((s) => <ProductCard key={s.id} product={s} score={scoreOf(s, T)} locked={noSeason} theme={ct} onOpen={() => actions.openProductFn(s.id)} />)}
          </div>
          <button onClick={actions.clearSearch} style={{ marginTop: 20, width: "100%", height: 46, border: `1px solid ${T.accent}`, borderRadius: 30, background: "transparent", color: T.accent, fontFamily: fm, fontSize: 11, letterSpacing: ".14em", cursor: "pointer" }}>NOVA BUSCA</button>
        </div>
      )}

      {!result && (
        <div style={{ marginTop: 36, paddingTop: 18, borderTop: `1px solid ${T.line}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 11 }}>
            <span style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".14em", color: T.muted }}>ENQUANTO ISSO</span>
            <span style={{ fontFamily: fm, fontSize: 11, color: T.muted }}>· algumas sugestões para a sua estação</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {browse.map((b) => <ProductCard key={b.id} product={b} score={scoreOf(b, T)} locked={noSeason} theme={ct} onOpen={() => actions.openProductFn(b.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Curation ────────────────────────────────────────────────────────────────────
function Curation({ st, T, fd, fm, ct, actions }: any) {
  const noSeason = !st.season;
  if (st.openPost) {
    const po = POSTS.find((x) => x.id === st.openPost)!;
    const paras = [
      'A coloração pessoal não classifica cores em "bonitas" ou "feias" — classifica relações. Uma cor que ilumina a pele fria some sobre a pele quente, e vice-versa.',
      "Nesta edição testamos cada produto contra as doze estações estendidas, medindo temperatura, profundidade e intensidade. O número que acompanha cada item resume essa leitura.",
      "O que se repete: subtom decide tudo. Antes da marca, antes do acabamento, antes do preço, é o subtom que aprova ou reprova uma cor no seu rosto.",
    ];
    const cards = po.pids.map((id) => PRODUCT_BY_ID[id]);
    return (
      <div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.line}` }}>
          <span onClick={actions.closePost} style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".12em", color: T.muted, cursor: "pointer" }}>← TODAS AS EDIÇÕES</span>
        </div>
        <div style={{ aspectRatio: "16 / 10", backgroundColor: T.surface, backgroundImage: stripe(T.line), display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${T.line}` }}>
          <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted, background: T.surface, padding: "5px 9px" }}>CAPA DA EDIÇÃO</span>
        </div>
        <div style={{ padding: "20px 16px 26px" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.accent }}>{po.kind} · {po.date} · {po.read}</div>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 36, lineHeight: 1, marginTop: 9, letterSpacing: "-.02em", textWrap: "pretty" }}>{po.title}</div>
          <div style={{ fontFamily: FONT_EDITORIAL, fontSize: 21, fontStyle: "italic", color: T.muted, marginTop: 12, lineHeight: 1.35 }}>{po.dek}</div>
          <div style={{ height: 1, background: T.ink, margin: "18px 0" }} />
          {paras.map((para, i) => <p key={i} style={{ fontFamily: fm, fontSize: 13.5, lineHeight: 1.62, color: T.ink, margin: "0 0 14px" }}>{para}</p>)}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 12px" }}>
            <span style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.muted, whiteSpace: "nowrap" }}>PRODUTOS DESTA EDIÇÃO</span>
            <span style={{ flex: 1, height: 1, background: T.line }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {cards.map((c) => <ProductCard key={c.id} product={c} score={scoreOf(c, T)} locked={noSeason} theme={ct} onOpen={() => actions.openProductFn(c.id)} />)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px 16px 24px" }}>
      <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".16em", color: T.muted }}>CURADORIA</div>
      <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 31, lineHeight: 1, marginTop: 8 }}>edições</div>
      <div style={{ marginTop: 14, borderTop: `1px solid ${T.line}` }}>
        {POSTS.map((p) => (
          <div key={p.id} onClick={() => actions.openPostFn(p.id)} style={{ display: "flex", gap: 15, padding: "18px 0", borderBottom: `1px solid ${T.line}`, cursor: "pointer" }}>
            <div style={{ width: 104, height: 104, flexShrink: 0, backgroundColor: T.surface, backgroundImage: stripe(T.line, 8), border: `1px solid ${T.line}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".12em", color: T.accent }}>{p.kind} · {p.date} · {p.read}</div>
              <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 23, lineHeight: 1.02, marginTop: 6, textWrap: "pretty" }}>{p.title}</div>
              <div style={{ fontFamily: fm, fontSize: 12.5, color: T.muted, marginTop: 6, lineHeight: 1.4 }}>{p.dek}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Product detail ──────────────────────────────────────────────────────────────
function ProductDetail({ st, T, fd, fm, ct, resAcc, seasonLabel, actions }: any) {
  const p: Product = PRODUCT_BY_ID[st.openProduct];
  const noSeason = !st.season;
  const sc = scoreOf(p, T);
  const verdict = sc >= 85 ? "perfeito para você" : sc >= 70 ? "ótimo, pode usar" : sc >= 55 ? "ok, com cautela" : sc >= 40 ? "arriscado" : "melhor evitar";
  const tempAlign = !!p.warm === !!T.warm;
  const dRef = T.depth == null ? 0.5 : T.depth;
  const dDiff = Math.abs(p.depth - dRef);
  const depthLabel = p.depth < 0.35 ? "Clara" : p.depth < 0.65 ? "Média" : "Profunda";
  const analysis = [
    { k: "TEMPERATURA", v: p.warm ? "Quente" : "Frio", ok: tempAlign },
    { k: "PROFUNDIDADE", v: depthLabel, ok: dDiff < 0.28 },
  ];
  const prose = tempAlign
    ? "O subtom " + (p.warm ? "quente" : "frio") + " deste produto conversa com a sua estação — a cor acende a pele em vez de apagá-la."
    : "A temperatura puxa para o lado oposto da sua paleta: usável, mas tende a competir com a sua pele em vez de iluminá-la.";
  const rank = ranking(p).slice(0, 6);
  const similars = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 2);
  const rankingLabel = st.season ? "OUTRAS ESTAÇÕES COMPATÍVEIS" : "ESTAÇÕES COMPATÍVEIS";

  return (
    <div>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.line}` }}>
        <span onClick={actions.closeProduct} style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".12em", color: T.muted, cursor: "pointer" }}>← VOLTAR</span>
      </div>
      <div style={{ position: "relative", aspectRatio: "4 / 3", width: "100%", backgroundColor: T.surface, backgroundImage: stripe(T.line, 10), borderBottom: `1px solid ${T.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted, background: T.surface, padding: "5px 9px" }}>{p.category}</span>
      </div>
      <div style={{ padding: "18px 16px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
          <span style={{ width: 36, height: 36, background: p.shade, border: `1px solid ${T.ink}`, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: T.muted }}>{p.brand} · {p.line}</div>
            <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 28, lineHeight: 1, marginTop: 5, letterSpacing: "-.01em", textWrap: "pretty" }}>{p.name}</div>
            <div style={{ fontFamily: fm, fontSize: 10, color: T.muted, marginTop: 5 }}>{(p.shade || "").toUpperCase()}</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <p style={{ fontFamily: fm, fontSize: 14, lineHeight: 1.6, color: T.ink, margin: 0 }}>{PROD_DESC[p.id]}</p>
          <div style={{ marginTop: 16, borderTop: `1px solid ${T.line}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 11 }}>
              <span style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".12em", color: T.muted, width: 46, flexShrink: 0, paddingTop: 2 }}>MARCA</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 16, lineHeight: 1.05 }}>{p.brand}</div>
                <div style={{ fontFamily: fm, fontSize: 12, lineHeight: 1.45, color: T.muted, marginTop: 3 }}>{BRAND_INFO[p.brand] || ""}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 11 }}>
              <span style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".12em", color: T.muted, width: 46, flexShrink: 0, paddingTop: 2 }}>LINHA</span>
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontFamily: fd, fontStyle: "italic", fontSize: 16, lineHeight: 1.05 }}>{p.line}</span>
                <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".1em", color: T.muted, textAlign: "right" }}>{p.category}</span>
              </div>
            </div>
          </div>
        </div>

        {noSeason ? (
          <div onClick={actions.goToPick} style={{ marginTop: 22, border: `1px solid ${T.line}`, padding: "20px 18px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted }}>COMPATIBILIDADE</div>
            <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 23, lineHeight: 1.08, marginTop: 9, textWrap: "pretty" }}>escolha sua cartela para ver o quanto combina com você</div>
            <div style={{ fontFamily: fm, fontSize: 12.5, lineHeight: 1.45, color: T.muted, marginTop: 9 }}>Sem uma cartela selecionada não dá para medir a compatibilidade com a sua coloração.</div>
            <div style={{ fontFamily: fm, fontSize: 11, letterSpacing: ".14em", color: T.accent, marginTop: 15 }}>ESCOLHER CARTELA →</div>
          </div>
        ) : (
          <div style={{ marginTop: 22, border: `1px solid ${T.line}`, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted }}>COMPATIBILIDADE</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.seasonInk }}>
                <span style={{ lineHeight: 0 }}><SeasonIconEl seasonKey={st.season} px={13} color={T.seasonInk} /></span>{seasonLabel}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 8 }}>
              <span style={{ fontFamily: fd, fontStyle: "italic", fontSize: 80, lineHeight: 0.76, color: T.seasonInk, fontWeight: 600, letterSpacing: "-.03em" }}>{sc}</span>
              <span style={{ fontFamily: fm, fontSize: 22, color: T.seasonInk }}>%</span>
              <span style={{ marginLeft: "auto", fontFamily: fm, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: T.muted, alignSelf: "flex-end" }}>{verdict}</span>
            </div>
            <div style={{ height: 9, width: "100%", background: T.line, marginTop: 14 }}><div style={{ height: 9, width: sc + "%", background: resAcc }} /></div>
            <div style={{ fontFamily: fm, fontSize: 13, lineHeight: 1.5, color: T.ink, marginTop: 13 }}>{prose}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {analysis.map((a) => (
                <div key={a.k} style={{ flex: 1, border: `1px solid ${T.line}`, padding: 10 }}>
                  <div style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".12em", color: T.muted }}>{a.k}</div>
                  <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 18, marginTop: 4, lineHeight: 1 }}>{a.v}</div>
                  <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: a.ok ? resAcc : T.muted }}>{a.ok ? "✓ alinha" : "✕ destoa"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.muted, margin: "22px 0 4px" }}>{rankingLabel}</div>
        <div style={{ border: `1px solid ${T.line}` }}>
          {rank.map((r, i) => {
            const mine = r.key === st.season;
            return (
              <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderBottom: `1px solid ${T.line}`, background: mine ? T.seasonInk + "12" : "transparent" }}>
                <span style={{ fontFamily: fm, fontSize: 10, color: T.muted }}>{("0" + (i + 1)).slice(-2)}</span>
                <span style={{ lineHeight: 0 }}><IconEl main={r.rawMain as any} mod={META[r.key].mod} px={20} color={r.accent} /></span>
                <div style={{ flex: 1, minWidth: 0, fontFamily: fd, fontStyle: "italic", fontSize: 17, color: mine ? T.seasonInk : T.ink }}>{r.label}</div>
                <div style={{ height: 4, width: 64, background: T.line, flexShrink: 0 }}><div style={{ height: 4, width: r.score + "%", background: mine ? T.seasonInk : r.accent }} /></div>
                <span style={{ fontFamily: fm, fontSize: 14, color: mine ? T.seasonInk : T.muted, fontWeight: 700, letterSpacing: ".02em" }}>{r.score}</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.muted, margin: "22px 0 8px" }}>PARECIDOS PARA VOCÊ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {similars.map((s) => <ProductCard key={s.id} product={s} score={scoreOf(s, T)} locked={noSeason} theme={ct} onOpen={() => actions.openProductFn(s.id)} />)}
        </div>
      </div>
    </div>
  );
}

// ── Cartela view ────────────────────────────────────────────────────────────────
function CartelaView({ st, T, fd, fm, seasonLabel, onBack, onSwap, headerIcon }: any) {
  const s = SEASON_BY_KEY[st.season];
  const m = META[st.season];
  const info = SEASON_INFO[st.season] || { desc: "", more: [] };
  const pillStyle: React.CSSProperties = { fontFamily: fm, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", color: T.muted, border: `1px solid ${T.line}`, padding: "5px 9px" };
  return (
    <div>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.line}` }}>
        <span onClick={onBack} style={{ fontFamily: fm, fontSize: 10, letterSpacing: ".12em", color: T.muted, cursor: "pointer" }}>← VOLTAR</span>
      </div>
      <div style={{ padding: "24px 16px 30px" }}>
        <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".16em", color: T.muted }}>SUA CARTELA</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <span style={{ lineHeight: 0 }}><SeasonIconEl seasonKey={st.season} px={30} color={T.seasonInk} /></span>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 33, lineHeight: 0.98, letterSpacing: "-.01em", textWrap: "pretty" }}>{seasonLabel}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 15 }}>
          {[m.t, m.v, m.i].map((pl, i) => <span key={i} style={pillStyle}>{pl}</span>)}
        </div>
        <p style={{ fontFamily: fm, fontSize: 14, lineHeight: 1.6, color: T.ink, margin: "16px 0 0", textWrap: "pretty" }}>{info.desc}</p>
        <div style={{ marginTop: 12 }}>
          {info.more.map((para, i) => <p key={i} style={{ fontFamily: fm, fontSize: 13, lineHeight: 1.55, color: T.muted, margin: "0 0 10px" }}>{para}</p>)}
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ lineHeight: 0 }}>{headerIcon}</span>
            <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.muted }}>SUA PALETA PESSOAL · 4 TONS-CHAVE</span>
          </div>
          <div style={{ display: "flex", height: 64, border: `1px solid ${T.line}`, marginTop: 11 }}>
            {s.swatches.map((c: string, i: number) => <span key={i} style={{ background: c, flex: 1, height: "100%" }} />)}
          </div>
          <div style={{ display: "flex", marginTop: 8 }}>
            {s.swatches.map((c: string, i: number) => <span key={i} style={{ flex: 1, fontFamily: fm, fontSize: 9, letterSpacing: ".04em", color: T.muted, textAlign: "center" }}>{c.toUpperCase()}</span>)}
          </div>
        </div>
        <div style={{ marginTop: 34, textAlign: "center" }}>
          <span onClick={onSwap} style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".14em", color: T.faint, cursor: "pointer", borderBottom: `1px solid ${T.line}`, paddingBottom: 2 }}>TROCAR DE CARTELA ↺</span>
        </div>
      </div>
    </div>
  );
}

// ── Account ─────────────────────────────────────────────────────────────────────
function Account({ st, T, fd, fm, seasonLabel, actions, headerIcon }: any) {
  const profile = {
    name: (st.authName || "").trim() || "Marina Alves",
    email: (st.authEmail || "").trim() || "marina.alves@email.com",
    phone: (st.authPhone || "").trim() || "(11) 99832-4471",
    plan: "Tez · plano gratuito",
  };
  const accountRows = [
    { k: "NOME", v: profile.name },
    { k: "E-MAIL", v: profile.email },
    { k: "TELEFONE", v: profile.phone },
    { k: "ASSINATURA", v: profile.plan },
  ];
  const offTrack = mix(T.line, T.ink, 0.3);
  const track = (on: boolean): React.CSSProperties => ({ width: 46, height: 26, borderRadius: 30, border: "none", padding: 0, position: "relative", cursor: "pointer", flexShrink: 0, background: on ? T.ink : offTrack, transition: "background .18s ease" });
  const knob = (on: boolean): React.CSSProperties => ({ position: "absolute", top: 3, left: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.08)", transition: "transform .18s ease", transform: on ? "translateX(20px)" : "none" });
  const notifDefs = [{ id: "curadoria", label: "curadoria semanal", desc: "A edição de sexta com resenhas e produtos para a sua cartela." }];
  const supportRows = ["Privacidade", "Termos de uso", "Central de ajuda"];
  const contaCartelaLabel = st.season ? seasonLabel : "escolher cartela";
  const contaCartelaTap = () => (st.season ? actions.openCartelaFn() : actions.goToPick());

  return (
    <div>
      <div style={{ padding: "24px 16px 20px", borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", gap: 15 }}>
        <div style={{ width: 66, height: 66, border: `1px solid ${T.line}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FanSymbol size={48} tone="mono" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".16em", color: T.muted }}>SUA CONTA</div>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 27, lineHeight: 1, marginTop: 5, letterSpacing: "-.01em", textWrap: "pretty" }}>{profile.name}</div>
          <div style={{ fontFamily: fm, fontSize: 12, color: T.muted, marginTop: 4 }}>{profile.email}</div>
        </div>
      </div>

      <div onClick={contaCartelaTap} style={{ margin: "18px 16px 4px", border: `1px solid ${T.line}`, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        {st.season && <span style={{ lineHeight: 0 }}>{headerIcon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".14em", color: T.muted }}>SUA CARTELA</div>
          <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 19, lineHeight: 1.05, color: T.seasonInk, marginTop: 3, textWrap: "pretty" }}>{contaCartelaLabel}</div>
        </div>
        <span style={{ fontFamily: fm, fontSize: 15, color: T.accent }}>›</span>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".16em", color: T.muted }}>DADOS PESSOAIS</div>
        <div style={{ marginTop: 6, borderTop: `1px solid ${T.line}` }}>
          {accountRows.map((r) => (
            <div key={r.k} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "13px 0", borderBottom: `1px solid ${T.line}` }}>
              <span style={{ fontFamily: fm, fontSize: 8.5, letterSpacing: ".12em", color: T.muted, width: 78, flexShrink: 0 }}>{r.k}</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: fm, fontSize: 14, color: T.ink, textWrap: "pretty" }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button variant="text" onClick={() => {}}>editar dados →</Button>
        </div>
      </div>

      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ fontFamily: fm, fontSize: 9.5, letterSpacing: ".16em", color: T.muted }}>NOTIFICAÇÕES</div>
        <div style={{ marginTop: 12, borderTop: `1px solid ${T.line}` }}>
          {notifDefs.map((n) => {
            const on = !!st.notif[n.id];
            return (
              <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 0", borderBottom: `1px solid ${T.line}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: fd, fontStyle: "italic", fontSize: 17, lineHeight: 1.1, color: T.ink, textWrap: "pretty" }}>{n.label}</div>
                  <div style={{ fontFamily: fm, fontSize: 11.5, color: T.muted, marginTop: 3, lineHeight: 1.4, textWrap: "pretty" }}>{n.desc}</div>
                </div>
                <button onClick={() => actions.toggleNotif(n.id)} aria-pressed={on} style={track(on)}><span style={knob(on)} /></button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "24px 16px 40px" }}>
        <div style={{ borderTop: `1px solid ${T.line}` }}>
          {supportRows.map((r) => (
            <div key={r} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${T.line}`, cursor: "pointer" }}>
              <span style={{ flex: 1, minWidth: 0, fontFamily: fm, fontSize: 13.5, color: T.ink }}>{r}</span>
              <span style={{ fontFamily: fm, fontSize: 13, color: T.faint }}>›</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
          <Button variant="text" onClick={actions.logout}>sair da conta ↦</Button>
        </div>
        <div style={{ textAlign: "center", marginTop: 18, fontFamily: fm, fontSize: 9, letterSpacing: ".14em", color: T.faint }}>TEZ · COLORAÇÃO PESSOAL · V1.0</div>
      </div>
    </div>
  );
}
