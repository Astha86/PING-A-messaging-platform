"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import { chat_service } from "./AppContext";
import AppContext from "./AppContext";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

interface ProviderProps {
    children: React.ReactNode;
}
export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }: ProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user, isAuth, fetchChats } = useContext(AppContext)!;

    useEffect(() => {
        if (isAuth && user) {
            const newSocket = io(chat_service, {
                query: {
                    userId: user._id,
                },
            });

            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            // when a new message is received
            newSocket.on("newMessage", (msg: any) => {
                fetchChats();
            });

            // when a message is seen
            newSocket.on("messagesSeen", ({ chatId }: { chatId: string }) => {
                fetchChats();
            });

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuth, user, fetchChats]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
