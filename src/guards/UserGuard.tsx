import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const UserGuard = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return !isAuthenticated ? <Outlet /> : <Navigate to="/wallet" />;
}