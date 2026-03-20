import React from 'react';
import { MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import { formatName, getInitials } from '../lib/utils';
import { User } from '../context/AppContext';

interface MessageHeaderProps {
  selectedUser: User | { _id: string; name: string; email: string };
  isOnline: boolean;
  setSelectedUser: (userId: string | null) => void;
}

const MessageHeader = ({ selectedUser, isOnline, setSelectedUser }: MessageHeaderProps) => {
  return (
    <div className="h-20 border-b border-white/[0.05] flex items-center justify-between px-6 bg-black/40 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors cursor-pointer sm:hidden"
          onClick={() => setSelectedUser(null)}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
            {getInitials(selectedUser.name)}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-black rounded-full" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">{formatName(selectedUser.name)}</h3>
          <p className={`text-[11px] font-medium ${isOnline ? "text-emerald-500" : "text-neutral-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2.5 text-neutral-500 hover:text-white transition-colors"><Phone size={18} /></button>
        <button className="p-2.5 text-neutral-500 hover:text-white transition-colors"><Video size={18} /></button>
        <button className="p-2.5 text-neutral-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
      </div>
    </div>
  );
};

export default MessageHeader;
