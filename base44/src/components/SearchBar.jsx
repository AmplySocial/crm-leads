import { Search } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/siteConfig";

export default function SearchBar({ filters, onChange, onSearch, compact = false }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  const inputCls =
    "w-full bg-white/5 border border-white/10 text-white text-sm rounded-sm px-4 py-3 focus:border-gold focus:outline-none transition-colors placeholder:text-slate-muted/60";

  const labelCls = "block text-[10px] tracking-luxe uppercase text-gold/80 mb-2";

  return (
    <div className={`w-full ${compact ? "" : "glass-panel rounded-lg p-5 md:p-7"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className={labelCls}>Finalidade</label>
          <select className={inputCls} value={filters.purpose} onChange={(e) => update("purpose", e.target.value)}>
            <option value="">Todas</option>
            <option value="Venda">Comprar</option>
            <option value="Aluguel">Aluguel</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Tipo</label>
          <select className={inputCls} value={filters.type} onChange={(e) => update("type", e.target.value)}>
            <option value="">Todos</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Localização</label>
          <input
            className={inputCls}
            placeholder="Cidade ou bairro"
            value={filters.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Faixa de preço</label>
          <select className={inputCls} value={filters.priceRange} onChange={(e) => update("priceRange", e.target.value)}>
            <option value="">Qualquer</option>
            <option value="0-300000">Até R$ 300 mil</option>
            <option value="300000-600000">R$ 300 mil - R$ 600 mil</option>
            <option value="600000-1200000">R$ 600 mil - R$ 1,2 mi</option>
            <option value="1200000-999999999">Acima de R$ 1,2 mi</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="btn-gold w-full !py-3"
          >
            <Search className="w-4 h-4" />
            Buscar imóveis
          </button>
        </div>
      </div>
    </div>
  );
}
