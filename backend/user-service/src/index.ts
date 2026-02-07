import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", userRoutes);

app.use(cors());

const port = process.env.PORT || 3000;

const start = async () => {
    await connectDb();
    await connectRabbitMQ();
    await connectRedis();
    app.listen(port, () => {
        console.log(`User Service is running on port: ${port}`);
    });
};

start();