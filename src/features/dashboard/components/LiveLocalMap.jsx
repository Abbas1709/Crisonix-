import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../../../components/common/Button';

// Dummy live emergency data (replace with real-time source in production)
const useLiveEmergencies = () => {
  const [emergencies, setEmergencies] = useState([
    { id: 1, lat: 28.6139, lng: 77.209, type: 'Medical', desc: 'Medical Emergency', urgent: true },
    { id: 2, lat: 28.7041, lng: 77.1025, type: 'Road Block', desc: 'Road Blockage', urgent: false },
  ]);
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencies((prev) => {
        // Randomly add a new emergency
        if (Math.random() < 0.2) {
          return [
            ...prev,
            {
              id: Date.now(),
              lat: 28.6 + Math.random() * 0.2,
              lng: 77.1 + Math.random() * 0.2,
              type: 'New Emergency',
              desc: 'Live update',
              urgent: Math.random() > 0.5,
            },
          ];
        }
        return prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  return emergencies;
};

const LiveLocalMap = ({ height = 250, preview = true, onExpandClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const emergencies = useLiveEmergencies();
  const [modalOpen, setModalOpen] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, {
      center: [28.6139, 77.209],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
      dragging: preview ? false : true,
      scrollWheelZoom: !preview,
      doubleClickZoom: !preview,
      boxZoom: !preview,
      keyboard: !preview,
      tap: !preview,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapInstance.current);
    markerLayer.current = L.layerGroup().addTo(mapInstance.current);
  }, [preview]);

  // Update markers live
  useEffect(() => {
    if (!markerLayer.current) return;
    markerLayer.current.clearLayers();
    emergencies.forEach((em) => {
      const marker = L.marker([em.lat, em.lng], {
        icon: L.divIcon({
          className: `live-marker ${em.urgent ? 'urgent' : ''}`,
          html: `<div style='background:${em.urgent ? '#f87171' : '#38bdf8'};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px #0003;'></div>`
        })
      }).bindPopup(`<b>${em.type}</b><br/>${em.desc}`);
      marker.addTo(markerLayer.current);
    });
  }, [emergencies]);

  // Modal full map
  const openModal = () => {
    if (onExpandClick) {
      onExpandClick();
    } else {
      setModalOpen(true);
    }
  };
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!modalOpen) return;
    // When modal opens, create a new map instance for full map
    const modalMap = L.map('full-live-map', {
      center: [28.6139, 77.209],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(modalMap);
    const modalLayer = L.layerGroup().addTo(modalMap);
    emergencies.forEach((em) => {
      const marker = L.marker([em.lat, em.lng], {
        icon: L.divIcon({
          className: `live-marker ${em.urgent ? 'urgent' : ''}`,
          html: `<div style='background:${em.urgent ? '#f87171' : '#38bdf8'};width:22px;height:22px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px #0003;'></div>`
        })
      }).bindPopup(`<b>${em.type}</b><br/>${em.desc}`);
      marker.addTo(modalLayer);
    });
    setTimeout(() => modalMap.invalidateSize(), 200);
    return () => modalMap.remove();
  }, [modalOpen, emergencies]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="rounded-xl border border-white/10 bg-black/60 overflow-hidden"
        style={{ height: height, minHeight: 180, filter: preview ? 'blur(0px)' : 'none', cursor: preview ? 'pointer' : 'grab' }}
        onClick={preview ? openModal : undefined}
      />
      {preview && (
        <Button
          variant="primary"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 shadow-lg"
          onClick={openModal}
        >
          Open Interactive Map
        </Button>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
          <div className="relative w-full max-w-5xl h-[80vh] bg-[#10151c] rounded-2xl border border-brand-accent/30 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-brand-accent/20 bg-black/40">
              <span className="text-lg font-bold text-brand-accent">Live Interactive Map</span>
              <Button variant="outline" onClick={closeModal}>Close</Button>
            </div>
            <div id="full-live-map" className="flex-1 w-full" style={{ minHeight: 400 }} />
          </div>
        </div>
      )}
      <style>{`
        .live-marker.urgent div { animation: pulse 1.2s infinite alternate; }
        @keyframes pulse { 0% { box-shadow:0 0 0 0 #f8717140; } 100% { box-shadow:0 0 0 8px #f8717140; } }
      `}</style>
    </div>
  );
};

export default LiveLocalMap;
