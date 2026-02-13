'use client'

import { User } from "lucide-react";
import Cookies from "js-cookie";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const user_service = "http://localhost:8081";
export const chat_service = "http://localhost:5002";

export interface User {
    _id: string;
    email: string;
    name: string;
}

export interface Chat {
    _id: string;
    users: string;
    latestMessage: {
        text: string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}

interface AppContextType {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchChats: () => Promise<void>;
    chats: Chats[] | null;
    users: User[] | null;
    setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    async function fetchUser() {
        try {
            const token = Cookies.get("token");
            if (!token) {
                setUser(null);
                setIsAuth(false);
                setLoading(false);
                return;
            }

            // Fetch user data using the token
            const { data } = await axios.get(`${user_service}/api/v1/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setUser(data.user);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setLoading(false);
        }
    }

    async function logout() {
        try {
            Cookies.remove("token");
            setUser(null);
            setIsAuth(false);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    const [chats, setChats] = useState<Chats[] | null>([]);
    async function fetchChats() {
        try {
            const token = Cookies.get("token");
            if (!token) {
                setChats([]);
                return;
            }

            const { data } = await axios.get(`${chat_service}/api/v1/chat/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setChats(data.chats);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    }

    const [users, setUsers] = useState<User[]>([]);
    async function fetchUsers() {
        try {
            const token = Cookies.get("token");
            if (!token) {
                setUsers([]);
                return;
            }

            const { data } = await axios.get(`${user_service}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setUser(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchChats();
        fetchUsers();
    }, []);

    return (
        // Provide the user, loading, and authentication status to the entire app
        <AppContext.Provider value={{ user, loading, isAuth, setUser, setIsAuth, logout, fetchUsers, fetchChats, chats, users, setChats, setUsers }}>
            {children}
            <Toaster />
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export default AppContext;