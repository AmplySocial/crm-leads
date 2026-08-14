import { Award } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

const ABOUT_IMG = "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/2f2aea151_generated_5aebb5c7.png";

export default function AboutSection({ content }) {
  const { ref, visible } = useReveal();
  const aboutImg = content.about_image || ABOUT_IMG;

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-obsidian scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-1000 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="relative rounded-lg overflow-hidden border border-white/8 shadow-luxe">
              {content.corretor_photo ? (
                <img src={content.corretor_photo} alt={content.corretor_name} className="w-full h-[520px] object-cover" />
              ) : (
                <div className="w-full h-[520px] bg-charcoal flex flex-col items-center justify-center p-8 text-center">
                  <img src={aboutImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-5">
                      <Award className="w-10 h-10 text-gold" />
                    </div>
                    <p className="text-sm text-white/60 font-light max-w-xs">
                      Espaço reservado para a foto profissional do corretor.
                    </p>
                    <p className="text-xs text-gold/70 mt-2 tracking-wide-luxe uppercase">
                      Adicione via painel administrativo
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 -right-5 glass-panel rounded-lg px-6 py-4 hidden md:block">
              <p className="text-[10px] tracking-luxe uppercase text-slate-muted">Registro profissional</p>
              <p className="text-gold font-heading text-lg mt-1">{content.creci}</p>
            </div>
          </div>

          {/* Text */}
          <div className={`transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-px bg-gold" />
              <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">Sobre</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] leading-[1.15] text-white">
              {content.about_title}
            </h2>
            <p className="mt-7 text-lg text-white/75 font-light leading-relaxed">
              {content.about_text}
            </p>
            <div className="mt-8 gold-hairline" />
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-heading text-gold">{content.google_rating?.toFixed?.(1) || "5,0"}</p>
                <p className="text-xs text-slate-muted mt-1 tracking-wide-luxe uppercase">Avaliação Google</p>
              </div>
              <div>
                <p className="text-3xl font-heading text-gold">{content.creci}</p>
                <p className="text-xs text-slate-muted mt-1 tracking-wide-luxe uppercase">Registro profissional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
