'use client'

import { User } from "lucide-react";
import Cookies from "js-cookie";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";

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

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        // Provide the user, loading, and authentication status to the entire app
        <AppContext.Provider value={{ user, loading, isAuth, setUser, setIsAuth }}>
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