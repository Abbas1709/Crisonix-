import React, { useState } from 'react';
import { X, UserCircle, Bell, Lock, Shield, HelpCircle, Download, Ban, ThumbsDown, Info, Trash2, ArrowLeft, Key, MessageSquare, HardDrive, Edit2, Check } from 'lucide-react';
import { useCommunityStore } from '../store/useCommunityStore';
import useAuthStore from '../../../store/authStore';
import PrivacySelectionOverlay from '../../privacy-controls/components/PrivacySelectionOverlay';
import ContactExceptionSelector from '../../privacy-controls/components/ContactExceptionSelector';
import { usePrivacyUIStore } from '../../privacy-controls/store/usePrivacyUIStore';
import { usePrivacyStore } from '../../privacy-controls/store/usePrivacyStore';
import ProfileVisibilityWrapper from '../../privacy-controls/components/ProfileVisibilityWrapper';

export default function RightPanel() {
    const { rightPanel, setRightPanel, activeChat, settings, updateSettings, updateProfile } = useCommunityStore();
    const { userData } = useAuthStore();
    
    // Privacy Extension Stores
    const { setActiveMenu } = usePrivacyUIStore();
    const { privacySettings } = usePrivacyStore();
    
    // Local state for profile editing
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempAbout, setTempAbout] = useState('');

    if (!rightPanel) return null;

    const closePanel = () => setRightPanel(null);

    const handleBack = () => {
        if (rightPanel.startsWith('settings-')) {
            setRightPanel('settings');
        } else {
            closePanel();
        }
    };

    const getTitle = () => {
        switch(rightPanel) {
            case 'settings': return 'Settings';
            case 'settings-account': return 'Account';
            case 'settings-privacy': return 'Privacy';
            case 'settings-chats': return 'Chats';
            case 'settings-notifications': return 'Notifications';
            case 'settings-storage': return 'Storage & data';
            case 'settings-help': return 'Help';
            case 'profile': return 'Profile';
            case 'contact-info': return 'Contact info';
            default: return '';
        }
    };

    const renderToggle = (value, onChange) => (
        <div 
            onClick={onChange}
            className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${value ? 'bg-brand-accent' : 'bg-white/20'}`}
        >
            <div className={`absolute top-1 left-1 w-3 h-3 bg-[#0d171d] rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    );

    return (
        <div className="w-[380px] min-w-[380px] bg-[#0b141a] border-l border-white/10 flex flex-col h-full animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="h-[60px] bg-[#0d171d] px-4 flex items-center gap-6 border-b border-white/10 shrink-0">
                {rightPanel.startsWith('settings-') ? (
                    <button onClick={handleBack} className="text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                ) : (
                    <button onClick={closePanel} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <h3 className="text-white font-medium text-[15px]">{getTitle()}</h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {rightPanel === 'settings' && (
                    <div className="p-4 space-y-6">
                        <div 
                            onClick={() => setRightPanel('profile')}
                            className="flex items-center gap-4 p-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center border border-brand-accent/50">
                                <UserCircle className="w-10 h-10 text-brand-accent" />
                            </div>
                            <div>
                                <h4 className="text-white text-lg">{settings.profile.name || userData.firstName || 'User'}</h4>
                                <p className="text-white/50 text-sm">{settings.profile.about || 'Available for emergency support'}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <SettingItem onClick={() => setRightPanel('settings-account')} icon={<Key className="w-5 h-5" />} title="Account" subtitle="Security notifications, change number" />
                            <SettingItem onClick={() => setRightPanel('settings-privacy')} icon={<Lock className="w-5 h-5" />} title="Privacy" subtitle="Block contacts, disappearing messages" />
                            <SettingItem onClick={() => setRightPanel('settings-chats')} icon={<MessageSquare className="w-5 h-5" />} title="Chats" subtitle="Theme, wallpapers, chat history" />
                            <SettingItem onClick={() => setRightPanel('settings-notifications')} icon={<Bell className="w-5 h-5" />} title="Notifications" subtitle="Message, group & call tones" />
                            <SettingItem onClick={() => setRightPanel('settings-storage')} icon={<HardDrive className="w-5 h-5" />} title="Storage and data" subtitle="Network usage, auto-download" />
                            <SettingItem onClick={() => setRightPanel('settings-help')} icon={<HelpCircle className="w-5 h-5" />} title="Help" subtitle="Help center, contact us, privacy policy" />
                        </div>
                    </div>
                )}

                {rightPanel === 'settings-account' && (
                    <div className="space-y-1 py-2">
                        <div className="p-4 flex flex-col items-center text-center pb-6 border-b border-white/5">
                            <div className="w-20 h-20 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4">
                                <Shield className="w-10 h-10" />
                            </div>
                            <h3 className="text-white text-lg font-medium mb-2">Security notifications</h3>
                            <p className="text-white/50 text-sm">
                                Your messages and calls are end-to-end encrypted. Turn on this setting to receive notifications when a contact's security code changes.
                            </p>
                            <div className="w-full flex items-center justify-between mt-6 px-2">
                                <span className="text-white text-[15px]">Show security notifications</span>
                                {renderToggle(settings.account.securityNotifications, () => updateSettings('account', 'securityNotifications', !settings.account.securityNotifications))}
                            </div>
                        </div>
                        <SettingItem icon={<Download className="w-5 h-5" />} title="Request account info" />
                        <SettingItem icon={<Trash2 className="w-5 h-5" />} title="Delete account" className="text-red-400" iconColor="text-red-400" />
                    </div>
                )}

                {rightPanel === 'settings-privacy' && (
                    <div className="space-y-1 py-2">
                        <div className="px-5 py-3 text-brand-accent text-sm font-medium">Who can see my personal info</div>
                        <SettingItem title="Last seen and online" subtitle={settings.privacy.lastSeen} />
                        <SettingItem 
                            title="Profile photo" 
                            subtitle={privacySettings.profilePhoto === 'except' ? 'My contacts except...' : privacySettings.profilePhoto === 'contacts' ? 'My contacts' : privacySettings.profilePhoto.charAt(0).toUpperCase() + privacySettings.profilePhoto.slice(1)} 
                            onClick={() => setActiveMenu('profilePhoto')} 
                        />
                        <SettingItem 
                            title="About" 
                            subtitle={privacySettings.about === 'except' ? 'My contacts except...' : privacySettings.about === 'contacts' ? 'My contacts' : privacySettings.about.charAt(0).toUpperCase() + privacySettings.about.slice(1)} 
                            onClick={() => setActiveMenu('about')} 
                        />
                        
                        <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                            <div>
                                <div className="text-white text-[15px]">Read receipts</div>
                                <div className="text-white/50 text-sm mt-1 max-w-[250px]">If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.</div>
                            </div>
                            {renderToggle(settings.privacy.readReceipts, () => updateSettings('privacy', 'readReceipts', !settings.privacy.readReceipts))}
                        </div>

                        <div className="h-2 bg-[#0a1218] border-y border-white/5 my-2"></div>
                        <div className="px-5 py-3 text-brand-accent text-sm font-medium">Disappearing messages</div>
                        <SettingItem title="Default message timer" subtitle="Off" />

                        <div className="h-2 bg-[#0a1218] border-y border-white/5 my-2"></div>
                        <SettingItem title="Blocked contacts" subtitle="None" />
                    </div>
                )}

                {rightPanel === 'settings-chats' && (
                    <div className="space-y-1 py-2">
                        <div className="px-5 py-3 text-brand-accent text-sm font-medium">Chat settings</div>
                        <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                            <div>
                                <div className="text-white text-[15px]">Media auto-download</div>
                                <div className="text-white/50 text-sm mt-1">Automatically download photos and videos</div>
                            </div>
                            {renderToggle(settings.chats.mediaAutoDownload, () => updateSettings('chats', 'mediaAutoDownload', !settings.chats.mediaAutoDownload))}
                        </div>
                        
                        <div className="h-2 bg-[#0a1218] border-y border-white/5 my-2"></div>
                        <SettingItem icon={<MessageSquare className="w-5 h-5" />} title="Chat backup" />
                        <SettingItem icon={<Download className="w-5 h-5" />} title="Export chat" />
                        <SettingItem icon={<Trash2 className="w-5 h-5" />} title="Clear all chats" className="text-red-400" iconColor="text-red-400" />
                    </div>
                )}

                {rightPanel === 'settings-notifications' && (
                    <div className="space-y-1 py-2">
                        <div className="px-5 py-3 text-brand-accent text-sm font-medium">Messages</div>
                        <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                            <div>
                                <div className="text-white text-[15px]">Show notifications</div>
                            </div>
                            {renderToggle(settings.notifications.message, () => updateSettings('notifications', 'message', !settings.notifications.message))}
                        </div>

                        <div className="h-2 bg-[#0a1218] border-y border-white/5 my-2"></div>
                        <div className="px-5 py-3 text-brand-accent text-sm font-medium">Groups</div>
                        <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                            <div>
                                <div className="text-white text-[15px]">Show notifications</div>
                            </div>
                            {renderToggle(settings.notifications.group, () => updateSettings('notifications', 'group', !settings.notifications.group))}
                        </div>
                        
                        <div className="h-2 bg-[#0a1218] border-y border-white/5 my-2"></div>
                        <div className="px-5 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer">
                            <div>
                                <div className="text-white text-[15px]">Conversation tones</div>
                                <div className="text-white/50 text-sm mt-1">Play sounds for incoming and outgoing messages.</div>
                            </div>
                            {renderToggle(settings.notifications.sound, () => updateSettings('notifications', 'sound', !settings.notifications.sound))}
                        </div>
                    </div>
                )}

                {rightPanel === 'settings-storage' && (
                    <div className="space-y-1 py-2">
                        <SettingItem icon={<HardDrive className="w-5 h-5" />} title="Manage storage" subtitle="1.2 GB used" />
                        <SettingItem icon={<Download className="w-5 h-5" />} title="Network usage" subtitle="450 MB sent • 1.1 GB received" />
                    </div>
                )}

                {rightPanel === 'settings-help' && (
                    <div className="space-y-1 py-2">
                        <SettingItem icon={<HelpCircle className="w-5 h-5" />} title="Help center" />
                        <SettingItem icon={<MessageSquare className="w-5 h-5" />} title="Contact us" subtitle="Questions? Need help?" />
                        <SettingItem icon={<Info className="w-5 h-5" />} title="Terms and Privacy Policy" />
                    </div>
                )}

                {rightPanel === 'profile' && (
                    <div className="p-4 flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-brand-accent/20 flex items-center justify-center border border-brand-accent/50 mt-4 mb-8 relative group cursor-pointer">
                            <UserCircle className="w-24 h-24 text-brand-accent" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs uppercase tracking-wider font-bold flex flex-col items-center gap-2">
                                    <Camera className="w-6 h-6" /> Change
                                </span>
                            </div>
                        </div>

                        <div className="w-full space-y-6">
                            <div className="bg-[#111b21] p-4 rounded-xl border border-white/5 relative group">
                                <label className="text-brand-accent text-xs uppercase tracking-wider font-bold mb-1 block">Your Name</label>
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 mt-2 border-b border-brand-accent pb-1">
                                        <input 
                                            type="text" 
                                            value={tempName} 
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="bg-transparent text-white text-[15px] flex-1 focus:outline-none"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    updateProfile('name', tempName);
                                                    setIsEditingName(false);
                                                }
                                            }}
                                        />
                                        <button onClick={() => { updateProfile('name', tempName); setIsEditingName(false); }} className="text-brand-accent hover:text-white transition-colors">
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-white text-[15px]">{settings.profile.name}</div>
                                        <button onClick={() => { setTempName(settings.profile.name); setIsEditingName(true); }} className="text-white/50 hover:text-white transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <p className="text-white/40 text-xs mt-4 leading-relaxed">This is not your username or pin. This name will be visible to your community contacts.</p>
                            </div>

                            <div className="bg-[#111b21] p-4 rounded-xl border border-white/5 relative group">
                                <label className="text-brand-accent text-xs uppercase tracking-wider font-bold mb-1 block">About</label>
                                {isEditingAbout ? (
                                    <div className="flex items-center gap-2 mt-2 border-b border-brand-accent pb-1">
                                        <input 
                                            type="text" 
                                            value={tempAbout} 
                                            onChange={(e) => setTempAbout(e.target.value)}
                                            className="bg-transparent text-white text-[15px] flex-1 focus:outline-none"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    updateProfile('about', tempAbout);
                                                    setIsEditingAbout(false);
                                                }
                                            }}
                                        />
                                        <button onClick={() => { updateProfile('about', tempAbout); setIsEditingAbout(false); }} className="text-brand-accent hover:text-white transition-colors">
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-white text-[15px]">{settings.profile.about}</div>
                                        <button onClick={() => { setTempAbout(settings.profile.about); setIsEditingAbout(true); }} className="text-white/50 hover:text-white transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {rightPanel === 'contact-info' && activeChat && (
                    <div className="flex flex-col">
                        <div className="bg-[#111b21] p-6 flex flex-col items-center mb-2 border-b border-white/5">
                            <ProfileVisibilityWrapper 
                                targetUserId={activeChat.id} 
                                field="profilePhoto"
                                fallback={
                                    <div className="w-32 h-32 rounded-full bg-black/40 flex items-center justify-center border border-white/10 mb-4">
                                        <UserCircle className="w-16 h-16 text-white/20" />
                                    </div>
                                }
                            >
                                <div className="w-32 h-32 rounded-full bg-black/40 flex items-center justify-center border border-white/10 mb-4">
                                    {activeChat.type === 'group' ? <Users className="w-16 h-16 text-white/50" /> : 
                                     activeChat.type === 'channel' ? <Hash className="w-16 h-16 text-white/50" /> :
                                     <UserCircle className="w-16 h-16 text-white/50" />}
                                </div>
                            </ProfileVisibilityWrapper>
                            <h2 className="text-white text-xl mb-1">{activeChat.name}</h2>
                            <p className="text-white/50 text-sm">
                                {activeChat.phone || (activeChat.type === 'group' ? 'Group - 12 members' : 'Public Channel')}
                            </p>
                        </div>

                        {activeChat.type === 'individual' && (
                            <ProfileVisibilityWrapper targetUserId={activeChat.id} field="about">
                                <div className="bg-[#111b21] p-4 mb-2 border-y border-white/5">
                                    <div className="text-white text-[15px] mb-1">Available for emergency support</div>
                                    <div className="text-white/50 text-xs">About</div>
                                </div>
                            </ProfileVisibilityWrapper>
                        )}

                        <div className="bg-[#111b21] p-4 mb-2 border-y border-white/5 space-y-4">
                            <div className="flex items-center justify-between cursor-pointer group">
                                <span className="text-white text-[15px]">Mute notifications</span>
                                <div className="w-10 h-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors"></div>
                            </div>
                            <div className="flex items-center justify-between cursor-pointer group">
                                <span className="text-white text-[15px]">Disappearing messages</span>
                                <span className="text-white/50 text-sm">Off</span>
                            </div>
                            <div className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-white/50" />
                                    <span className="text-white text-[15px]">Encryption</span>
                                </div>
                                <span className="text-white/50 text-sm text-right max-w-[150px] truncate">Messages are end-to-end encrypted.</span>
                            </div>
                        </div>

                        <div className="bg-[#111b21] p-2 border-y border-white/5">
                            {activeChat.type === 'individual' && (
                                <button className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-white/5 transition-colors text-[15px]">
                                    <Ban className="w-5 h-5" /> Block {activeChat.name}
                                </button>
                            )}
                            <button className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-white/5 transition-colors text-[15px]">
                                <ThumbsDown className="w-5 h-5" /> Report {activeChat.name}
                            </button>
                            {activeChat.type !== 'channel' && (
                                <button className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-white/5 transition-colors text-[15px]">
                                    <Trash2 className="w-5 h-5" /> Delete chat
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Privacy Module Extensions */}
            <PrivacySelectionOverlay />
            <ContactExceptionSelector />
        </div>
    );
}

function SettingItem({ icon, title, subtitle, onClick, className = '', iconColor = 'text-white/50' }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-white/5 transition-colors ${className}`}>
            {icon && (
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${iconColor}`}>
                    {icon}
                </div>
            )}
            <div className="flex-1">
                <div className="text-white text-[15px]">{title}</div>
                {subtitle && <div className="text-white/50 text-sm">{subtitle}</div>}
            </div>
        </div>
    );
}

function Camera(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    )
}
function Users(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
}
function Hash(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
    )
}
