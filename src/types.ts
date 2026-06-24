export type SeasonId =
  | 'primavera_clara'
  | 'primavera_quente'
  | 'primavera_brilhante'
  | 'verao_claro'
  | 'verao_frio'
  | 'verao_suave'
  | 'outono_suave'
  | 'outono_quente'
  | 'outono_escuro'
  | 'inverno_frio'
  | 'inverno_brilhante'
  | 'inverno_escuro';

export interface SeasonInfo {
  id: SeasonId;
  name: string;
  parentSeason: 'primavera' | 'verao' | 'outono' | 'inverno';
  description: string;
  paletteColors: string[]; // 8 distinct beautiful color swatches
  theme: {
    background: string;
    text: string;
    primary: string;
    accent: string;
    cardBg: string;
    accentText: string;
    glassBorder: string;
    badgeBg: string;
    barBg: string;
  };
  details: {
    contrast: string;
    temperature: string;
    saturation: string;
    classicTones: string[];
  };
}

export interface MakeupProduct {
  id: string;
  name: string;
  brand: string;
  type: string;
  barcode: string;
  primarySeason: SeasonId;
  compatibleSeasons: SeasonId[];
  colors: string[];
  description: string;
  parameters: {
    temp: string;
    intensity: string;
    depth: string;
  };
}

export interface AnalysisResult extends MakeupProduct {
  source: 'local_database' | 'gemini_ai' | 'local_smart_fallback';
  compatibilityScore: 'Excelente' | 'Boa Coerência' | 'Pouca Afinidade' | 'Paleta Não Informada';
  aiExplanation?: string;
}
