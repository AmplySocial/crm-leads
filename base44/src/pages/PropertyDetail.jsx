import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useSiteContent } from "@/lib/useSiteContent";
import { waLink, formatPrice } from "@/lib/siteConfig";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Bed, Bath, Car, Maximize, MapPin, Check, MessageCircle, Calendar, ChevronLeft, ChevronRight, X, ArrowLeft,
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const { content } = useSiteContent();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await base44.entities.Property.get(id);
        setProperty(p);
      } catch (e) {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-obsidian min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-obsidian min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-slate-muted text-lg">Imóvel não encontrado.</p>
        <Link to="/imoveis" className="btn-ghost-gold mt-6">Ver imóveis</Link>
      </div>
    );
  }

  const photos = property.photos && property.photos.length ? property.photos : [];
  const mainPhoto = photos[0];

  const waInterest = waLink(
    content.contact_whatsapp,
    `Olá, Robson! Vi o imóvel ${property.name} no seu site e gostaria de saber mais informações.`
  );
  const waVisit = waLink(
    content.contact_whatsapp,
    `Olá, Robson! Gostaria de agendar uma visita ao imóvel ${property.name}.`
  );

  const specs = [
    { icon: Bed, label: "Quartos", value: property.bedrooms },
    { icon: Bath, label: "Banheiros", value: property.bathrooms },
    { icon: Car, label: "Vagas", value: property.parking },
    { icon: Maximize, label: "Área", value: property.area ? `${property.area} m²` : null },
  ].filter((s) => s.value != null);

  const openLightbox = (i) => setLightbox(i);
  const next = () => setLightbox((l) => (l + 1) % photos.length);
  const prev = () => setLightbox((l) => (l - 1 + photos.length) % photos.length);

  return (
    <div className="bg-obsidian min-h-screen pb-28 md:pb-0">
      <Header content={content} />
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Breadcrumb */}
          <Link to="/imoveis" className="inline-flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-slate-muted hover:text-gold transition-colors mt-6 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar aos imóveis
          </Link>

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">
                  {property.type} · {property.purpose}
                </span>
                {property.status !== "Disponível" && (
                  <span className="px-2.5 py-0.5 text-[10px] tracking-wide-luxe uppercase border border-amber-500/30 text-amber-300 rounded-sm">
                    {property.status}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
                {property.name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-muted mt-3">
                <MapPin className="w-4 h-4 text-gold/70" />
                {property.neighborhood ? `${property.neighborhood}, ` : ""}
                {property.city || "Santa Luzia - MG"}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-luxe uppercase text-slate-muted">Valor</p>
              <p className="text-3xl md:text-4xl font-heading text-gold mt-1">{formatPrice(property.price)}</p>
            </div>
          </div>

          {/* Gallery */}
          {mainPhoto ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-10">
              <div className="lg:col-span-3 rounded-lg overflow-hidden border border-white/8 cursor-pointer group" onClick={() => openLightbox(0)}>
                <img src={mainPhoto} alt={property.name} className="w-full h-[300px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                {photos.slice(1, 4).map((ph, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-white/8 cursor-pointer group" onClick={() => openLightbox(i + 1)}>
                    <img src={ph} alt="" className="w-full h-24 lg:h-[146px] object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ))}
                {photos.length > 4 && (
                  <button
                    onClick={() => openLightbox(0)}
                    className="rounded-lg overflow-hidden border border-white/8 relative group h-24 lg:h-[146px]"
                  >
                    <img src={photos[3]} alt="" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                      +{photos.length - 4} fotos
                    </div>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-white/8 bg-charcoal h-[300px] flex items-center justify-center text-slate-muted mb-10">
              Sem fotos disponíveis
            </div>
          )}

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="lg:col-span-2">
              {/* Specs */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {specs.map((s) => (
                    <div key={s.label} className="p-5 bg-charcoal/60 rounded-lg border border-white/6 text-center">
                      <s.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="text-lg text-white font-heading">{s.value}</p>
                      <p className="text-[10px] tracking-wide-luxe uppercase text-slate-muted mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="mb-10">
                  <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-4">Descrição</h3>
                  <p className="text-white/80 font-light leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-4">Características</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/75">
                        <Check className="w-4 h-4 text-gold shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional info */}
              {property.additional_info && (
                <div className="mb-10">
                  <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-4">Informações adicionais</h3>
                  <p className="text-white/80 font-light leading-relaxed whitespace-pre-line">{property.additional_info}</p>
                </div>
              )}

              {/* Map */}
              {property.map_link && (
                <div>
                  <h3 className="text-sm tracking-wide-luxe uppercase text-gold mb-4">Localização</h3>
                  <div className="rounded-lg overflow-hidden border border-white/8 h-80">
                    <iframe
                      title="Mapa"
                      src={property.map_link}
                      className="w-full h-full"
                      loading="lazy"
                      style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) contrast(0.9)" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-panel rounded-lg p-6 sticky top-28">
                <p className="text-[10px] tracking-luxe uppercase text-slate-muted">Valor</p>
                <p className="text-3xl font-heading text-gold mt-1 mb-5">{formatPrice(property.price)}</p>
                <div className="gold-hairline mb-5" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-muted">Tipo</span><span className="text-white">{property.type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-muted">Finalidade</span><span className="text-white">{property.purpose}</span></div>
                  {property.area != null && <div className="flex justify-between"><span className="text-slate-muted">Área</span><span className="text-white">{property.area} m²</span></div>}
                  {property.bedrooms != null && <div className="flex justify-between"><span className="text-slate-muted">Quartos</span><span className="text-white">{property.bedrooms}</span></div>}
                  {property.bathrooms != null && <div className="flex justify-between"><span className="text-slate-muted">Banheiros</span><span className="text-white">{property.bathrooms}</span></div>}
                  {property.parking != null && <div className="flex justify-between"><span className="text-slate-muted">Vagas</span><span className="text-white">{property.parking}</span></div>}
                </div>
                <div className="mt-6 space-y-3">
                  <a href={waInterest} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
                    <MessageCircle className="w-4 h-4" /> Tenho interesse
                  </a>
                  <a href={waVisit} target="_blank" rel="noopener noreferrer" className="btn-ghost-gold w-full">
                    <Calendar className="w-4 h-4" /> Agendar visita
                  </a>
                </div>
                <p className="text-[10px] text-slate-muted text-center mt-4 tracking-wide-luxe uppercase">{content.creci}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer content={content} />
      <WhatsAppButton content={content} />

      {/* Fixed bottom bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel px-4 py-3 md:hidden flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-luxe uppercase text-slate-muted">Valor</p>
          <p className="text-lg font-heading text-gold">{formatPrice(property.price)}</p>
        </div>
        <a href={waInterest} target="_blank" rel="noopener noreferrer" className="btn-gold !py-2.5 !px-5 !text-xs">
          <MessageCircle className="w-4 h-4" /> Tenho interesse
        </a>
      </div>

      {/* Lightbox */}
      {lightbox != null && photos.length > 0 && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-gold p-2" onClick={() => setLightbox(null)}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-gold p-2" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img src={photos[lightbox]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white/70 hover:text-gold p-2" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-9 h-9" />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/50 tracking-wide-luxe uppercase">
            {lightbox + 1} / {photos.length}
          </p>
        </div>
      )}
    </div>
  );
}
