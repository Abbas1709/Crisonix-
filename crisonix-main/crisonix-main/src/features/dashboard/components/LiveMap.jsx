import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useEmergencyStore from '../../../store/useEmergencyStore';

// Fix Leaflet icon issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LiveMap = ({ isFullScreen = false, onClose }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const userMarkerRef = useRef(null);
    
    const { emergencyRequests, userLocation } = useEmergencyStore();

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map if not already done
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Add or update user location marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        } else {
            userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
                radius: 8,
                fillColor: '#00e6ff',
                color: '#00e6ff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
            }).bindPopup('Your Location').addTo(map);
        }

        // Clear old markers not in current requests
        Object.keys(markersRef.current).forEach((id) => {
            if (!emergencyRequests.find((req) => req.id.toString() === id)) {
                map.removeLayer(markersRef.current[id]);
                delete markersRef.current[id];
            }
        });

        // Add or update emergency request markers
        emergencyRequests.forEach((request) => {
            const markerId = request.id.toString();
            
            if (!markersRef.current[markerId]) {
                // Determine marker color based on urgency
                let color = '#00e6ff'; // default
                if (request.urgency === 'urgent') color = '#ef4444';
                else if (request.urgency === 'normal') color = '#f97316';
                else if (request.urgency === 'low') color = '#3b82f6';

                const marker = L.circleMarker([request.lat, request.lng], {
                    radius: 10,
                    fillColor: color,
                    color: color,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7,
                }).bindPopup(`
                    <div class="p-2 text-xs">
                        <h3 class="font-bold mb-1">${request.title}</h3>
                        <p>Urgency: ${request.urgency}</p>
                        <p>${new Date(request.timestamp).toLocaleTimeString()}</p>
                    </div>
                `).addTo(map);

                markersRef.current[markerId] = marker;
            }
        });
    }, [emergencyRequests, userLocation]);

    return (
        <div
            ref={mapRef}
            className={`w-full rounded-xl border border-white/20 bg-black/40 ${
                isFullScreen
                    ? 'h-screen'
                    : 'h-[250px] md:h-[350px] shadow-inner'
            } leaflet-container`}
        />
    );
};

export default LiveMap;
