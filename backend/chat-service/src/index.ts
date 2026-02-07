import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", chatRoutes);

const PORT = process.env.PORT || 5002;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Chat service is running on port ${PORT}`);
});