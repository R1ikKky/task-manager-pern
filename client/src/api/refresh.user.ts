import { api } from "./interceptors";
import { useAuthStore } from "../store/user.store";

export const refreshUser = async () => {
    try {
        const res = await api.post("/auth/refresh")
        const { accessToken, user} = res.data

        const { setUser, setAccessToken, setAuthReady } = useAuthStore.getState()
        setUser(user)
        setAccessToken(accessToken)
        
        console.log("[refresh] token in store ➜", useAuthStore.getState().accessToken);
        setAuthReady()

        console.log("[Auto-Login] Refreshed user:", user)
    } catch {
        
    }finally {
        useAuthStore.getState().setAuthReady()
    }
}