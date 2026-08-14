import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { formatPrice } from "@/lib/siteConfig";
import { Plus, Pencil, Copy, Trash2, Star, Eye, EyeOff, Search } from "lucide-react";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const items = await base44.entities.Property.list("-created_date", 500);
      setProperties(items || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (p, field) => {
    try {
      await base44.entities.Property.update(p.id, { [field]: !p[field] });
      load();
    } catch (e) {}
  };

  const setStatus = async (p, status) => {
    try {
      await base44.entities.Property.update(p.id, { status });
      load();
    } catch (e) {}
  };

  const duplicate = async (p) => {
    try {
      const { id, created_date, updated_date, created_by_id, ...rest } = p;
      await base44.entities.Property.create({ ...rest, name: `${rest.name} (cópia)`, active: false, featured: false, status: "Disponível" });
      load();
    } catch (e) {}
  };

  const remove = async (p) => {
    if (!confirm(`Excluir o imóvel "${p.name}"?`)) return;
    try {
      await base44.entities.Property.delete(p.id);
      load();
    } catch (e) {}
  };

  const filtered = properties.filter((p) =>
    !search || (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Disponível: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    Reservado: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    Vendido: "text-red-300 bg-red-500/10 border-red-500/30",
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white">Imóveis</h1>
          <p className="text-slate-muted text-sm mt-1">{properties.length} imóveis cadastrados</p>
        </div>
        <Link to="/admin/imoveis/novo" className="btn-gold !py-2.5 !text-xs">
          <Plus className="w-4 h-4" /> Novo imóvel
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou cidade..."
          className="w-full bg-charcoal border border-white/10 text-white text-sm rounded-md pl-10 pr-4 py-2.5 focus:border-gold focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-charcoal rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-muted">Nenhum imóvel encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 p-4 bg-charcoal rounded-lg border border-white/6 hover:border-white/15 transition-colors">
              {/* Thumb */}
              <div className="w-16 h-16 rounded-md overflow-hidden bg-obsidian shrink-0">
                {p.photos && p.photos[0] ? (
                  <img src={p.photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-muted/40 text-xs">—</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-medium text-sm">{p.name}</h3>
                  {p.featured && <Star className="w-3.5 h-3.5 text-gold fill-gold" />}
                </div>
                <p className="text-xs text-slate-muted mt-0.5">
                  {p.type} · {p.purpose} · {p.neighborhood ? `${p.neighborhood}, ` : ""}{p.city}
                </p>
                <p className="text-gold text-sm font-heading mt-1">{formatPrice(p.price)}</p>
              </div>

              {/* Status */}
              <select
                value={p.status || "Disponível"}
                onChange={(e) => setStatus(p, e.target.value)}
                className={`text-xs px-3 py-1.5 rounded-md border bg-obsidian ${statusColors[p.status || "Disponível"]}`}
              >
                <option value="Disponível">Disponível</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>

              {/* Active toggle */}
              <button
                onClick={() => toggle(p, "active")}
                title={p.active !== false ? "Visível no site" : "Oculto"}
                className={`p-2 rounded-md border ${p.active !== false ? "text-emerald-300 border-emerald-500/30" : "text-slate-muted border-white/10"}`}
              >
                {p.active !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Featured toggle */}
              <button
                onClick={() => toggle(p, "featured")}
                title="Destacar"
                className={`p-2 rounded-md border ${p.featured ? "text-gold border-gold/40 bg-gold/10" : "text-slate-muted border-white/10"}`}
              >
                <Star className={`w-4 h-4 ${p.featured ? "fill-gold" : ""}`} />
              </button>

              {/* Actions */}
              <div className="flex gap-1">
                <Link to={`/admin/imoveis/${p.id}`} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 transition-colors">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button onClick={() => duplicate(p)} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => remove(p)} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-red-300 hover:border-red-500/40 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
