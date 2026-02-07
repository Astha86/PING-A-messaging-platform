import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createChat, getChats } from "../controllers/chat.js";

const router = express.Router();

router.post("/chat/new", isAuth, createChat);
router.get("/chat/all", isAuth, getChats);

export default router;