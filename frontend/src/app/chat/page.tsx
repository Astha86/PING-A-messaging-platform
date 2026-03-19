'use client';

import ChatSidebar from '@/src/components/ChatSidebar';
import Loading from '@/src/components/Loading';
import EmptyChat from '@/src/components/EmptyChat';
import Connecting from '@/src/components/Connecting';
import AppContext, { User } from '@/src/context/AppContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useSocketContext } from '@/src/context/SocketContext';

export interface Message {
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

const ChatApp = () => {
  const { loading, isAuth, logout, chats, user: loggedInUser, users, fetchChats, setChats } = useContext(AppContext)!;
  const { onlineUsers } = useSocketContext();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAllUser, setshowAllUser] = useState(false);

  const router = useRouter();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  // Show loading spinner while checking authentication status
  if (loading) {
    return <Loading />;
  }

  const handleLogout = () => logout();

  return (
    <div className='min-h-screen flex bg-[#050505] text-white relative overflow-hidden'>
      {/* Background gradients for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[30%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

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
        onlineUsers={onlineUsers}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-30">
        {!selectedUser ? (
          <EmptyChat />
        ) : (
          <Connecting />
        )}
      </main>

    </div>
  );
};

export default ChatApp;