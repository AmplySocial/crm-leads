import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useSiteContent } from "@/lib/useSiteContent";
import { LayoutDashboard, Building2, Users, FileText, Star, LogOut, ExternalLink } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/imoveis", label: "Imóveis", icon: Building2 },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { to: "/admin/avaliacoes", label: "Avaliações", icon: Star },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { content } = useSiteContent();

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal border-r border-white/8 flex flex-col fixed h-screen z-30 hidden md:flex">
        <div className="p-6 border-b border-white/8">
          <img src={content.logo_url} alt="" className="h-10 w-auto object-contain" />
          <p className="text-[10px] tracking-luxe uppercase text-gold mt-3">Painel administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/8 space-y-1">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" /> Ver site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-white/70 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass-panel px-4 py-3 flex items-center justify-between">
        <img src={content.logo_url} alt="" className="h-8 w-auto" />
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-md text-xs whitespace-nowrap ${isActive(item) ? "text-gold" : "text-white/70"}`}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="px-3 py-2 text-red-300 text-xs"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-5 md:p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
