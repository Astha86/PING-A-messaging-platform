import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
}

const redisClient = createClient({
    url: REDIS_URL,
});

redisClient.on("connect", () => {
    console.log("Redis client connected successfully");
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

const connectRedis = async () => {
    console.log("Connecting to Redis...");
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Failed to connect to Redis", error);
        process.exit(1);
    }
};

export { redisClient, connectRedis };