import React from 'react';
import { ArrowLeft, Check, UserCircle } from 'lucide-react';
import { usePrivacyStore } from '../store/usePrivacyStore';
import { usePrivacyUIStore } from '../store/usePrivacyUIStore';
import { useCommunityStore } from '../../community-chat/store/useCommunityStore';

const OPTIONS = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'contacts', label: 'My contacts' },
    { id: 'except', label: 'My contacts except...' },
    { id: 'nobody', label: 'Nobody' }
];

export default function PrivacySelectionOverlay() {
    const { activeMenu, closeMenu, setActiveMenu } = usePrivacyUIStore();
    const { privacySettings, updatePrivacySetting } = usePrivacyStore();

    if (!activeMenu || activeMenu.includes('Exceptions')) return null;

    const title = activeMenu === 'profilePhoto' ? 'Profile Photo' : 'About';
    const currentValue = privacySettings[activeMenu];

    const handleSelect = (optionId) => {
        if (optionId === 'except') {
            setActiveMenu(`${activeMenu}Exceptions`);
        } else {
            updatePrivacySetting(activeMenu, optionId);
        }
    };

    return (
        <div className="absolute inset-0 bg-[#0b141a] z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-[60px] bg-[#0d171d] px-4 flex items-center gap-6 border-b border-white/10 shrink-0">
                <button onClick={closeMenu} className="text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-white font-medium text-[15px]">{title}</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                <div className="px-5 py-3 text-brand-accent text-sm font-medium">Who can see my {title.toLowerCase()}</div>
                
                <div className="bg-[#111b21] border-y border-white/5">
                    {OPTIONS.map(option => (
                        <div 
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="flex-1 text-white text-[15px]">{option.label}</div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentValue === option.id ? 'border-brand-accent' : 'border-white/50'}`}>
                                {currentValue === option.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
