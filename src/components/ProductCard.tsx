import { MakeupProduct, SeasonId } from "../types";
import { SEASONS_DATA } from "../seasonsData";
import { Sparkles, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface ProductCardProps {
  key?: string;
  product: MakeupProduct;
  userPalette: SeasonId | null;
  onSelectProduct?: (product: MakeupProduct) => void;
}

export default function ProductCard({ product, userPalette, onSelectProduct }: ProductCardProps) {
  // Determine compatibility level
  const isPerfectMatch = userPalette === product.primarySeason;
  const isCompatible = userPalette ? product.compatibleSeasons.includes(userPalette) : false;

  let compStatus: { label: string; textClass: string; bgClass: string; icon: any } = {
    label: "Selecione sua cartela",
    textClass: "text-zinc-500",
    bgClass: "bg-zinc-100",
    icon: HelpCircle,
  };

  if (userPalette) {
    if (isPerfectMatch) {
      compStatus = {
        label: "Excelente Afinidade",
        textClass: "text-emerald-700 font-medium",
        bgClass: "bg-emerald-50/90 border border-emerald-200/60",
        icon: CheckCircle,
      };
    } else if (isCompatible) {
      compStatus = {
        label: "Boa Coerência",
        textClass: "text-amber-700 font-medium",
        bgClass: "bg-amber-50/80 border border-amber-200/50",
        icon: Sparkles,
      };
    } else {
      compStatus = {
        label: "Pouca Afinidade",
        textClass: "text-rose-700",
        bgClass: "bg-rose-50/70 border border-rose-200/45",
        icon: AlertCircle,
      };
    }
  }

  // Get matching season detail
  const primarySeasonInfo = SEASONS_DATA[product.primarySeason];

  const primaryColor = product.colors?.[0] || "#8B4513";
  const secondaryColor = product.colors?.[1] || product.colors?.[0] || "#D2691E";
  const productType = product.type || "Batom";

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct?.(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-[#4A3728]/15 p-5 transition-all duration-300 hover:shadow-md hover:border-[#4A3728]/35 cursor-pointer text-left"
      style={{ contentVisibility: 'auto' }}
    >
      <div className="space-y-4">
        {/* Aspect-square high fidelity layout representation of geometric patterns */}
        <div className="aspect-square bg-stone-50 rounded-lg flex items-center justify-center relative overflow-hidden border border-[#4A3728]/5 group-hover:bg-stone-100/50 transition-colors">
          {productType.toLowerCase().includes("batom") ? (
            <div className="w-16 h-28 bg-stone-205/40 rounded-t-lg p-1.5 flex flex-col justify-end shadow-xs relative">
              <div 
                className="w-full h-14 rounded-t-sm transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `linear-gradient(to top, ${secondaryColor}, ${primaryColor})` }} 
              />
              <div className="w-full h-7 bg-zinc-950 rounded-b-sm border-t border-zinc-900" />
            </div>
          ) : (
            <div 
              className="w-24 h-24 border-2 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-12" 
              style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}15` }}
            >
              <div 
                className="w-16 h-16 rounded-full shadow-xs"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
          )}
          
          {/* Floating tiny pill badges for match indicator */}
          {userPalette && (
            <span className={`absolute top-2.5 right-2.5 text-[9px] font-semibold font-sans px-2 py-0.5 rounded-full transition-opacity ${
              isPerfectMatch
                ? "bg-[#4A3728] text-white"
                : isCompatible
                ? "bg-[#4A3728]/10 text-[#4A3728] border border-[#4A3728]/25"
                : "bg-rose-50 text-rose-800 border border-rose-250/50"
            }`}>
              {isPerfectMatch ? "COMPATÍVEL" : isCompatible ? "HARMONIA ALTA" : "DESELEGÁVEL"}
            </span>
          )}
        </div>

        {/* Top Header Label */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#4A3728]/60">
              {product.brand}
            </span>
            {/* Swatch dots list */}
            <div className="flex space-x-1">
              {product.colors.map((color, cIdx) => (
                <span
                  key={cIdx}
                  className="h-3 w-3 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: color }}
                  title="Código de cor"
                />
              ))}
            </div>
          </div>
          <h4 className="text-lg font-normal italic font-serif leading-tight text-[#4A3728] group-hover:opacity-90">
            {product.name}
          </h4>
        </div>

        {/* Product description statement */}
        <p className="text-[11px] text-[#4A3728]/70 font-sans leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Dimension parameters info */}
        <div className="grid grid-cols-3 gap-1 py-1 px-1.5 bg-[#4A3728]/5 rounded-sm text-center font-mono text-[9px] text-[#4A3728]/80">
          <div>
            <span className="block text-[8px] opacity-60">TEMP</span>
            <span className="font-semibold">{product.parameters.temp}</span>
          </div>
          <div>
            <span className="block text-[8px] opacity-60">BRILHO</span>
            <span className="font-semibold truncate block px-0.5">{product.parameters.intensity.split('/')[0]}</span>
          </div>
          <div>
            <span className="block text-[8px] opacity-60">PROF.</span>
            <span className="font-semibold">{product.parameters.depth}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-4 pt-4 border-t border-[#4A3728]/10 space-y-2">
        {/* Match description text */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs ${compStatus.bgClass} ${compStatus.textClass}`}>
          <compStatus.icon className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-sans tracking-tight">{compStatus.label}</span>
        </div>

        {/* Target season labels */}
        <div className="space-y-1">
          <div className="text-[8px] text-[#4A3728]/50 font-mono tracking-widest uppercase">Cartelas Recomendadas:</div>
          <div className="flex flex-wrap gap-1">
            <span className="inline-flex items-center rounded-sm bg-[#4A3728] text-white font-medium text-[8px] px-1.5 py-0.5 uppercase tracking-wider">
              {primarySeasonInfo?.name || product.primarySeason.split('_').join(' ')}
            </span>
            {product.compatibleSeasons.slice(0, 2).map((seasonId) => {
              const info = SEASONS_DATA[seasonId];
              return (
                <span
                  key={seasonId}
                  className="inline-flex items-center rounded-sm bg-[#4A3728]/10 text-[#4A3728] border border-[#4A3728]/10 text-[8px] px-1.5 py-0.5 uppercase tracking-wider"
                >
                  {info?.name || seasonId.split('_').join(' ')}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
