import { create } from 'zustand';

const useEmergencyStore = create((set) => ({
    emergencyRequests: [
        { id: 1, lat: 40.7128, lng: -74.0060, title: 'Medical Assistance', urgency: 'urgent', timestamp: Date.now() - 300000 },
        { id: 2, lat: 40.7589, lng: -73.9851, title: 'Road Blockage', urgency: 'normal', timestamp: Date.now() - 600000 },
        { id: 3, lat: 40.7489, lng: -73.9680, title: 'Supply Distribution', urgency: 'low', timestamp: Date.now() - 900000 },
    ],
    userLocation: { lat: 40.7128, lng: -74.0060 },
    
    addEmergencyRequest: (request) => set((state) => ({
        emergencyRequests: [...state.emergencyRequests, { ...request, id: Date.now() }],
    })),
    
    updateUserLocation: (location) => set({ userLocation: location }),
    
    removeEmergencyRequest: (id) => set((state) => ({
        emergencyRequests: state.emergencyRequests.filter((req) => req.id !== id),
    })),
    
    clearEmergencyRequests: () => set({ emergencyRequests: [] }),
}));

export default useEmergencyStore;
