import { api } from "./tasks.api";
import { useAuthStore } from "../store/user.store";

export const refreshUser = async () => {
    try {
        const res = await api.post("/auth/refresh")
        const { accessToken, user } = res.data

        const { setUser, setAccessToken } = useAuthStore.getState()
        setUser(user)
        setAccessToken(accessToken)

        console.log("[Auto-Login] Refreshed user:", user)
    } catch(err) {
        console.warn("[Auto-Login] Failed to refresh user")
    }
}