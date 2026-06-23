import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            role: null,
            isAuthenticated: false,
            hasCompletedRegistration: false,
            profileCompleted: false, // Legacy, keeping it for compatibility if needed elsewhere
            userData: {
                firstName: '',
                emailOrPhone: '',
                password: '',
                username: '',
                occupation: '',
                language: 'English',
                fontSize: 'Default',
                chatDensity: 'Compact',
                profilePicture: null
            },
            setRole: (role) => set({ role }),
            setUserData: (data) => set((state) => ({
                userData: { ...state.userData, ...data }
            })),
            login: (data) => set((state) => ({
                isAuthenticated: true,
                userData: { ...state.userData, ...data }
            })),
            setHasCompletedRegistration: (val) => set({ hasCompletedRegistration: val }),
            setProfileCompleted: (val) => set({ profileCompleted: val }),
            logout: () => set({
                role: null,
                isAuthenticated: false,
                hasCompletedRegistration: false,
                profileCompleted: false,
                userData: { firstName: '', emailOrPhone: '', password: '', username: '', occupation: '', language: 'English', fontSize: 'Default', chatDensity: 'Compact', profilePicture: null }
            }),
            clearAuth: () => set({
                role: null,
                isAuthenticated: false,
                hasCompletedRegistration: false,
                profileCompleted: false,
                userData: { firstName: '', emailOrPhone: '', password: '', username: '', occupation: '', language: 'English', fontSize: 'Default', chatDensity: 'Compact', profilePicture: null }
            }),
        }),
        {
            name: 'auth-storage', // unique name
        }
    )
);

export default useAuthStore;
