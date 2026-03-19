import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import { app, server } from "./config/socket.js";
import express from "express";

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1", chatRoutes);

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
    console.log(`Chat service is running on port ${PORT}`);
});