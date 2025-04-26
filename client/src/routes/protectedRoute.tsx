import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/user.store";

interface ProtectedRouteProps {
    redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
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

    return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;