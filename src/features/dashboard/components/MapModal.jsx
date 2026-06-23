import { X } from 'lucide-react';
import LiveMap from './LiveMap';

const MapModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full h-full flex flex-col bg-black">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-brand-accent">Live Local Map</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Map Container */}
                <div className="flex-1 overflow-hidden">
                    <LiveMap isFullScreen={true} onClose={onClose} />
                </div>

                {/* Footer Info */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
                    <p className="text-sm text-white/70">
                        🔴 Red = Urgent | 🟠 Orange = Normal | 🔵 Blue = Low Priority | 🔵 Cyan = Your Location
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
