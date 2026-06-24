import { useState, useEffect } from "react";
import { Camera, X, RefreshCw, Check, Sparkles, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface BarcodeScannerMockProps {
  onScanResult: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScannerMock({ onScanResult, onClose }: BarcodeScannerMockProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cameraPermission, setCameraPermission] = useState<'checking' | 'allowed' | 'simulated'>('checking');

  // Realistic sample barcodes to quick-select to let users try easily
  const SAMPLE_BARCODES = [
    { label: "Batom Ruby Woo MAC (Vermelho Matte)", code: "773602120011" },
    { label: "Blush Orgasm NARS (Pêssego Brilhante)", code: "607845040132" },
    { label: "Base Maybelline Fit Me 120 (Claro Cálido)", code: "041554533431" },
    { label: "Batom Niina Secrets Hermione (Suave Malva)", code: "7891033481231" },
  ];

  useEffect(() => {
    // Simulate initial permission asking
    const timer = setTimeout(() => {
      setCameraPermission('simulated');
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (cameraPermission !== 'simulated' || !isScanning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Auto-trigger with first mock barcode for super sleek experience
          const randomBarcode = SAMPLE_BARCODES[Math.floor(Math.random() * SAMPLE_BARCODES.length)].code;
          setTimeout(() => {
            onScanResult(randomBarcode);
          }, 450);
          return 100;
        }
        return prev + 6;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [cameraPermission, isScanning]);

  const handleManualCode = (code: string) => {
    setIsScanning(false);
    onScanResult(code);
  };

  const handleRetry = () => {
    setProgress(0);
    setIsScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 text-white overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Camera className="h-4.5 w-4.5 text-zinc-400" />
            <span className="text-xs font-semibold tracking-wider font-mono uppercase text-zinc-300">
              Leitor de Código de Barras
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera Stage viewport */}
        <div className="relative aspect-square w-full bg-zinc-900 flex flex-col items-center justify-center overflow-hidden">
          {cameraPermission === 'checking' ? (
            <div className="text-center p-6 space-y-3">
              <RefreshCw className="h-6 w-6 text-zinc-400 animate-spin mx-auto" />
              <p className="text-xs text-zinc-500 font-mono">Iniciando câmera digital...</p>
            </div>
          ) : (
            <>
              {/* Overlay guides */}
              <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
                {/* Scanning line animation */}
                {isScanning && (
                  <motion.div
                    animate={{ top: ["8%", "92%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute left-4 right-4 h-0.5 bg-rose-500 shadow-md shadow-rose-500/50"
                  />
                )}

                {/* Corners accent decorators */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
              </div>

              {/* Status or Success View */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-12 text-center pointer-events-none">
                <span className="text-[10px] bg-black/40 text-rose-400 px-2 py-0.5 rounded-full font-mono font-medium tracking-widest uppercase">
                  {isScanning ? "Procurando Código..." : "Análise Concluída"}
                </span>

                {isScanning ? (
                  <div className="text-[10px] text-zinc-400 bg-black/50 p-2 rounded-xl">
                    Posicione o código de barras no centro do visor ou clique em um produto teste abaixo.
                  </div>
                ) : (
                  <div className="bg-emerald-900/80 p-2.5 rounded-full ring-4 ring-emerald-950 text-white animate-bounce">
                    <Check className="h-5 w-5" />
                  </div>
                )}

                {/* Real-time Simulated Video Background */}
                <div className="absolute inset-0 -z-10 opacity-30 bg-radial from-transparent to-black" />
                <div className="absolute inset-0 -z-20 flex flex-wrap items-center justify-center gap-1.5 opacity-20 p-2 scale-[1.05]">
                  {Array.from({ length: 40 }).map((_, idx) => (
                    <div key={idx} className="h-1 bg-white" style={{ width: `${Math.random() * 32 + 4}px` }} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress simulation stats */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-900">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-1">
            <span>MODO INTELIGENTE ATIVO</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-300 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Interactive Barcode Sandbox for easy testing */}
        <div className="p-4 space-y-3 bg-zinc-900/40">
          <h5 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            Produtos de Teste Rápido
          </h5>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_BARCODES.map((item) => (
              <button
                key={item.code}
                onClick={() => handleManualCode(item.code)}
                className="flex items-center justify-between text-left px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 transition-colors duration-150 cursor-pointer text-xs"
              >
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-medium text-zinc-200">{item.label}</span>
                  <span className="block text-[9px] text-zinc-500 font-mono">{item.code}</span>
                </div>
                <span className="text-[10px] text-zinc-400 hover:text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  Simular
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
