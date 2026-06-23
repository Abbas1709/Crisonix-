import React from 'react';
import { useCommunityStore } from '../store/useCommunityStore';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import RightPanel from './RightPanel';
import { X } from 'lucide-react';

export default function CommunityChatOverlay() {
    const { isOpen, setIsOpen } = useCommunityStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 font-outfit">
            <div className="w-full max-w-[1400px] h-[90vh] bg-[#0d171d] border border-white/10 rounded-2xl overflow-hidden flex shadow-2xl relative">
                {/* Close Button */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-red-500/20 text-white/50 hover:text-red-500 rounded-full flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <Sidebar />
                <ChatArea />
                <RightPanel />
            </div>
        </div>
    );
}
