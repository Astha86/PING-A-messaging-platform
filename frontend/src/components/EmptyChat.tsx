import React from 'react';
import { MessageCircle, Zap, Shield } from 'lucide-react';

const EmptyChat = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 -z-10 animate-pulse" />
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 mx-auto transform hover:scale-105 transition-all duration-500 group">
            <MessageCircle className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Your Space to Connect
          </h2>
          <p className="text-neutral-400 text-base font-medium leading-relaxed">
            Select a friend from the sidebar or start a new conversation to begin.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm text-left group hover:bg-white/[0.04] transition-all">
            <Zap className="w-5 h-5 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white mb-1">Instant Delivery</p>
            <p className="text-[11px] text-neutral-500 font-medium">Blink and it's there.</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm text-left group hover:bg-white/[0.04] transition-all">
            <Shield className="w-5 h-5 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white mb-1">Secure by Design</p>
            <p className="text-[11px] text-neutral-500 font-medium">Private and protected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
