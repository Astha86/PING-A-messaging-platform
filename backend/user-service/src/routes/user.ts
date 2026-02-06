import express from "express"; 
import { getUserProfile, loginUser, updateUserName, verifyOTP } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/profile", isAuth, getUserProfile);
router.put("/profile", isAuth, updateUserName);

export default router;