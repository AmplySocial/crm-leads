import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { waLink } from "@/lib/siteConfig";
import { useReveal } from "@/lib/useReveal";

const CTA_BG = "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/0bdb041df_generated_ad23828e.png";

export default function CTASection({ content }) {
  const { ref, visible } = useReveal();
  const wa = waLink(content.contact_whatsapp, "Olá, Robson! Gostaria de conversar sobre imóveis disponíveis.");

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      <img src={CTA_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-obsidian/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian" />

      <div ref={ref} className={`relative max-w-3xl mx-auto px-5 lg:px-8 text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="flex items-center gap-3 mb-6 justify-center">
          <span className="block w-8 h-px bg-gold" />
          <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">Vamos conversar</span>
          <span className="block w-8 h-px bg-gold" />
        </div>
        <h2 className="font-heading text-3xl md:text-5xl lg:text-[52px] leading-[1.12] text-white">
          {content.cta_title}
        </h2>
        <p className="mt-6 text-lg text-white/75 font-light max-w-xl mx-auto">
          {content.cta_text}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold">
            <MessageCircle className="w-4 h-4" />
            Falar pelo WhatsApp
          </a>
          <Link to="/imoveis" className="btn-ghost-gold">
            Ver imóveis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
