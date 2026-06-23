import React, { useState } from 'react';
import { Search, MessageSquarePlus, MoreVertical, Users, Hash, UserCircle } from 'lucide-react';
import { useCommunityStore } from '../store/useCommunityStore';
import useAuthStore from '../../../store/authStore';

export default function Sidebar() {
    const { chats, activeChat, setActiveChat, setRightPanel } = useCommunityStore();
    const { userData } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, individual, group, channel

    const filteredChats = chats.filter(chat => {
        if (filter !== 'all' && chat.type !== filter) return false;
        if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="w-[380px] min-w-[380px] bg-[#0a1218] border-r border-white/10 flex flex-col h-full">
            {/* Header */}
            <div className="h-[60px] bg-[#0d171d] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
                <div 
                    onClick={() => setRightPanel('profile')}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 cursor-pointer hover:border-brand-accent/50 transition-colors"
                >
                    <UserCircle className="w-6 h-6 text-white/70" />
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-white/50 hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors">
                        <MessageSquarePlus className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setRightPanel('settings')}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/10">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                        type="text" 
                        placeholder="Search or start new chat"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#162128] text-white text-sm rounded-lg pl-10 pr-4 py-2 border border-transparent focus:border-brand-accent/30 focus:outline-none transition-colors placeholder:text-white/40"
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="px-3 pb-2 pt-1 flex gap-2 overflow-x-auto scrollbar-hide border-b border-white/10 shrink-0">
                {['all', 'individual', 'group', 'channel'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors border ${
                            filter === f 
                            ? 'bg-brand-accent/20 border-brand-accent/50 text-brand-accent' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                    >
                        {f === 'individual' ? 'Chats' : f + 's'}
                    </button>
                ))}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredChats.map((chat) => (
                    <div 
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-white/5 transition-colors ${
                            activeChat?.id === chat.id ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center shrink-0 border border-white/10 relative">
                            {chat.type === 'group' ? <Users className="w-6 h-6 text-white/50" /> : 
                             chat.type === 'channel' ? <Hash className="w-6 h-6 text-white/50" /> :
                             <UserCircle className="w-7 h-7 text-white/50" />}
                             {chat.type === 'individual' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a1218]"></div>}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-white font-medium truncate text-[15px]">{chat.name}</h4>
                                <span className={`text-xs ${chat.unread > 0 ? 'text-brand-accent' : 'text-white/40'}`}>{chat.time}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-white/50 text-sm truncate pr-2">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-brand-accent text-[#0a1218] text-[10px] font-bold flex items-center justify-center shrink-0">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
