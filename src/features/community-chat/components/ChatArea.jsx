import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Smile, Mic, Send, Lock, Hash, Users, UserCircle, Check, CheckCheck } from 'lucide-react';
import { useCommunityStore } from '../store/useCommunityStore';

export default function ChatArea() {
    const { activeChat, messages, addMessage, setRightPanel } = useCommunityStore();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    const currentMessages = activeChat ? (messages[activeChat.id] || []) : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);

    const handleSend = () => {
        if (!inputText.trim() || !activeChat) return;
        
        const newMessage = {
            id: Date.now(),
            senderId: 'me',
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };
        
        addMessage(activeChat.id, newMessage);
        setInputText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!activeChat) {
        return (
            <div className="flex-1 bg-[#0d171d] flex flex-col items-center justify-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00d4ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <div className="text-center max-w-md z-10 space-y-6">
                    <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto border border-brand-accent/20 shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                        <MessageSquareIcon className="w-10 h-10 text-brand-accent" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-light text-white mb-3">Crisonix <span className="font-bold text-brand-accent">Community</span></h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Connect with volunteers, NGOs, and people in need. Send and receive messages in real-time.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-white/5">
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-full hover:bg-brand-accent/20 transition-colors text-sm font-medium border border-brand-accent/20">
                            <MessageSquareIcon className="w-4 h-4" /> Start Chat
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full hover:bg-white/10 transition-colors text-sm font-medium border border-white/10">
                            <Users className="w-4 h-4" /> Create Group
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full hover:bg-white/10 transition-colors text-sm font-medium border border-white/10">
                            <Hash className="w-4 h-4" /> Channels
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/30 pt-6">
                        <Lock className="w-3 h-3" /> End-to-end encrypted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')]" />

            {/* Chat Header */}
            <div className="h-[60px] bg-[#0d171d] px-4 flex items-center justify-between border-b border-white/10 z-10 shrink-0">
                <div 
                    onClick={() => setRightPanel('contact-info')}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/5 px-2 py-1 -ml-2 rounded-lg transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                        {activeChat.type === 'group' ? <Users className="w-6 h-6 text-white/50" /> : 
                         activeChat.type === 'channel' ? <Hash className="w-6 h-6 text-white/50" /> :
                         <UserCircle className="w-7 h-7 text-white/50" />}
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-[15px]">{activeChat.name}</h3>
                        <p className="text-white/50 text-xs">
                            {activeChat.type === 'individual' ? 'Online' : 
                             activeChat.type === 'group' ? 'Tap here for group info' : 'Channel'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-white/50 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setRightPanel('contact-info')}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar flex flex-col gap-2">
                <div className="flex justify-center mb-4">
                    <span className="bg-[#182229] text-white/60 text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm border border-white/5">
                        Today
                    </span>
                </div>
                
                {currentMessages.map((msg, idx) => {
                    const isMe = msg.senderId === 'me';
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                            <div className={`max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm relative group ${
                                isMe ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'
                            }`}>
                                {!isMe && activeChat.type === 'group' && (
                                    <div className="text-[11px] font-bold text-orange-400 mb-0.5">
                                        Volunteer {msg.senderId}
                                    </div>
                                )}
                                <div className="text-[14.5px] leading-relaxed break-words pr-2 pb-1">
                                    {msg.text}
                                </div>
                                <div className={`flex items-center justify-end gap-1 text-[10px] ${isMe ? 'text-white/60' : 'text-white/50'} float-right mt-1 ml-3`}>
                                    {msg.timestamp}
                                    {isMe && (
                                        <span className="text-brand-accent">
                                            {msg.status === 'seen' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeChat.type !== 'channel' ? (
                <div className="h-[62px] bg-[#0d171d] px-4 flex items-center gap-3 z-10 shrink-0">
                    <button className="text-white/50 hover:text-white transition-colors p-2">
                        <Smile className="w-6 h-6" />
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors p-2">
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message"
                            className="w-full bg-[#2a3942] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none placeholder:text-white/40"
                        />
                    </div>
                    {inputText.trim() ? (
                        <button 
                            onClick={handleSend}
                            className="text-white/50 hover:text-brand-accent transition-colors p-2"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    ) : (
                        <button className="text-white/50 hover:text-white transition-colors p-2">
                            <Mic className="w-6 h-6" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="h-[62px] bg-[#0d171d] flex items-center justify-center z-10 shrink-0 text-white/50 text-sm">
                    Only admins can send messages
                </div>
            )}
        </div>
    );
}

function MessageSquareIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )
}
