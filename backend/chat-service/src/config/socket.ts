import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { Messages } from '../models/messages.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
};

const userSocketMap: { [key: string]: string } = {}; // {userId: socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle marking a specific message as seen by the recipient
    socket.on("markMessageAsSeen", async ({ messageId, chatId, senderId }) => {
        try {
            await Messages.findByIdAndUpdate(messageId, { seen: true, seenAt: new Date() });
            const senderSocketId = getReceiverSocketId(senderId);
            if (senderSocketId) {
                // Emit to the sender that their message was seen
                io.to(senderSocketId).emit("messagesSeen", { chatId, seenBy: userId });
            }
        } catch (error) {
            console.error("Error marking message as seen", error);
        }
    });

    //disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        // remove user from map
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} disconnected`);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };