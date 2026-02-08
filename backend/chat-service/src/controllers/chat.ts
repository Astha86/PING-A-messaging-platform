import axios from "axios";
import TryCatch from "../config/tryCatch.js";
import type { IAuthRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/chat.js";
import { Messages } from "../models/messages.js";
import { text } from "express";

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

// Logic to send a message in a chat
export const sendMessage = TryCatch(async (req: IAuthRequest, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;

    // only req.file
    const image = req.file ? {
        url: req.file.path,
        publicId: req.file.filename,
    } : null;

    if(!senderId) {
        res.status(401).json({
            message: "Unauthorized: Sender ID is missing!"
        });
        return;
    }

    if (!chatId) {
        res.status(400).json({
            message: "Chat ID is required"
        });
        return;
    }

    if(!text && !image) {
        res.status(400).json({
            message: "Message text or image is required"
        });
        return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
        res.status(404).json({
            message: "Chat not found"
        });
        return;
    }
    
    const isUserInChat = chat.users.includes(senderId);

    if (!isUserInChat) {
        res.status(403).json({
            message: "Forbidden: You are not a participant in this chat"
        });
        return;
    }

    const otherUserId = chat.users.find(id => id !== senderId);

    if(!otherUserId) {
        res.status(400).json({
            message: "Invalid chat participants"
        });
        return;
    }

    // pending: socket event to notify recipient about new message

    let messageData: any = {
        chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined,
    };

    if(image) {
        messageData.image = {
            url: image.url, //path
            publicId: image.publicId, // filename
        };
        messageData.messageType = "image";
        messageData.text = text || ""; // Set text to empty string if not provided 
    } else {
        messageData.text = text;
        messageData.messageType = "text";
    }
    
    // Create a new message document
    const message = new Messages(messageData);
    const savedMessage = await message.save();

    const latestMessage = image ? "📷 Image" : text;
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            sender: senderId,
            text: latestMessage,
        },
        updatedAt: new Date(),
    }, { new: true });

    // pending: emit socket event to recipient about new message

    res.status(201).json({
        message: "Message sent successfully",
        data: savedMessage,
    });
});
