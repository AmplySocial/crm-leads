import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Star, Pencil, X, Check } from "lucide-react";

const EMPTY = { author_name: "", rating: 5, text: "", source: "Google", active: true };

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const items = await base44.entities.Review.list("-created_date", 100);
      setReviews(items || []);
    } catch (e) {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!editing.author_name || !editing.text) return;
    try {
      if (editing.id) {
        await base44.entities.Review.update(editing.id, editing);
      } else {
        await base44.entities.Review.create(editing);
      }
      setEditing(null);
      load();
    } catch (err) {}
  };

  const remove = async (r) => {
    if (!confirm("Excluir esta avaliação?")) return;
    try { await base44.entities.Review.delete(r.id); load(); } catch (e) {}
  };

  const toggleActive = async (r) => {
    try { await base44.entities.Review.update(r.id, { active: !r.active }); load(); } catch (e) {}
  };

  const inputCls = "w-full bg-charcoal border border-white/10 text-white text-sm rounded-md px-4 py-2.5 focus:border-gold focus:outline-none";
  const labelCls = "block text-[10px] tracking-luxe uppercase text-gold/80 mb-2";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white">Avaliações</h1>
          <p className="text-slate-muted text-sm mt-1">{reviews.length} avaliações cadastradas</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-gold !py-2.5 !text-xs">
          <Plus className="w-4 h-4" /> Nova avaliação
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="mb-6 p-6 bg-charcoal rounded-lg border border-gold/30">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">{editing.id ? "Editar" : "Nova"} avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Nome do autor</label><input className={inputCls} value={editing.author_name} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} required /></div>
            <div><label className={labelCls}>Origem</label><input className={inputCls} value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Nota</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setEditing({ ...editing, rating: s })}>
                    <Star className={`w-7 h-7 ${s <= editing.rating ? "text-gold fill-gold" : "text-slate-muted/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <button type="button" onClick={() => setEditing({ ...editing, active: !editing.active })} className={`relative w-11 h-6 rounded-full transition-colors ${editing.active ? "bg-gold" : "bg-white/15"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${editing.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-white">Ativa no site</span>
              </label>
            </div>
            <div className="md:col-span-2"><label className={labelCls}>Avaliação</label><textarea className={inputCls + " min-h-[100px] resize-y"} value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} required /></div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="btn-gold !py-2.5 !text-xs"><Check className="w-4 h-4" /> Salvar</button>
            <button type="button" onClick={() => setEditing(null)} className="px-5 text-sm text-slate-muted hover:text-white tracking-wide-luxe uppercase">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-charcoal rounded-lg animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20"><p className="text-slate-muted">Nenhuma avaliação cadastrada.</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-5 bg-charcoal rounded-lg border border-white/6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-medium">{r.author_name}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-gold fill-gold" : "text-slate-muted/30"}`} />)}
                    </div>
                    <span className="text-[10px] tracking-wide-luxe uppercase text-slate-muted">{r.source}</span>
                    {!r.active && <span className="text-[10px] tracking-wide-luxe uppercase text-amber-300">Inativa</span>}
                  </div>
                  <p className="text-sm text-white/70 font-light mt-2 italic">"{r.text}"</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ ...r })} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-gold hover:border-gold/40"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => toggleActive(r)} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-gold hover:border-gold/40">{r.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}</button>
                  <button onClick={() => remove(r)} className="p-2 rounded-md border border-white/10 text-white/70 hover:text-red-300 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
