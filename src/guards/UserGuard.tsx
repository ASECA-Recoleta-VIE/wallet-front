import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation, Outlet } from "react-router-dom";

export const UserGuard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  

  // Si no está autenticado, puede acceder a login/register
  return !isAuthenticated ? <Outlet /> : <Navigate to="/wallet" />;
};