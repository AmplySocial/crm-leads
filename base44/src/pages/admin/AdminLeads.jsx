import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useSiteContent } from "@/lib/useSiteContent";
import { waLink } from "@/lib/siteConfig";
import { MessageCircle, Search, Trash2 } from "lucide-react";

const STATUSES = ["Novo", "Em atendimento", "Contatado", "Convertido", "Arquivado"];
const STATUS_COLORS = {
  Novo: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  "Em atendimento": "text-blue-300 bg-blue-500/10 border-blue-500/30",
  Contatado: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  Convertido: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  Arquivado: "text-slate-muted bg-white/5 border-white/15",
};

export default function AdminLeads() {
  const { content } = useSiteContent();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const load = async () => {
    try {
      const items = await base44.entities.Lead.list("-created_date", 500);
      setLeads(items || []);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (lead, status) => {
    try {
      await base44.entities.Lead.update(lead.id, { status });
      load();
    } catch (e) {}
  };

  const remove = async (lead) => {
    if (!confirm("Excluir este lead?")) return;
    try { await base44.entities.Lead.delete(lead.id); load(); } catch (e) {}
  };

  const filtered = leads.filter((l) => {
    if (filter && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (l.name || "").toLowerCase().includes(q) || (l.phone || "").toLowerCase().includes(q) || (l.property_name || "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-white">Leads</h1>
        <p className="text-slate-muted text-sm mt-1">{leads.length} contatos recebidos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, telefone ou imóvel..." className="w-full bg-charcoal border border-white/10 text-white text-sm rounded-md pl-10 pr-4 py-2.5 focus:border-gold focus:outline-none" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-charcoal border border-white/10 text-white text-sm rounded-md px-4 py-2.5 focus:border-gold focus:outline-none">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-charcoal rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-slate-muted">Nenhum lead encontrado.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => {
            const wa = waLink(content.contact_whatsapp, `Olá, ${l.name || ""}! Aqui é o Robson, retornando seu contato sobre imóveis.`);
            return (
              <div key={l.id} className="p-5 bg-charcoal rounded-lg border border-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-medium">{l.name}</h3>
                      <span className={`text-[10px] tracking-wide-luxe uppercase px-2 py-0.5 rounded-sm border ${STATUS_COLORS[l.status] || STATUS_COLORS.Novo}`}>
                        {l.status || "Novo"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-slate-muted">
                      <span>📞 {l.phone}</span>
                      {l.email && <span>✉ {l.email}</span>}
                      <span className="text-gold">{l.interest_type}</span>
                      {l.property_name && <span>🏠 {l.property_name}</span>}
                    </div>
                    {l.message && (
                      <p className="text-sm text-white/70 font-light mt-3 leading-relaxed border-l-2 border-gold/30 pl-3">
                        {l.message}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-muted/60 mt-2">
                      {l.created_date ? new Date(l.created_date).toLocaleString("pt-BR") : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <select
                      value={l.status || "Novo"}
                      onChange={(e) => setStatus(l, e.target.value)}
                      className="text-xs bg-obsidian border border-white/15 text-white rounded-md px-3 py-1.5 focus:border-gold focus:outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#25D366]/15 text-[#25D366] rounded-md hover:bg-[#25D366]/25">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <button onClick={() => remove(l)} className="p-1.5 text-slate-muted hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
