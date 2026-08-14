import { Link } from "react-router-dom";
import { MessageCircle, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { waLink } from "@/lib/siteConfig";

export default function Footer({ content }) {
  const wa = waLink(
    content.contact_whatsapp,
    "Olá, Robson! Acessei seu site e gostaria de receber informações sobre imóveis disponíveis."
  );

  return (
    <footer className="bg-obsidian border-t border-white/8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <img
              src={content.logo_url}
              alt="Robson Corretor de Imóveis"
              className="h-14 w-auto object-contain mb-5"
            />
            <p className="text-sm text-slate-muted leading-relaxed">
              {content.corretor_name}
            </p>
            <p className="text-xs text-gold mt-2 tracking-wide-luxe uppercase">
              {content.creci}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-luxe uppercase text-gold mb-5">Navegação</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-white/70 hover:text-gold transition-colors">Início</Link></li>
              <li><Link to="/imoveis" className="text-sm text-white/70 hover:text-gold transition-colors">Imóveis</Link></li>
              <li><Link to="/#sobre" className="text-sm text-white/70 hover:text-gold transition-colors">Sobre</Link></li>
              <li><Link to="/#contato" className="text-sm text-white/70 hover:text-gold transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-luxe uppercase text-gold mb-5">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors">
                  <MessageCircle className="w-4 h-4 text-gold" /> {content.contact_phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${content.contact_email}`} className="flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold" /> {content.contact_email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>{content.contact_address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-luxe uppercase text-gold mb-5">Redes</h4>
            <div className="flex gap-3">
              {content.social_instagram && (
                <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {content.social_facebook && (
                <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs text-slate-muted mt-5">{content.contact_city}</p>
          </div>
        </div>

        <div className="gold-hairline my-10" />

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-slate-muted text-center">
            {new Date().getFullYear()} {content.corretor_name}. Todos os direitos reservados.
          </p>
          <Link
            to="/admin"
            title="Painel administrativo"
            className="text-slate-muted/40 hover:text-gold transition-colors text-2xl leading-none"
          >
            ©
          </Link>
        </div>
      </div>
    </footer>
  );
}
