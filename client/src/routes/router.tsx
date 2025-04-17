import { Route, Routes } from "react-router"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import Settings from "../pages/Settings"
import NoMatchPage from "../pages/NoMatchPage"
import ProtectedRoute from "./protectedRoute"
import GuestRoute from "./guestRoute"

const AppRoutes = () => {
    return  (

    <Routes>
        <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/settings" element={<Settings/>} />
        </Route>

        <Route path="*" element={<NoMatchPage />} />
    </Routes>
    
    )
}

export default AppRoutes