import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// object of online user
const userSocketMap: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: ${userId} with socket id ${socket.id}`);
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));

    //disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        // remove user from map
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ${userId} removed from online users`);
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
    });

    socket.on("connect_error", (err) => {
        console.log("Socket connection error", err);
    });
});

export { app, server, io };