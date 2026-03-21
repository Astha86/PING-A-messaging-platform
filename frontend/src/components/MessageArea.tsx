import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSocketContext } from '../context/SocketContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppContext, { User, Chats, chat_service } from '../context/AppContext';
import MessageHeader from './MessageHeader';
import MessageInput from './MessageInput';
import ClearChatModal from './ClearChatModal';

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
  setSelectedUser: (userId: string | null) => void;
}

const MessageArea = ({ selectedUserId, chats, loggedInUser, onlineUsers, setSelectedUser }: MessageAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [deleteForBoth, setDeleteForBoth] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
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

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setShowEmojiPicker(false);
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleClearChat = async () => {
    if (!chatId) return;
    try {
      const token = Cookies.get("token");
      await axios.delete(`${chat_service}/api/v1/chat/${chatId}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { deleteForBoth }
      });
      setMessages([]);
      fetchChats();
    } catch (error) {
      console.error("Error clearing chat messages:", error);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  const userFromList = users?.find(u => u._id === selectedUserId);
  const selectedUser = chat?.user || userFromList || { _id: selectedUserId, email: "", name: "New Contact" };
  const isOnline = onlineUsers.includes(selectedUserId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] relative">
      {/* Upper Bar */}
      <MessageHeader 
        selectedUser={selectedUser}
        isOnline={isOnline}
        setSelectedUser={setSelectedUser}
        onOpenClearModal={() => setShowClearModal(true)}
      />

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
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        pickerRef={pickerRef}
        handleEmojiClick={handleEmojiClick}
      />

      {showClearModal && (
        <ClearChatModal
          selectedUser={selectedUser}
          deleteForBoth={deleteForBoth}
          setDeleteForBoth={setDeleteForBoth}
          onCancel={() => setShowClearModal(false)}
          onConfirm={() => {
            setShowClearModal(false);
            handleClearChat();
            setDeleteForBoth(false);
          }}
        />
      )}
    </div>
  );
};

export default MessageArea;
