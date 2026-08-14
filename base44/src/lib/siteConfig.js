// Central configuration & helpers for the Robson real estate site.

export const DEFAULT_CONTENT = {
  corretor_name: "Robson Corretor de Imóveis",
  creci: "CRECI-MG 61483",
  hero_headline: "Encontre o imóvel certo para o próximo capítulo da sua vida.",
  hero_subheadline:
    "Atendimento personalizado para quem busca comprar, vender ou investir em imóveis em Santa Luzia e região.",
  about_title: "Mais do que encontrar imóveis. Encontrar oportunidades.",
  about_text:
    "Meu objetivo é tornar a compra, venda ou investimento em um imóvel uma experiência mais segura, transparente e personalizada.",
  sell_title: "Tem um imóvel para vender?",
  sell_text:
    "Conte com um atendimento profissional para apresentar sua propriedade às pessoas certas.",
  investment_title: "Propriedades também podem ser grandes oportunidades.",
  investment_text:
    "Encontre terrenos, sítios, fazendas e imóveis com potencial para diferentes objetivos de investimento.",
  cta_title: "Seu próximo imóvel pode estar mais perto do que você imagina.",
  cta_text: "Fale com Robson e encontre uma propriedade que faça sentido para você.",
  contact_phone: "(31) 97595-3346",
  contact_whatsapp: "5531975953346",
  contact_email: "robsoncorretor46@gmail.com",
  contact_address: "R. Adolfo Loureiro, 317 - São João Batista, Santa Luzia - MG, 33010-100",
  contact_city: "Santa Luzia - MG",
  seo_title: "Robson Corretor de Imóveis | Imóveis em Santa Luzia MG",
  seo_description:
    "Compra, venda e investimento em imóveis residenciais, casas, sítios, terrenos e fazendas em Santa Luzia e região, Minas Gerais. CRECI-MG 61483.",
  google_rating: 5.0,
  google_reviews_count: 2,
};

export const LOGO_URL =
  "https://media.base44.com/images/public/user_6a7b404e4ac366cbbd3e7447/2e2422790_image.png";

export const DEFAULT_WHATSAPP = "5531975953346";

export function waLink(number, message) {
  const num = (number || DEFAULT_WHATSAPP).replace(/\D/g, "");
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${num}?text=${text}`;
}

export function formatPrice(value) {
  if (value == null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export const PROPERTY_TYPES = ["Casa", "Sítio", "Terreno", "Fazenda", "Outros"];

export const CATEGORIES = [
  {
    name: "Casas",
    type: "Casa",
    description: "Residências para diferentes estilos de vida.",
  },
  {
    name: "Sítios",
    type: "Sítio",
    description: "Espaço, tranquilidade e contato com a natureza.",
  },
  {
    name: "Terrenos",
    type: "Terreno",
    description: "Opções para construir ou investir.",
  },
  {
    name: "Fazendas",
    type: "Fazenda",
    description: "Grandes propriedades para diferentes objetivos.",
  },
];

export const DIFFERENTIALS = [
  {
    icon: "Handshake",
    title: "ATENDIMENTO PERSONALIZADO",
    text: "Você fala diretamente com quem entende suas necessidades.",
  },
  {
    icon: "ShieldCheck",
    title: "NEGOCIAÇÃO TRANSPARENTE",
    text: "Informações claras para você tomar decisões com segurança.",
  },
  {
    icon: "MapPin",
    title: "CONHECIMENTO DA REGIÃO",
    text: "Atendimento voltado para Santa Luzia e região.",
  },
  {
    icon: "Building2",
    title: "IMÓVEIS PARA DIFERENTES OBJETIVOS",
    text: "Residências, terrenos, sítios, fazendas e oportunidades de investimento.",
  },
];
