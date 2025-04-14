
import { create } from 'zustand';

interface User {
    id: string
    email: string
    userName: string
}

interface useAuthUser {
    user: User | null
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<useAuthUser>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    logout: () => set({user: null})
}))