import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSocketContext } from '../context/SocketContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppContext, { User, Chats, chat_service } from '../context/AppContext';
import MessageHeader from './MessageHeader';
import MessageInput from './MessageInput';
import ClearChatModal from './ClearChatModal';
import LoadingComponent from './Loading';
import ImageModal from './ImageModal';

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
  isOptimistic?: boolean;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
        // Add if it belongs to current chat or is from the selected user (for new chats)
        if (msg.chatId === chatId || msg.sender === selectedUserId) {
          setMessages(prev => {
            // Avoid duplicate messages if chatId synchronization is fast
            if (prev.find(m => m._id === msg._id)) return prev;
            return [...prev, msg];
          });

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
  }, [socket, chatId, fetchChats, loggedInUser?._id]);

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
    if (isSending || (!newMessage.trim() && !selectedImage)) return;

    setIsSending(true);

    // Capture current input values
    const textToSend = newMessage;
    const imageToSend = selectedImage;
    const previewToSend = imagePreview;

    // Clear input immediately for better UX
    setNewMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    setShowEmojiPicker(false);

    // Create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      _id: tempId,
      chatId: chatId || "pending",
      sender: loggedInUser?._id || "",
      text: textToSend,
      image: previewToSend ? { url: previewToSend, publicId: "temp" } : undefined,
      messageType: imageToSend ? 'image' : 'text',
      seen: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMsg]);

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

      const formData = new FormData();
      if (currentChatId) formData.append("chatId", currentChatId);
      if (textToSend.trim()) formData.append("text", textToSend);
      if (imageToSend) formData.append("image", imageToSend);

      const { data } = await axios.post(`${chat_service}/api/v1/chat/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Replace optimistic message with actual data from server
      setMessages(prev => prev.map(m => m._id === tempId ? data.data : m));
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m._id !== tempId));
      // Restore input values
      setNewMessage(textToSend);
      if (imageToSend) {
        setSelectedImage(imageToSend);
        setImagePreview(previewToSend);
      }
    } finally {
      setIsSending(false);
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
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative"
      >
        {loading && (
          <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px]">
            <LoadingComponent fullScreen={false} />
          </div>
        )}
        {messages.map((msg, index) => {
          const isSender = msg.sender === loggedInUser?._id;
          return (
            <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                <div className={`
                    p-4 rounded-2xl shadow-sm overflow-hidden relative
                    ${isSender
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white/[0.03] border border-white/[0.06] text-neutral-200 rounded-bl-none"
                  }
                `}>
                  {msg.isOptimistic && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all duration-300">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden bg-black/20">
                      <img
                        src={msg.image.url}
                        alt="attachment"
                        className={`max-w-full h-auto object-contain hover:scale-105 transition-transform duration-500 cursor-pointer ${msg.isOptimistic ? 'blur-[2px] grayscale-[0.2]' : ''}`}
                        onClick={() => !msg.isOptimistic && setPreviewImage(msg.image?.url || null)}
                        onLoad={() => {
                          if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                          }
                        }}
                      />
                    </div>
                  )}
                  {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                </div>
                <div className={`flex items-center mt-2 gap-2 ${isSender ? "justify-end" : "justify-start"}`}>
                  <span className="text-[10px] text-neutral-600 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isSender && (
                    <span className="text-[10px] text-indigo-500 font-bold italic">
                      {msg.isOptimistic ? "Sending..." : (msg.seen ? "Read" : "Sent")}
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
        setSelectedImage={setSelectedImage}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        isSending={isSending}
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

      {previewImage && (
        <ImageModal 
          imageUrl={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}
    </div>
  );
};

export default MessageArea;
