import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createChat, getChats, sendMessage } from "../controllers/chat.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/chat/new", isAuth, createChat);
router.get("/chat/all", isAuth, getChats);
router.post("/chat/send", isAuth, upload.single('image'), sendMessage); 

export default router;