import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const UserGuard = () => {
    const { isAuthenticated } = useContext(AuthContext);
    console.log('UserGuard: isAuthenticated =', isAuthenticated);

    if (isAuthenticated) {
        console.log('UserGuard: User is authenticated, redirecting to /wallet');
        return <Navigate to="/wallet" />;
    }

    console.log('UserGuard: User is not authenticated, allowing access to login/register');
    return <Outlet />;
}