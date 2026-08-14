import { Link } from "react-router-dom";
import { Bed, Bath, Car, Maximize, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { formatPrice, waLink } from "@/lib/siteConfig";

const STATUS_STYLES = {
  Disponível: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Reservado: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Vendido: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function PropertyCard({ property, content, index = 0 }) {
  const photo = property.photos && property.photos[0];
  const wa = waLink(
    content?.contact_whatsapp,
    `Olá, Robson! Tenho interesse no imóvel ${property.name}. Poderia me passar mais informações?`
  );

  const status = property.status || "Disponível";

  return (
    <div
      className="group relative bg-charcoal rounded-lg overflow-hidden border border-white/6 transition-all duration-500 hover:border-gold/40 hover:shadow-luxe animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden bg-obsidian">
        {photo ? (
          <img
            src={photo}
            alt={property.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-muted/40 text-xs">
            Sem foto
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.featured && (
            <span className="px-3 py-1 text-[10px] tracking-wide-luxe uppercase gold-gradient-bg text-black font-semibold rounded-sm">
              Destaque
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-[10px] tracking-wide-luxe uppercase rounded-sm border ${STATUS_STYLES[status] || STATUS_STYLES.Disponível}`}>
            {status}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] tracking-wide-luxe uppercase text-gold-light font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded-sm">
            {property.type} · {property.purpose}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading text-lg text-white leading-snug group-hover:text-gold transition-colors">
            {property.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-muted mb-4">
          <MapPin className="w-3.5 h-3.5 text-gold/70" />
          <span>
            {property.neighborhood ? `${property.neighborhood}, ` : ""}
            {property.city || "Santa Luzia - MG"}
          </span>
        </div>

        <p className="text-xl font-heading text-gold mb-4">{formatPrice(property.price)}</p>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-white/70 mb-5 flex-wrap">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-gold/70" /> {property.bedrooms} qt</span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-gold/70" /> {property.bathrooms} ban</span>
          )}
          {property.parking != null && (
            <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-gold/70" /> {property.parking} vg</span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-gold/70" /> {property.area} m²</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/imovel/${property.id}`}
            className="flex-1 text-center text-xs tracking-wide-luxe uppercase py-3 border border-gold/40 text-gold hover:bg-gold/10 transition-colors rounded-sm"
          >
            Ver imóvel
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25 transition-colors rounded-sm"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
