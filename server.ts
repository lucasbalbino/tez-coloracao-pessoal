import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY process.env key is not set. Dynamic analysis will fall back to smart local matching.");
}

// Preloaded Catalog of popular cosmetics for fast local matching and fallback
// (Both Brazilian and International favorites popular in Brazilian seasonal analysis)
const LOCAL_CATALOG = [
  {
    id: "prod_1",
    name: "Batom Matte Ruby Woo",
    brand: "MAC Cosmetics",
    type: "Batom Matte",
    barcode: "773602120011",
    primarySeason: "inverno_frio",
    compatibleSeasons: ["inverno_frio", "inverno_brilhante", "inverno_escuro"],
    colors: ["#C41E3A"],
    description: "Vermelho azulado ultra-mate vibrante. Possui alta saturação e temperatura puramente fria.",
    parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" }
  },
  {
    id: "prod_2",
    name: "Blush Orgasm",
    brand: "NARS",
    type: "Blush Compacto",
    barcode: "607845040132",
    primarySeason: "primavera_clara",
    compatibleSeasons: ["primavera_clara", "primavera_quente", "outono_suave"],
    colors: ["#F3A297", "#DF7A6E"],
    description: "Rosa pêssego iluminado com partículas de brilho dourado. Perfeito para peles quentes e radiantes de Primavera.",
    parameters: { temp: "Quente", intensity: "Brilhante/Radiante", depth: "Clara" }
  },
  {
    id: "prod_3",
    name: "Batom Liquido Bruna",
    brand: "Linha Bruna Tavares",
    type: "Batom Líquido",
    barcode: "7898588523001",
    primarySeason: "inverno_brilhante",
    compatibleSeasons: ["inverno_brilhante", "inverno_frio", "primavera_brilhante"],
    colors: ["#D21F3C"],
    description: "Vermelho vivo puríssimo e opaco, com subtons azulados e alta definição de contraste.",
    parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" }
  },
  {
    id: "prod_4",
    name: "Base Fit Me 120 Claro Cálido",
    brand: "Maybelline NY",
    type: "Base Facial",
    barcode: "041554533431",
    primarySeason: "primavera_quente",
    compatibleSeasons: ["primavera_quente", "primavera_clara", "outono_quente"],
    colors: ["#F3D0B5"],
    description: "Base fluida mate com fundo levemente amarelado/pêssego, ideal para peles com subtom quente.",
    parameters: { temp: "Quente", intensity: "Suave", depth: "Clara" }
  },
  {
    id: "prod_5",
    name: "Batom Líquido Niina Secrets Mate Hermione",
    brand: "Eudora / Niina Secrets",
    type: "Batom Líquido",
    barcode: "7891033481231",
    primarySeason: "outono_suave",
    compatibleSeasons: ["outono_suave", "verao_suave", "outono_quente"],
    colors: ["#B38B82"],
    description: "Malva acinzentado terroso sutil, com fundo quente suave. Ideal para cartelas de baixa saturação.",
    parameters: { temp: "Neutra-Quente", intensity: "Macia/Suave", depth: "Média-Escura" }
  },
  {
    id: "prod_6",
    name: "Gloss Volumão Copacabana",
    brand: "Quem Disse, Berenice?",
    type: "Gloss Labial",
    barcode: "7891034010502",
    primarySeason: "primavera_clara",
    compatibleSeasons: ["primavera_clara", "verao_claro", "primavera_quente"],
    colors: ["#FFA39E"],
    description: "Tom pêssego translúcido com microesferas de brilho delicado, realça peles claras e luminosas.",
    parameters: { temp: "Neutra-Quente", intensity: "Brilhante", depth: "Clara" }
  },
  {
    id: "prod_7",
    name: "Contorno Facial Stick Taupe",
    brand: "Mari Maria Makeup",
    type: "Contorno Stick",
    barcode: "7898651811228",
    primarySeason: "verao_suave",
    compatibleSeasons: ["verao_suave", "outono_suave", "verao_frio"],
    colors: ["#C2B2A3"],
    description: "Marrom acinzentado de tom frio e opaco. Fantástico para criar sombras naturais sem amarelar.",
    parameters: { temp: "Fria", intensity: "Suave", depth: "Média" }
  },
  {
    id: "prod_8",
    name: "Sombra Cremosa Paint Pot Groundwork",
    brand: "MAC Cosmetics",
    type: "Sombra de Olhos",
    barcode: "773602196621",
    primarySeason: "outono_suave",
    compatibleSeasons: ["outono_suave", "outono_quente", "outono_escuro"],
    colors: ["#8B7E74"],
    description: "Taupe neutro opaco e macio de profundidade média. Um clássico elegante de calmaria terrosa.",
    parameters: { temp: "Neutra-Quente", intensity: "Suave", depth: "Média" }
  },
  {
    id: "prod_9",
    name: "Blush Stick Peach",
    brand: "Bruna Tavares",
    type: "Blush Stick",
    barcode: "7898588529997",
    primarySeason: "primavera_quente",
    compatibleSeasons: ["primavera_quente", "primavera_clara", "outono_quente"],
    colors: ["#FFA07A"],
    description: "Rosa pêssego solar acolhedor com toque avelulado, harmoniza lindamente com peles vivas e ricas.",
    parameters: { temp: "Quente", intensity: "Brilhante", depth: "Média" }
  },
  {
    id: "prod_10",
    name: "Batom Mate Velvet Velvet Teddy",
    brand: "MAC Cosmetics",
    type: "Batom Mate",
    barcode: "773602334814",
    primarySeason: "outono_quente",
    compatibleSeasons: ["outono_quente", "outono_suave", "primavera_quente"],
    colors: ["#C4977E"],
    description: "Nude bege clássico, sutilmente quente e aveludado. Enquadra-se majestosamente em peles douradas.",
    parameters: { temp: "Quente", intensity: "Suave", depth: "Média" }
  },
  {
    id: "prod_11",
    name: "Batom Líquido Mate Diva",
    brand: "MAC Cosmetics",
    type: "Batom Mate",
    barcode: "773602120158",
    primarySeason: "inverno_escuro",
    compatibleSeasons: ["inverno_escuro", "outono_escuro", "inverno_frio"],
    colors: ["#5C1324"],
    description: "Burgundy escuro e dramático. Subtons vinhos frios de profunda sofisticação.",
    parameters: { temp: "Fria", intensity: "Suave", depth: "Escura" }
  },
  {
    id: "prod_12",
    name: "Lápis de Boca Boldly Bare",
    brand: "MAC Cosmetics",
    type: "Lápis Labial",
    barcode: "773602058420",
    primarySeason: "outono_suave",
    compatibleSeasons: ["outono_suave", "primavera_clara", "outono_quente"],
    colors: ["#E29B7F"],
    description: "Nude pêssego acastanhado levemente rosado, sutilmente quente e extremamente maleável.",
    parameters: { temp: "Neutra-Quente", intensity: "Suave", depth: "Média" }
  },
  {
    id: "prod_13",
    name: "Batom Super Stay Vinil Ink Coy",
    brand: "Maybelline NY",
    type: "Batom Líquido",
    barcode: "041554085428",
    primarySeason: "verao_claro",
    compatibleSeasons: ["verao_claro", "verao_suave", "verao_frio"],
    colors: ["#D48C9E"],
    description: "Rosa malva delicado de brilho vinilizado. Perfeito para realçar a luminosidade fresca e suave de peles de Verão.",
    parameters: { temp: "Fria", intensity: "Brilhante", depth: "Clara" }
  },
  {
    id: "prod_14",
    name: "Blush Líquido Soft Pinch Happy",
    brand: "Rare Beauty",
    type: "Blush Líquido",
    barcode: "840122302401",
    primarySeason: "verao_frio",
    compatibleSeasons: ["verao_frio", "verao_claro", "inverno_frio"],
    colors: ["#FA7FA5"],
    description: "Rosa Orquídea orvalhado de alta pigmentação, trazendo frescor com subtons puramente frios.",
    parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" }
  },
  {
    id: "prod_15",
    name: "Iluminador BT Shimmer Gold",
    brand: "Bruna Tavares",
    type: "Iluminador Compacto",
    barcode: "7898588523995",
    primarySeason: "primavera_quente",
    compatibleSeasons: ["primavera_quente", "primavera_brilhante", "outono_quente"],
    colors: ["#F0D59E"],
    description: "Pó iluminador ultra-fino com brilho dourado champagne cintilante e quente.",
    parameters: { temp: "Quente", intensity: "Brilhante", depth: "Clara" }
  },
  {
    id: "prod_16",
    name: "Gloss Glossy Lips Chocochilli",
    brand: "Fran by Renata Meins",
    type: "Gloss Labial",
    barcode: "7898651813451",
    primarySeason: "outono_escuro",
    compatibleSeasons: ["outono_escuro", "outono_quente", "inverno_escuro"],
    colors: ["#6F453B"],
    description: "Gloss marrom chocolate translúcido e encorpado com efeito plump térmico.",
    parameters: { temp: "Quente", intensity: "Brilhante/Suave", depth: "Escura" }
  },
  {
    id: "prod_17",
    name: "Lip Oil Gloss Juicy Guava",
    brand: "Ruby Rose",
    type: "Gloss Labial",
    barcode: "7898501239999",
    primarySeason: "primavera_clara",
    compatibleSeasons: ["primavera_clara", "verao_claro", "primavera_quente"],
    colors: ["#FF8E8B"],
    description: "Óleo labial translúcido rosado pêssego, altamente nutritivo, com nuances suaves e quentes.",
    parameters: { temp: "Neutra-Quente", intensity: "Radiante", depth: "Clara" }
  },
  {
    id: "prod_18",
    name: "Batom Cremoso Boca Rosa Nude",
    brand: "Payot / Boca Rosa",
    type: "Batom Matte",
    barcode: "7896609532414",
    primarySeason: "verao_suave",
    compatibleSeasons: ["verao_suave", "verao_frio", "outono_suave"],
    colors: ["#DCA49A"],
    description: "Nude rosado acinzentado opaco e macio de tom médio-claro, maravilhoso para Verão Suave.",
    parameters: { temp: "Fria", intensity: "Suave", depth: "Clara" }
  },
  {
    id: "prod_19",
    name: "Batom Retro Matte Flat Out Fabulous",
    brand: "MAC Cosmetics",
    type: "Batom Matte",
    barcode: "773602334852",
    primarySeason: "inverno_brilhante",
    compatibleSeasons: ["inverno_brilhante", "inverno_frio", "verao_frio"],
    colors: ["#BD1278"],
    description: "Uva pink ultra-matte super saturado, perfeito para criar contrastes radiantes nas estações vibrantes.",
    parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" }
  },
  {
    id: "prod_20",
    name: "Pó Bronzeador Make B. Bahia",
    brand: "O Boticário",
    type: "Bronzer",
    barcode: "7891033481414",
    primarySeason: "outono_quente",
    compatibleSeasons: ["outono_quente", "outono_escuro", "primavera_quente"],
    colors: ["#A0522D"],
    description: "Pó compacto terracota dourado ultra-fino, ideal para aquecer peles neutro-quentes e quentes.",
    parameters: { temp: "Quente", intensity: "Suave", depth: "Média" }
  }
];

// Helper to normalize strings for rough local matching
const normalizeStr = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Endpoint to analyze makeup product compatibility
app.post("/api/analyze-product", async (req, res) => {
  try {
    const { productName, brand, barcode, userPalette } = req.body;

    if (!productName && !barcode) {
      return res.status(400).json({ error: "Insira ao menos o nome do produto ou código de barras." });
    }

    // 1. Try local catalog first (or exact match by barcode or partial text name match)
    let foundLocal = null;
    if (barcode) {
      foundLocal = LOCAL_CATALOG.find(p => p.barcode === barcode.trim());
    }
    if (!foundLocal && productName) {
      const normQuery = normalizeStr(productName);
      const normBrand = brand ? normalizeStr(brand) : "";
      
      foundLocal = LOCAL_CATALOG.find(p => {
        const normName = normalizeStr(p.name);
        const normItemBrand = normalizeStr(p.brand);
        return (normName.includes(normQuery) && (normBrand === "" || normItemBrand.includes(normBrand))) ||
               (normQuery.includes(normName)) || 
               (normName.includes(normQuery));
      });
    }

    if (foundLocal) {
      // Local match response - fast and consistent
      const compatibleList = foundLocal.compatibleSeasons;
      const isCompat = userPalette ? compatibleList.includes(userPalette) : false;
      const compatibilityScore = isCompat 
        ? (foundLocal.primarySeason === userPalette ? "Excelente" : "Boa Coerência") 
        : "Pouca Afinidade";

      return res.json({
        source: "local_database",
        name: foundLocal.name,
        brand: foundLocal.brand,
        barcode: foundLocal.barcode,
        primarySeason: foundLocal.primarySeason,
        compatibleSeasons: foundLocal.compatibleSeasons,
        colors: foundLocal.colors,
        description: foundLocal.description,
        parameters: foundLocal.parameters,
        compatibilityScore,
        aiExplanation: `O produto '${foundLocal.name}' da ${foundLocal.brand} foi encontrado em nossa base de curadoria técnica de moda. Ele exibe características de temperatura ${foundLocal.parameters.temp}, intensidade ${foundLocal.parameters.intensity} e profundidade ${foundLocal.parameters.depth}, o que o torna ideal para a cartela ${foundLocal.primarySeason.split('_').join(' ').toUpperCase()}.`
      });
    }

    // 2. If not found in local catalog, and Gemini API client is active, consult Gemini LLM for expert aesthetic and chromatics assessment!
    if (ai) {
      const prompt = `Analise a maquiagem informada sob a perspectiva do Método Sazonal Estendido de 12 estações de Coloração Pessoal.
Produto solicitado: "${productName || 'Não informado'}" da marca "${brand || 'Variadas/Famosa'}" ${barcode ? `(Código de barras: ${barcode})` : ''}.
Cartela do usuário atual: "${userPalette || 'Nenhuma selecionada (Análise geral)'}".

Por favor, analise a temperatura do produto (fria, neutra-fria, neutra-quente, quente), sua intensidade ou saturação (brilhante/acesa versus opaca/suave/macia), e sua profundidade (clara, média, escura).
Com base nessa análise cromática profunda, retorne um objeto JSON estrito com o seguinte esquema (nada mais que o JSON puro, sem markdown tags de bloco \`\`\`json):
{
  "name": "Nome formatado elegante do produto",
  "brand": "Nome formatado da marca",
  "primarySeason": "A principal das 12 estações que combina perfeitamente (use minuscula com underline, ex: verao_suave, outono_escuro, inverno_frio, primavera_clara, primavera_brilhante, outono_quente, verao_claro, etc.)",
  "compatibleSeasons": ["Array com 2 a 4 estações compatíveis de forma descendente dentre as 12"],
  "colors": ["De 1 a 2 cores Hexadecimal representativas da cor do cosmético, ex: #A1344B"],
  "description": "Explicação técnica de moda e colorimetria sobre o cosmético.",
  "parameters": {
    "temp": "Fria/Quente/Neutra-Fria/Neutra-Quente",
    "intensity": "Macia/Suave ou Brilhante/Radiante ou Opaca/Aveludada",
    "depth": "Clara/Média/Escura"
  },
  "compatibilityScore": "Excelente (se for o match perfeito com a cartela do usuário), Boa Coerência (se estiver em compatíveis), ou Pouca Afinidade (se não estiver)",
  "aiExplanation": "Breve parágrafo explicativo elegante de alta costura correlacionando o tom com a cartela do usuário."
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            temperature: 0.2, // Lower temp for more deterministic classification
            responseMimeType: "application/json",
          }
        });

        const textOutput = response.text?.trim() || "{}";
        const result = JSON.parse(textOutput);

        // Calculate custom compatibility score on server if needed based on dynamic return
        if (userPalette) {
          const isPrimary = result.primarySeason === userPalette;
          const isCompatible = result.compatibleSeasons?.includes(userPalette);
          result.compatibilityScore = isPrimary ? "Excelente" : (isCompatible ? "Boa Coerência" : "Pouca Afinidade");
        } else {
          result.compatibilityScore = "Paleta Não Informada";
        }

        return res.json({
          source: "gemini_ai",
          ...result,
          barcode: barcode || "N/A"
        });

      } catch (err: any) {
        console.error("Gemini invocation failed, falling back to smart fuzzy text matcher.", err);
        // Fallback below
      }
    }

    // 3. Fallback smart matches if Gemini fails or is unconfigured
    // We do a simple smart match based on keyword spotting: e.g. "coral", "gold", "terracota" -> Primavera/Outono; "ruby", "pink", "vinho", "silver" -> Inverno/Verão
    const lowerQuery = normalizeStr(productName || "");
    let guessedPrimary = "inverno_frio";
    let guessedCompat = ["inverno_frio", "inverno_brilhante", "verao_frio"];
    let guessedColors = ["#8B0000"];
    let guessedDesc = "Cosmético elegante analisado pela nossa central de colorimetria padrão.";
    let temp = "Fria";
    let intensity = "Macia";
    let depth = "Escura";

    if (lowerQuery.includes("coral") || lowerQuery.includes("peach") || lowerQuery.includes("pessego") || lowerQuery.includes("ouro") || lowerQuery.includes("dourado") || lowerQuery.includes("brilho") || lowerQuery.includes("nude")) {
      guessedPrimary = "primavera_clara";
      guessedCompat = ["primavera_clara", "primavera_quente", "outono_quente"];
      guessedColors = ["#FFA07A"];
      temp = "Quente";
      intensity = "Brilhante";
      depth = "Clara";
    } else if (lowerQuery.includes("terracota") || lowerQuery.includes("marrom") || lowerQuery.includes("cobre") || lowerQuery.includes("chocolate") || lowerQuery.includes("mate") || lowerQuery.includes("canela")) {
      guessedPrimary = "outono_quente";
      guessedCompat = ["outono_quente", "outono_escuro", "outono_suave"];
      guessedColors = ["#D2691E"];
      temp = "Quente";
      intensity = "Suave";
      depth = "Média";
    } else if (lowerQuery.includes("nude") || lowerQuery.includes("suave") || lowerQuery.includes("rosa") || lowerQuery.includes("gloss")) {
      guessedPrimary = "verao_suave";
      guessedCompat = ["verao_suave", "verao_claro", "outono_suave"];
      guessedColors = ["#E8C3C1"];
      temp = "Neutra-Fria";
      intensity = "Suave";
      depth = "Clara";
    }

    const isCompat = userPalette ? guessedCompat.includes(userPalette) : false;
    const compatibilityScore = isCompat 
      ? (guessedPrimary === userPalette ? "Excelente" : "Boa Coerência") 
      : "Pouca Afinidade";

    return res.json({
      source: "local_smart_fallback",
      name: productName ? productName.trim() : "Batom Elegance",
      brand: brand ? brand.trim() : "Marca Premium",
      barcode: barcode || "N/A",
      primarySeason: guessedPrimary,
      compatibleSeasons: guessedCompat,
      colors: guessedColors,
      description: guessedDesc,
      parameters: { temp, intensity, depth },
      compatibilityScore,
      aiExplanation: `Estudo calorimétrico sugeriu que este cosmético tem subtons predominantemente ${temp.toLowerCase()} e é excelente para peles de ${guessedPrimary.split('_').join(' ').toUpperCase()}.`
    });

  } catch (error: any) {
    console.error("Error in analyze endpoint:", error);
    res.status(500).json({ error: "Erro interno ao processar a análise cromática." });
  }
});

// Serve products in batch for "Produtos para você"
app.get("/api/products", (req, res) => {
  const { palette } = req.query;
  
  if (!palette) {
    // Return random products
    const shuffled = [...LOCAL_CATALOG].sort(() => 0.5 - Math.random());
    return res.json(shuffled.slice(0, 15));
  }

  // Filter based on selected palette
  const matching = LOCAL_CATALOG.filter(prod => 
    prod.primarySeason === palette || prod.compatibleSeasons.includes(palette as string)
  );

  if (matching.length === 0) {
    const shuffled = [...LOCAL_CATALOG].sort(() => 0.5 - Math.random());
    return res.json(shuffled.slice(0, 15));
  }

  return res.json(matching);
});

// Configure Vite integration for dev server or serve build static files for prod
import { createServer as createViteServer } from "vite";

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Development Server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving precompiled production frontend assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [Tez Server] listening on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
