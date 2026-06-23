import { create } from 'zustand';

export const useChatStore = create((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    
    isFullScreen: false,
    setFullScreen: (isFullScreen) => set({ isFullScreen }),
    
    isSidebarOpen: true,
    setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

    isSettingsOpen: false,
    setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
    
    activeSettingsTab: 'General',
    setActiveSettingsTab: (activeSettingsTab) => set({ activeSettingsTab }),

    messages: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
}));
