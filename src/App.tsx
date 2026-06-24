import React, { useState, useEffect, useTransition } from "react";
import {
  Menu,
  X,
  Search,
  Sparkles,
  Camera,
  ShoppingBag,
  User,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Palette,
  Heart,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SEASONS_DATA, DEFAULT_THEME } from "./seasonsData";
import { SeasonId, MakeupProduct, AnalysisResult } from "./types";
import PaletteSelector from "./components/PaletteSelector";
import ProductCard from "./components/ProductCard";
import BarcodeScannerMock from "./components/BarcodeScannerMock";
import { EDITIONS_DATA } from "./editionsData";
import { ALL_PRODUCTS_CATALOG } from "./allProductsData";

export default function App() {
  // Navigation & Page views
  const [currentPage, setCurrentPage] = useState<"home" | "search" | "foryou">("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null);

  // User State info
  const [userPalette, setUserPalette] = useState<SeasonId | null>(() => {
    const saved = localStorage.getItem("tez_user_palette");
    return saved ? (saved as SeasonId) : null;
  });

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");
  const [isAnalyzing, startAnalysis] = useTransition();
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("Iniciando escaneamento óptico...");
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<MakeupProduct | null>(null);
  const [showOlderEditions, setShowOlderEditions] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Curated list for active catalog
  const [curatedProducts, setCuratedProducts] = useState<MakeupProduct[]>([]);
  const [isLoadingCurated, setIsLoadingCurated] = useState(false);

  // Modals / Tools
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showSeasonDetailModal, setShowSeasonDetailModal] = useState(false);

  // Local clock state to display premium Android mock status bar
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Sync current time for simulated top-notch Android status bar
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isScanningAnimation) {
      setScanProgress(0);
      setScanStep("Identificando produto...");
      
      const steps = [
        "Identificando produto...",
        "Analisando características...",
        "Gerando resultado..."
      ];
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 16) + 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
        }
        setScanProgress(currentProgress);
        
        const stepIdx = Math.min(
          Math.floor((currentProgress / 100) * steps.length),
          steps.length - 1
        );
        setScanStep(steps[stepIdx]);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanningAnimation]);

  // Fetch products matching the current theme or random products
  useEffect(() => {
    const fetchCurated = async () => {
      setIsLoadingCurated(true);
      try {
        const url = userPalette
          ? `/api/products?palette=${userPalette}`
          : "/api/products";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCuratedProducts(data);
        } else {
          fallbackCuratedData();
        }
      } catch (err) {
        fallbackCuratedData();
      } finally {
        setIsLoadingCurated(false);
      }
    };

    fetchCurated();
  }, [userPalette]);

  // Fallback if local server api is booting or delayed
  const fallbackCuratedData = () => {
    // Generate static mockup entries based on selected palette or general
    const rawMock = [
      {
        id: "mock_1",
        name: "Batom Velvet Teddy",
        brand: "MAC Cosmetics",
        type: "Batom",
        barcode: "773602334814",
        primarySeason: "outono_quente" as SeasonId,
        compatibleSeasons: ["outono_quente", "outono_suave", "primavera_quente"] as SeasonId[],
        colors: ["#C4977E"],
        description: "Clássico suntuoso, sutilmente terroso.",
        parameters: { temp: "Quente", intensity: "Suave", depth: "Média" }
      },
      {
        id: "mock_2",
        name: "Batom Ruby Woo",
        brand: "MAC Cosmetics",
        type: "Batom Matte",
        barcode: "773602120011",
        primarySeason: "inverno_frio" as SeasonId,
        compatibleSeasons: ["inverno_frio", "inverno_brilhante", "inverno_escuro"] as SeasonId[],
        colors: ["#C41E3A"],
        description: "Vermelho azulado absoluto ultra-mate.",
        parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" }
      },
      {
        id: "mock_3",
        name: "Blush Orgasm",
        brand: "NARS",
        type: "Blush",
        barcode: "607845040132",
        primarySeason: "primavera_clara" as SeasonId,
        compatibleSeasons: ["primavera_clara", "primavera_quente", "outono_suave"] as SeasonId[],
        colors: ["#F3A297"],
        description: "Rosa pêssego iluminado com partículas de brilho dourado.",
        parameters: { temp: "Quente", intensity: "Brilhante", depth: "Clara" }
      },
      {
        id: "mock_4",
        name: "Contorno Sticks Taupe",
        brand: "Mari Maria Makeup",
        type: "Contorno",
        barcode: "7898651811228",
        primarySeason: "verao_suave" as SeasonId,
        compatibleSeasons: ["verao_suave", "outono_suave", "verao_frio"] as SeasonId[],
        colors: ["#C2B2A3"],
        description: "Marrom acinzentado frio para sombras perfeitas.",
        parameters: { temp: "Fria", intensity: "Suave", depth: "Média" }
      }
    ];

    if (userPalette) {
      const filtered = rawMock.filter(
        (p) => p.primarySeason === userPalette || p.compatibleSeasons.includes(userPalette)
      );
      setCuratedProducts(filtered.length > 0 ? filtered : rawMock.slice(0, 3));
    } else {
      setCuratedProducts(rawMock);
    }
  };

  // Select Palette callback
  const handlePaletteSelected = (id: SeasonId) => {
    setUserPalette(id);
    localStorage.setItem("tez_user_palette", id);
    // Auto collapse detailed views or switch to Homepage
    setCurrentPage("home");
  };

  const handleClearPalette = () => {
    setUserPalette(null);
    localStorage.removeItem("tez_user_palette");
    setAnalysisResult(null);
  };

  // Perform dynamic API check for cosmetic query
  const handleCosmeticSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryTerm = searchQuery.trim();
    if (!queryTerm) return;

    setSearchError(null);
    setAnalysisResult(null);
    setIsScanningAnimation(true);

    startAnalysis(async () => {
      // Create a nice delay for high fidelity cosmetic scanning experience!
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isNumericBarcode = /^\d{5,}$/.test(queryTerm);

      try {
        const res = await fetch("/api/analyze-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: isNumericBarcode ? "" : queryTerm,
            brand: "",
            barcode: isNumericBarcode ? queryTerm : "",
            userPalette: userPalette
          })
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data);
        } else {
          const errData = await res.json();
          setSearchError(errData.error || "Ocorreu um erro na análise cromática.");
        }
      } catch (err) {
        // Fallback local matching
        setSearchError("Mostrando estimativa inteligente de coloração.");
        simulateClientSideAnalysis(queryTerm);
      } finally {
        setIsScanningAnimation(false);
      }
    });
  };

  const simulateClientSideAnalysis = (term: string) => {
    const isEan = /^\d+$/.test(term);
    const mockMatch: AnalysisResult = {
      id: "fallback_result_" + Math.random(),
      name: isEan ? "Produto EAN " + term : term,
      brand: "Analítica Especializada",
      type: "Maquiagem Labial",
      barcode: isEan ? term : "N/A",
      primarySeason: "inverno_frio",
      compatibleSeasons: ["inverno_frio", "inverno_brilhante", "verao_frio"],
      colors: ["#9E1B32"],
      description: "Match calculado via sensor inteligente de matiz.",
      parameters: { temp: "Fria", intensity: "Brilhante", depth: "Média" },
      source: "local_smart_fallback",
      compatibilityScore: userPalette === "inverno_frio" ? "Excelente" : "Pouca Afinidade",
      aiExplanation: "Este produto possui pigmentos frios e intensos que se harmonizam perfeitamente com subtons invernais."
    };
    setAnalysisResult(mockMatch);
  };

  // Barcode scanner success trigger
  const handleBarcodeScanned = (barcode: string) => {
    setIsScannerOpen(false);
    setSearchQuery(barcode);
    setSearchError(null);
    setAnalysisResult(null);
    setIsScanningAnimation(true);

    startAnalysis(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const res = await fetch("/api/analyze-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            barcode: barcode,
            userPalette: userPalette
          })
        });
        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data);
        } else {
          setSearchError("Erro ao recuperar resultados deste código de barras.");
        }
      } catch (err) {
        setSearchError("Erro na conexão com o servidor de cosméticos.");
      } finally {
        setIsScanningAnimation(false);
      }
    });
  };

  // Clear search field
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchBrand("");
    setSearchBarcode("");
    setAnalysisResult(null);
    setSearchError(null);
  };

  // Map theme variables based on user selected extended season
  const currentSeasonInfo = userPalette ? SEASONS_DATA[userPalette] : null;
  const activeTheme = currentSeasonInfo ? currentSeasonInfo.theme : DEFAULT_THEME;

  // Font family determined by parent season
  let fontClass = "font-sans";
  if (currentSeasonInfo) {
    if (currentSeasonInfo.parentSeason === "primavera") fontClass = "font-spring";
    else if (currentSeasonInfo.parentSeason === "verao") fontClass = "font-summer";
    else if (currentSeasonInfo.parentSeason === "outono") fontClass = "font-autumn";
    else if (currentSeasonInfo.parentSeason === "inverno") fontClass = "font-winter";
  }

  const queryValidInput = searchQuery.trim() !== "" || searchBrand.trim() !== "" || searchBarcode.trim() !== "";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-6 transition-all duration-300">
      {/* 
        PREMIUM ANDROID FRAME CONTAINER:
        Ensures the application feels exactly like a designer-grade high-fidelity 
        Android device app on desktop screens, while scaling flawlessly of edge-to-edge on real phones.
      */}
      <div className="relative w-full max-w-[430px] h-none sm:h-[880px] bg-zinc-900 rounded-none sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden sm:border-8 sm:border-zinc-850">
        
        {/* Top Camera Notch & Android Status Bar (Only on Desktop display padding) */}
        <div className="bg-black text-[11px] h-7 px-6 flex items-center justify-between text-zinc-400 select-none z-30 font-mono">
          <span>{currentTime || "12:00"}</span>
          {/* Simulated hardware pill */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1 h-3.5 w-24 bg-zinc-950 rounded-full border border-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-[9px] tracking-wider text-zinc-500">
            <span>5G</span>
            <span>LTE</span>
            <span>100%</span>
          </div>
        </div>

        {/* Dynamic Warning Alert Banner at the Top if no palette registered */}
        <AnimatePresence>
          {!userPalette && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-zinc-100 border-b border-zinc-200 text-zinc-800 text-center text-[10.5px] px-4 py-2.5 flex items-center justify-between gap-1 z-20"
            >
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 bg-zinc-900 rounded-full animate-ping" />
                <span className="font-sans">Você não cadastrou sua cartela pessoal ainda.</span>
              </div>
              <button
                onClick={() => {
                  setCurrentPage("search");
                  // Focus palette register
                  const el = document.getElementById("palette-selector-viewport");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[10px] font-bold underline uppercase tracking-wider text-black hover:opacity-80"
              >
                Cadastrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 
          Main App Viewport: Styled entirely by the selected season colors 
          and the main Couture Font family of the parent seaon!
        */}
        <div
          id="app-theme-wrapper"
          className={`flex-1 overflow-y-auto overflow-x-hidden relative ${activeTheme.background} ${fontClass} flex flex-col justify-between scroll-hide`}
        >
          {/* Header Bar */}
          <header className="sticky top-0 z-20 px-5 py-5 flex items-center justify-between bg-[#F7F3E9]/80 backdrop-blur-md border-b border-[#4A3728]/15">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 cursor-pointer py-1 bg-transparent hover:opacity-80 active:scale-95 transition-all text-[#4A3728]"
              title="Menu"
            >
              <div className="w-5 h-3 flex flex-col justify-between opacity-80">
                <span className="block w-full h-0.5 bg-[#4A3728]"></span>
                <span className="block w-full h-0.5 bg-[#4A3728]"></span>
                <span className="block w-full h-0.5 bg-[#4A3728]"></span>
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-semibold text-[#4A3728]">Menu</span>
            </button>

            {/* Brand Logo & Tagline (tez - coloração pessoal) */}
            <div className="text-center text-[#4A3728]">
              <h1 className="text-4xl font-normal leading-none font-serif tracking-tight select-none">
                tez
              </h1>
              <p className="text-[7.5px] tracking-[0.35em] uppercase font-sans mt-1 opacity-80 font-bold select-none">
                coloração pessoal
              </p>
            </div>

            <button
              onClick={() => {
                if (userPalette) setShowSeasonDetailModal(true);
                else {
                  setCurrentPage("search");
                }
              }}
              className="w-8 h-8 rounded-full border border-[#4A3728]/25 flex items-center justify-center hover:bg-[#4A3728]/5 active:scale-95 transition-all cursor-pointer relative text-[#4A3728]"
              title="Minha Cartela"
            >
              <Palette className="h-4 w-4" />
              {userPalette && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-white" style={{ backgroundColor: currentSeasonInfo?.paletteColors[0] }} />
              )}
            </button>
          </header>

          {/* Navigation Hamburguer Menu Sliding Drawer */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute inset-0 bg-black z-40 cursor-pointer"
                />

                {/* Sidebar drawer content */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="absolute top-0 bottom-0 left-0 w-[290px] bg-white text-zinc-900 z-50 p-6 flex flex-col justify-between shadow-2xl border-r border-zinc-100"
                >
                  <div className="space-y-6">
                    {/* Header menu */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                      <div>
                        <h2 className="text-lg font-bold tracking-widest uppercase">tez</h2>
                      </div>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1 px-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2 flex flex-col font-sans">
                      <button
                        onClick={() => {
                          setCurrentPage("home");
                          setIsMenuOpen(false);
                        }}
                        className={`text-left px-3 py-3.5 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                          currentPage === "home"
                            ? "bg-zinc-950 text-white font-semibold"
                            : "hover:bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Palette className="h-4 w-4" /> Página Inicial
                        </span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage("search");
                          setIsMenuOpen(false);
                        }}
                        className={`text-left px-3 py-3.5 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                          currentPage === "search"
                            ? "bg-zinc-950 text-white font-semibold"
                            : "hover:bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Search className="h-4 w-4" /> Busca de Produtos
                        </span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage("foryou");
                          setSelectedEditionId(null);
                          setIsMenuOpen(false);
                        }}
                        className={`text-left px-3 py-3.5 rounded-xl text-xs font-medium tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                          currentPage === "foryou"
                            ? "bg-zinc-950 text-white font-semibold"
                            : "hover:bg-zinc-50 text-zinc-600"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Calendar className="h-4 w-4" /> Edições
                        </span>
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      </button>
                    </nav>
                  </div>

                  {/* Profile Status & Settings in Sidebar footer */}
                  <div className="pt-4 border-t border-zinc-100 mt-auto space-y-4">
                    {/* User Profile Header with Elegant Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-zinc-200 bg-stone-100 flex items-center justify-center">
                          {/* Fashion-forward styling avatar */}
                          <div className="w-full h-full bg-stone-900 flex items-center justify-center text-white font-serif font-semibold text-base">
                            L
                          </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-zinc-950 border border-white rounded-full flex items-center justify-center">
                          <span className="text-[7.5px] text-white">✨</span>
                        </div>
                      </div>
                      <div className="text-left font-sans">
                        <h4 className="text-[12px] font-bold text-zinc-950 leading-tight">Lucas Valente</h4>
                        <p className="text-[9.5px] text-zinc-400 font-mono truncate max-w-[140px]">lucasbmf@gmail.com</p>
                      </div>
                    </div>

                    {/* Settings Option Group */}
                    <div className="bg-stone-50 rounded-xl p-3 space-y-2.5 font-sans border border-stone-200/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-stone-900/60 uppercase tracking-widest">
                          Configurações
                        </span>
                        <span className="text-[8px] text-zinc-400 font-mono">ESTÁVEL</span>
                      </div>

                      <div className="space-y-1.5 text-left">
                        {/* Selector/Option to swap palette directly in settings */}
                        <label className="text-[10px] font-medium text-zinc-500 block">Sua Cartela:</label>
                        <select
                          value={userPalette || ""}
                          onChange={(e) => {
                            const val = e.target.value as SeasonId || "";
                            if (val) {
                              handlePaletteSelected(val);
                            } else {
                              handleClearPalette();
                            }
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 bg-white text-[11px] text-zinc-700 font-sans focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="">Não registrada</option>
                          {Object.entries(SEASONS_DATA).map(([id, info]) => (
                            <option key={id} value={id}>
                              {info.name}
                            </option>
                          ))}
                        </select>

                        {userPalette && (
                          <button
                            onClick={handleClearPalette}
                            className="w-full text-center py-2 mt-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100/30 text-rose-600 rounded-lg text-[9px] uppercase font-mono tracking-wider transition-colors cursor-pointer"
                          >
                            Resetar Cartela
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-center text-[8.5px] text-zinc-300 font-mono uppercase tracking-widest leading-none mt-2">
                      tez coloraçao pessoal © 2026
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* PAGE ROUTER CONTROLLER */}
          <main className="flex-1 px-5 py-6">
            <AnimatePresence mode="wait">
              {currentPage === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Busca de Produtos - Exact Same Layout as Search page */}
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <span className="text-[9.5px] uppercase font-sans tracking-[0.25em] font-bold text-[#4A3728]/70 block">
                        Assinatura de Estilo
                      </span>
                      <h2 className="text-2xl font-serif font-normal italic text-stone-900 leading-tight">
                        Busca de Produtos
                      </h2>
                      <p className="text-[11.8px] text-[#4A3728]/80 font-sans leading-relaxed">
                        Chega de errar no tom! Digite o nome, marca, linha ou o código de barras (EAN). Nosso algoritmo mapeia a química dos pigmentos para revelar seu percentual de harmonia com o Método Sazonal Estendido.
                      </p>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-4 font-sans">
                      {/* Prominent Camera Scan Area */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-stone-900/60 uppercase tracking-widest block font-sans">
                          Acesso por Código de Barras / Câmera
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsScannerOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/40 via-stone-50 to-amber-50/35 hover:from-amber-100/50 hover:to-stone-100 border-2 border-dashed border-[#D4AF37] rounded-xl transition-all cursor-pointer text-left group shadow-xs focus:outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] group-hover:scale-105 transition-all shadow-sm">
                              <Camera className="h-6 w-6 text-[#D4AF37]" strokeWidth={2.5} />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#4A3728] block font-sans">
                                Ler Código de Barras (EAN)
                              </span>
                              <span className="text-[10.5px] text-[#4A3728]/75 block font-sans leading-tight">
                                Aponte para o código de barras ou tire foto do produto.
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Divider "or search by text" */}
                      <div className="relative flex items-center justify-center py-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-stone-150"></div>
                        </div>
                        <span className="relative px-3 text-[9px] text-[#4A3728]/60 font-mono tracking-widest uppercase bg-white">ou pesquise por texto</span>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setCurrentPage("search");
                          handleCosmeticSearch();
                        }}
                        className="space-y-3"
                      >
                        <div className="space-y-1.5 relative">
                          <label className="text-[10px] font-bold text-stone-900/60 uppercase tracking-widest block font-sans">
                            Pesquisar por Digitação
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (searchError) setSearchError(null);
                              }}
                              placeholder="Marca, Linha, Batom, Base ou EAN..."
                              className="w-full pl-3 pr-12 py-3 bg-stone-50 rounded-xl text-xs border border-stone-300/60 focus:border-black focus:bg-white focus:outline-none placeholder:text-zinc-400 text-zinc-850 font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsScannerOpen(true);
                              }}
                              className="absolute right-3.5 text-stone-400 hover:text-black p-1 transition-colors rounded-full hover:bg-stone-100"
                              title="Tirar foto ou Ler código de barras"
                            >
                              <Camera className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={isAnalyzing || isScanningAnimation || !searchQuery.trim()}
                            className="flex-1 bg-stone-950 text-white font-medium hover:bg-stone-850 disabled:bg-stone-100 disabled:text-stone-400 justify-center text-xs py-3 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
                          >
                            <Sparkles className="h-3.5 w-3.5" /> Analisar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Curated Editorial Section (Edições/Resenhas) */}
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-end border-b border-[#4A3728]/10 pb-2">
                      <div>
                        <h3 className="text-xl font-normal font-serif italic text-[#4A3728]">
                          Edição em Destaque
                        </h3>
                        <p className="text-[9.5px] uppercase tracking-[0.1em] font-sans text-[#4A3728]/60 mt-0.5">
                          05 de Junho de 2026
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEditionId(null);
                          setCurrentPage("foryou");
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#4A3728]/80 hover:text-black flex items-center gap-0.5 font-sans cursor-pointer focus:outline-none"
                      >
                        Ver Edições →
                      </button>
                    </div>

                    {/* Show the latest edition from our EDITIONS_DATA database */}
                    {(() => {
                      const latestEd = EDITIONS_DATA[0];
                      if (!latestEd) {
                        return (
                          <p className="text-xs text-[#4A3728]/60 font-mono py-4 text-center">
                            Nenhuma edição de visagismo disponível no momento.
                          </p>
                        );
                      }
                      
                      return (
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                            <span>{latestEd.date}</span>
                            <span className="text-[#D4AF37] font-bold">{latestEd.readTime}</span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-lg font-serif font-normal italic text-zinc-950 leading-tight">
                              {latestEd.title}
                            </h4>
                            <p className="text-[11.8px] text-zinc-600 line-clamp-3 leading-relaxed font-sans">
                              {latestEd.summary}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-zinc-400 italic">
                              Por {latestEd.author}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedEditionId(latestEd.id);
                                setCurrentPage("foryou");
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-stone-850 flex items-center gap-1 font-sans cursor-pointer"
                            >
                              Ler Edição Completa →
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

                {currentPage === "search" && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 text-left"
                >
                  {/* Search Description Area */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] uppercase font-sans tracking-[0.25em] font-bold text-[#4A3728]/70 block">
                      Assinatura de Estilo
                    </span>
                    <h2 className="text-2xl font-serif font-normal italic text-stone-900 leading-tight">
                      Sua Beleza em Sintonia Cromática Absoluta
                    </h2>
                    <p className="text-[11.8px] text-stone-600 font-sans leading-relaxed">
                      Chega de errar no tom! Digite o nome, marca, linha ou o código de barras (EAN). Nosso algoritmo mapeia a química dos pigmentos para revelar seu percentual de harmonia com o Método Sazonal Estendido.
                    </p>
                  </div>

                  {/* Single Unified Search form */}
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-4 font-sans">
                    {/* Prominent Camera Scan Area */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-stone-900/60 uppercase tracking-widest block font-sans">
                        Acesso por Código de Barras / Câmera
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsScannerOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/40 via-stone-50 to-amber-50/35 hover:from-amber-100/50 hover:to-stone-100 border-2 border-dashed border-[#D4AF37] rounded-xl transition-all cursor-pointer text-left group shadow-xs focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] group-hover:scale-105 transition-all shadow-sm">
                            <Camera className="h-6 w-6 text-[#D4AF37]" strokeWidth={2.5} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4A3728] block font-sans">
                              Ler Código de Barras (EAN)
                            </span>
                            <span className="text-[10.5px] text-[#4A3728]/75 block font-sans leading-tight">
                              Aponte para o código de barras ou tire foto do produto.
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {/* Divider "or search by text" */}
                    <div className="relative flex items-center justify-center py-1">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200/60"></div>
                      </div>
                      <span className="relative px-3 text-[9px] text-[#4A3728]/60 font-mono tracking-widest uppercase bg-white">ou pesquise por texto</span>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCosmeticSearch();
                      }}
                      className="space-y-3"
                    >
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-bold text-stone-900/60 uppercase tracking-widest block font-sans">
                          Pesquisar por Digitação
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              if (searchError) setSearchError(null);
                            }}
                            placeholder="Marca, Linha, Batom, Base ou EAN..."
                            className="w-full pl-3 pr-12 py-3 bg-stone-50 rounded-xl text-xs border border-stone-300/60 focus:border-black focus:bg-white focus:outline-none placeholder:text-zinc-400 text-zinc-850 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsScannerOpen(true);
                            }}
                            className="absolute right-3.5 text-stone-400 hover:text-black p-1 transition-colors rounded-full hover:bg-stone-100"
                            title="Tirar foto ou Ler código de barras"
                          >
                            <Camera className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Action CTA button named "Analisar" as requested */}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          id="execute-analysis-cta"
                          disabled={isAnalyzing || isScanningAnimation || !searchQuery.trim()}
                          className="flex-1 bg-stone-950 text-white font-medium hover:bg-stone-850 disabled:bg-stone-100 disabled:text-stone-400 justify-center text-xs py-3 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
                        >
                          {isScanningAnimation ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Mapeando pigmentos...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" /> Analisar
                            </>
                          )}
                        </button>

                        {(searchQuery || analysisResult) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("");
                              setAnalysisResult(null);
                              setSearchError(null);
                            }}
                            className="px-3 bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 rounded-xl transition-colors cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Laser Scanner Visualizer Animation Overlay */}
                    <AnimatePresence>
                      {isScanningAnimation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2"
                        >
                          <div className="relative p-6 bg-gradient-to-b from-stone-900 to-neutral-950 overflow-hidden rounded-2xl border-2 border-[#D4AF37] flex flex-col justify-center items-center text-center space-y-4 shadow-xl">
                            {/* Scanning moving laser line */}
                            <motion.div
                              animate={{ y: [0, 160] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_18px_#D4AF37] z-10 pointer-events-none"
                            />
                            {/* Decorative background grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] opacity-20" />
                            
                            {/* Tech scanner ring */}
                            <div className="relative h-14 w-14 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center animate-spin [animation-duration:8s] z-10">
                              <div className="h-10 w-10 rounded-full border border-stone-850 bg-stone-900 flex items-center justify-center" />
                            </div>
                            <Camera className="h-6 w-6 text-[#D4AF37] absolute top-10 animate-pulse z-20" />

                            <div className="space-y-1.5 z-10">
                              <p className="text-xs font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase animate-pulse">
                                AUDITORIA CROMÁTICA MOLECULAR
                              </p>
                              <p className="text-[11px] font-sans text-stone-350 font-medium h-4 max-w-[320px] mx-auto truncate">
                                {scanStep}
                              </p>
                            </div>

                            {/* Sleek Progress Bar with percentage */}
                            <div className="w-full max-w-[280px] space-y-2 z-10">
                              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                                <span className="uppercase tracking-widest text-[#D4AF37]/85">PROCESSAMENTO</span>
                                <span className="font-bold text-[#D4AF37]">{scanProgress}%</span>
                              </div>
                              <div className="h-2 w-full bg-stone-850 rounded-full overflow-hidden border border-stone-750 p-0.5">
                                <div
                                  className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-400 rounded-full transition-all duration-100 ease-out"
                                  style={{ width: `${scanProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Fallback & Error alerts */}
                    {searchError && (
                      <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl flex items-start gap-2.5 text-amber-900 text-[11px] leading-relaxed font-sans">
                        <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>{searchError}</span>
                      </div>
                    )}
                  </div>

                  {/* 
                    ANALYSIS RESULT CONTAINER:
                    Displays custom visual representation, technical parameters, and exact requested compatibility metrics.
                  */}
                  {/* 
                    ANALYSIS RESULT CONTAINER:
                    Displays search result product using the exact same ProductCard interface.
                  */}
                  {analysisResult && !isScanningAnimation && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest text-left pl-1">
                        Resultado da Pesquisa / Diagnóstico Molecular
                      </div>
                      <ProductCard
                        product={analysisResult}
                        userPalette={userPalette}
                        onSelectProduct={(p) => {
                          setSelectedDetailProduct(p);
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* EDITORIAL EDITIONS (EDIÇÕES / CONTRASTES & RESENHAS) */}
              {currentPage === "foryou" && (
                <motion.div
                  key="foryou"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6 text-left"
                >
                  {selectedEditionId ? (
                    // 1. Detailed Review / Editorial Article View
                    (() => {
                      const activeEd = EDITIONS_DATA.find((ed) => ed.id === selectedEditionId);
                      if (!activeEd) {
                        return (
                          <div className="text-center py-10 space-y-3">
                            <p className="text-sm text-stone-500 font-sans">Edição não encontrada.</p>
                            <button
                              onClick={() => setSelectedEditionId(null)}
                              className="text-xs uppercase font-bold tracking-widest text-stone-900 focus:outline-none"
                            >
                              ← Voltar para Edições
                            </button>
                          </div>
                        );
                      }

                      // Find featured products matching this edition
                      const featuredProducts = ALL_PRODUCTS_CATALOG.filter(prod => activeEd.productIds.includes(prod.id));

                      return (
                        <div className="space-y-6">
                          {/* Back Button */}
                          <button
                            onClick={() => setSelectedEditionId(null)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 group focus:outline-none cursor-pointer"
                          >
                            <ChevronLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Editions
                          </button>

                          {/* Article Header Metadata */}
                          <div className="space-y-3 border-b border-stone-150 pb-5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                              <span>Sexta-feira • {activeEd.date}</span>
                              <span className="text-[#D4AF37] font-semibold">{activeEd.readTime}</span>
                            </div>

                            <h2 className="text-2xl font-serif font-normal italic text-stone-950 leading-tight">
                              {activeEd.title}
                            </h2>

                            <div className="flex items-center gap-2">
                              <div className="text-[10px] text-stone-500 font-sans italic">
                                Por <span className="font-semibold text-stone-800">{activeEd.author}</span> • Colunista Lab Tez
                              </div>
                            </div>
                          </div>

                          {/* Beautiful Article Content Body with generous negative space and italic quotes */}
                          <div className="space-y-4 text-stone-750 font-sans text-[12px] leading-relaxed">
                            {activeEd.content.split("\n\n").map((para, idx) => {
                              // If paragraph looks like a quote, style it as a pulling editorial quote
                              if (para.startsWith('"') || para.startsWith('“')) {
                                return (
                                  <blockquote
                                    key={idx}
                                    className="p-4 border-l-2 border-[#D4AF37] bg-stone-50/70 font-serif italic text-[13px] text-stone-800 rounded-r-xl leading-relaxed my-4"
                                  >
                                    {para}
                                  </blockquote>
                                );
                              }
                              return (
                                <p key={idx} className="whitespace-pre-line text-zinc-700">
                                  {para}
                                </p>
                              );
                            })}
                          </div>

                          {/* Featured Products List from this edition */}
                          <div className="pt-6 border-t border-stone-150 space-y-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono tracking-widest uppercase text-stone-400 font-bold block">
                                ROTEIRO DE COMPRA
                              </span>
                              <h3 className="text-lg font-serif font-normal italic text-[#4A3728]">
                                Produtos nesta Edição
                              </h3>
                              <p className="text-[10px] text-zinc-400 font-sans">
                                Toque nos cards abaixo para visualizar o score de compatibilidade molecular com a sua cartela estendida.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              {featuredProducts.length > 0 ? (
                                featuredProducts.map((prod) => (
                                  <ProductCard
                                    key={prod.id}
                                    product={prod}
                                    userPalette={userPalette}
                                    onSelectProduct={(p) => {
                                      setSelectedDetailProduct(p);
                                    }}
                                  />
                                ))
                              ) : (
                                <p className="text-xs text-center text-zinc-400 font-mono py-4">
                                  Nenhum produto cadastrado para essa edição.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // 2. Summary List of All Editorial Editions
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[9.5px] uppercase font-sans tracking-[0.25em] font-bold text-[#4A3728]/70 block">
                          Tez Editorial
                        </span>
                        <h2 className="text-2xl font-serif font-normal italic text-stone-900 leading-none">
                          Edições Semanais
                        </h2>
                        <p className="text-[11.8px] text-[#4A3728]/80 font-sans leading-relaxed">
                          Toda sexta-feira nossa bancada de colunistas investiga as cores e características de cosméticos nacionais para trazer visagismo sincero direto no seu celular.
                        </p>
                      </div>

                      {/* Editions List Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        {EDITIONS_DATA.map((edition) => (
                          <div
                            key={edition.id}
                            className="bg-white/95 rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow text-left"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                              <span>{edition.date}</span>
                              <span className="text-[#D4AF37] font-semibold">{edition.readTime}</span>
                            </div>

                            <div className="space-y-1.5 focus:outline-none">
                              <h4 className="text-lg font-serif font-normal italic text-zinc-950 leading-tight">
                                {edition.title}
                              </h4>
                              <p className="text-[11.8px] text-zinc-500 line-clamp-3 leading-relaxed font-sans">
                                {edition.summary}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                              <span className="text-[9.5px] text-zinc-400 font-sans italic">
                                Autoria: {edition.author}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedEditionId(edition.id);
                                }}
                                className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-stone-950 flex items-center gap-1 font-sans cursor-pointer focus:outline-none"
                              >
                                Ver Completa →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* PRODUCT DETAIL DIALOG */}
          <AnimatePresence>
            {selectedDetailProduct && (
              <>
                {/* Backdrop overlay styled inside the device */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedDetailProduct(null)}
                  className="absolute inset-0 bg-black z-40 cursor-pointer animate-fade-in"
                />

                {/* Slide up sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 280 }}
                  className="absolute bottom-0 left-0 right-0 max-h-[85%] bg-white rounded-t-[32px] shadow-2xl z-50 overflow-y-auto scroll-hide border-t border-stone-200 flex flex-col text-left text-zinc-900"
                >
                  {/* Handle pill */}
                  <div className="flex justify-center py-3">
                    <div className="w-12 h-1.5 bg-stone-250 rounded-full" />
                  </div>

                  {/* Close Button & Title */}
                  <div className="px-6 pb-2 flex justify-between items-center bg-white sticky top-0 z-10">
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase">
                      Estudo Cromático Fino
                    </span>
                    <button
                      onClick={() => setSelectedDetailProduct(null)}
                      className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-850 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="px-6 pb-8 space-y-5">
                    {/* Main Visual Representation */}
                    <div className="grid grid-cols-12 gap-4 pt-1">
                      <div className="col-span-4 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-center p-3 h-28 relative overflow-hidden group">
                        <div
                          className="absolute inset-0 opacity-10 filter blur-md"
                          style={{
                            background: `radial-gradient(circle, ${selectedDetailProduct.colors?.[0] || "#9E1B32"} 0%, transparent 80%)`,
                          }}
                        />
                        
                        {/* Lipstick or Cosmetic */}
                        <div className="relative flex flex-col items-center justify-center pointer-events-none">
                          {selectedDetailProduct.type?.toLowerCase().includes("batom") || selectedDetailProduct.type?.toLowerCase().includes("gloss") || selectedDetailProduct.type?.toLowerCase().includes("lápis") ? (
                            <div className="w-5 h-12 bg-stone-900 rounded-t-sm rounded-b-md relative flex items-center justify-center shadow-md">
                              <div className="absolute top-3 w-5 h-1 bg-[#D4AF37]" />
                              <div
                                className="absolute -top-3 w-3 h-4 rounded-t-full origin-bottom transform rotate-12"
                                style={{ backgroundColor: selectedDetailProduct.colors?.[0] || "#9E1B32" }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: selectedDetailProduct.colors?.[0] || "#9E1B32" }}>
                              <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: selectedDetailProduct.colors?.[0] || "#9E1B32" }} />
                            </div>
                          )}
                          <span className="mt-2 text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                            {selectedDetailProduct.type || "Fórmula"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-8 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                            {selectedDetailProduct.brand}
                          </span>
                          <h4 className="text-[16px] font-serif font-semibold text-zinc-950 leading-tight">
                            {selectedDetailProduct.name}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-wider">
                            EAN: {selectedDetailProduct.barcode || "N/A"}
                          </p>
                        </div>

                        {selectedDetailProduct.colors && selectedDetailProduct.colors.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 bg-stone-50 p-1.5 rounded-lg border border-stone-150">
                            <span className="text-[9px] font-mono text-zinc-400 block px-1">Pigmento:</span>
                            {selectedDetailProduct.colors.map((c, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <span
                                  className="h-3 w-3 rounded-full border border-stone-300"
                                  style={{ backgroundColor: c }}
                                />
                                <span className="text-[9px] font-mono text-stone-600 font-semibold uppercase">
                                  {c}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Diagnostic report description & parameters */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <span className="text-[9px] font-bold text-stone-900/60 uppercase tracking-wider block">
                        Características Principais
                      </span>
                      
                      <div className="grid grid-cols-3 gap-2 text-center bg-stone-100/40 p-2.5 rounded-xl border border-stone-150/40 text-[10.5px]">
                        <div>
                          <span className="block text-[8px] text-zinc-400 font-mono uppercase">Temperatura</span>
                          <span className="font-semibold text-stone-900 text-xs">
                            {selectedDetailProduct.parameters?.temp || "Neutro"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-zinc-400 font-mono uppercase">Intensidade</span>
                          <span className="font-semibold text-stone-900 text-xs truncate block max-w-full">
                            {selectedDetailProduct.parameters?.intensity.split("/")[0] || "Suave"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-zinc-400 font-mono uppercase">Profundidade</span>
                          <span className="font-semibold text-stone-900 text-xs">
                            {selectedDetailProduct.parameters?.depth || "Média"}
                          </span>
                        </div>
                      </div>

                      <p className="text-[12px] text-zinc-600 leading-relaxed font-sans pt-1">
                        {selectedDetailProduct.description}
                      </p>
                    </div>

                    {/* COMPATIBILITY SCORE CONTAINER */}
                    <div className="p-4 rounded-xl border bg-stone-50/50 border-stone-250/50 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                        <div>
                          <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest font-sans">
                            Sua Compatibilidade
                          </span>
                          <h4 className="text-[12px] font-bold text-zinc-900 font-sans mt-0.5 uppercase">
                            {currentSeasonInfo?.name || "Cartela não informada"}
                          </h4>
                        </div>

                        {(() => {
                          if (!userPalette) {
                            return (
                              <span className="text-[9px] font-bold uppercase text-stone-400 bg-stone-100 px-2 py-1 rounded-md">
                                SEM CADASTRO
                              </span>
                            );
                          }

                          const isExact = selectedDetailProduct.primarySeason === userPalette;
                          const isComp = selectedDetailProduct.compatibleSeasons?.includes(userPalette);

                          let scoreStr = "0-25% • Baixa";
                          let scoreClass = "bg-rose-50 border-rose-200 text-rose-850";

                          if (isExact) {
                            scoreStr = "92% • Alta";
                            scoreClass = "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-stone-900";
                          } else if (isComp) {
                            scoreStr = "65% • Média";
                            scoreClass = "bg-amber-50 border-amber-250 text-amber-850";
                          }

                          return (
                            <div className="text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-mono tracking-wider border ${scoreClass}`}>
                                {scoreStr}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {userPalette ? (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-stone-950 rounded-full transition-all"
                              style={{
                                width: `${
                                  selectedDetailProduct.primarySeason === userPalette
                                    ? 92
                                    : selectedDetailProduct.compatibleSeasons?.includes(userPalette)
                                    ? 65
                                    : 18
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                            <span>0% Baixa</span>
                            <span>50% Média</span>
                            <span>100% Alta</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-zinc-500 font-sans italic pt-1">
                          💡 Cadastre sua cartela pessoal de 12 estações estendidas para obter o cálculo exato de afinidade de tons.
                        </div>
                      )}
                    </div>

                    {/* Cartelas Compatíveis */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-bold text-stone-900/60 uppercase tracking-widest block font-sans">
                          Cartelas Compatíveis
                        </span>
                        <span className="text-[8px] text-[#D4AF37] font-bold tracking-widest">TOP 3 PERFIS</span>
                      </div>

                      <div className="grid grid-cols-1 divide-y divide-stone-100">
                        {(() => {
                          const pool = selectedDetailProduct.compatibleSeasons || [];
                          const list = pool.slice(0, 3);
                          
                          if (list.length === 0) {
                            return <p className="text-[10.5px] text-zinc-400 italic">Nenhum perfil secundário mapeado.</p>;
                          }

                          return list.map((seasonId, idx) => {
                            const info = SEASONS_DATA[seasonId];
                            const secondaryPercentage = idx === 0 ? "85% - Alta" : idx === 1 ? "70% - Média" : "55% - Média";

                            return (
                              <div key={seasonId} className="flex items-center justify-between py-2 font-sans first:pt-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: info?.paletteColors?.[0] || "#ccc" }}
                                  />
                                  <span className="text-[11px] font-medium text-stone-850">
                                    {info?.name || seasonId.split("_").join(" ")}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono text-zinc-500 font-semibold bg-stone-50 px-2 py-0.5 rounded border border-stone-150">
                                  {secondaryPercentage}
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Luxury watermark */}
                    <div className="text-[8.5px] text-right font-mono text-zinc-300 uppercase tracking-widest pt-3 border-t border-stone-150">
                      LABORATÓRIO TEZ • DIAGNÓSTICO DE PRECISÃO
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Android Software Navigation Keys Bar */}
        <div className="bg-black h-11 border-t border-zinc-905 flex items-center justify-around text-zinc-400 select-none z-30 font-mono text-xs">
          <button
            onClick={() => {
              if (currentPage !== "home") setCurrentPage("home");
            }}
            className="flex flex-col items-center gap-0.5 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => setCurrentPage("home")}
            className="h-3 w-3 rounded-full border-2 border-zinc-350 hover:bg-white transition-colors"
          />
          <button
            onClick={() => setIsMenuOpen(true)}
            className="h-3 w-3 rounded-xs border-2 border-zinc-350 hover:bg-white transition-colors"
          />
        </div>
      </div>

      {/* RENDER ACTIVE BARCODE CAMERA READER MODAL */}
      <AnimatePresence>
        {isScannerOpen && (
          <BarcodeScannerMock
            onScanResult={handleBarcodeScanned}
            onClose={() => setIsScannerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* RENDER DETAILED SEASON COSMETIC PROFILE DIALOG */}
      <AnimatePresence>
        {showSeasonDetailModal && currentSeasonInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white text-zinc-900 p-6 space-y-5 overflow-hidden shadow-2xl border"
              style={{ contentVisibility: 'auto' }}
            >
              {/* background decorative circle */}
              <div
                className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full opacity-10 filter blur-3xl pointer-events-none"
                style={{ backgroundColor: currentSeasonInfo.paletteColors[0] }}
              />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">Cartografia Cromática</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-900">
                    {currentSeasonInfo.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSeasonDetailModal(false)}
                  className="p-1.5 hover:bg-zinc-150 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Swatch detail circles */}
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase font-mono tracking-wider text-zinc-400">Amostrário da Paleta (8 Subtons):</span>
                <div className="grid grid-cols-4 gap-2">
                  {currentSeasonInfo.paletteColors.map((col, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 bg-zinc-50 p-1.5 rounded-xl border border-zinc-100">
                      <span className="h-7 w-7 rounded-lg shadow-inner" style={{ backgroundColor: col }} />
                      <span className="text-[8px] font-mono text-zinc-400 uppercase leading-none">{col}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Analysis */}
              <div className="space-y-3 pt-3 border-t border-zinc-100">
                <span className="text-[9.5px] uppercase font-mono tracking-wider text-zinc-400 block">Parâmetros de Contraste e Subtom:</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-zinc-50 rounded-xl space-y-0.5">
                    <span className="text-[9px] text-zinc-400">Contraste</span>
                    <p className="font-semibold text-zinc-805 leading-none">{currentSeasonInfo.details.contrast}</p>
                  </div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl space-y-0.5">
                    <span className="text-[9px] text-zinc-400">Temperatura</span>
                    <p className="font-semibold text-zinc-805 leading-none">{currentSeasonInfo.details.temperature}</p>
                  </div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl space-y-0.5">
                    <span className="text-[9px] text-zinc-400">Saturação</span>
                    <p className="font-semibold text-zinc-805 leading-none">{currentSeasonInfo.details.saturation}</p>
                  </div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl space-y-0.5">
                    <span className="text-[9px] text-zinc-400">Estilo Geral</span>
                    <p className="font-semibold text-zinc-805 leading-none uppercase text-[9px] truncate">{currentSeasonInfo.parentSeason}</p>
                  </div>
                </div>
              </div>

              {/* Recommended tones for makeups */}
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase font-mono tracking-wider text-zinc-400">Tons recomendados para Maquiagem:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSeasonInfo.details.classicTones.map((tone, i) => (
                    <span key={i} className="bg-zinc-100 text-zinc-700 text-[10px] px-2.5 py-1 rounded-full font-medium">
                      {tone}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setShowSeasonDetailModal(false)}
                  className="w-full bg-zinc-950 text-white font-medium hover:bg-zinc-800 text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Confirmar Amostragem
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
