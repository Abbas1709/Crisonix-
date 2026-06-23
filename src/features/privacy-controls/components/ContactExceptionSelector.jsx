import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Search, UserCircle, X } from 'lucide-react';
import { usePrivacyStore } from '../store/usePrivacyStore';
import { usePrivacyUIStore } from '../store/usePrivacyUIStore';
import { useCommunityStore } from '../../community-chat/store/useCommunityStore';

export default function ContactExceptionSelector() {
    const { activeMenu, setActiveMenu } = usePrivacyUIStore();
    const { privacySettings, updatePrivacySetting, updateExceptions } = usePrivacyStore();
    const { chats } = useCommunityStore();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (activeMenu?.includes('Exceptions')) {
            const field = activeMenu.replace('Exceptions', '');
            setSelectedIds(privacySettings[`${field}Exceptions`] || []);
        }
    }, [activeMenu, privacySettings]);

    if (!activeMenu || !activeMenu.includes('Exceptions')) return null;

    const field = activeMenu.replace('Exceptions', '');
    const title = field === 'profilePhoto' ? 'Profile Photo' : 'About';
    
    // Only show individual contacts, not groups or channels
    const contacts = chats.filter(c => c.type === 'individual');
    
    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.phone && c.phone.includes(searchQuery))
    );

    const toggleContact = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        updateExceptions(field, selectedIds);
        updatePrivacySetting(field, 'except');
        setActiveMenu(field); // Go back to selection screen
    };

    const handleBack = () => {
        setActiveMenu(field); // Go back without saving
    };

    return (
        <div className="absolute inset-0 bg-[#0b141a] z-[60] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-[60px] bg-[#0d171d] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={handleBack} className="text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-white font-medium text-[15px]">Hide {title} from...</h3>
                        <p className="text-white/50 text-xs">{selectedIds.length} contacts excluded</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave} 
                    className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-[#0d171d] hover:bg-white transition-colors"
                >
                    <Check className="w-5 h-5" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3 bg-[#0d171d]">
                <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5">
                    <Search className="w-5 h-5 text-white/50 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-white text-[15px] flex-1 focus:outline-none placeholder:text-white/40"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')}>
                            <X className="w-4 h-4 text-white/50" />
                        </button>
                    )}
                </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-white/50">No contacts found</div>
                ) : (
                    <div className="py-2">
                        {filteredContacts.map(contact => {
                            const isSelected = selectedIds.includes(contact.id);
                            return (
                                <div 
                                    key={contact.id}
                                    onClick={() => toggleContact(contact.id)}
                                    className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                                        <UserCircle className="w-8 h-8 text-brand-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white text-[15px]">{contact.name}</div>
                                        <div className="text-white/50 text-xs">{contact.phone}</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-red-500' : 'border-2 border-white/50'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
