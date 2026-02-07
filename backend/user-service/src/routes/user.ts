import express from "express"; 
import { getAllUsers, getUserById, getMyProfile, loginUser, updateUserName, verifyOTP } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.get("/users/me", isAuth, getMyProfile);
router.put("/users/me", isAuth, updateUserName);
router.get("/users", isAuth, getAllUsers);
router.get("/users/:id", getUserById);

export default router;