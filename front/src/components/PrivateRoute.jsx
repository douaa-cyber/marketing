import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

// On ajoute 'allowedRoles' en props
export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p className="p-4 text-center">Chargement...</p>;

  // 1. Si pas d'utilisateur du tout -> Direction Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si des rôles sont spécifiés et que l'utilisateur n'en fait pas partie
  // On le redirige vers l'accueil (ou une page 403)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Sinon, tout est bon !
  return children;
}
