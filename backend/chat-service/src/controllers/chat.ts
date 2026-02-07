import axios from "axios";
import TryCatch from "../config/tryCatch.js";
import type { IAuthRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/chat.js";
import { Messages } from "../models/messages.js";

// Logic to create a chat between users
export const createChat = TryCatch(async (req: IAuthRequest, res) => {
    const userId = req.user?._id;
    const { recipientId } = req.body;

    if (!recipientId) {
        res.status(400).json({ message: "Recipient ID is required" });
        return;
    }

    // Check if a chat already exists between the two users
    const existingChat = await Chat.findOne({
        users: { $all: [userId, recipientId], $size: 2 },
    });

    if (existingChat) {
        res.status(200).json({ 
            message: "Chat already exists",
            chatId: existingChat._id
        });
        return;
    }

    // Create a new chat document
    const newChat = await Chat.create({
        users: [userId, recipientId],
    });

    res.status(201).json({ 
        message: "New chat created successfully",
        chatId: newChat._id
    });
});

// Logic to retrieve all chats for a user
export const getChats = TryCatch(async (req: IAuthRequest, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({ message: "UserId is missing!" });
        return;
    }

    // Find all chats that include the user
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    // For each chat, identify the other user and return the latest message and chat details
    const chatList = await Promise.all(chats.map(async (chat) => {

    // Find the other user in the chat
    const otherUserId = chat.users.find(id => id !== userId);

    // Count the number of unseen messages in the chat for the current user
    const unseenMessagesCount = await Messages.countDocuments({
        chat: chat._id,
        sender: { $ne: userId },
        seen: false,
    });
    
    try {
        const { data } = await axios.get(
            `${process.env.USER_SERVICE_URL}/api/v1/users/${otherUserId}`
        );
        return {
            user: data,
            chat: {
                ...chat.toObject(),
                latestMessage: chat.latestMessage || null, // Ensure latestMessage is included in the response
                unseenMessagesCount,
            },
        };
    } catch (error) {
        console.error("Error fetching latest message for chat", chat._id, error);
        return {
            user: { _id: otherUserId, name: "Unknown User"},
            chat: {
                ...chat.toObject(),
                latestMessage: chat.latestMessage || null,
                unseenMessagesCount,
            },
        };
        }
    }));
    res.status(200).json({ chats: chatList });
});