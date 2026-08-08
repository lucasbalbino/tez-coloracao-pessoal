// Tez — data model, ported from the Claude Design prototype (Tez.dc.html).
// Two color worlds: INSTITUTIONAL (chrome, constant) vs SEASONAL (product,
// dresses user content only). See the design-system readme for the full rule.

export type FamilyKey = "primavera" | "verao" | "outono" | "inverno";

export interface Season {
  key: string;
  label: string;
  main: FamilyKey;
  famInk: string; // family label ink (--season-*)
  accent: string;
  hue: number;
  warm: boolean;
  depth: number;
  swatches: string[];
  blurb: string;
}

export interface Product {
  id: string;
  category: string;
  brand: string;
  line: string;
  name: string;
  shade: string;
  hue: number;
  warm: boolean;
  depth: number;
}

export interface Post {
  id: string;
  date: string;
  kind: string;
  title: string;
  dek: string;
  read: string;
  pids: string[];
}

// Institutional (chrome) tokens — constant, never seasonal.
export const INST = {
  bg: "#e9e7e2",
  surface: "#fcfaf6",
  sunken: "#f6f1e9",
  ink: "#1b1a18",
  muted: "#6f6a62",
  faint: "#a59e90",
  line: "#e6e0d6",
  accent: "#b884a0",
  fontDisplay: "'Bodoni Moda', Georgia, serif",
};

export const FONT_MONO = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const FONT_DISPLAY = "'Bodoni Moda', Georgia, serif";
export const FONT_EDITORIAL = "'Cormorant Garamond', Georgia, serif";

export const MAIN_LABEL: Record<FamilyKey, string> = {
  inverno: "INVERNO",
  verao: "VERÃO",
  outono: "OUTONO",
  primavera: "PRIMAVERA",
};

export const FAM_ACCENT: Record<FamilyKey, string> = {
  primavera: "#a98a63",
  verao: "#9a7f93",
  outono: "#9a6e44",
  inverno: "#6a7280",
};

export const VAR_FEM: Record<string, string> = {
  claro: "Clara",
  suave: "Suave",
  puro: "Pura",
  profundo: "Profunda",
  brilhante: "Brilhante",
};

// SEASONAL (product) colors — dress user content only.
export const SEASONS: Season[] = [
  { key: "inv-bri", label: "inverno brilhante", main: "inverno", famInk: "#6a7280", accent: "#b11e3c", hue: 330, warm: false, depth: 0.5, swatches: ["#b11e3c", "#2e73a6", "#1f8a6d", "#e0e3ea"], blurb: "Contraste alto, frio e límpido." },
  { key: "inv-pur", label: "inverno frio", main: "inverno", famInk: "#6a7280", accent: "#2e73a6", hue: 350, warm: false, depth: 0.6, swatches: ["#2e73a6", "#3a6e8a", "#6f86b0", "#c7cbd6"], blurb: "Frio puro, vermelho e azul reais." },
  { key: "inv-pro", label: "inverno profundo", main: "inverno", famInk: "#6a7280", accent: "#1c2a3a", hue: 340, warm: false, depth: 0.85, swatches: ["#14161c", "#3a1f2c", "#1c2a3a", "#c7cbd6"], blurb: "Escuro, frio e intenso." },
  { key: "ver-cla", label: "verão claro", main: "verao", famInk: "#9a7f93", accent: "#d8bccb", hue: 330, warm: false, depth: 0.25, swatches: ["#e7d4dd", "#d8bccb", "#cdd3e6", "#cfe0df"], blurb: "Frio, claro e suave." },
  { key: "ver-pur", label: "verão frio", main: "verao", famInk: "#9a7f93", accent: "#b884a0", hue: 320, warm: false, depth: 0.4, swatches: ["#b884a0", "#8fa2c0", "#7f9fb8", "#a9c0c4"], blurb: "Frio, médio e elegante." },
  { key: "ver-sua", label: "verão suave", main: "verao", famInk: "#9a7f93", accent: "#c4a9b6", hue: 350, warm: false, depth: 0.35, swatches: ["#c4a9b6", "#a8acc0", "#9cb7b8", "#c3cdd2"], blurb: "Frio, acinzentado e discreto." },
  { key: "out-sua", label: "outono suave", main: "outono", famInk: "#9a6e44", accent: "#c79a6b", hue: 25, warm: true, depth: 0.4, swatches: ["#c79a6b", "#a98a52", "#8a8a55", "#b08a6a"], blurb: "Quente, médio e empoeirado." },
  { key: "out-pur", label: "outono quente", main: "outono", famInk: "#9a6e44", accent: "#c8763f", hue: 20, warm: true, depth: 0.55, swatches: ["#c8763f", "#9a7b3c", "#7c7a3e", "#a8492e"], blurb: "Quente puro, terroso e rico." },
  { key: "out-pro", label: "outono profundo", main: "outono", famInk: "#9a6e44", accent: "#8a4a28", hue: 30, warm: true, depth: 0.8, swatches: ["#8a4a28", "#6f5a24", "#55552c", "#7a2f22"], blurb: "Quente, escuro e denso." },
  { key: "pri-cla", label: "primavera clara", main: "primavera", famInk: "#a98a63", accent: "#f4c79c", hue: 14, warm: true, depth: 0.25, swatches: ["#f7ddc0", "#f4c79c", "#f0d98a", "#cdd98f"], blurb: "Quente, claro e fresco." },
  { key: "pri-pur", label: "primavera quente", main: "primavera", famInk: "#a98a63", accent: "#e89a55", hue: 30, warm: true, depth: 0.35, swatches: ["#e89a55", "#d9a441", "#d9c264", "#9cbf6e"], blurb: "Quente puro, vivo e radiante." },
  { key: "pri-bri", label: "primavera brilhante", main: "primavera", famInk: "#a98a63", accent: "#e8b53e", hue: 348, warm: true, depth: 0.4, swatches: ["#f2a65a", "#e8b53e", "#c6cf5a", "#7fc06a"], blurb: "Quente, vívido e brilhante." },
];

export const SEASON_BY_KEY: Record<string, Season> = Object.fromEntries(
  SEASONS.map((s) => [s.key, s]),
);

export const PRODUCTS: Product[] = [
  { id: "p1", category: "BATOM · MATTE", brand: "Maison Generic", line: "Velour", name: "Batom matte vinho", shade: "#7a0f2e", hue: 345, warm: false, depth: 0.8 },
  { id: "p2", category: "BATOM · CREMOSO", brand: "Atelier No.4", line: "Satin", name: "Batom coral cremoso", shade: "#ff7a5c", hue: 14, warm: true, depth: 0.3 },
  { id: "p3", category: "BASE · FLUIDA", brand: "Studio Mute", line: "Seconde Peau", name: "Base bege neutro", shade: "#d8a878", hue: 30, warm: true, depth: 0.5 },
  { id: "p4", category: "BLUSH · PÓ", brand: "Maison Generic", line: "Flou", name: "Blush rosa frio", shade: "#c98aa6", hue: 330, warm: false, depth: 0.3 },
  { id: "p5", category: "SOMBRA · CINTILANTE", brand: "Atelier No.4", line: "Prisme", name: "Sombra ametista", shade: "#7b2ff2", hue: 270, warm: false, depth: 0.6 },
  { id: "p6", category: "GLOSS · BRILHO", brand: "Studio Mute", line: "Verre", name: "Gloss nude rosado", shade: "#d99b8a", hue: 18, warm: true, depth: 0.25 },
  { id: "p7", category: "DELINEADOR · LÍQUIDO", brand: "Noir Generic", line: "Trait", name: "Delineador preto azulado", shade: "#0e1a3a", hue: 230, warm: false, depth: 0.9 },
  { id: "p8", category: "BATOM · MATTE", brand: "Atelier No.4", line: "Velour", name: "Batom terracota", shade: "#b5561e", hue: 20, warm: true, depth: 0.55 },
  { id: "p9", category: "ILUMINADOR · PÓ", brand: "Maison Generic", line: "Halo", name: "Iluminador champanhe", shade: "#e6c88a", hue: 42, warm: true, depth: 0.2 },
  { id: "p10", category: "SOMBRA · MATTE", brand: "Studio Mute", line: "Terre", name: "Sombra oliva", shade: "#6e7d2e", hue: 75, warm: true, depth: 0.5 },
  { id: "p11", category: "BATOM · CREMOSO", brand: "Noir Generic", line: "Satin", name: "Batom pink frio", shade: "#e10a7d", hue: 330, warm: false, depth: 0.45 },
  { id: "p12", category: "BLUSH · CREME", brand: "Atelier No.4", line: "Flou", name: "Blush pêssego", shade: "#ff9f7a", hue: 20, warm: true, depth: 0.25 },
];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export const BRAND_INFO: Record<string, string> = {
  "Maison Generic": "Casa francesa de alta perfumaria que estende seu savoir-faire à maquiagem de acabamento couture.",
  "Atelier No.4": "Marca de autor com produção em pequenos lotes e foco em texturas second-skin.",
  "Studio Mute": "Beauty lab minimalista — fórmulas clean, embalagens recarregáveis e paleta sóbria.",
  "Noir Generic": "Linha-conceito de alto contraste, pensada para peles que pedem cor saturada e definição.",
};

export const PROD_DESC: Record<string, string> = {
  p1: "Batom de textura matte aveludada e cobertura total em um só gesto. O vinho profundo carrega fundo azulado, que realça dentes e ilumina peles de subtom frio.",
  p2: "Bastão cremoso de brilho acetinado e deslize confortável. O coral aquecido traz vivacidade imediata, ideal para um look fresco de dia.",
  p3: "Base fluida de média cobertura e acabamento natural. O bege neutro equilibra subtons sem puxar para rosa nem amarelo.",
  p4: "Blush em pó sedoso, pigmentação construível. O rosa frio simula o rubor natural de peles claras e médias-frias.",
  p5: "Sombra de partícula cintilante e fixação alta. A ametista esfria o olhar e adiciona brilho sem cair.",
  p6: "Gloss de brilho espelhado, sensação não pegajosa. O nude rosado dá volume com leveza sobre qualquer batom.",
  p7: "Delineador líquido de ponta fina e secagem rápida. O preto azulado intensifica o contorno em vez do preto puro.",
  p8: "Batom matte de pigmento terroso e conforto prolongado. A terracota quente assina os looks de outono.",
  p9: "Iluminador em pó de reflexo champanhe e textura fina. Realça a maçã do rosto com glow quente e discreto.",
  p10: "Sombra matte de cor densa e esfumado fácil. A oliva quente traz um neutro inesperado e sofisticado.",
  p11: "Batom cremoso de alta saturação e brilho leve. O pink frio acende peles de inverno num gesto.",
  p12: "Blush em creme de acabamento dewy. O pêssego quente devolve viço com aparência de pele real.",
};

export const POSTS: Post[] = [
  { id: "e1", date: "19 JUN 2026", kind: "REVIEW", title: "a linha Velour, decifrada", dek: "Seis batons matte sob a lente da coloração pessoal — os quentes, os frios e os que enganam.", read: "6 MIN", pids: ["p1", "p8", "p11"] },
  { id: "e2", date: "12 JUN 2026", kind: "RESENHA", title: "o mito do nude universal", dek: 'Por que o "nude que serve em todo mundo" não existe — e o que olhar no subtom.', read: "4 MIN", pids: ["p6", "p3", "p12"] },
  { id: "e3", date: "05 JUN 2026", kind: "REVIEW", title: "cintilantes para invernos", dek: "Sombras que brilham sem amarelar a pele fria.", read: "5 MIN", pids: ["p5", "p7", "p9"] },
  { id: "e4", date: "29 MAI 2026", kind: "RESENHA", title: "terracota é para todas?", dek: "A cor-assinatura do outono, testada nas doze estações.", read: "5 MIN", pids: ["p8", "p10", "p2"] },
];

export interface SeasonMeta {
  mod: string;
  t: string;
  v: string;
  i: string;
}

export const META: Record<string, SeasonMeta> = {
  "inv-bri": { mod: "brilhante", t: "Fria-neutra", v: "Média", i: "Brilhante" },
  "inv-pur": { mod: "puro", t: "Fria", v: "Média", i: "Viva" },
  "inv-pro": { mod: "profundo", t: "Fria", v: "Escura", i: "Contraste" },
  "ver-cla": { mod: "claro", t: "Fria", v: "Clara", i: "Suave" },
  "ver-pur": { mod: "puro", t: "Fria", v: "Média", i: "Suave" },
  "ver-sua": { mod: "suave", t: "Fria-neutra", v: "Média", i: "Muito suave" },
  "out-sua": { mod: "suave", t: "Quente-neutra", v: "Média", i: "Muito suave" },
  "out-pur": { mod: "puro", t: "Quente", v: "Média", i: "Rica" },
  "out-pro": { mod: "profundo", t: "Quente", v: "Escura", i: "Rica" },
  "pri-cla": { mod: "claro", t: "Quente", v: "Clara", i: "Suave" },
  "pri-pur": { mod: "puro", t: "Quente", v: "Média", i: "Viva" },
  "pri-bri": { mod: "brilhante", t: "Quente-neutra", v: "Média", i: "Brilhante" },
};

export interface WheelFam {
  main: FamilyKey;
  keys: string[];
}

export const WHEEL_FAMS: WheelFam[] = [
  { main: "primavera", keys: ["pri-bri", "pri-pur", "pri-cla"] },
  { main: "verao", keys: ["ver-cla", "ver-pur", "ver-sua"] },
  { main: "outono", keys: ["out-sua", "out-pur", "out-pro"] },
  { main: "inverno", keys: ["inv-pro", "inv-pur", "inv-bri"] },
];

export const SEASON_INFO: Record<string, { desc: string; more: string[] }> = {
  "inv-bri": { desc: "O inverno mais vibrante. Sua pele de subtom frio pede cores límpidas e saturadas, em alto contraste — como o rubi, o pino e o azul-safira, que acendem o seu rosto num instante.", more: ["Prefira cores frias e nítidas, com boa distância entre o claro e o escuro. O contraste é a sua assinatura.", "Evite tons terrosos, empoeirados ou amarelados: eles abafam o brilho que é naturalmente seu."] },
  "inv-pur": { desc: "O frio em estado puro. Vermelhos e azuis reais, sem qualquer traço de calor — a sua pele responde à pureza da cor, não ao excesso de intensidade.", more: ["Prefira tons frios e saturados, do branco puro ao preto real.", "Evite alaranjados, dourados e beges quentes, que puxam a sua pele para o cansaço."] },
  "inv-pro": { desc: "Escuro, frio e intenso. Cores profundas de temperatura fria — vinho, marinho, esmeralda — emolduram o contraste que já existe em você.", more: ["Prefira profundidade e frieza; o alto contraste favorece o seu olhar.", "Evite pastéis lavados e tons quentes e claros, que somem diante da sua intensidade."] },
  "ver-cla": { desc: "Frio, claro e delicado. A sua paleta vive nos tons suaves e arejados, com a leveza de um céu de fim de tarde.", more: ["Prefira cores frias, claras e de baixo contraste, sempre suaves.", "Evite tons escuros, quentes ou muito saturados, que endurecem os seus traços."] },
  "ver-pur": { desc: "Frio, médio e elegante. Rosas empoeirados, azuis serenos e malvas discretos conversam com a suavidade da sua pele.", more: ["Prefira tons frios e médios, com acabamento sempre esbatido.", "Evite o calor e os contrastes fortes, que competem com a sua serenidade."] },
  "ver-sua": { desc: "Frio e levemente acinzentado, de contraste muito baixo. A delicadeza esbatida é a sua marca — nada grita, tudo harmoniza.", more: ["Prefira tons neutros, frios e suaves, próximos entre si.", "Evite cores vivas e contrastes marcados, que quebram a sua discrição."] },
  "out-sua": { desc: "Quente e empoeirado, de contraste baixo. Tons médios e terrosos, com uma calidez discreta que aquece sem pesar.", more: ["Prefira quentes suaves e neutros, de aparência natural.", "Evite frios gélidos e cores muito vivas, que apagam o seu viço morno."] },
  "out-pur": { desc: "O calor em estado puro: terroso, rico e radiante. Ferrugem, mostarda e verde-oliva são a sua casa e trazem vida imediata à pele.", more: ["Prefira tons quentes, ricos e saturados, com alma de outono.", "Evite frios e pastéis lavados, que deixam a sua pele sem energia."] },
  "out-pro": { desc: "Quente, escuro e denso. A profundidade da terra em cores como chocolate, musgo e telha, que dão gravidade ao seu rosto.", more: ["Prefira quentes profundos e encorpados.", "Evite tons claros, frios e leves, que não sustentam a sua intensidade."] },
  "pri-cla": { desc: "Quente, clara e fresca. A sua paleta tem a leveza de um jardim ao amanhecer — luminosa, viva e sem peso.", more: ["Prefira quentes claros e frescos, cheios de luz.", "Evite escuros pesados e frios acinzentados, que embaçam o seu frescor."] },
  "pri-pur": { desc: "O calor vivo e radiante da primavera. Coral, pêssego e verde-folha devolvem viço ao rosto num único gesto.", more: ["Prefira quentes vivos e luminosos, de alta energia.", "Evite frios e tons apagados, que roubam a sua vivacidade."] },
  "pri-bri": { desc: "Quente, vívido e brilhante. Cores límpidas e cheias de luz, com um toque de contraste que faz o seu rosto reluzir.", more: ["Prefira quentes brilhantes e nítidos.", "Evite tons empoeirados e frios escuros, que abafam a sua clareza."] },
};

export function varName(key: string): string {
  return VAR_FEM[META[key].mod] || META[key].mod;
}
