import React, { useEffect, useRef, useState, useContext } from 'react';
import { Send, Image as ImageIcon, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import { useSocketContext } from '../context/SocketContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppContext, { User, Chats, chat_service } from '../context/AppContext';
import { formatName, getInitials } from '../lib/utils';

interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: 'text' | 'image';
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

interface MessageAreaProps {
  selectedUserId: string;
  chats: Chats[] | null;
  loggedInUser: User | null;
  onlineUsers: string[];
}

const MessageArea = ({ selectedUserId, chats, loggedInUser, onlineUsers }: MessageAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocketContext();
  const { fetchChats, users } = useContext(AppContext)!;
  
  // Find the chatId for the selectedUser
  const chat = chats?.find(c => c.user._id === selectedUserId);
  const chatId = chat?.chat._id;

  // Real-time message reception
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (msg: Message) => {
        // Only add if it belongs to current chat
        if (msg.chatId === chatId) {
          setMessages(prev => [...prev, msg]);
          
          // If we are currently looking at this chat, we instantly saw the message.
          // Notify the backend so the sender gets the "Read" status updated in real-time.
          if (msg.sender !== loggedInUser?._id) {
            socket.emit("markMessageAsSeen", { 
              messageId: msg._id, 
              chatId: msg.chatId, 
              senderId: msg.sender 
            });
          }
        }
        // Refresh sidebar to update last message
        fetchChats();
      });

      socket.on("messagesSeen", ({ chatId: incomingChatId, seenBy }: { chatId: string, seenBy: string }) => {
        if (incomingChatId === chatId) {
          setMessages(prev => prev.map(m => 
            m.sender !== seenBy ? { ...m, seen: true, seenAt: new Date().toISOString() } : m
          ));
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("messagesSeen");
      };
    }
  }, [socket, chatId, fetchChats]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (chatId) {
      fetchMessages();
    } else {
        setMessages([]);
    }
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.get(`${chat_service}/api/v1/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data.messages);
      setLoading(false);
      
      // Refresh the chat list in the sidebar to remove the unread badge
      // since the backend just marked these messages as seen.
      fetchChats();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = Cookies.get("token");
      
      // If no chat exists yet, we should create one first or the backend handles it via receiverId
      // Our backend sendMessage needs chatId. Let's handle chat creation if chatId is missing.
      let currentChatId = chatId;
      if (!currentChatId) {
          const { data: newChatData } = await axios.post(`${chat_service}/api/v1/chat/new`, 
              { recipientId: selectedUserId }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
          currentChatId = newChatData.chatId;
          await fetchChats(); // Update chats list in AppContext
      }

      const { data } = await axios.post(`${chat_service}/api/v1/chat/send`, 
        { chatId: currentChatId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, data.data]);
      setNewMessage("");
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const userFromList = users?.find(u => u._id === selectedUserId);
  const selectedUser = chat?.user || userFromList || { _id: selectedUserId, email: "", name: "New Contact" };
  const isOnline = onlineUsers.includes(selectedUserId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]">
      {/* Upper Bar */}
      <div className="h-20 border-b border-white/[0.05] flex items-center justify-between px-6 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
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

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, index) => {
          const isSender = msg.sender === loggedInUser?._id;
          return (
            <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] group`}>
                <div className={`
                    p-4 rounded-2xl shadow-sm
                    ${isSender 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : "bg-white/[0.03] border border-white/[0.06] text-neutral-200 rounded-bl-none"
                    }
                `}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className={`flex items-center mt-2 gap-2 ${isSender ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] text-neutral-600 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isSender && (
                    <span className="text-[10px] text-indigo-500 font-bold">
                        {msg.seen ? "Read" : "Sent"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black/40 backdrop-blur-md border-t border-white/[0.05]">
        <form onSubmit={handleSendMessage} className="flex items-end gap-4">
          <div className="flex-1 relative bg-white/[0.03] border border-white/[0.08] rounded-2xl focus-within:border-indigo-500/50 transition-all">
            <div className="absolute left-4 bottom-3 p-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-pointer">
              <Smile size={20} />
            </div>
            <textarea
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a secure message..."
              className="w-full pl-14 pr-14 py-4 bg-transparent text-white text-sm placeholder:text-neutral-600 focus:outline-none resize-none max-h-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="absolute right-4 bottom-3 p-1.5 text-neutral-500 hover:text-indigo-400 transition-colors cursor-pointer">
              <ImageIcon size={20} />
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-neutral-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Send size={22} className={newMessage.trim() ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
