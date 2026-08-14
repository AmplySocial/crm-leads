import { useEffect, useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { DEFAULT_CONTENT, LOGO_URL } from "@/lib/siteConfig";
import { Save, Upload, CheckCircle2 } from "lucide-react";

export default function AdminContent() {
  const [form, setForm] = useState(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null);
  const logoRef = useRef(null);
  const photoRef = useRef(null);
  const aboutImgRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await base44.entities.SiteContent.list("-updated_date", 1);
        if (items && items.length > 0) {
          const merged = { ...DEFAULT_CONTENT, ...items[0] };
          setForm(merged);
          setRecordId(items[0].id);
        }
      } catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const upload = async (file, field) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set(field, file_url);
    } catch (e) {}
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.logo_url) payload.logo_url = LOGO_URL;
      if (recordId) {
        await base44.entities.SiteContent.update(recordId, payload);
      } else {
        const created = await base44.entities.SiteContent.create(payload);
        setRecordId(created.id);
      }
      setSaved(true);
    } catch (err) {}
    finally { setSaving(false); }
  };

  const inputCls = "w-full bg-charcoal border border-white/10 text-white text-sm rounded-md px-4 py-2.5 focus:border-gold focus:outline-none transition-colors";
  const labelCls = "block text-[10px] tracking-luxe uppercase text-gold/80 mb-2";
  const taCls = inputCls + " min-h-[90px] resize-y";

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin" /></div>;

  const ImageUpload = ({ field, label, inputRef }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-obsidian border border-white/10 shrink-0">
          {form[field] ? <img src={form[field]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-muted/40 text-xs">—</div>}
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-ghost-gold !py-2 !px-4 !text-xs">
          <Upload className="w-3.5 h-3.5" /> Enviar
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], field)} />
      </div>
    </div>
  );

  return (
    <form onSubmit={save}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl text-white">Conteúdo do site</h1>
          <p className="text-slate-muted text-sm mt-1">Edite textos, imagens e informações de contato</p>
        </div>
        <button type="submit" disabled={saving} className="btn-gold !py-2.5 !text-xs disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {saved && (
        <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex items-center gap-2 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Conteúdo salvo com sucesso!
        </div>
      )}

      <div className="space-y-6">
        {/* Brand */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Identidade visual</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUpload field="logo_url" label="Logo" inputRef={logoRef} />
            <ImageUpload field="corretor_photo" label="Foto do corretor" inputRef={photoRef} />
            <ImageUpload field="hero_image" label="Imagem do Hero" inputRef={heroImgRef} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div><label className={labelCls}>Nome do corretor</label><input className={inputCls} value={form.corretor_name} onChange={(e) => set("corretor_name", e.target.value)} /></div>
            <div><label className={labelCls}>CRECI</label><input className={inputCls} value={form.creci} onChange={(e) => set("creci", e.target.value)} /></div>
          </div>
        </section>

        {/* Hero */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Hero</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Headline</label><input className={inputCls} value={form.hero_headline} onChange={(e) => set("hero_headline", e.target.value)} /></div>
            <div><label className={labelCls}>Subheadline</label><textarea className={taCls} value={form.hero_subheadline} onChange={(e) => set("hero_subheadline", e.target.value)} /></div>
          </div>
        </section>

        {/* About */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Sobre</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>Título</label><input className={inputCls} value={form.about_title} onChange={(e) => set("about_title", e.target.value)} /></div>
            <div><label className={labelCls}>Texto</label><textarea className={taCls} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUpload field="about_image" label="Imagem (opcional)" inputRef={aboutImgRef} />
            </div>
          </div>
        </section>

        {/* Sections text */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Seções de conversão</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Título - Vender</label><input className={inputCls} value={form.sell_title} onChange={(e) => set("sell_title", e.target.value)} /></div>
            <div><label className={labelCls}>Texto - Vender</label><textarea className={taCls} value={form.sell_text} onChange={(e) => set("sell_text", e.target.value)} /></div>
            <div><label className={labelCls}>Título - Investimento</label><input className={inputCls} value={form.investment_title} onChange={(e) => set("investment_title", e.target.value)} /></div>
            <div><label className={labelCls}>Texto - Investimento</label><textarea className={taCls} value={form.investment_text} onChange={(e) => set("investment_text", e.target.value)} /></div>
            <div><label className={labelCls}>Título - CTA final</label><input className={inputCls} value={form.cta_title} onChange={(e) => set("cta_title", e.target.value)} /></div>
            <div><label className={labelCls}>Texto - CTA final</label><textarea className={taCls} value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} /></div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Telefone</label><input className={inputCls} value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} /></div>
            <div><label className={labelCls}>WhatsApp (só dígitos)</label><input className={inputCls} value={form.contact_whatsapp} onChange={(e) => set("contact_whatsapp", e.target.value)} placeholder="5531975953346" /></div>
            <div><label className={labelCls}>E-mail</label><input className={inputCls} value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></div>
            <div><label className={labelCls}>Cidade</label><input className={inputCls} value={form.contact_city} onChange={(e) => set("contact_city", e.target.value)} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Endereço</label><input className={inputCls} value={form.contact_address} onChange={(e) => set("contact_address", e.target.value)} /></div>
            <div><label className={labelCls}>Instagram (URL)</label><input className={inputCls} value={form.social_instagram} onChange={(e) => set("social_instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
            <div><label className={labelCls}>Facebook (URL)</label><input className={inputCls} value={form.social_facebook} onChange={(e) => set("social_facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
          </div>
        </section>

        {/* Reviews summary */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">Avaliações Google</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Nota Google</label><input type="number" step="0.1" className={inputCls} value={form.google_rating} onChange={(e) => set("google_rating", Number(e.target.value))} /></div>
            <div><label className={labelCls}>Número de avaliações</label><input type="number" className={inputCls} value={form.google_reviews_count} onChange={(e) => set("google_reviews_count", Number(e.target.value))} /></div>
          </div>
        </section>

        {/* SEO */}
        <section className="p-6 bg-charcoal rounded-lg border border-white/6">
          <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-5">SEO</h3>
          <div className="space-y-4">
            <div><label className={labelCls}>SEO Title</label><input className={inputCls} value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></div>
            <div><label className={labelCls}>SEO Description</label><textarea className={taCls} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-gold !py-2.5 !text-xs disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar conteúdo"}
          </button>
        </div>
      </div>
    </form>
  );
}
