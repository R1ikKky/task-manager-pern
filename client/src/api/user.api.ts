import { api } from "./interceptors";
import { useAuthStore } from "../store/user.store";
import { AxiosError } from "axios";

interface ApiResult {
  success: boolean;
  message?: string;
}

export const loginUser = async (email: string, password: string): Promise<ApiResult> => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, user } = res.data;

    const { setUser, setAccessToken, setAuthReady } = useAuthStore.getState();
    setUser(user);
    setAccessToken(accessToken);
    setAuthReady()
    console.log("[login] token in store ➜", useAuthStore.getState().accessToken);
    return { success: true };
  } catch (err) {
    const error = err as AxiosError
    console.error("Login Failed", error)
    return { success: false, message: error.message}
  }
  
};


export const registerUser = async (email: string, userName: string, password:string): Promise<ApiResult> => {
    try{
        const res = await api.post("/auth/register", { email, userName, password })
        const { accessToken, user } = res.data

        const { setUser, setAccessToken, setAuthReady } = useAuthStore.getState()
        setUser( user )
        setAccessToken(accessToken)
        setAuthReady()

        return { success: true }
    } catch(err){
        const error = err as AxiosError
        console.log("Registration failed:", error)
        return { success: false, message: error.message}
    }
}

export const logoutUser = async () => {
  useAuthStore.getState().logout()
  try{
    await api.post("/auth/logout").catch(() => {})
  } catch {}
}