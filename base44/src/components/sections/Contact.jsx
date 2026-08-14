import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { waLink } from "@/lib/siteConfig";
import SectionHeading from "@/components/SectionHeading";

export default function Contact({ content }) {
  const wa = waLink(content.contact_whatsapp, "Olá, Robson! Gostaria de conversar sobre imóveis.");

  // Santa Luzia MG approx coordinates
  const lat = -19.769;
  const lng = -43.851;
  const delta = 0.012;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}&layer=mapnik&marker=${lat}%2C${lng}`;

  const items = [
    { icon: Phone, label: "Telefone", value: content.contact_phone, href: `tel:${content.contact_phone?.replace(/\D/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: content.contact_phone, href: wa, external: true },
    { icon: Mail, label: "E-mail", value: content.contact_email, href: `mailto:${content.contact_email}` },
    { icon: MapPin, label: "Endereço", value: content.contact_address },
  ];

  return (
    <section id="contato" className="py-20 lg:py-28 bg-obsidian scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contato"
          title="Fale com Robson"
          subtitle="Atendimento personalizado para comprar, vender ou investir em imóveis."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-14">
          {/* Info */}
          <div className="space-y-4">
            {items.map((it) => {
              const Inner = (
                <div className="flex items-start gap-4 p-5 bg-charcoal/60 rounded-lg border border-white/6 hover:border-gold/30 transition-colors h-full">
                  <div className="w-11 h-11 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                    <it.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-luxe uppercase text-slate-muted mb-1">{it.label}</p>
                    <p className="text-sm text-white font-light leading-relaxed">{it.value}</p>
                  </div>
                </div>
              );
              return it.href ? (
                <a
                  key={it.label}
                  href={it.href}
                  target={it.external ? "_blank" : undefined}
                  rel={it.external ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {Inner}
                </a>
              ) : (
                <div key={it.label}>{Inner}</div>
              );
            })}

            <div className="p-5 bg-charcoal/60 rounded-lg border border-gold/20">
              <p className="text-[10px] tracking-luxe uppercase text-slate-muted mb-1">Registro profissional</p>
              <p className="text-gold font-heading text-lg">{content.creci}</p>
            </div>

            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
              <MessageCircle className="w-4 h-4" />
              Iniciar conversa no WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden border border-white/8 shadow-luxe h-full min-h-[380px]">
            <iframe
              title="Localização"
              src={mapSrc}
              className="w-full h-full min-h-[380px] grayscale-[0.3]"
              loading="lazy"
              style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) contrast(0.9)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
