import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

export default function FeaturedProperties({ content, onSearch }) {
  const [filters, setFilters] = useState({ purpose: "", type: "", location: "", priceRange: "" });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await base44.entities.Property.list("-created_date", 50);
        const active = (items || []).filter((p) => p.active !== false);
        setProperties(active);
      } catch (e) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const display = featured.length >= 3 ? featured : properties.slice(0, 6);

  return (
    <section id="destaques" className="py-20 lg:py-28 bg-obsidian">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Seleção premium"
          title="Imóveis em destaque"
          subtitle="Propriedades selecionadas para diferentes momentos e objetivos."
        />

        {/* Search */}
        <div className="mt-12">
          <SearchBar
            filters={filters}
            onChange={setFilters}
            onSearch={() => onSearch(filters)}
          />
        </div>

        {/* Grid */}
        <div className="mt-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-charcoal rounded-lg animate-pulse border border-white/5" />
              ))}
            </div>
          ) : display.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-muted text-lg font-light">
                Nenhum imóvel em destaque no momento.
              </p>
              <p className="text-slate-muted/60 text-sm mt-2">
                Em breve novas propriedades estarão disponíveis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {display.map((p, i) => (
                <PropertyCard key={p.id} property={p} content={content} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/imoveis" className="btn-ghost-gold">
            Ver todos os imóveis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
