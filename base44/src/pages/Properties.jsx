import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useSiteContent } from "@/lib/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { SlidersHorizontal, X } from "lucide-react";

export default function Properties() {
  const { content } = useSiteContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(
    () => ({
      purpose: searchParams.get("finalidade") || "",
      type: searchParams.get("tipo") || "",
      location: searchParams.get("localizacao") || "",
      priceRange: searchParams.get("preco") || "",
    }),
    [searchParams]
  );

  useEffect(() => {
    (async () => {
      try {
        const items = await base44.entities.Property.list("-created_date", 100);
        setProperties((items || []).filter((p) => p.active !== false));
      } catch (e) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.purpose && p.purpose !== filters.purpose) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.location) {
        const q = filters.location.toLowerCase();
        const inCity = (p.city || "").toLowerCase().includes(q);
        const inNbh = (p.neighborhood || "").toLowerCase().includes(q);
        if (!inCity && !inNbh) return false;
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (p.price != null && (p.price < min || p.price > max)) return false;
      }
      return true;
    });
  }, [properties, filters]);

  const updateFilters = (f) => {
    const params = new URLSearchParams();
    if (f.purpose) params.set("finalidade", f.purpose);
    if (f.type) params.set("tipo", f.type);
    if (f.location) params.set("localizacao", f.location);
    if (f.priceRange) params.set("preco", f.priceRange);
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = filters.purpose || filters.type || filters.location || filters.priceRange;

  return (
    <div className="bg-obsidian min-h-screen">
      <Header content={content} />
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Title */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gold" />
              <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">Catálogo</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-white">Imóveis disponíveis</h1>
            <p className="mt-3 text-slate-muted font-light">
              {loading
                ? "Carregando propriedades..."
                : `${filtered.length} ${filtered.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`}
            </p>
          </div>

          {/* Search - desktop */}
          <div className="hidden md:block">
            <SearchBar filters={filters} onChange={updateFilters} onSearch={() => updateFilters(filters)} />
          </div>

          {/* Search - mobile toggle */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="w-full glass-panel rounded-lg px-5 py-4 flex items-center justify-between text-sm tracking-wide-luxe uppercase text-white"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                Filtros {hasFilters && <span className="text-gold">· ativos</span>}
              </span>
              {showFilters ? <X className="w-4 h-4" /> : null}
            </button>
            {showFilters && (
              <div className="mt-3">
                <SearchBar filters={filters} onChange={updateFilters} onSearch={() => updateFilters(filters)} />
              </div>
            )}
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-xs tracking-wide-luxe uppercase text-gold hover:text-gold-light transition-colors">
              Limpar filtros ✕
            </button>
          )}

          {/* Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-charcoal rounded-lg animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-muted text-lg font-light">Nenhum imóvel encontrado com esses filtros.</p>
                <button onClick={clearFilters} className="btn-ghost-gold mt-6">Ver todos os imóveis</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p, i) => (
                  <PropertyCard key={p.id} property={p} content={content} index={i % 6} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer content={content} />
      <WhatsAppButton content={content} />
    </div>
  );
}
