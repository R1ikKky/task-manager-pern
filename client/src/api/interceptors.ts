import { api } from "./tasks.api";
import { useAuthStore } from "../store/user.store";

let isRefreshing = false
let failedQueue: any[] = []

 const processQueue = (error: any, token: string | null = null ) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
 }

 api.interceptors.response.use(
    (config) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
 )

 api.interceptors.request.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if(error.response?.status === 401 && !originalRequest._retry){
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                })
                .then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token as string}`
                    return api(originalRequest)
                })
                .catch((err) => Promise.reject(err))
            }

            //токен просрочен

            originalRequest._retry = true
            isRefreshing = true

            try{
                const res = await api.post("auth/refresh")
                const newToken = res.data.accessToken
                useAuthStore.getState().setAccessToken(newToken)

                processQueue(null, newToken)

                originalRequest.headers["Authorization"] = `Bearer ${newToken}`
                return api(originalRequest)
            }   catch(err){
                processQueue(err, null)
                useAuthStore.getState().logout()
                return Promise.reject(err)
            }   finally{
                isRefreshing = false
            }
        }
        return Promise.reject(error)
    }
 )
