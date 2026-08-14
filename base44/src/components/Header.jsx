import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/siteConfig";

const NAV_LINKS = [
  { label: "Início", to: "/" },
  { label: "Imóveis", to: "/imoveis" },
  { label: "Comprar", to: "/imoveis?finalidade=Venda" },
  { label: "Vender", to: "/#vender" },
  { label: "Sobre", to: "/#sobre" },
  { label: "Contato", to: "/#contato" },
];

export default function Header({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const wa = waLink(
    content.contact_whatsapp,
    "Olá, Robson! Acessei seu site e gostaria de receber informações sobre imóveis disponíveis."
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-panel py-3 shadow-luxe"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={content.logo_url}
            alt="Robson Corretor de Imóveis"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isHash = link.to.includes("#");
            const isActive =
              !isHash &&
              (location.pathname === link.to ||
                (link.to.startsWith("/imoveis") && location.pathname === "/imoveis"));
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`text-[13px] tracking-wide-luxe uppercase font-medium transition-colors duration-300 ${
                  isActive ? "text-gold" : "text-white/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold !py-2.5 !px-5 !text-xs"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass-panel mt-3 mx-3 rounded-lg overflow-hidden animate-fade-up">
          <nav className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-6 py-3 text-sm tracking-wide-luxe uppercase text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mx-5 mt-3 !py-3"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
