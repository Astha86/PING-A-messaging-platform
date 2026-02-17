'use client';

import ChatSidebar from '@/src/components/ChatSidebar';
import Loading from '@/src/components/Loading';
import AppContext, { User } from '@/src/context/AppContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { MessageCircle, Shield, Zap, X, Plus, Search, UserCircle, Settings, LogOut } from 'lucide-react';

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
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-30">
        {!selectedUser ? (
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
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Connecting...</h3>
                <p className="text-neutral-500 font-medium text-sm">Securing your conversation</p>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default ChatApp;