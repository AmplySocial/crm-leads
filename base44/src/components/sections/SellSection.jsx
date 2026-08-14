import { useState, useRef } from "react";
import { ImagePlus, X, Send, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { waLink, PROPERTY_TYPES } from "@/lib/siteConfig";
import { useReveal } from "@/lib/useReveal";

const SELL_BG = "https://media.base44.com/images/public/6a7c8b514b9b0c5220756c4e/0bdb041df_generated_ad23828e.png";

export default function SellSection({ content }) {
  const { ref, visible } = useReveal();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    property_type: "Casa",
    city: "Santa Luzia",
    neighborhood: "",
    desired_value: "",
    message: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFiles = async (files) => {
    const arr = Array.from(files);
    const uploaded = [];
    for (const file of arr) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      } catch (e) {
        // skip failed
      }
    }
    setPhotos((p) => [...p, ...uploaded]);
  };

  const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      const photoList = photos.length ? `\n\nFotos: ${photos.join(", ")}` : "";
      await base44.entities.Lead.create({
        name: form.name,
        phone: form.phone,
        interest_type: "Anunciar imóvel",
        property_type: form.property_type,
        city: form.city,
        neighborhood: form.neighborhood,
        desired_value: form.desired_value,
        message: form.message + photoList,
        status: "Novo",
      });
      const waMsg = `Olá, Robson! Tenho um imóvel e gostaria de conversar sobre a possibilidade de anunciá-lo.\n\nNome: ${form.name}\nTipo: ${form.property_type}\nCidade: ${form.city}\nBairro: ${form.neighborhood}\nValor desejado: ${form.desired_value}\nMensagem: ${form.message}`;
      window.open(waLink(content.contact_whatsapp, waMsg), "_blank");
      setDone(true);
      setForm({ name: "", phone: "", property_type: "Casa", city: "Santa Luzia", neighborhood: "", desired_value: "", message: "" });
      setPhotos([]);
    } catch (err) {
      // error bubbles
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-white text-sm rounded-sm px-4 py-3 focus:border-gold focus:outline-none transition-colors placeholder:text-slate-muted/60";
  const labelCls = "block text-[10px] tracking-luxe uppercase text-gold/80 mb-2";

  return (
    <section id="vender" className="relative py-20 lg:py-28 bg-obsidian scroll-mt-20 overflow-hidden">
      <img src={SELL_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/85 to-obsidian" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-5 justify-center">
            <span className="block w-8 h-px bg-gold" />
            <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">Para vendedores</span>
            <span className="block w-8 h-px bg-gold" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] leading-[1.15] text-white">
            {content.sell_title}
          </h2>
          <p className="mt-5 text-lg text-white/75 font-light max-w-2xl mx-auto">
            {content.sell_text}
          </p>

          {!open ? (
            <button onClick={() => setOpen(true)} className="btn-gold mt-9">
              Quero anunciar meu imóvel
            </button>
          ) : done ? (
            <div className="mt-9 glass-panel rounded-lg p-8 max-w-lg mx-auto">
              <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-heading text-xl text-white mb-2">Recebido com sucesso!</h3>
              <p className="text-sm text-slate-muted">
                Suas informações foram enviadas. Continue a conversa no WhatsApp que abrimos para você.
              </p>
              <button onClick={() => { setDone(false); setOpen(false); }} className="btn-ghost-gold mt-6 !py-2.5 !text-xs">
                Enviar outro imóvel
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-9 glass-panel rounded-lg p-6 md:p-8 text-left max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nome *</label>
                  <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp *</label>
                  <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(31) 90000-0000" required />
                </div>
                <div>
                  <label className={labelCls}>Tipo de imóvel</label>
                  <select className={inputCls} value={form.property_type} onChange={(e) => set("property_type", e.target.value)}>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Cidade</label>
                  <input className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Bairro</label>
                  <input className={inputCls} value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Valor desejado</label>
                  <input className={inputCls} value={form.desired_value} onChange={(e) => set("desired_value", e.target.value)} placeholder="R$ 0,00" />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>Mensagem</label>
                <textarea className={inputCls + " min-h-[90px] resize-y"} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Descreva seu imóvel..." />
              </div>

              {/* Photos */}
              <div className="mt-4">
                <label className={labelCls}>Fotos do imóvel</label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-white/10 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 border border-dashed border-white/20 rounded-sm flex flex-col items-center justify-center text-slate-muted hover:border-gold hover:text-gold transition-colors"
                  >
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-[9px] mt-1">Adicionar</span>
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" disabled={submitting} className="btn-gold flex-1 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                  {submitting ? "Enviando..." : "Enviar imóvel"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-5 text-sm text-slate-muted hover:text-white tracking-wide-luxe uppercase">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
