import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { CATEGORIES } from "@/lib/siteConfig";

const CAT_IMAGES = {
  Casa: "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/cce3ef92f_generated_53f31ac5.png",
  Sítio: "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/d52216aea_generated_4e787f8e.png",
  Terreno: "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/26ac375e1_generated_ea3707b0.png",
  Fazenda: "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/1eb8e9f09_generated_80e9d81b.png",
};

export default function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-charcoal/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Por categoria"
          title="Encontre o tipo de propriedade ideal"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/imoveis?tipo=${encodeURIComponent(cat.type)}`}
              className="group relative h-72 rounded-lg overflow-hidden border border-white/6 hover:border-gold/40 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img
                src={CAT_IMAGES[cat.type]}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-white/70 font-light leading-relaxed mb-3">
                  {cat.description}
                </p>
                <span className="flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Ver imóveis <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
