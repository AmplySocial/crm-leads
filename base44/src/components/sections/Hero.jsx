import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { waLink } from "@/lib/siteConfig";

const HERO_IMG = "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/77c6ced4b_generated_12fe5a1e.png";

export default function Hero({ content }) {
  const heroImg = content.hero_image || HERO_IMG;
  const wa = waLink(
    content.contact_whatsapp,
    "Olá, Robson! Acessei seu site e gostaria de receber informações sobre imóveis disponíveis."
  );

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-7 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="block w-10 h-px bg-gold" />
            <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">
              {content.creci} · {content.contact_city}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] leading-[1.08] text-white animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {content.hero_headline}
          </h1>

          <p className="mt-7 text-lg text-white/75 font-light leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: "0.35s" }}>
            {content.hero_subheadline}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <Link to="/imoveis" className="btn-gold">
              Encontrar meu imóvel
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost-gold">
              <MessageCircle className="w-4 h-4" />
              Falar com Robson
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6 animate-fade-up" style={{ animationDelay: "0.65s" }}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-gold text-sm">★</span>
                ))}
              </div>
              <span className="text-xs text-white/60">{content.google_rating?.toFixed?.(1) || "5,0"} no Google</span>
            </div>
            <span className="block w-px h-4 bg-white/20" />
            <span className="text-xs tracking-wide-luxe uppercase text-white/60">
              {content.corretor_name}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold to-transparent" />
      </div>
    </section>
  );
}
