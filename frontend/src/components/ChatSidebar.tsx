import React, { useState } from 'react';
import { User } from '../context/AppContext';
import { MessageCircle, Plus, Search, UserCircle, X, LogOut, Settings } from 'lucide-react';
import { formatName, getInitials } from '../lib/utils';

interface ChatSideProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    showAllUsers: boolean;
    setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
    users: User[] | null;
    loggedInUser: User | null;
    chats: any[] | null;
    selectedUser: string | null;
    setSelectedUser: (userId: string | null) => void;
    handleLogout: () => void;
    onlineUsers: string[];
}

const ChatSidebar = ({
    sidebarOpen,
    setSidebarOpen,
    showAllUsers,
    setShowAllUsers,
    users,
    loggedInUser,
    chats,
    selectedUser,
    setSelectedUser,
    handleLogout,
    onlineUsers
}: ChatSideProps) => {

    const [searchQuery, setsearchQuery] = useState("");

    return (
        <aside className="w-full h-full bg-black flex flex-col transition-all duration-300 overflow-hidden">

            {/* Header */}
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <MessageCircle className='w-5 h-5 text-white' />
                        </div>
                        <h2 className='text-lg font-bold text-white tracking-tight'>
                            {showAllUsers ? "New Chat" : "Messages"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${showAllUsers
                                    ? "bg-white/10 text-white hover:bg-white/20"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                                }`}
                            onClick={() => setShowAllUsers((prev) => !prev)}
                        >
                            {showAllUsers ? <X className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors' />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-all'
                        value={searchQuery}
                        onChange={e => setsearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                {showAllUsers ? (
                    <div className="space-y-1">
                        <p className="px-4 mb-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Available People</p>
                        {users
                            ?.filter((u) => u._id !== loggedInUser?._id && (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false))
                            ?.map((u) => (
                                <button
                                    key={u._id}
                                    onClick={() => {
                                        setSelectedUser(u._id);
                                        setShowAllUsers(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 group ${selectedUser === u._id
                                            ? "bg-indigo-600/10 border-indigo-500/20 text-white"
                                            : "bg-transparent border-transparent text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-11 h-11 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300">
                                            <UserCircle className='w-7 h-7 text-neutral-500 group-hover:text-indigo-400 transition-colors' />
                                        </div>
                                        {onlineUsers.includes(u._id) && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className='font-semibold text-sm tracking-tight'>
                                            {formatName(u.name)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                ) : chats && chats.length > 0 ? (
                    <div className="space-y-1">
                        <p className="px-4 mb-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Recent Chats</p>
                        {chats
                            .filter((c) => c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
                            .map((c) => (
                                <button
                                    key={c.chat._id}
                                    onClick={() => {
                                        setSelectedUser(c.user._id);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 group ${selectedUser === c.user._id
                                            ? "bg-indigo-600/10 border-indigo-500/20 text-white"
                                            : "bg-transparent border-transparent text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-11 h-11 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300">
                                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center font-bold text-indigo-400 text-xs">
                                                {getInitials(c.user.name)}
                                            </div>
                                        </div>
                                        {onlineUsers.includes(c.user._id) && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-center px-1">
                                            <p className='font-semibold text-sm tracking-tight truncate'>
                                                {formatName(c.user.name)}
                                            </p>
                                            {c.chat.unseenMessagesCount && c.chat.unseenMessagesCount > 0 ? (
                                                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-indigo-500/40">
                                                    {c.chat.unseenMessagesCount}
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className='text-[11px] text-neutral-500 truncate'>
                                            {c.chat.latestMessage?.text || "No messages yet"}
                                        </p>
                                    </div>
                                </button>
                            ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center px-8 text-center space-y-5">
                        <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-white/[0.05]">
                            <MessageCircle className="w-8 h-8 text-neutral-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-neutral-400">Your network is quiet</p>
                            <p className="text-[11px] text-neutral-600 mt-1">Start a conversation with someone new to get things moving.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Bar */}
            <div className="p-4 bg-black/40 border-t border-white/[0.05]">
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-white text-xs">
                            {getInitials(loggedInUser?.name)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate max-w-[120px]">
                                {formatName(loggedInUser?.name)}
                            </p>
                            <span className="text-[10px] font-medium text-emerald-500">Active now</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                            <Settings size={16} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}


export default ChatSidebar;