
import { create } from 'zustand';
import { User } from '../interfaces/user.interface';

interface useAuthStore {
    user: User | null
    accessToken: string | null
    setUser: (user: User) => void
    setAccessToken: (token: string) => void
    logout: () => void
}

export const useAuthStore = create<useAuthStore>((set) => ({
    user: null,
    accessToken: null,

    setUser: (user) => set({user}),
    setAccessToken: (token) => set({accessToken: token}),

    logout: () => set({user: null, accessToken: null}),
}))