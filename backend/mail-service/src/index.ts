import express from "express";
import dotenv from "dotenv";
import { startSendOTPConsumer } from "./consumer.js";

dotenv.config();

startSendOTPConsumer();

const app = express();

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Mail Service is running on port: ${port}`);
});