import { Handshake, ShieldCheck, MapPin, Building2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { DIFFERENTIALS } from "@/lib/siteConfig";

const ICONS = { Handshake, ShieldCheck, MapPin, Building2 };

export default function Differentials() {
  return (
    <section className="py-20 lg:py-28 bg-charcoal/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Por que contar com atendimento personalizado"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {DIFFERENTIALS.map((d, i) => {
            const Icon = ICONS[d.icon] || Handshake;
            return (
              <div
                key={d.title}
                className="group p-7 bg-obsidian/60 rounded-lg border border-white/6 hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-sm tracking-wide-luxe uppercase text-white font-semibold mb-3 leading-relaxed">
                  {d.title}
                </h3>
                <p className="text-sm text-slate-muted font-light leading-relaxed">
                  {d.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
