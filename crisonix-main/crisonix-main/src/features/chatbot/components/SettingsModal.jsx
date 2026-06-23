import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import useAuthStore from '../../../store/authStore';
import { X, Settings, Bell, Palette, LayoutGrid, Database, Shield, User, ChevronDown, Check, Trash2, Lock, LogOut } from 'lucide-react';

const SETTINGS_TABS = [
  { id: 'General', icon: Settings, label: 'General' },
  { id: 'Notifications', icon: Bell, label: 'Notifications' },
  { id: 'Personalization', icon: Palette, label: 'Personalization' },
  { id: 'Apps', icon: LayoutGrid, label: 'Apps (Account variant)' },
  { id: 'Data controls', icon: Database, label: 'Data controls' },
  { id: 'Security', icon: Shield, label: 'Security' },
  { id: 'Account', icon: User, label: 'Account' },
];

export default function SettingsModal() {
  const { isSettingsOpen, setSettingsOpen, activeSettingsTab, setActiveSettingsTab } = useChatStore();
  const { userData } = useAuthStore();
  const displayName = userData.firstName || userData.username || 'User';

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-[#080c10]/75 backdrop-blur-[20px]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setSettingsOpen(false);
          }
        }}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-[1000px] aspect-video bg-[#0f141c]/90 backdrop-blur-[24px] border border-[#00d4ff]/20 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.1)] flex overflow-hidden flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={() => setSettingsOpen(false)}
          className="absolute top-4 left-4 z-10 p-2 text-[#7a8a99] hover:text-[#00d4ff] transition-colors bg-[#080c10]/50 rounded-full md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-[#00d4ff]/10 bg-[#0a0a0f]/50 p-4 pt-16 md:pt-4 flex flex-col gap-2 overflow-y-auto">
          <div className="hidden md:flex justify-between items-center mb-4 pl-2">
            <h2 className="text-[#e8edf2] font-semibold text-lg">Settings</h2>
            <button 
              onClick={() => setSettingsOpen(false)}
              className="p-1 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSettingsTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
                    : 'text-[#7a8a99] hover:text-[#e8edf2] hover:bg-[#111820]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <h2 className="text-2xl font-semibold text-[#e8edf2] mb-8">{activeSettingsTab}</h2>
          <div className="space-y-8 pb-12">
            {activeSettingsTab === 'General' && <GeneralSettings />}
            {activeSettingsTab === 'Notifications' && <NotificationSettings />}
            {activeSettingsTab === 'Personalization' && <PersonalizationSettings />}
            {activeSettingsTab === 'Apps' && <div className="text-[#7a8a99]">No apps installed.</div>}
            {activeSettingsTab === 'Data controls' && <DataControlSettings />}
            {activeSettingsTab === 'Security' && <SecuritySettings />}
            {activeSettingsTab === 'Account' && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#00d4ff]' : 'bg-[#111820] border border-[#7a8a99]/30'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'transform translate-x-5' : ''}`} />
    </button>
  );
}

function Dropdown({ value, options }) {
  return (
    <div className="relative group cursor-pointer inline-block">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00d4ff]/20 bg-[#0a0a0f] text-[#e8edf2] text-sm hover:border-[#00d4ff]/50 transition-colors">
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-[#7a8a99]" />
      </div>
      <div className="absolute top-full mt-1 right-0 min-w-[150px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-10 bg-[#0f1419] border border-[#00d4ff]/20 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-lg p-1">
        {options.map((opt, i) => (
          <div key={`${opt}-${i}`} className="px-3 py-2 text-sm text-[#e8edf2] hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] rounded cursor-pointer transition-colors">
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [darkToggle, setDarkToggle] = useState('Dark');
  const [separateVoice, setSeparateVoice] = useState(false);
  const { userData } = useAuthStore();

  return (
    <div className="space-y-6 max-w-2xl text-[#e8edf2]">
      <div className="flex items-center justify-between py-2 border-b border-[#ffffff0a]">
        <div>
          <h3 className="font-medium">Appearance</h3>
          <p className="text-sm text-[#7a8a99] mt-1">Theme preference.</p>
        </div>
        <div className="flex rounded-lg border border-[#00d4ff]/20 overflow-hidden bg-[#0a0a0f] p-1">
          {['System', 'Light', 'Dark'].map(t => (
            <button key={t} onClick={() => setDarkToggle(t)} className={`px-4 py-1.5 text-sm rounded-md transition-all ${darkToggle === t ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-[#7a8a99] hover:text-[#e8edf2]'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Accent color</h3>
        <Dropdown value="Default" options={['Default', 'Cyan', 'Purple']} />
      </div>
      <div className="flex items-center justify-between py-2 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Language</h3>
        <Dropdown value={userData.language || "Auto-detect"} options={['Auto-detect', 'English', 'Spanish', 'French']} />
      </div>
      <div className="flex flex-col py-2 border-b border-[#ffffff0a]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">System language</h3>
            <p className="text-sm text-[#7a8a99] mt-1">Language affects speech recognition accuracy.</p>
          </div>
          <Dropdown value="Auto-detect" options={['Auto-detect', 'English (US)', 'English (UK)']} />
        </div>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Voice</h3>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-[#00d4ff]/10 flex items-center justify-center text-[#00d4ff] hover:bg-[#00d4ff]/20 transition-colors">▶</button>
          <Dropdown value="Jumper" options={['Jumper', 'Breeze', 'Cove']} />
        </div>
      </div>
      <div className="flex items-center justify-between py-2 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Separate voice mode</h3>
        <Toggle checked={separateVoice} onChange={setSeparateVoice} />
      </div>
    </div>
  );
}

function NotificationSettings() {
  const notes = [
    { id: 'Response', desc: 'When the AI generates a long response.' },
    { id: 'Group chats', desc: 'Mentions and activity in group discussions.' },
    { id: 'Tasks', desc: 'Task completion and updates.', type: 'Both' },
    { id: 'Projects', desc: 'Project-level alerts.' },
    { id: 'Recommendations', desc: 'New feature suggestions via AI.', type: 'Both' }
  ];

  const [toggles, setToggles] = useState({});

  return (
    <div className="space-y-4 max-w-2xl">
      {notes.map((n) => (
        <div key={n.id} className="flex items-center justify-between py-3 border-b border-[#ffffff0a] group">
          <div>
            <h3 className="font-medium text-[#e8edf2]">{n.id}</h3>
            <p className="text-sm text-[#7a8a99] mt-0.5">{n.desc}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7a8a99] uppercase tracking-wider hidden group-hover:block transition-all bg-[#080c10] px-2 py-1 border border-[#00d4ff]/10 rounded">
              {n.type || 'Push'} Delivery
            </span>
            <Toggle 
              checked={toggles[n.id] ?? true} 
              onChange={(val) => setToggles({...toggles, [n.id]: val})} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PersonalizationSettings() {
  const subToggles = ['Warm', 'Enthusiastic', 'Headers & Lists', 'Emoji'];
  const [toggles, setToggles] = useState({Memory1: true, Memory2: true, Adv1: false, Adv2: true});
  const { userData } = useAuthStore();

  return (
    <div className="space-y-8 max-w-2xl text-[#e8edf2]">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Base style and tone</h3>
        <Dropdown value="Default" options={['Default', 'Professional', 'Friendly', 'Candid', 'Efficient', 'Nerdy', 'Cynical']} />
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Characteristics</h3>
        <div className="grid grid-cols-2 gap-4">
          {subToggles.map(t => (
            <div key={t} className="flex justify-between items-center bg-[#0a0a0f]/50 p-3 rounded-lg border border-[#ffffff0a]">
              <span className="text-sm">{t}</span>
              <Dropdown value="Default" options={['Default', 'More', 'Less']} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Customer instructions</h3>
        <textarea 
          placeholder="How should Crisonix respond to you?"
          className="w-full h-24 bg-[#0a0a0f] border border-[#00d4ff]/20 rounded-xl p-3 text-sm text-[#e8edf2] focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] outline-none resize-none transition-all"
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">About You</h3>
        <div className="space-y-3">
          <input type="text" defaultValue={userData.username || userData.firstName || ""} placeholder="Nickname" className="w-full bg-[#0a0a0f] border border-[#00d4ff]/20 rounded-lg p-3 text-sm focus:border-[#00d4ff] outline-none text-[#e8edf2]" />
          <input type="text" defaultValue={userData.occupation || ""} placeholder="Occupation" className="w-full bg-[#0a0a0f] border border-[#00d4ff]/20 rounded-lg p-3 text-sm focus:border-[#00d4ff] outline-none text-[#e8edf2]" />
          <textarea placeholder="More about you..." className="w-full h-20 bg-[#0a0a0f] border border-[#00d4ff]/20 rounded-lg p-3 text-sm focus:border-[#00d4ff] outline-none resize-none text-[#e8edf2]" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Memory</h3>
         <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span>Reference saved memory</span>
                <p className="text-xs text-[#7a8a99] mt-1">Crisonix will use your saved personal details.</p>
              </div>
              <Toggle checked={toggles.Memory1} onChange={(v) => setToggles({...toggles, Memory1: v})} />
            </div>
             <div className="flex justify-between items-center">
              <div>
                <span>Reference chat history</span>
                <p className="text-xs text-[#7a8a99] mt-1">Allow ChatGPT-like contextual memory over time.</p>
              </div>
              <Toggle checked={toggles.Memory2} onChange={(v) => setToggles({...toggles, Memory2: v})} />
            </div>
         </div>
      </div>
    </div>
  );
}

function DataControlSettings() {
  const [improveModel, setImproveModel] = useState(true);
  const [expandImprove, setExpandImprove] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl text-[#e8edf2]">
      <div className="border border-[#00d4ff]/10 rounded-xl overflow-hidden bg-[#0a0a0f]/30">
        <div 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00d4ff]/5 transition-colors"
          onClick={() => setExpandImprove(!expandImprove)}
        >
          <div>
            <h3 className="font-medium">Improve model for everyone</h3>
            <p className="text-sm text-[#7a8a99] mt-1">Allow your data to train our systems.</p>
          </div>
          <div className="flex items-center gap-3">
             <Toggle checked={improveModel} onChange={(v) => {setImproveModel(v); if(v===true) setExpandImprove(true)}} />
             <ChevronDown className={`w-4 h-4 text-[#7a8a99] transition-transform ${expandImprove ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {expandImprove && (
          <div className="p-4 border-t border-[#00d4ff]/10 bg-[#080c10] space-y-4">
            <div className="flex justify-between items-center ml-4">
              <span className="text-sm">Include your audio recordings</span>
              <Toggle checked={true} onChange={()=>{}} />
            </div>
             <div className="flex justify-between items-center ml-4">
              <span className="text-sm">Include your video recordings</span>
              <Toggle checked={false} onChange={()=>{}} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center py-3 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Shared list</h3>
        <button className="px-4 py-1.5 border border-[#00d4ff]/30 text-sm rounded-lg hover:bg-[#00d4ff]/10 text-[#00d4ff] transition-colors">Manage</button>
      </div>
       <div className="flex justify-between items-center py-3 border-b border-[#ffffff0a]">
        <h3 className="font-medium">Archive chats</h3>
        <button className="px-4 py-1.5 border border-[#00d4ff]/30 text-sm rounded-lg hover:bg-[#00d4ff]/10 text-[#00d4ff] transition-colors">Manage</button>
      </div>

      <div className="flex gap-3 pt-4">
        <button className="px-5 py-2 border border-[#7a8a99]/30 rounded-lg text-sm hover:bg-[#ffffff0a] transition-colors">Archive all chats</button>
        <button 
          onClick={() => setShowConfirm(true)}
          className="px-5 py-2 border border-[#c0392b]/50 text-[#c0392b] rounded-lg text-sm hover:bg-[#c0392b]/10 transition-colors"
        >
          Delete all chats
        </button>
        <button className="px-5 py-2 border border-[#00d4ff]/30 text-[#00d4ff] rounded-lg text-sm hover:bg-[#00d4ff]/10 transition-colors ml-auto">
          Export chats
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080c10]/80">
          <div className="bg-[#0f1419] p-6 rounded-2xl border border-[#c0392b]/30 max-w-sm w-full shadow-[0_0_40px_rgba(192,57,43,0.2)]">
            <h3 className="text-xl text-white mb-2">Delete all chats?</h3>
            <p className="text-[#7a8a99] text-sm mb-6">This action cannot be undone. All your chat history will be permanently deleted.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm text-[#e8edf2] hover:bg-[#111820] rounded-lg">Cancel</button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm bg-[#c0392b] text-white hover:bg-[#a93226] rounded-lg">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SecuritySettings() {
  const [authApp, setAuthApp] = useState(true);
  const [smsAuth, setSmsAuth] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl text-[#e8edf2]">
      <div className="flex justify-between items-center py-3 border-b border-[#ffffff0a]">
        <div>
          <h3 className="font-medium">Passkeys</h3>
          <p className="text-sm text-[#7a8a99] mt-0.5">Use biometric login without passwords.</p>
        </div>
        <button className="px-4 py-1.5 border border-[#00d4ff]/30 text-sm rounded-lg hover:bg-[#00d4ff]/10 text-[#00d4ff] transition-colors">Add</button>
      </div>

      <div className="py-2">
        <h3 className="font-medium mb-4 text-[#00d4ff]">Multi-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#ffffff0a]">
            <div>
              <h4 className="text-sm font-medium">Authenticator app</h4>
              <p className="text-xs text-[#7a8a99] mt-1">Use an app like Google Authenticator.</p>
            </div>
            <Toggle checked={authApp} onChange={setAuthApp} />
          </div>
          <div className="flex justify-between items-center bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#ffffff0a]">
            <div>
              <h4 className="text-sm font-medium">Text message</h4>
              <p className="text-xs text-[#7a8a99] mt-1">We will send a code to your mobile device (+1 ...)</p>
            </div>
            <Toggle checked={smsAuth} onChange={setSmsAuth} />
          </div>
        </div>
      </div>

       <div className="flex justify-between items-center py-3 border-b border-[#ffffff0a]">
        <div>
          <h3 className="font-medium">Trusted devices</h3>
          {authApp || smsAuth ? (
             <p className="text-sm text-[#7a8a99] mt-0.5 flex items-center gap-2"><Lock className="w-3 h-3 text-[#00d4ff]"/> MFA is active</p>
          ) : (
             <p className="text-sm text-[#7a8a99] mt-0.5 flex items-center gap-2">MFA is inactive</p>
          )}
        </div>
        <button className="px-4 py-1.5 border border-[#00d4ff]/30 text-sm rounded-lg hover:bg-[#00d4ff]/10 text-[#00d4ff] transition-colors">Device list</button>
      </div>

      <div className="pt-6 space-y-3">
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[#7a8a99]/30 rounded-lg text-sm hover:bg-[#ffffff0a] transition-colors w-full sm:w-auto">
          <LogOut className="w-4 h-4" /> Log out of this device
        </button>
        <div className="p-4 border border-[#c0392b]/30 bg-[#c0392b]/5 rounded-xl">
           <button className="px-5 py-2 bg-[#c0392b]/10 border border-[#c0392b]/50 text-[#c0392b] rounded-lg text-sm hover:bg-[#c0392b] hover:text-white transition-colors mb-2 w-full sm:w-auto">
            Log out of all devices
          </button>
          <p className="text-xs text-[#7a8a99]">This will invalidate all current sessions across every device you are logged into.</p>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  const { userData, setUserData, role } = useAuthStore();
  const [formData, setFormData] = useState({
     username: userData.username || userData.firstName || '',
     fontSize: userData.fontSize || 'Small',
     chatDensity: userData.chatDensity || 'Compact'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);

  // Check if form is dirty
  const isDirty = formData.username !== userData.username;

  const handleEditCancel = () => {
      if (isDirty) {
          setShowDiscardWarning(true);
      } else {
          setIsEditing(false);
      }
  };

  const handleSave = () => {
      setUserData({
          username: formData.username,
          fontSize: formData.fontSize,
          chatDensity: formData.chatDensity
      });
      setIsEditing(false);
  };

  useEffect(() => {
     // Auto-save display preferences immediately on change (without needing to click save)
     setUserData({
         fontSize: formData.fontSize,
         chatDensity: formData.chatDensity
     });
  }, [formData.fontSize, formData.chatDensity, setUserData]);

  return (
    <div className="space-y-8 max-w-2xl text-[#e8edf2] relative h-full">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00d4ff] to-[#007a99] flex items-center justify-center text-2xl font-bold border-2 border-[#00d4ff]/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
             {displayName.charAt(0).toUpperCase()}
          </div>
          <button 
             onClick={() => setIsEditing(true)}
             className="absolute bottom-0 right-0 w-7 h-7 bg-[#0f1419] rounded-full border border-[#00d4ff]/30 flex items-center justify-center hover:bg-[#00d4ff]/20 text-[#00d4ff] transition-colors"
          >
            <span className="text-xs">✎</span>
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{displayName}</h2>
          <span className="inline-block px-2 py-0.5 rounded text-xs bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 mt-1">{role || 'User'}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#ffffff0a]">
          <label className="text-xs text-[#7a8a99] uppercase tracking-wider block mb-1">Mail ID</label>
          <div className="text-sm font-medium">{userData.emailOrPhone || 'user@example.com'}</div>
        </div>
         <div className="bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#ffffff0a]">
          <label className="text-xs text-[#7a8a99] uppercase tracking-wider block mb-1">User ID</label>
          <div className="text-sm font-mono text-[#00d4ff]">crix-8942-109</div>
        </div>
         <div className="bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#ffffff0a]">
          <label className="text-xs text-[#7a8a99] uppercase tracking-wider block mb-1">Role</label>
          <div className="text-sm font-medium flex justify-between items-center">
            {role || 'User'}
            <span className="text-xs text-[#7a8a99]">Email and role can only be updated from the main dashboard</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#ffffff0a]">
        <h3 className="font-medium mb-4">Display preferences</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Font size</span>
             <div className="flex rounded-lg border border-[#00d4ff]/20 overflow-hidden bg-[#0a0a0f] p-1">
              {['Small', 'Default', 'Large'].map(t => (
                <button key={t} onClick={() => setFormData({...formData, fontSize: t})} className={`px-4 py-1 text-sm rounded-md transition-all ${formData.fontSize === t ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-[#7a8a99] hover:text-[#e8edf2]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-sm">Chat density</span>
             <div className="flex rounded-lg border border-[#00d4ff]/20 overflow-hidden bg-[#0a0a0f] p-1">
              {['Compact', 'Default', 'Comfortable'].map(t => (
                <button key={t} onClick={() => setFormData({...formData, chatDensity: t})} className={`px-4 py-1 text-sm rounded-md transition-all ${formData.chatDensity === t ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-[#7a8a99] hover:text-[#e8edf2]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex gap-4 text-xs text-[#7a8a99]">
        <a href="#" className="hover:text-[#00d4ff] transition-colors">Terms & conditions</a>
        <span>|</span>
        <a href="#" className="hover:text-[#00d4ff] transition-colors">Privacy policy</a>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080c10]/80 backdrop-blur-sm -m-6 md:-m-8">
           <div className="bg-[#0f1419] p-6 rounded-2xl border border-[#00d4ff]/30 max-w-sm w-full shadow-[0_0_40px_rgba(0,212,255,0.15)] relative">
              <h3 className="text-xl text-white mb-4">Edit Profile</h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs text-[#7a8a99] mb-1 block">Username</label>
                    <input 
                       type="text" 
                       value={formData.username}
                       onChange={(e) => setFormData({...formData, username: e.target.value})}
                       className="w-full bg-[#0a0a0f] border border-[#00d4ff]/20 rounded-lg p-3 text-sm focus:border-[#00d4ff] outline-none text-[#e8edf2]"
                    />
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button onClick={handleEditCancel} className="px-4 py-2 text-sm text-[#e8edf2] hover:bg-[#111820] rounded-lg border border-[#ffffff0a]">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-brand-accent/20 text-[#00d4ff] hover:bg-brand-accent/30 border border-[#00d4ff]/30 rounded-lg">Save</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Discard Warning Modal */}
      {showDiscardWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#080c10]/90 backdrop-blur-sm -m-6 md:-m-8">
           <div className="bg-[#0f1419] p-6 rounded-2xl border border-[#c0392b]/30 max-w-sm w-full shadow-[0_0_40px_rgba(192,57,43,0.2)]">
              <h3 className="text-xl text-white mb-2">Discard Changes?</h3>
              <p className="text-[#7a8a99] text-sm mb-6">You have unsaved changes. Are you sure you want to discard them?</p>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setShowDiscardWarning(false)} className="px-4 py-2 text-sm text-[#e8edf2] hover:bg-[#111820] border border-[#ffffff0a] rounded-lg">Cancel</button>
                 <button 
                   onClick={() => {
                      setShowDiscardWarning(false);
                      setIsEditing(false);
                      setFormData(prev => ({...prev, username: userData.username || userData.firstName || ''})); // Revert changes
                   }} 
                   className="px-4 py-2 text-sm bg-[#c0392b]/20 text-[#c0392b] border border-[#c0392b]/40 hover:bg-[#c0392b]/30 rounded-lg"
                 >
                   Yes, Discard
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
