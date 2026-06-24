import { SEASONS_DATA } from "../seasonsData";
import { SeasonId } from "../types";
import { Check, Sparkles } from "lucide-react";

interface PaletteSelectorProps {
  selectedId: SeasonId | null;
  onSelect: (id: SeasonId) => void;
}

export default function PaletteSelector({ selectedId, onSelect }: PaletteSelectorProps) {
  const seasons = Object.values(SEASONS_DATA);

  // Group by parent season (Primavera, Verão, Outono, Inverno)
  const groupedSeasons = {
    primavera: seasons.filter((s) => s.parentSeason === "primavera"),
    verao: seasons.filter((s) => s.parentSeason === "verao"),
    outono: seasons.filter((s) => s.parentSeason === "outono"),
    inverno: seasons.filter((s) => s.parentSeason === "inverno"),
  };

  const getParentLabel = (parent: string) => {
    switch (parent) {
      case "primavera":
        return { label: "Primavera 🌸", desc: "Quente, brilhante, alegre e luminosa" };
      case "verao":
        return { label: "Verão ☀️", desc: "Frio, suave, leve e acinzentado sutil" };
      case "outono":
        return { label: "Outono 🍂", desc: "Quente, opaco, terroso e profundo" };
      case "inverno":
        return { label: "Inverno ❄️", desc: "Frio, intenso, dramático e contrastante" };
      default:
        return { label: "", desc: "" };
    }
  };

  return (
    <div id="palette-selector-viewport" className="space-y-8">
      <div className="text-center max-w-md mx-auto space-y-2">
        <h3 className="text-sm tracking-widest uppercase font-mono text-zinc-500">Cadastro de Cartela</h3>
        <h2 className="text-2xl font-semibold tracking-tight">Qual é a sua beleza sazonal?</h2>
        <p className="text-xs text-zinc-500 font-sans leading-relaxed">
          Selecione uma das 12 vertentes do Método Sazonal Estendido. A tez do seu aplicativo se adaptará inteiramente ao seu temperamento cromático.
        </p>
      </div>

      <div className="space-y-8">
        {(Object.keys(groupedSeasons) as Array<keyof typeof groupedSeasons>).map((group) => {
          const { label, desc } = getParentLabel(group);
          return (
            <div key={group} className="space-y-3" id={`group-${group}`}>
              <div className="border-b border-zinc-100 pb-1.5 px-1">
                <h4 className="text-xs font-semibold tracking-wider text-zinc-600 uppercase font-mono">{label}</h4>
                <p className="text-[10px] text-zinc-400">{desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {groupedSeasons[group].map((season) => {
                  const isSelected = selectedId === season.id;
                  return (
                    <button
                      key={season.id}
                      id={`btn-season-${season.id}`}
                      onClick={() => onSelect(season.id)}
                      className={`relative flex flex-col justify-between p-3.5 rounded-xl text-left border transition-all duration-300 group cursor-pointer ${
                        isSelected
                          ? "border-zinc-950 bg-zinc-950/5 shadow-sm scale-[0.99]"
                          : "border-zinc-200 hover:border-zinc-400 bg-white"
                      }`}
                      style={{ contentVisibility: 'auto' }}
                    >
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-center justify-between">
                          <span className={`text-[13px] font-medium tracking-tight text-zinc-900 group-hover:text-black`}>
                            {season.name}
                          </span>
                          {isSelected && (
                            <div className="bg-zinc-900 text-white rounded-full p-0.5">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-sans line-clamp-2 leading-relaxed">
                          {season.description}
                        </p>
                      </div>

                      {/* Swatch indicator row */}
                      <div className="mt-3 flex items-center justify-between w-full pt-2.5 border-t border-zinc-100/55">
                        <div className="flex -space-x-1 overflow-hidden">
                          {season.paletteColors.slice(0, 4).map((color, idx) => (
                            <span
                              key={idx}
                              className="inline-block h-4 w-4 rounded-full ring-2 ring-white"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                          {season.details.temperature.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-2xl flex items-start gap-3 max-w-xl mx-auto">
        <div className="p-2 bg-white rounded-xl shadow-xs border border-zinc-100 mt-0.5">
          <Sparkles className="h-4 w-4 text-zinc-700" />
        </div>
        <div>
          <h5 className="text-xs font-semibold text-zinc-800">Por que se cadastrar?</h5>
          <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
            Ao definir sua cartela pessoal, nosso provador digital analisa instantaneamente bases, batons, blushs e sombras para classificar se a composição é fria ou quente, permitindo-lhe acertar no tom sem errar.
          </p>
        </div>
      </div>
    </div>
  );
}
