import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import useAuthStore from '../../../store/authStore';
import { 
  MessageSquarePlus, Settings, Menu, Paperclip, Mic, Send,
  Plus, Search, BrainCircuit, BookOpen, GitBranch, Volume2, AlertTriangle, Menu as MenuIcon,
  X, Maximize2, Minimize2
} from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function ChatInterface() {
  const { isSidebarOpen, setSidebarOpen, setSettingsOpen, setIsOpen, isFullScreen, setFullScreen } = useChatStore();
  const { userData } = useAuthStore();
  const displayName = userData.firstName || userData.username || 'User';
  const [inputVal, setInputVal] = useState('');
  const [isActive, setIsActive] = useState(false); // Mocking active conversation
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeDropdownOpen, setActiveDropdownOpen] = useState(false);

  // Dynamic Styles based on preferences
  const fontSizeCls = userData.fontSize === 'Large' ? 'text-[17px]' : userData.fontSize === 'Small' ? 'text-[13px]' : 'text-[15px]';
  const pyCls = userData.chatDensity === 'Comfortable' ? 'py-4' : userData.chatDensity === 'Compact' ? 'py-1.5' : 'py-3';

  return (
    <div className={`transition-all duration-300 ${
      isFullScreen 
        ? "fixed inset-0 z-40 flex bg-[#080c10] text-[#e8edf2] font-sans h-screen w-screen overflow-hidden" 
        : "fixed bottom-[90px] right-6 z-40 flex bg-[#0f141c]/95 backdrop-blur-[20px] text-[#e8edf2] font-sans w-[380px] h-[520px] overflow-hidden border border-[#00d4ff]/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
    }`}>
      
      {/* Sidebar - Collapsible (Hidden in mini mode) */}
      <div 
        className={`${isFullScreen ? (isSidebarOpen ? 'w-64' : 'w-0') : 'w-0'} transition-all duration-300 flex flex-col bg-[#0a0a0f] border-r border-[#00d4ff]/10 h-full shrink-0 overflow-hidden relative group`}
      >
        <div className="p-4 flex items-center justify-between">
          <button 
            className={`flex items-center gap-2 text-[#e8edf2] hover:text-[#00d4ff] transition-colors`}
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span className="font-medium whitespace-nowrap">New chat</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
           <div className="text-xs font-semibold text-[#7a8a99] px-2 py-2 uppercase tracking-wider mt-2 hover:text-[#00d4ff] transition-colors cursor-pointer group whitespace-nowrap">
              Today
           </div>
           <div className="px-3 py-2 text-sm text-[#e8edf2] bg-[#00d4ff]/10 rounded-lg cursor-pointer truncate border border-[#00d4ff]/20">
              Crisis Response Protocol
           </div>
           <div className="text-xs font-semibold text-[#7a8a99] px-2 py-2 uppercase tracking-wider mt-4 whitespace-nowrap">
              Previous 7 Days
           </div>
           <div className="px-3 py-2 text-sm text-[#7a8a99] hover:bg-[#111820] rounded-lg cursor-pointer truncate transition-colors">
              Drafting Evacuation Plan
           </div>
           <div className="px-3 py-2 text-sm text-[#7a8a99] hover:bg-[#111820] rounded-lg cursor-pointer truncate transition-colors">
              Medical Supplies List
           </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#00d4ff]/10 flex items-center justify-between hover:bg-[#111820] transition-colors cursor-pointer" onClick={() => setSettingsOpen(true)}>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00d4ff] to-[#007a99] flex items-center justify-center text-sm font-bold border border-[#00d4ff]/30 shrink-0">
               {displayName.charAt(0).toUpperCase()}
             </div>
             <span className="text-sm font-medium whitespace-nowrap">{displayName}</span>
          </div>
          <Settings className="w-4 h-4 text-[#7a8a99] shrink-0" />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative h-full w-full overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between z-10 bg-[#0f141c]/50 backdrop-blur-md border-b border-[#ffffff0a]">
          <div className="flex items-center gap-3">
            {isFullScreen && !isSidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-1 sm:p-2 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-lg hover:bg-[#00d4ff]/10 hidden md:block"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="text-lg sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#e8edf2]">
              Crisonix
            </div>
          </div>

          {/* Context Tools (Right Side) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Active conversation context group */}
            {isActive && isFullScreen && (
              <div className="flex items-center gap-1 mr-2 sm:mr-4 border-r border-[#00d4ff]/20 pr-2 sm:pr-4">
                <div className="relative group">
                  <button onClick={() => setActiveDropdownOpen(!activeDropdownOpen)} className="p-1.5 sm:p-2 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-full hover:bg-[#00d4ff]/10">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  {/* Floating Dropdown for Active Context */}
                  {activeDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-[#0f1419]/95 backdrop-blur-md border border-[#00d4ff]/30 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.15)] flex flex-col py-1 overflow-hidden z-20">
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><GitBranch className="w-4 h-4" /> Branch in new chat</button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><Volume2 className="w-4 h-4" /> Read loud</button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors border-t border-[#ffffff0a] mt-1 pt-3"><AlertTriangle className="w-4 h-4" /> Report a problem</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Default Context Tools (Hidden in mini mode for space, or shown simplified) */}
            {isFullScreen && (
                <div className="relative group">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-1.5 sm:p-2 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-full hover:bg-[#00d4ff]/10 shadow-[0_0_15px_rgba(0,212,255,0)] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-56 bg-[#0f1419]/95 backdrop-blur-md border border-[#00d4ff]/30 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.15)] flex flex-col py-1 overflow-hidden z-20">
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><Paperclip className="w-4 h-4" /> Add photos & files</button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><Search className="w-4 h-4" /> Web search</button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><BrainCircuit className="w-4 h-4" /> Deep research</button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors"><BookOpen className="w-4 h-4" /> Study & Learn</button>
                    </div>
                  )}
                </div>
            )}

            {/* Expand / Collapse Button */}
            <button 
                onClick={() => setFullScreen(!isFullScreen)}
                className="p-1.5 sm:p-2 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-full hover:bg-[#00d4ff]/10"
                title={isFullScreen ? "Minimize" : "Expand to Full Screen"}
            >
                {isFullScreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Close Chatbot Button */}
            <div className="pl-1 sm:pl-2 ml-1 sm:ml-2 border-l border-[#ffffff0a]">
               <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 sm:p-2 text-[#7a8a99] hover:text-white transition-colors rounded-full hover:bg-red-500/20"
                  title="Close Crisonix"
               >
                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
               </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 flex flex-col w-full pt-16 pb-[calc(env(safe-area-inset-bottom)+20px)] overflow-hidden`}>
           <div className="flex-1 w-full flex flex-col items-center overflow-y-auto px-2 sm:px-4 custom-scrollbar">
             
             {/* Welcome Message (Only when not active) */}
             {!isActive && (
               <div className="text-center mt-auto mb-auto transform translate-y-[-20px] px-4">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-3xl bg-gradient-to-tr from-[#00d4ff]/20 to-[#007a99]/5 flex items-center justify-center border border-[#00d4ff]/30 shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00d4ff] rounded-full blur-[10px] opacity-50 absolute"></div>
                   <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-[#00d4ff] relative z-10" />
                 </div>
                 <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome {displayName}</h1>
                 <p className="text-[#7a8a99] text-sm sm:text-lg">Ready when you are.</p>
               </div>
             )}

             {/* Mock Conversation View */}
             {isActive && (
               <div className="w-full max-w-3xl mb-4 space-y-6 mt-4">
                 {/* User Message */}
                 <div className="flex justify-end">
                   <div className={`bg-[#111820] border border-[#00d4ff]/20 px-4 sm:px-5 ${pyCls} rounded-2xl rounded-tr-sm max-w-[85%] ${fontSizeCls} leading-relaxed shadow-sm`}>
                     Can you fetch the latest updates on the crisis response in the downtown area?
                   </div>
                 </div>

                 {/* AI Message */}
                 <div className="flex justify-start">
                   <div className={`max-w-[90%] ${fontSizeCls} leading-relaxed`}>
                     <p className="mb-3 sm:mb-4 text-[#e8edf2]">Based on the latest reports, here is the status for the downtown area:</p>
                     <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-[#e8edf2]/90 mb-3 sm:mb-4">
                       <li><strong className="text-[#00d4ff]">Evacuation points</strong>: Routes 4 and 7 are clear. The main stadium holds 450 evacuees.</li>
                       <li><strong className="text-[#00d4ff]">Medical supplies</strong>: A shipment arrived 2 hours ago. Needs are currently met.</li>
                       <li><strong className="text-[#00d4ff]">Power status</strong>: 60% of the grid requires manual restart. Crews are on standby.</li>
                     </ul>
                     
                     {/* Action Icons directly below response */}
                     <div className="flex items-center gap-1 mt-3 sm:mt-4 border-t border-[#ffffff0a] pt-2 sm:pt-3">
                       <button className="p-1 sm:p-1.5 text-[#7a8a99] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-md transition-colors" title="Copy"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                       <button className="p-1 sm:p-1.5 text-[#7a8a99] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-md transition-colors" title="Regenerate"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg></button>
                       <button className="p-1 sm:p-1.5 text-[#7a8a99] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 rounded-md transition-colors ml-auto" title="Share"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>

           {/* Input Bar (Sticky at bottom with safe area) */}
           <div className={`w-full max-w-3xl mx-auto px-2 sm:px-4 shrink-0 bg-[#080c10] pt-2 pb-[env(safe-area-inset-bottom)] sm:pb-3 relative`}>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#00d4ff]/0 via-[#00d4ff]/10 to-[#00d4ff]/0 blur-xl opacity-0 transition-opacity duration-500 rounded-3xl ${inputVal.length > 0 ? 'opacity-100' : 'group-focus-within:opacity-100'}`}></div>
                
                <div className={`relative flex items-end bg-[#0f1419]/90 backdrop-blur-md border rounded-3xl p-1.5 sm:p-2 transition-all duration-300 shadow-lg ${
                    inputVal.length > 0 ? 'border-[#00d4ff]/50 shadow-[0_0_20px_rgba(0,212,255,0.15)]' : 'border-[#00d4ff]/20 hover:border-[#00d4ff]/40 focus-within:border-[#00d4ff]/50 focus-within:shadow-[0_0_20px_rgba(0,212,255,0.15)]'
                }`}>
                  
                  <button className="p-2 sm:p-3 text-[#7a8a99] hover:text-[#00d4ff] transition-colors rounded-full shrink-0">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <textarea 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask Crisonix anything..."
                    className="flex-1 bg-transparent border-none text-[#e8edf2] placeholder-[#7a8a99] resize-none outline-none min-h-[40px] sm:min-h-[44px] max-h-[120px] py-2.5 sm:py-3 px-1 sm:px-2 text-[14px] sm:text-[15px]"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if(inputVal.trim()) {
                          setIsActive(true);
                          setInputVal('');
                        }
                      }
                    }}
                  />
                  
                  <div className="flex items-center gap-1 shrink-0 p-1">
                    {inputVal.length === 0 ? (
                      <button className="p-2 sm:p-2.5 text-[#7a8a99] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors rounded-full">
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if(inputVal.trim()) {
                            setIsActive(true);
                            setInputVal('');
                          }
                        }}
                        className="p-2 sm:p-2.5 bg-[#00d4ff] text-[#0a0a0f] hover:bg-[#00b8d9] transition-colors rounded-full shadow-[0_0_15px_rgba(0,212,255,0.4)] transform hover:scale-105 active:scale-95"
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-[10px] sm:text-[11px] text-[#7a8a99]/70 pb-1">
                Crisonix can make mistakes. Check important info.
              </div>
           </div>
        </div>
      </div>
      
      {/* Settings Modal Layer */}
      <SettingsModal />

    </div>
  );
}
