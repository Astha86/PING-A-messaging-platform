import React from 'react';
import { formatName } from '../lib/utils';
import { User } from '../context/AppContext';

interface ClearChatModalProps {
  selectedUser: User | { _id: string; name: string; email: string };
  deleteForBoth: boolean;
  setDeleteForBoth: (val: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const ClearChatModal = ({
  selectedUser,
  deleteForBoth,
  setDeleteForBoth,
  onCancel,
  onConfirm
}: ClearChatModalProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#151515] border border-white/[0.1] rounded-2xl p-6 w-[400px] max-w-[90vw] shadow-2xl relative">
        <h3 className="text-lg font-bold text-white mb-2">Clear chat</h3>
        <p className="text-sm text-neutral-400 mb-6">
          Are you sure you want to clear your chat history with <span className="text-white font-medium">{formatName(selectedUser.name)}</span>?
        </p>
        
        <label className="flex items-center gap-3 mb-6 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              className="peer appearance-none w-5 h-5 border border-white/[0.2] rounded group-hover:border-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
              checked={deleteForBoth}
              onChange={(e) => setDeleteForBoth(e.target.checked)}
            />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm text-neutral-300 select-none group-hover:text-white transition-colors">
            Also delete for {formatName(selectedUser.name)}
          </span>
        </label>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 text-sm font-medium rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearChatModal;
