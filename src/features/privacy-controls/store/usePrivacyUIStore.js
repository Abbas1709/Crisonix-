import { create } from 'zustand';

export const usePrivacyUIStore = create((set) => ({
    activeMenu: null, // 'profilePhoto', 'about', 'profilePhotoExceptions', 'aboutExceptions'
    setActiveMenu: (menu) => set({ activeMenu: menu }),
    closeMenu: () => set({ activeMenu: null })
}));
