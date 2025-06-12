import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const UserGuard = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();
    const testMode = new URLSearchParams(location.search).get('testmode') === 'true';
    
    console.log('UserGuard: isAuthenticated =', isAuthenticated);
    console.log('UserGuard: testMode =', testMode);

    if (isAuthenticated && !testMode) {
        console.log('UserGuard: User is authenticated and not in test mode, redirecting to /wallet');
        return <Navigate to="/wallet" />;
    }

    console.log('UserGuard: Allowing access to login/register (test mode or not authenticated)');
    return <Outlet />;
}