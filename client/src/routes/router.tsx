import { Route, Routes } from "react-router"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import Settings from "../pages/Settings"
import NoMatchPage from "../pages/NoMatchPage"

const AppRoutes = () => {
    const navigationRoutes = [
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/", element: <Dashboard /> },
        { path: "/profile", element: <Profile /> },
        { path: "/settings", element: <Settings /> },
        { path: "*", element: <NoMatchPage /> },
    ]
    return  (

    <Routes>
        {navigationRoutes.map((route) => (
            < Route key={route.path} path={route.path} element={route.element} />
        ))}
    </Routes>
    
    )
}

export default AppRoutes