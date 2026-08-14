import { MessageCircle } from "lucide-react";
import { waLink, DEFAULT_WHATSAPP } from "@/lib/siteConfig";

export default function WhatsAppButton({ content }) {
  const number = content?.contact_whatsapp || DEFAULT_WHATSAPP;
  const link = waLink(number, "Olá, Robson! Acessei seu site e gostaria de receber informações sobre imóveis disponíveis.");

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 group"
      aria-label="Falar no WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-transform duration-300 group-hover:scale-110">
        <MessageCircle className="w-7 h-7 text-white" />
      </span>
    </a>
  );
}
