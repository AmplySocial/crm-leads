import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Building2, CheckCircle2, Tag, Users, Mail, TrendingUp, Plus } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, featured: 0, leads: 0, newLeads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [properties, leads] = await Promise.all([
          base44.entities.Property.list("-created_date", 500),
          base44.entities.Lead.list("-created_date", 500),
        ]);
        const props = properties || [];
        const allLeads = leads || [];
        setStats({
          total: props.length,
          available: props.filter((p) => p.status === "Disponível").length,
          sold: props.filter((p) => p.status === "Vendido").length,
          featured: props.filter((p) => p.featured).length,
          leads: allLeads.length,
          newLeads: allLeads.filter((l) => l.status === "Novo").length,
        });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: "Total de imóveis", value: stats.total, icon: Building2, color: "text-gold" },
    { label: "Disponíveis", value: stats.available, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Vendidos", value: stats.sold, icon: TrendingUp, color: "text-red-300" },
    { label: "Em destaque", value: stats.featured, icon: Tag, color: "text-gold-light" },
    { label: "Leads recebidos", value: stats.leads, icon: Users, color: "text-white" },
    { label: "Novos contatos", value: stats.newLeads, icon: Mail, color: "text-amber-300" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl text-white">Dashboard</h1>
          <p className="text-slate-muted text-sm mt-1">Visão geral do seu negócio imobiliário</p>
        </div>
        <Link to="/admin/imoveis/novo" className="btn-gold !py-2.5 !text-xs">
          <Plus className="w-4 h-4" /> Novo imóvel
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-charcoal rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="p-6 bg-charcoal rounded-lg border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <c.icon className={`w-6 h-6 ${c.color}`} />
              </div>
              <p className="text-4xl font-heading text-white">{c.value}</p>
              <p className="text-xs tracking-wide-luxe uppercase text-slate-muted mt-2">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/imoveis" className="p-6 bg-charcoal rounded-lg border border-white/6 hover:border-gold/40 transition-colors group">
          <Building2 className="w-7 h-7 text-gold mb-3" />
          <h3 className="text-white font-heading text-lg">Gerenciar imóveis</h3>
          <p className="text-sm text-slate-muted mt-1">Criar, editar, destacar e marcar como vendido.</p>
        </Link>
        <Link to="/admin/leads" className="p-6 bg-charcoal rounded-lg border border-white/6 hover:border-gold/40 transition-colors group">
          <Users className="w-7 h-7 text-gold mb-3" />
          <h3 className="text-white font-heading text-lg">Gerenciar leads</h3>
          <p className="text-sm text-slate-muted mt-1">Visualizar contatos e atualizar status.</p>
        </Link>
      </div>
    </div>
  );
}
