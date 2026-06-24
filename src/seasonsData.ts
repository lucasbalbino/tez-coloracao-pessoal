import { SeasonInfo, SeasonId } from "./types";

export const SEASONS_DATA: Record<SeasonId, SeasonInfo> = {
  primavera_clara: {
    id: "primavera_clara",
    name: "Primavera Clara",
    parentSeason: "primavera",
    description: "Luminosa, delicada, radiante e fresca. Tons pastéis acesos dominam este perfil alegre.",
    paletteColors: ["#FF8C69", "#FFA07A", "#FFD700", "#40E0D0", "#FFB6C1", "#AFEEEE", "#FF7F50", "#E0F7FA"],
    theme: {
      background: "bg-gradient-to-br from-[#FFF5F2] to-[#FFFDEC]",
      text: "text-amber-950",
      primary: "bg-[#FF7F50]",
      accent: "border-[#FFB6C1]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#E65100]",
      glassBorder: "border-[#FFEBE3]",
      badgeBg: "bg-[#FFEBE3]",
      barBg: "bg-amber-100"
    },
    details: {
      contrast: "Baixo para médio",
      temperature: "Neutra-quente",
      saturation: "Média-alta (luminosa)",
      classicTones: ["Rosa Pêssego", "Coral Claro", "Turquesa", "Amarelo Manteiga"]
    }
  },
  primavera_quente: {
    id: "primavera_quente",
    name: "Primavera Quente",
    parentSeason: "primavera",
    description: "Vibrante, solar, acolhedora e extremamente dourada. Irradia calor e energia de média profundidade.",
    paletteColors: ["#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#ADFF2F", "#00FF7F", "#EE82EE", "#FF1493"],
    theme: {
      background: "bg-gradient-to-br from-[#FFF8E7] to-[#FFE0B2]",
      text: "text-orange-950",
      primary: "bg-[#FF8C00]",
      accent: "border-[#FFA500]",
      cardBg: "bg-white/85 backdrop-blur-md",
      accentText: "text-[#D35400]",
      glassBorder: "border-[#FFE5D9]",
      badgeBg: "bg-[#FFE0B2]",
      barBg: "bg-orange-100"
    },
    details: {
      contrast: "Médio",
      temperature: "Puramente Quente",
      saturation: "Brilhante",
      classicTones: ["Laranja Damasco", "Verde Folha", "Dourado", "Papoula"]
    }
  },
  primavera_brilhante: {
    id: "primavera_brilhante",
    name: "Primavera Brilhante",
    parentSeason: "primavera",
    description: "Contrastante, cintilante, elétrica e cristalina. Alta saturação de tirar o fôlego.",
    paletteColors: ["#FF1493", "#FF4500", "#FF00FF", "#00FFFF", "#39FF14", "#FFEF00", "#FF007F", "#4B0082"],
    theme: {
      background: "bg-gradient-to-br from-[#FFF0F5] to-[#ECFFEE]",
      text: "text-zinc-900",
      primary: "bg-[#FF1493]",
      accent: "border-[#00FFFF]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#E0115F]",
      glassBorder: "border-[#FFD1E8]",
      badgeBg: "bg-[#FFD1E8]",
      barBg: "bg-pink-100"
    },
    details: {
      contrast: "Médio para Alto",
      temperature: "Neutra-quente",
      saturation: "Puramente Brilhante",
      classicTones: ["Pink Vibrante", "Verde Limão", "Turquesa Elétrico", "Laranja Neon"]
    }
  },

  verao_claro: {
    id: "verao_claro",
    name: "Verão Claro",
    parentSeason: "verao",
    description: "Delicado, suave, ensolaradamente fresco e etéreo. Cores claras e sutilmente acinzentadas.",
    paletteColors: ["#98FB98", "#AFEEEE", "#E6E6FA", "#FFB6C1", "#F08080", "#B0C4DE", "#D8BFD8", "#F5F5DC"],
    theme: {
      background: "bg-gradient-to-br from-[#F3F8FC] to-[#FDF4F5]",
      text: "text-slate-900",
      primary: "bg-[#8FA9C4]",
      accent: "border-[#FFD1DC]",
      cardBg: "bg-white/75 backdrop-blur-md",
      accentText: "text-[#546A8B]",
      glassBorder: "border-[#E3ECF5]",
      badgeBg: "bg-[#E3ECF5]",
      barBg: "bg-[#EBEFF4]"
    },
    details: {
      contrast: "Baixo",
      temperature: "Neutra-fria",
      saturation: "Suave",
      classicTones: ["Azul Bebê", "Arco-Íris Antigo", "Rosa Giz", "Verde Menta Pastel"]
    }
  },
  verao_frio: {
    id: "verao_frio",
    name: "Verão Frio",
    parentSeason: "verao",
    description: "Sereno, clássico, aristocrático e puramente frio. Tons de mar e lavandas frescas ornamentam este perfil.",
    paletteColors: ["#4169E1", "#6A5ACD", "#7B68EE", "#8A2BE2", "#48D1CC", "#FF69B4", "#C0C0C0", "#000080"],
    theme: {
      background: "bg-gradient-to-br from-[#EEF4FA] to-[#E8EBF5]",
      text: "text-cyan-950",
      primary: "bg-[#4B6B94]",
      accent: "border-[#7B68EE]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#3B4E6B]",
      glassBorder: "border-[#E1E7F3]",
      badgeBg: "bg-[#DDE4F3]",
      barBg: "bg-sky-100"
    },
    details: {
      contrast: "Médio",
      temperature: "Puramente Fria",
      saturation: "Suave/Média",
      classicTones: ["Azul Royal Velado", "Lavanda Escura", "Magenta Frio", "Cinza Prata"]
    }
  },
  verao_suave: {
    id: "verao_suave",
    name: "Verão Suave",
    parentSeason: "verao",
    description: "Aveludado, enevoado, misterioso e reservado. Tons opacos, acinzentados de alta sofisticação natural.",
    paletteColors: ["#778899", "#708090", "#B0C4DE", "#BC8F8F", "#8B814C", "#556B2F", "#8FBC8F", "#8A8A8A"],
    theme: {
      background: "bg-gradient-to-br from-[#F5F5F5] to-[#E6EAEB]",
      text: "text-zinc-800",
      primary: "bg-[#9B8784]",
      accent: "border-[#BC8F8F]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#6E5A57]",
      glassBorder: "border-[#E1E5E6]",
      badgeBg: "bg-[#EAE2E1]",
      barBg: "bg-zinc-100"
    },
    details: {
      contrast: "Baixo para Médio",
      temperature: "Neutra-fria",
      saturation: "Muito Suave/Baixa",
      classicTones: ["Rosa Chá", "Verde Musgo Suave", "Azul Bruma", "Ameixa Velado"]
    }
  },

  outono_suave: {
    id: "outono_suave",
    name: "Outono Suave",
    parentSeason: "outono",
    description: "Aconchegante, elegante, camurça escovada e terrosa. Tons naturais, amortecidos e polidos.",
    paletteColors: ["#8FBC8F", "#BDB76B", "#CD853F", "#BC8F8F", "#CD5C5C", "#8B7355", "#D2B48C", "#FFF8DC"],
    theme: {
      background: "bg-gradient-to-br from-[#FAF0E6] to-[#EAE0D5]",
      text: "text-amber-950",
      primary: "bg-[#A0785C]",
      accent: "border-[#CD853F]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#8A5229]",
      glassBorder: "border-[#EFE5DC]",
      badgeBg: "bg-[#EAE0D5]",
      barBg: "bg-stone-100"
    },
    details: {
      contrast: "Baixo para Médio",
      temperature: "Neutra-quente",
      saturation: "Muito Suave/Fosca",
      classicTones: ["Verde Oliva Claro", "Rosado Rústico", "Café com Leite", "Nude Quente"]
    }
  },
  outono_quente: {
    id: "outono_quente",
    name: "Outono Quente",
    parentSeason: "outono",
    description: "Opulento, suntuoso, rústico e puramente quente. Florestas de tons dourados e avermelhados de outorga.",
    paletteColors: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#B8860B", "#556B2F", "#808000", "#800000"],
    theme: {
      background: "bg-gradient-to-br from-[#FFF5EC] to-[#F1DFC8]",
      text: "text-[#4A2711]",
      primary: "bg-[#C45E20]",
      accent: "border-[#B8860B]",
      cardBg: "bg-white/85 backdrop-blur-md",
      accentText: "text-[#9E450E]",
      glassBorder: "border-[#EFE1D3]",
      badgeBg: "bg-[#ECDAC1]",
      barBg: "bg-amber-100"
    },
    details: {
      contrast: "Médio",
      temperature: "Puramente Quente",
      saturation: "Suave/Fosca",
      classicTones: ["Mostarda Rico", "Terracota Sólido", "Verde Floresta", "Pinhão"]
    }
  },
  outono_escuro: {
    id: "outono_escuro",
    name: "Outono Escuro",
    parentSeason: "outono",
    description: "Clássico profundo, misterioso, ricamente pigmentado e morno. Lados escuros, intensos e requintados.",
    paletteColors: ["#431A05", "#5C1D24", "#3D2B1F", "#1D301D", "#B85A1C", "#8B0000", "#E1A142", "#800020"],
    theme: {
      background: "bg-gradient-to-br from-[#F5EBE6] to-[#DCDEC9]/50",
      text: "text-[#3D1401]",
      primary: "bg-[#5C1D24]",
      accent: "border-[#A0522D]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#8B0000]",
      glassBorder: "border-[#E7D9D3]",
      badgeBg: "bg-[#E6D4CB]",
      barBg: "bg-[#F3E7E1]"
    },
    details: {
      contrast: "Médio para Alto",
      temperature: "Neutra-quente",
      saturation: "Suave a Média",
      classicTones: ["Vinho Bordeaux", "Mostarda Queimado", "Preto Chocolate", "Verde Militar Escuro"]
    }
  },

  inverno_frio: {
    id: "inverno_frio",
    name: "Inverno Frio",
    parentSeason: "inverno",
    description: "Irmão do contraste marcante, gélido, majestoso e altivo. Tons azuis elétricos e vermelhos carmim puros.",
    paletteColors: ["#0000FF", "#000080", "#FF007F", "#8A2BE2", "#008080", "#4B0082", "#FF0000", "#FFFFFF"],
    theme: {
      background: "bg-gradient-to-br from-[#EBF3FF] to-[#FCEBEF]",
      text: "text-indigo-950",
      primary: "bg-[#1E3A8A]",
      accent: "border-[#FF007F]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#C41E3A]",
      glassBorder: "border-[#D6E4FF]",
      badgeBg: "bg-[#E0EAFF]",
      barBg: "bg-blue-100"
    },
    details: {
      contrast: "Alto",
      temperature: "Puramente Fria",
      saturation: "Brilhante",
      classicTones: ["Azul Cobalto", "Fuchsia Carmim", "Prata Metálico", "Branco Alvo"]
    }
  },
  inverno_brilhante: {
    id: "inverno_brilhante",
    name: "Inverno Brilhante",
    parentSeason: "inverno",
    description: "Fabuloso, elétrico, puramente contrastado e audaz. O reino do preto e neon com batom fúcsia cintilante.",
    paletteColors: ["#FA016D", "#39FF14", "#01FFFF", "#FFFFFF", "#000000", "#7B00FF", "#D70040", "#FFFF00"],
    theme: {
      background: "bg-gradient-to-br from-[#FFF0F4] to-[#E3F2FD]/80",
      text: "text-slate-900",
      primary: "bg-[#FA016D]",
      accent: "border-[#01FFFF]",
      cardBg: "bg-white/80 backdrop-blur-md",
      accentText: "text-[#FA016D]",
      glassBorder: "border-[#FFD7EB]",
      badgeBg: "bg-[#FFDAEB]",
      barBg: "bg-slate-100"
    },
    details: {
      contrast: "Muito Alto",
      temperature: "Neutra-fria",
      saturation: "Altíssima / Brilhante",
      classicTones: ["Preto Absoluto", "Verde Esmeralda", "Fúcsia Néon", "Rosa Shocking"]
    }
  },
  inverno_escuro: {
    id: "inverno_escuro",
    name: "Inverno Escuro",
    parentSeason: "inverno",
    description: "Profundo, elegante, enigmático e emoldurado. Mistura de realeza gelada com florestas noturnas profundas.",
    paletteColors: ["#2C0D1B", "#1C1D3A", "#0E1C15", "#4B0082", "#800020", "#301934", "#480607", "#FFFFFF"],
    theme: {
      background: "bg-gradient-to-br from-[#EAEBF2] to-[#F1E5EC]",
      text: "text-slate-950",
      primary: "bg-[#2A103D]",
      accent: "border-[#800020]",
      cardBg: "bg-white/80 backdrop-blur" + "-md",
      accentText: "text-[#580018]",
      glassBorder: "border-[#E1DFEB]",
      badgeBg: "bg-[#E6E0F1]",
      barBg: "bg-[#EDE9F5]"
    },
    details: {
      contrast: "Alto",
      temperature: "Neutra-fria",
      saturation: "Brilhante para Média",
      classicTones: ["Cereja Escuro", "Petróleo", "Roxo Berinjela", "Preto Ônix"]
    }
  }
};

export const DEFAULT_THEME = {
  background: "bg-[#F7F3E9]",
  text: "text-[#4A3728]",
  primary: "bg-[#4A3728] text-[#F7F3E9] hover:bg-opacity-90",
  accent: "border-[#4A3728]/15",
  cardBg: "bg-white/90 backdrop-blur-md",
  accentText: "text-[#4A3728]",
  glassBorder: "border-[#4A3728]/10",
  badgeBg: "bg-[#4A3728]/10 text-[#4A3728]",
  barBg: "bg-[#4A3728]/15"
};
