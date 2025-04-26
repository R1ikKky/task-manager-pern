import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/user.store";

interface GuestRouteProps {
    redirectTo?: string 
}

const GuestRoute = ({redirectTo = "/" }: GuestRouteProps) => {
    const { user, isAuthReady } = useAuthStore();

    // Показываем загрузку пока проверяем авторизацию
    if (!isAuthReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-900 to-indigo-900 
                          flex items-center justify-center">
                <div className="text-white text-xl">Загрузка...</div>
            </div>
        );
    }

    return user ? <Navigate to={redirectTo} replace /> : <Outlet />;
}

export default GuestRoute;