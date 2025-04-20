import { create } from 'zustand';
import { User } from '../interfaces/user.interface';

interface useAuthStore {
    user: User | null
    accessToken: string | null
    isAuthReady: boolean
    setUser: (u: User) => void
    setAccessToken: (t: string) => void
    setAuthReady: () => void
    logout: () => void
}

export const useAuthStore = create<useAuthStore>((set) => ({
    user: null,
    accessToken: null,
    isAuthReady: false,

    setUser: (user) => set({user}),
    setAccessToken: (token) => set({accessToken: token}),
    setAuthReady: () => set({ isAuthReady: true }),
    logout: () => set({user: null, accessToken: null, isAuthReady: true}),
}))