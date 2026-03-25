import React from 'react';
import { Send, Image as ImageIcon, Smile, X } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (msg: string | ((prev: string) => string)) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  pickerRef: React.RefObject<HTMLDivElement | null>;
  handleEmojiClick: (emojiObject: any) => void;
  setSelectedImage: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  isSending: boolean;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  pickerRef,
  handleEmojiClick,
  setSelectedImage,
  imagePreview,
  setImagePreview,
  isSending,
}: MessageInputProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-3 sm:p-5 bg-black/40 backdrop-blur-md border-t border-white/[0.05] shrink-0">
      <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-4">
        <div ref={pickerRef} className="flex-1 relative bg-white/[0.03] border border-white/[0.08] rounded-2xl focus-within:border-indigo-500/50 transition-all">
          
          {/* Image Preview Area */}
          {imagePreview && (
            <div className="p-3 border-b border-white/5 bg-white/5 relative group/img">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

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
            placeholder={imagePreview ? "Add a caption..." : "Send a secure message..."}
            className="w-full pl-11 sm:pl-14 pr-11 sm:pr-14 py-4 bg-transparent text-white text-sm placeholder:text-neutral-600 focus:outline-none resize-none max-h-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-3 sm:right-4 bottom-3 p-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <ImageIcon size={20} />
          </button>
        </div>
        <button
          type="submit"
          disabled={isSending || (!newMessage.trim() && !imagePreview)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-neutral-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={20} className={newMessage.trim() || imagePreview ? "translate-x-0.5 sm:translate-x-0.5" : ""} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
