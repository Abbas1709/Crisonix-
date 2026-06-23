import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const parseCoord = (v) => {
    const n = parseFloat(String(v).trim());
    return Number.isFinite(n) ? n : null;
};

/**
 * OSM tiles + click to set lat/lng. Optional reverse geocode fills address when possible.
 */
const MapLocationPicker = ({
    latitude,
    longitude,
    onLocationChange,
    className = '',
}) => {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const onLocationChangeRef = useRef(onLocationChange);
    const [reverseLoading, setReverseLoading] = useState(false);

    useEffect(() => {
        onLocationChangeRef.current = onLocationChange;
    }, [onLocationChange]);

    const lat = parseCoord(latitude);
    const lng = parseCoord(longitude);
    const hasPoint = lat != null && lng != null;

    useEffect(() => {
        if (!mapEl.current || mapRef.current) return;

        const initialLat = lat ?? 20.5937;
        const initialLng = lng ?? 78.9629;

        const map = L.map(mapEl.current, {
            zoomControl: true,
            attributionControl: true,
        }).setView([initialLat, initialLng], lat != null && lng != null ? 15 : 4);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
        markerRef.current = marker;
        mapRef.current = map;

        if (lat != null && lng != null) {
            map.setView([lat, lng], 15);
            marker.setLatLng([lat, lng]);
        }

        const reverseGeocode = async (latN, lngN) => {
            setReverseLoading(true);
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latN}&lon=${lngN}`;
                const res = await fetch(url, { headers: { Accept: 'application/json' } });
                if (!res.ok) return;
                const data = await res.json();
                const display = data?.display_name;
                if (display) {
                    onLocationChangeRef.current({
                        latitude: String(latN),
                        longitude: String(lngN),
                        address: display,
                    });
                }
            } catch {
                /* optional enrichment */
            } finally {
                setReverseLoading(false);
            }
        };

        const apply = (ll) => {
            const { lat: la, lng: ln } = ll;
            onLocationChangeRef.current({ latitude: String(la), longitude: String(ln) });
            void reverseGeocode(la, ln);
        };

        map.on('click', (e) => {
            marker.setLatLng(e.latlng);
            map.panTo(e.latlng);
            apply(e.latlng);
        });

        marker.on('dragend', () => {
            const ll = marker.getLatLng();
            apply(ll);
        });

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker || lat == null || lng == null) return;
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
    }, [lat, lng]);

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="relative rounded-xl overflow-hidden border border-white/20 bg-black/30">
                <div ref={mapEl} className="h-[260px] md:h-[340px] w-full z-0" />
                <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-xs text-white/80 backdrop-blur-md border border-white/10">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
                    <span>
                        {hasPoint
                            ? 'Tap the map or drag the pin to set your location. Address may auto-fill when available.'
                            : 'Tap the map to drop your pin. Coordinates will fill in below.'}
                    </span>
                </div>
                {reverseLoading && (
                    <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/80 backdrop-blur border border-white/10">
                        Looking up address…
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapLocationPicker;
