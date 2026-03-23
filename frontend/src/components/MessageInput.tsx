import React from 'react';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (msg: string | ((prev: string) => string)) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  pickerRef: React.RefObject<HTMLDivElement | null>;
  handleEmojiClick: (emojiObject: any) => void;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  pickerRef,
  handleEmojiClick,
}: MessageInputProps) => {
  return (
    <div className="p-3 sm:p-5 bg-black/40 backdrop-blur-md border-t border-white/[0.05] shrink-0">
      <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-4">
        <div ref={pickerRef} className="flex-1 relative bg-white/[0.03] border border-white/[0.08] rounded-2xl focus-within:border-indigo-500/50 transition-all">
          <button 
            type="button"
            className="absolute left-3 sm:left-4 bottom-3 p-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-pointer z-10"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-4 left-0 z-50 shadow-2xl w-full sm:w-[350px]">
              <div className="hidden sm:block">
                <EmojiPicker 
                  theme={Theme.DARK}
                  onEmojiClick={handleEmojiClick}
                  width={350}
                  height={400}
                />
              </div>
              <div className="sm:hidden w-screen fixed inset-x-0 bottom-0 z-50 pb-safe">
                <div className="bg-[#151515] rounded-t-3xl border-t border-white/10 p-2 overflow-hidden shadow-2xl">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4" onClick={() => setShowEmojiPicker(false)} />
                  <EmojiPicker 
                    theme={Theme.DARK}
                    onEmojiClick={handleEmojiClick}
                    width="100%"
                    height={350}
                    lazyLoadEmojis={true}
                  />
                </div>
              </div>
            </div>
          )}

          <textarea
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a secure message..."
            className="w-full pl-11 sm:pl-14 pr-11 sm:pr-14 py-4 bg-transparent text-white text-sm placeholder:text-neutral-600 focus:outline-none resize-none max-h-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute right-3 sm:right-4 bottom-3 p-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-pointer">
            <ImageIcon size={20} />
          </div>
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-neutral-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Send size={20} className={newMessage.trim() ? "translate-x-0.5 sm:translate-x-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
