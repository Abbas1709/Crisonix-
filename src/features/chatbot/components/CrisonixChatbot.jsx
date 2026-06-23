import React from 'react';
import { useChatStore } from '../store/useChatStore';
import useAuthStore from '../../../store/authStore';
import { BrainCircuit } from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function CrisonixChatbot() {
  const { isOpen, setIsOpen } = useChatStore();
  const { isAuthenticated, profileCompleted } = useAuthStore();

  // Guard: Only show the chatbot globally if the user is completely logged in and onboarded.
  if (!isAuthenticated || !profileCompleted) return null;

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#0a0a0f] border-2 border-[#00d4ff]/50 rounded-full flex items-center justify-center text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-105 hover:bg-[#080c10] transition-all duration-300 group overflow-hidden"
          aria-label="Open Crisonix AI"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <BrainCircuit className="w-8 h-8 relative z-10 group-hover:text-white transition-colors" />
        </button>
      )}

      {/* Overlay/Chat Container handled internally by ChatInterface for smooth transition */}
      {isOpen && <ChatInterface />}
    </>
  );
}
