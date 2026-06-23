import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCommunityStore = create(
    persist(
        (set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    activeChat: null,
    setActiveChat: (chat) => set({ activeChat: chat, rightPanel: null }),
    rightPanel: null, // 'profile', 'contact-info', 'settings', 'settings-account', 'settings-privacy', 'settings-chats', 'settings-notifications', 'settings-storage', 'settings-help'
    setRightPanel: (panel) => set({ rightPanel: panel }),
    activeView: 'home', // 'home', 'chat', 'settings', 'profile'
    setActiveView: (view) => set({ activeView: view }),
    messages: {
        '1': [
            { id: 1, senderId: 'me', text: 'Hey there! How is the relief effort going?', timestamp: '10:30 AM', status: 'seen' },
            { id: 2, senderId: '1', text: 'We just distributed the food packets.', timestamp: '10:32 AM', status: 'seen' },
        ],
        'group-1': [
            { id: 1, senderId: '2', text: 'Emergency meeting at 5 PM.', timestamp: '09:00 AM', status: 'seen' },
        ]
    },
    addMessage: (chatId, message) => set((state) => ({
        messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), message]
        }
    })),
    chats: [
        { id: '1', type: 'individual', name: 'Alex Johnson', phone: '+1 234 567 8900', lastMessage: 'We just distributed the food packets.', time: '10:32 AM', unread: 0 },
        { id: 'group-1', type: 'group', name: 'Sector 4 Volunteers', lastMessage: 'Emergency meeting at 5 PM.', time: '09:00 AM', unread: 2 },
        { id: 'channel-1', type: 'channel', name: 'City Alerts', lastMessage: 'Water supply restored in Downtown.', time: 'Yesterday', unread: 0 },
    ],
    settings: {
        account: { securityNotifications: true },
        privacy: { lastSeen: 'Everyone', profilePhoto: 'Everyone', about: 'Everyone', readReceipts: true, blockedContacts: [] },
        chats: { mediaAutoDownload: false },
        notifications: { message: true, group: true, sound: true },
        profile: { name: 'User', about: 'Available for emergency support' }
    },
    updateProfile: (key, value) => set((state) => ({
        settings: {
            ...state.settings,
            profile: {
                ...state.settings.profile,
                [key]: value
            }
        }
    })),
    updateSettings: (category, key, value) => set((state) => ({
        settings: {
            ...state.settings,
            [category]: {
                ...state.settings[category],
                [key]: value
            }
        }
    }))
        }),
        {
            name: 'community-chat-storage',
            partialize: (state) => ({ settings: state.settings, messages: state.messages, chats: state.chats }),
        }
    )
);
