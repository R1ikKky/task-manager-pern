import { api } from "./tasks.api";
import { useAuthStore } from "../store/user.store";
import { User } from "../interfaces/user.interface";
import { AxiosError } from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, user } = res.data;

    const { setUser, setAccessToken } = useAuthStore.getState();
    setUser(user);
    setAccessToken(accessToken);

    return { success: true };
  } catch (err) {
    const error = err as AxiosError
    console.error("Login Failed", error)
    return { success: false, message: error.message }
  }
};


export const registerUser = async (email: string, userName: string, password:string) => {
    try{
        const res = await api.post("/auth/register", { email, userName, password })
        const { accessToken, user } = res.data

        const { setUser, setAccessToken } = useAuthStore.getState()
        setUser( user )
        setAccessToken(accessToken)

        return { success: true }
    } catch(err){
        const error = err as AxiosError
        console.log("Registration failed:", error)
        return { success: false, message: error.message}
    }
}