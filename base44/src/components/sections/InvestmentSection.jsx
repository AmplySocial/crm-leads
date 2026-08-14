import { TrendingUp, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/siteConfig";
import { useReveal } from "@/lib/useReveal";

const INVEST_BG = "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/e74e690be_generated_e23d492c.png";

export default function InvestmentSection({ content }) {
  const { ref, visible } = useReveal();
  const wa = waLink(content.contact_whatsapp, "Olá, Robson! Gostaria de falar sobre oportunidades de investimento em imóveis.");

  return (
    <section className="py-20 lg:py-28 bg-charcoal/40">
      <div ref={ref} className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`relative transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="rounded-lg overflow-hidden border border-white/8 shadow-luxe">
              <img src={INVEST_BG} alt="Investimento imobiliário" className="w-full h-[400px] object-cover" />
            </div>
            <div className="absolute -top-5 -left-5 glass-panel rounded-lg p-5 hidden md:block">
              <TrendingUp className="w-8 h-8 text-gold mb-2" />
              <p className="text-xs tracking-wide-luxe uppercase text-slate-muted">Oportunidades</p>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-gold" />
              <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">Para investidores</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] leading-[1.15] text-white">
              {content.investment_title}
            </h2>
            <p className="mt-6 text-lg text-white/75 font-light leading-relaxed">
              {content.investment_text}
            </p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold mt-9">
              <MessageCircle className="w-4 h-4" />
              Falar sobre oportunidades
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
