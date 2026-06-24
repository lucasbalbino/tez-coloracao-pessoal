import { SeasonId } from "./types";

export interface Edition {
  id: string;
  date: string; // Formato DD/MM/AAAA
  title: string;
  summary: string; // Início do texto usado na Home e na listagem
  content: string; // Resenha/review completo com parágrafos ricos em detalhes técnicos
  productIds: string[]; // IDs de produtos relacionados da base
  author: string;
  readTime: string;
}

export const EDITIONS_DATA: Edition[] = [
  {
    id: "edicao_05_06_2026",
    date: "05/06/2026",
    title: "O Segredo dos Subtons Frios: Conquistando o Efeito Vinil Luxuoso",
    summary: "Se você tem o subtom de pele predominantemente frio ou suave, como as cartelas de Verão Claro ou Verão Frio, sabe como é desafiador achar o acabamento vinílico perfeito que não altere a cor ao longo do dia.",
    content: `Se você tem o subtom de pele predominantemente frio, luminoso ou suave (como as fabulosas cartelas de Verão Claro, Verão Frio ou Inverno Frio), sabe muito bem como é desafiador encontrar aquele acabamento vinílico hidratante e perfeito que exibe fidelidade de pigmento sem oxidar ou amarelar após algumas horas de uso.

Nesta edição exclusiva do laboratório **tez**, fizemos uma análise minuciosa de como os pigmentos frios agem em simbiose com finas partículas de acabamento em gloss ou vinil líquido. O nosso destaque vai para a fórmula inteligente da **Maybelline NY** com o seu **Super Stay Vinil Ink na cor Coy**. Ele traz uma matização fresca em rosa malva que impede a interferência de reflexos alaranjados, ideal para o perfil fresco de Verão Claro. 

Para harmonizar as maçãs do rosto com a luminosidade fria dessa maquiagem, combinamos o review com o icônico **Blush Líquido Soft Pinch na cor Happy da Rare Beauty**. Ele possui uma base de blush fria purpurina-firme que oferece alta fusão celular, mantendo a temperatura da pele impecavelmente fresca e corada de forma natural. 

**Veredito técnico tez:** Uma combinação aristocrática para subtons puramente frios e claros, proporcionando frescor instantâneo e contraste equilibrado ideal para o dia a dia.`,
    productIds: ["prod_13", "prod_14"],
    author: "Amanda Cavalcante (Colorometrista-Chefe)",
    readTime: "3 min de leitura"
  },
  {
    id: "edicao_29_05_2026",
    date: "29/05/2026",
    title: "Sinfonia Dourada: Texturas Solares e Iluminação de Primavera",
    summary: "O esplendor das cartelas quentes e vibrantes pede reflexos dourados e fundos pêssego ou pimenta. Analisamos o match cirúrgico entre blushes solares e bases radiantes que valorizam a beleza luminosa.",
    content: `O esplendor das cartelas quentes e vibrantes (com especial ênfase em Primavera Quente, Primavera Clara ou Outono Quente) clama por reflexos dourados e bases com fundos de pêssego, damasco e coral. 

Nesta semana, nosso editorial mergulhou na resenha do clássico incontornável **Blush Orgasm da NARS**. Este produto é um marco mundial em harmonização térmica de subtons: a fusão do rosa pêssego quente com partículas microscópicas de cintilância dourada cria uma difusão de luz maravilhosa, valorizando peles vivas e radiantes de Primavera Clássica. 

Para complementação de pele, analisamos também o **Blush Stick da Bruna Tavares na cor Peach** e a **Base Fit Me 120 Claro Cálido da Maybelline**. Ambos possuem uma formulação com carga de amarelo-quente neutro que respeita os limites da pele solar, impedindo que o produto pareça artificial ou acinzentado sob as luzes de estúdio.

**Como usar no seu dia a dia:** Aplique o Blush Stick Peach suavemente nas têmporas, selando com uma leve bruma do Blush Orgasm por cima para acentuar o reflexo holográfico dourado.`,
    productIds: ["prod_2", "prod_4", "prod_9"],
    author: "Mariana Mendes (Estilista de Visagismo)",
    readTime: "4 min de leitura"
  },
  {
    id: "edicao_22_05_2026",
    date: "22/05/2026",
    title: "O Triunfo do Matte Opaco: Tons Terrosos do Outono Suave",
    summary: "A elegância dos subtons terrosos e camurça velados está em voga. Conheça as resenhas do clássico batom Hermione de Niina Secrets e a sombra de olhos que enaltecem a maquiagem aveludada.",
    content: `Se a sua cartela pessoal de cores é classificada sob o Método Sazonal Estendido como Outono Suave, Outono Quente ou Verão Suave, sua beleza é enaltecida por contrastes velados, macios e terrosos de baixa intensidade. O brilho excessivo ou o neon super brilhoso costuma competir com o seu magnetismo sutil. 

Hoje, avaliamos o badaladíssimo **Batom Líquido Hermione da Niina Secrets** (Eudora). Ele se destaca por sua complexa mistura de malva acinzentado com fundo terroso neutro-quente. Trata-se de uma cor camaleônica que ganha tonalidades únicas em cada indivíduo, mantendo sempre a opacidade mate aveludada que é regra de ouro do Outono Suave. 

Adicionamos a esta edição a **Sombra Cremosa Paint Pot na cor Groundwork da MAC Cosmetics**. Sua característica mate-cetim desliza suavemente sobre as pálpebras proporcionando uma profundidade natural impecável. Juntas, estas escolhas compõem o look chic-minimalista definitivo.

**Recomendação de Luxo:** Finalize contornando levemente as bordas dos lábios com o **Lápis de Boca Boldly Bare da MAC**, esfumando para dentro antes de aplicar o Batom Hermione para maximizar a ilusão de lábios desenhados.`,
    productIds: ["prod_5", "prod_8", "prod_12"],
    author: "Amanda Cavalcante (Colorometrista-Chefe)",
    readTime: "3 min de leitura"
  }
];
