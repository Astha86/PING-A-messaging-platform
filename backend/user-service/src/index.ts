import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const start = async () => {
    await connectDb();
    await connectRedis();
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
};

start();