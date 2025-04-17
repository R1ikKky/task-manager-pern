import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/user.store";

interface GuestRouteProps {
    redirectTo?: string 
}

const GuestRoute = ({redirectTo = "/" }: GuestRouteProps) => {
    const { user } = useAuthStore()

    return user ? <Navigate to={redirectTo} replace /> : <Outlet />
}

export default GuestRoute