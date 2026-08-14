import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/SectionHeading";

export default function Reviews({ content }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const items = await base44.entities.Review.list("-created_date", 20);
        setReviews((items || []).filter((r) => r.active !== false));
      } catch (e) {
        setReviews([]);
      }
    })();
  }, []);

  const rating = content.google_rating ?? 5.0;
  const count = content.google_reviews_count ?? 0;

  return (
    <section className="py-20 lg:py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Confiança"
          title="Quem já confiou no nosso atendimento"
        />

        {/* Rating summary */}
        <div className="flex flex-col items-center mt-10 mb-12">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-7 h-7 text-gold fill-gold" />
            ))}
          </div>
          <p className="mt-4 text-4xl font-heading text-white">{rating.toFixed(1)}</p>
          <p className="text-xs text-slate-muted mt-2 tracking-wide-luxe uppercase">
            {count} {count === 1 ? "avaliação" : "avaliações"} no Google
          </p>
        </div>

        {/* Reviews list */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className="p-7 bg-charcoal/60 rounded-lg border border-white/6 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-gold fill-gold" : "text-slate-muted/30"}`} />
                  ))}
                </div>
                <p className="text-sm text-white/80 font-light leading-relaxed italic mb-5">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-9 h-9 rounded-full gold-gradient-bg flex items-center justify-center text-black font-semibold text-sm">
                    {r.author_name?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{r.author_name}</p>
                    <p className="text-[10px] text-slate-muted tracking-wide-luxe uppercase">{r.source || "Google"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-muted text-sm font-light">
              As avaliações reais dos clientes aparecerão aqui. Estrutura pronta para cadastro via painel administrativo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
