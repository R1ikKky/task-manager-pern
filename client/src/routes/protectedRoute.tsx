import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/user.store";

interface ProtectedRouteProps {
    redirectTo?: string 
}

const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
    const { user } =useAuthStore()

    return user ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export default ProtectedRoute