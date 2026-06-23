import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Map as MapIcon, ArrowLeft, Wind, Droplets, Thermometer, Eye,
    AlertCircle, RefreshCw, Layers, CloudRain, Sun, Cloud, Zap,
    CloudSnow, CloudDrizzle, CloudLightning, Loader2
} from 'lucide-react';
import Navbar from '../../../components/common/Navbar';

/* ── OpenWeather config ────────────────────────────────────────── */
const OW_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OW_BASE = 'https://api.openweathermap.org/data/2.5';

/* ── Dummy crisis events (replace w/ real data later) ────────────── */
const CRISIS_EVENTS = [
    { id: 1, lat: 28.6139, lng: 77.2090, type: 'Medical', desc: 'Medical Emergency – Sector 4', urgent: true },
    { id: 2, lat: 28.7041, lng: 77.1025, type: 'Road Block', desc: 'Road Blockage – NH-48', urgent: false },
    { id: 3, lat: 28.5355, lng: 77.3910, type: 'Fire', desc: 'Structure Fire – Noida Sector 18', urgent: true },
    { id: 4, lat: 28.4595, lng: 77.0266, type: 'Flood', desc: 'Flash Flood Warning – Gurgaon', urgent: true },
    { id: 5, lat: 28.6692, lng: 77.4538, type: 'Supply', desc: 'Supply Drop – Ghaziabad East', urgent: false },
];

/* ── Weather icon helper ─────────────────────────────────────────── */
function WeatherIcon({ code, className = 'w-6 h-6' }) {
    const id = code || '';
    if (id.startsWith('01')) return <Sun className={className} />;
    if (id.startsWith('02') || id.startsWith('03') || id.startsWith('04')) return <Cloud className={className} />;
    if (id.startsWith('09')) return <CloudDrizzle className={className} />;
    if (id.startsWith('10')) return <CloudRain className={className} />;
    if (id.startsWith('11')) return <CloudLightning className={className} />;
    if (id.startsWith('13')) return <CloudSnow className={className} />;
    if (id.startsWith('50')) return <Eye className={className} />;
    return <Cloud className={className} />;
}

/* ── Marker colours ──────────────────────────────────────────────── */
function crisisMarkerHtml(urgent) {
    const color = urgent ? '#f87171' : '#38bdf8';
    return `<div style="
        background:${color};
        width:18px;height:18px;
        border-radius:50%;
        border:2px solid #fff;
        box-shadow:0 0 0 0 ${color}40;
        animation:crisisPing 1.4s infinite;
    "></div>
    <style>
      @keyframes crisisPing{0%{box-shadow:0 0 0 0 ${color}70}70%{box-shadow:0 0 0 10px ${color}00}100%{box-shadow:0 0 0 0 ${color}00}}
    </style>`;
}

/* ═══════════════════════════════════════════════════════════════════ */
const CrisisMapPage = () => {
    const navigate = useNavigate();
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const weatherLayerRef = useRef(null);

    const [weather, setWeather] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);
    const [weatherError, setWeatherError] = useState(null);
    const [activeLayer, setActiveLayer] = useState('precipitation');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 });
    const [lastUpdated, setLastUpdated] = useState(null);

    /* ── Fetch weather from OpenWeather ─────────────────────────── */
    const fetchWeather = useCallback(async (lat, lng) => {
        setLoadingWeather(true);
        setWeatherError(null);
        try {
            const res = await fetch(
                `${OW_BASE}/weather?lat=${lat}&lon=${lng}&appid=${OW_KEY}&units=metric`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setWeather(data);
            setLastUpdated(new Date());
        } catch (err) {
            setWeatherError('Unable to load weather data. Check your API key.');
            console.error('OpenWeather error:', err);
        } finally {
            setLoadingWeather(false);
        }
    }, []);

    /* ── Attempt geolocation, fall back to Delhi ────────────────── */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords: c }) => {
                    const loc = { lat: c.latitude, lng: c.longitude };
                    setCoords(loc);
                    fetchWeather(loc.lat, loc.lng);
                },
                () => fetchWeather(coords.lat, coords.lng),
                { timeout: 5000 }
            );
        } else {
            fetchWeather(coords.lat, coords.lng);
        }
    }, []);

    /* ── Initialise Leaflet map ──────────────────────────────────── */
    useEffect(() => {
        if (!mapEl.current || mapRef.current) return;

        mapRef.current = L.map(mapEl.current, {
            center: [coords.lat, coords.lng],
            zoom: 11,
            zoomControl: false,
            attributionControl: true,
        });

        /* Base tile */
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
        }).addTo(mapRef.current);

        /* Custom zoom control (bottom-right) */
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

        /* OpenWeather tile layer */
        weatherLayerRef.current = L.tileLayer(
            `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OW_KEY}`,
            { opacity: 0.6, maxZoom: 19 }
        ).addTo(mapRef.current);

        /* Crisis markers */
        CRISIS_EVENTS.forEach((ev) => {
            const marker = L.marker([ev.lat, ev.lng], {
                icon: L.divIcon({
                    className: '',
                    html: crisisMarkerHtml(ev.urgent),
                    iconSize: [18, 18],
                    iconAnchor: [9, 9],
                }),
            });
            marker.bindPopup(`
                <div style="font-family:Outfit,sans-serif;padding:4px 2px;min-width:140px">
                    <strong style="font-size:13px">${ev.type}</strong>
                    <p style="font-size:11px;color:#555;margin-top:4px">${ev.desc}</p>
                    <span style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;
                        background:${ev.urgent ? '#fee2e2' : '#e0f2fe'};
                        color:${ev.urgent ? '#dc2626' : '#0284c7'};
                        font-size:10px;font-weight:700">
                        ${ev.urgent ? 'URGENT' : 'MONITOR'}
                    </span>
                </div>
            `);
            marker.on('click', () => setSelectedEvent(ev));
            marker.addTo(mapRef.current);
        });

        /* User location marker */
        L.circleMarker([coords.lat, coords.lng], {
            radius: 9,
            fillColor: '#00e6ff',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.9,
        }).bindPopup('<strong>Your Location</strong>').addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    /* ── Swap weather overlay layer when activeLayer changes ─────── */
    useEffect(() => {
        if (!mapRef.current || !weatherLayerRef.current) return;
        mapRef.current.removeLayer(weatherLayerRef.current);
        weatherLayerRef.current = L.tileLayer(
            `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OW_KEY}`,
            { opacity: 0.6, maxZoom: 19 }
        ).addTo(mapRef.current);
    }, [activeLayer]);

    /* ── Layer options ────────────────────────────────────────────── */
    const layers = [
        { id: 'precipitation_new', label: 'Precipitation', icon: <CloudRain className="w-3.5 h-3.5" /> },
        { id: 'temp_new', label: 'Temperature', icon: <Thermometer className="w-3.5 h-3.5" /> },
        { id: 'wind_new', label: 'Wind Speed', icon: <Wind className="w-3.5 h-3.5" /> },
        { id: 'clouds_new', label: 'Clouds', icon: <Cloud className="w-3.5 h-3.5" /> },
        { id: 'pressure_new', label: 'Pressure', icon: <Zap className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="min-h-screen bg-[#080e14] text-white font-outfit flex flex-col">
            <Navbar />

            {/* ── Page header ───────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/5 bg-black/60 backdrop-blur-md z-20 relative flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="h-5 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-[#00e6ff]" />
                        <span className="font-bold text-lg tracking-tight">Crisis Map</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#00e6ff]/10 border border-[#00e6ff]/20 text-[#00e6ff] text-[10px] font-bold uppercase tracking-wider">Live</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                    {lastUpdated && (
                        <>
                            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                            <span>·</span>
                        </>
                    )}
                    <button
                        onClick={() => fetchWeather(coords.lat, coords.lng)}
                        className="flex items-center gap-1 hover:text-white/70 transition-colors"
                        title="Refresh weather"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            {/* ── Main layout ───────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row flex-1 relative overflow-hidden">

                {/* ── Left sidebar ──────────────────────────────────── */}
                <aside className="lg:w-80 flex-shrink-0 bg-[#0a1018]/90 border-r border-white/5 overflow-y-auto z-10 order-2 lg:order-1">

                    {/* Weather conditions */}
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Current Conditions</span>
                            {weather && (
                                <span className="text-[10px] text-white/30">{weather.name}, {weather.sys?.country}</span>
                            )}
                        </div>

                        {loadingWeather ? (
                            <div className="flex items-center gap-2 text-white/40 py-4 justify-center">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Loading weather…</span>
                            </div>
                        ) : weatherError ? (
                            <div className="text-red-400/70 text-xs py-3 px-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                {weatherError}
                            </div>
                        ) : weather && (
                            <>
                                {/* Main weather */}
                                <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-[#00e6ff]/5 border border-[#00e6ff]/10">
                                    <WeatherIcon code={weather.weather?.[0]?.icon} className="w-10 h-10 text-[#00e6ff]" />
                                    <div>
                                        <div className="text-3xl font-black text-white">{Math.round(weather.main?.temp)}°C</div>
                                        <div className="text-xs text-white/50 capitalize">{weather.weather?.[0]?.description}</div>
                                    </div>
                                </div>

                                {/* Weather stats grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: <Thermometer className="w-3.5 h-3.5" />, label: 'Feels Like', value: `${Math.round(weather.main?.feels_like)}°C` },
                                        { icon: <Droplets className="w-3.5 h-3.5" />, label: 'Humidity', value: `${weather.main?.humidity}%` },
                                        { icon: <Wind className="w-3.5 h-3.5" />, label: 'Wind', value: `${Math.round(weather.wind?.speed)} m/s` },
                                        { icon: <Eye className="w-3.5 h-3.5" />, label: 'Visibility', value: `${((weather.visibility || 10000) / 1000).toFixed(1)} km` },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-2.5 rounded-lg bg-white/3 border border-white/5 flex items-center gap-2">
                                            <span className="text-[#00e6ff]/60">{stat.icon}</span>
                                            <div>
                                                <div className="text-[9px] uppercase tracking-wider text-white/30">{stat.label}</div>
                                                <div className="text-xs font-bold text-white/80">{stat.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Map layers */}
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-3.5 h-3.5 text-white/30" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Weather Layers</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {layers.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setActiveLayer(l.id)}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                                        activeLayer === l.id
                                            ? 'bg-[#00e6ff]/15 border border-[#00e6ff]/30 text-[#00e6ff]'
                                            : 'bg-white/3 border border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
                                    }`}
                                >
                                    {l.icon} {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active crisis events */}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-3.5 h-3.5 text-red-400/60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">Crisis Events</span>
                            <span className="ml-auto px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">{CRISIS_EVENTS.filter(e => e.urgent).length} URGENT</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {CRISIS_EVENTS.map((ev) => (
                                <button
                                    key={ev.id}
                                    onClick={() => {
                                        setSelectedEvent(ev);
                                        if (mapRef.current) {
                                            mapRef.current.flyTo([ev.lat, ev.lng], 14, { duration: 1 });
                                        }
                                    }}
                                    className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                                        selectedEvent?.id === ev.id
                                            ? 'bg-[#00e6ff]/10 border-[#00e6ff]/30'
                                            : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ev.urgent ? 'bg-red-400' : 'bg-sky-400'}`} />
                                        <span className="text-xs font-semibold text-white/80">{ev.type}</span>
                                        {ev.urgent && (
                                            <span className="ml-auto text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Urgent</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-white/40 pl-4 leading-relaxed">{ev.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── Map area ──────────────────────────────────────────── */}
                <div className="flex-1 relative order-1 lg:order-2 min-h-[50vh] lg:min-h-0">
                    <div ref={mapEl} className="absolute inset-0" />

                    {/* Selected event overlay */}
                    {selectedEvent && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[min(340px,90vw)] bg-[#0a1018]/95 border border-[#00e6ff]/20 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${selectedEvent.urgent ? 'bg-red-400' : 'bg-sky-400'}`} />
                                    <span className="font-bold text-sm">{selectedEvent.type}</span>
                                    {selectedEvent.urgent && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold uppercase">Urgent</span>
                                    )}
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="text-white/30 hover:text-white text-xs">✕</button>
                            </div>
                            <p className="text-xs text-white/60 mb-3">{selectedEvent.desc}</p>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 rounded-lg bg-[#00e6ff]/10 border border-[#00e6ff]/20 text-[#00e6ff] text-xs font-bold hover:bg-[#00e6ff]/20 transition-colors">
                                    View Details
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors">
                                    Dispatch Help
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Map legend */}
                    <div className="absolute top-4 right-4 z-[400] bg-[#0a1018]/90 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-2 font-bold">Legend</div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" /> Urgent Crisis
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <span className="w-3 h-3 rounded-full bg-sky-400 flex-shrink-0" /> Active Event
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <span className="w-3 h-3 rounded-full bg-[#00e6ff] flex-shrink-0" /> Your Location
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrisisMapPage;
