import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePrivacyStore = create(
    persist(
        (set) => ({
            privacySettings: {
                profilePhoto: 'everyone', // everyone, contacts, except, nobody
                profilePhotoExceptions: [],
                about: 'everyone',
                aboutExceptions: []
            },
            updatePrivacySetting: (field, value) => set((state) => ({
                privacySettings: {
                    ...state.privacySettings,
                    [field]: value
                }
            })),
            updateExceptions: (field, userIds) => set((state) => ({
                privacySettings: {
                    ...state.privacySettings,
                    [`${field}Exceptions`]: userIds
                }
            }))
        }),
        {
            name: 'privacy-settings-storage'
        }
    )
);
