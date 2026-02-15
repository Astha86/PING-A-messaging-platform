'use client';
import ChatSidebar from '@/src/components/ChatSidebar';
import Loading from '@/src/components/Loading';
import AppContext, {User} from '@/src/context/AppContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react'

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string; 
  }
  messageType: 'text'| 'image';
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const ChatApp = () => {
  const {loading, isAuth, logout, chats, user: loggedInUser, users, fetchChats, setChats} = useContext(AppContext)!;

  const [selectedUser, setSelectedUser] = useState<string | null> (null);
  const [message, setMessage] = useState(""); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setshowAllUser] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [typingTimeOut, settypingTimeOut] = useState<NodeJS.Timeout | null>(null);

  const router = useRouter();
  
  // Redirect to login page if not authenticated
  useEffect(() => {
    if(!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]); 

  // Show loading spinner while checking authentication status
  if(loading) {
    return <Loading />;
  }

  const handleLogout = () => logout();

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-x-hidden'>

      <ChatSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setshowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
      />

    </div>
  )
}

export default ChatApp;