import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { PROPERTY_TYPES } from "@/lib/siteConfig";
import { ArrowLeft, Save, ImagePlus, X, Star, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const EMPTY = {
  name: "", type: "Casa", purpose: "Venda", price: "", city: "Santa Luzia",
  neighborhood: "", address: "", area: "", bedrooms: "", bathrooms: "", parking: "",
  description: "", features: [], status: "Disponível", featured: false, active: true,
  map_link: "", additional_info: "", photos: [],
};

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "novo";
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const p = await base44.entities.Property.get(id);
          setForm({ ...EMPTY, ...p, photos: p.photos || [], features: p.features || [] });
        } catch (e) {}
        finally { setLoading(false); }
      })();
    }
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFiles = async (files) => {
    setUploading(true);
    const arr = Array.from(files);
    const uploaded = [];
    for (const file of arr) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      } catch (e) {}
    }
    setForm((f) => ({ ...f, photos: [...(f.photos || []), ...uploaded] }));
    setUploading(false);
  };

  const removePhoto = (i) => setForm((f) => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));
  const movePhoto = (i, dir) => {
    setForm((f) => {
      const photos = [...(f.photos || [])];
      const j = i + dir;
      if (j < 0 || j >= photos.length) return f;
      [photos[i], photos[j]] = [photos[j], photos[i]];
      return { ...f, photos };
    });
  };
  const setMainPhoto = (i) => {
    setForm((f) => {
      const photos = [...(f.photos || [])];
      const [main] = photos.splice(i, 1);
      photos.unshift(main);
      return { ...f, photos };
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      set("features", [...(form.features || []), featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const removeFeature = (i) => set("features", (form.features || []).filter((_, idx) => idx !== i));

  const save = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    const payload = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      area: form.area === "" ? null : Number(form.area),
      bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
      parking: form.parking === "" ? null : Number(form.parking),
    };
    try {
      if (isNew) {
        await base44.entities.Property.create(payload);
      } else {
        await base44.entities.Property.update(id, payload);
      }
      navigate("/admin/imoveis");
    } catch (err) {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-charcoal border border-white/10 text-white text-sm rounded-md px-4 py-2.5 focus:border-gold focus:outline-none transition-colors placeholder:text-slate-muted/50";
  const labelCls = "block text-[10px] tracking-luxe uppercase text-gold/80 mb-2";

  if (loading) {
    return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin" /></div>;
  }

  return (
    <form onSubmit={save}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/imoveis" className="p-2 rounded-md border border-white/10 text-white/70 hover:text-gold hover:border-gold/40">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl text-white">{isNew ? "Novo imóvel" : "Editar imóvel"}</h1>
            <p className="text-slate-muted text-xs mt-0.5">{isNew ? "Adicione uma nova propriedade" : form.name}</p>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-gold !py-2.5 !text-xs disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Informações principais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Nome do imóvel *</label>
                <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Tipo</label>
                <select className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Finalidade</label>
                <select className={inputCls} value={form.purpose} onChange={(e) => set("purpose", e.target.value)}>
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Preço (R$)</label>
                <input type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="Disponível">Disponível</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Cidade</label><input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><label className={labelCls}>Bairro</label><input className={inputCls} value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Endereço</label><input className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="md:col-span-2"><label className={labelCls}>Link do mapa (embed)</label><input className={inputCls} value={form.map_link} onChange={(e) => set("map_link", e.target.value)} placeholder="https://www.openstreetmap.org/export/embed.html?..." /></div>
            </div>
          </div>

          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Características</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className={labelCls}>Área (m²)</label><input type="number" className={inputCls} value={form.area} onChange={(e) => set("area", e.target.value)} /></div>
              <div><label className={labelCls}>Quartos</label><input type="number" className={inputCls} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></div>
              <div><label className={labelCls}>Banheiros</label><input type="number" className={inputCls} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></div>
              <div><label className={labelCls}>Vagas</label><input type="number" className={inputCls} value={form.parking} onChange={(e) => set("parking", e.target.value)} /></div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Características (lista)</label>
              <div className="flex gap-2 mb-3">
                <input className={inputCls} value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Ex: Piscina, Churrasqueira..." />
                <button type="button" onClick={addFeature} className="btn-ghost-gold !px-4 !py-2.5 !text-xs">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.features || []).map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian border border-gold/20 rounded-md text-xs text-white">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)}><X className="w-3 h-3 text-slate-muted hover:text-red-300" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Descrição</h3>
            <label className={labelCls}>Descrição</label>
            <textarea className={inputCls + " min-h-[140px] resize-y"} value={form.description} onChange={(e) => set("description", e.target.value)} />
            <label className={labelCls + " mt-4"}>Informações adicionais</label>
            <textarea className={inputCls + " min-h-[100px] resize-y"} value={form.additional_info} onChange={(e) => set("additional_info", e.target.value)} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Visibilidade</h3>
            <label className="flex items-center justify-between cursor-pointer mb-4">
              <span className="text-sm text-white">Ativo no site</span>
              <button type="button" onClick={() => set("active", !form.active)} className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-gold" : "bg-white/15"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white">Destaque</span>
              <button type="button" onClick={() => set("featured", !form.featured)} className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-gold" : "bg-white/15"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          </div>

          {/* Photos */}
          <div className="p-6 bg-charcoal rounded-lg border border-white/6">
            <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Fotos</h3>
            <div className="space-y-3">
              {(form.photos || []).map((ph, i) => (
                <div key={i} className="relative group rounded-md overflow-hidden border border-white/10">
                  <img src={ph} alt="" className="w-full h-28 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {i !== 0 && (
                      <button type="button" onClick={() => movePhoto(i, -1)} className="p-2 bg-black/60 rounded-md text-white hover:text-gold"><ArrowUp className="w-4 h-4" /></button>
                    )}
                    {i !== form.photos.length - 1 && (
                      <button type="button" onClick={() => movePhoto(i, 1)} className="p-2 bg-black/60 rounded-md text-white hover:text-gold"><ArrowDown className="w-4 h-4" /></button>
                    )}
                    {i !== 0 && (
                      <button type="button" onClick={() => setMainPhoto(i)} title="Definir como principal" className="p-2 bg-black/60 rounded-md text-white hover:text-gold"><Star className="w-4 h-4" /></button>
                    )}
                    <button type="button" onClick={() => removePhoto(i)} className="p-2 bg-black/60 rounded-md text-white hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {i === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-wide-luxe uppercase gold-gradient-bg text-black rounded-sm font-semibold">Principal</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-8 border border-dashed border-white/20 rounded-md flex flex-col items-center justify-center text-slate-muted hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
              >
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-xs tracking-wide-luxe uppercase">{uploading ? "Enviando..." : "+ Adicionar fotos"}</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files?.length && handleFiles(e.target.files)} />
            </div>
            <p className="text-[10px] text-slate-muted mt-3">A primeira foto é a principal. Use as setas para reordenar.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
