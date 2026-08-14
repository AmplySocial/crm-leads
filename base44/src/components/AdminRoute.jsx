import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminRoute() {
  return (
    <ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />}>
      <AdminRoleCheck />
    </ProtectedRoute>
  );
}

function AdminRoleCheck() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth || !user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
        <div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-obsidian px-5 text-center">
        <p className="text-white text-lg font-heading mb-2">Acesso restrito</p>
        <p className="text-slate-muted text-sm">Você não tem permissão para acessar o painel administrativo.</p>
        <a href="/" className="btn-ghost-gold mt-6">Voltar ao site</a>
      </div>
    );
  }

  return <Outlet />;
}
