import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../config/tryCatch.js";
import type { AuthRequest } from "../middleware/isAuth.js";
import User from "../model/User.js";

// send OTP to user's email for login
export const loginUser = TryCatch(async (req, res) => {
    // Placeholder logic for user login
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;
    const ratelimit = await redisClient.get(rateLimitKey);

    if (ratelimit) {
        return res.status(429).json({
            message: "Too many requests. Please wait before requesting another OTP.",
        });
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with a 5-minute expiry
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 60 * 5, // 5 minutes
    });
    
    await redisClient.set(rateLimitKey, "true", {
        EX: 60, // 1 minute
    });
    
    const message  = {
        to: email,
        subject: "Verify your PING account",
        body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    }

    await publishToQueue("send-otp", message);

    res.status(200).json({
        message: "OTP has been sent to your email",
    });
});

// verify the OTP entered by the user and return a JWT token if OTP is valid
export const verifyOTP = TryCatch(async (req, res) => {
    const { email, otp: enteredOTP } = req.body;

    if(!email || !enteredOTP) {
        return res.status(400).json({
            message: "Email and OTP are required",
        });
        return;
    }

    const otpKey = `otp:${email}`;
    const storedOTP = await redisClient.get(otpKey);

    if (!storedOTP || storedOTP !== enteredOTP) {
        return res.status(400).json({
            message: "Invalid or expired OTP",
        });
        return;
    }

    // OTP is valid, proceed with login (placeholder logic)
    await redisClient.del(otpKey); // Invalidate the OTP after successful verification

    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, email.indexOf('@'));
        user = await User.create({ email, name });
    }

    const token = generateToken(user);
    

    res.status(200).json({
        message: "Login successful",
        user,
        token,
    });
});

// return the profile of currently logged in user
export const getMyProfile = TryCatch(async (req: AuthRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.status(200).json({
        user,
    });
});

// update the name of currently logged in user
export const updateUserName = TryCatch(async (req: AuthRequest, res) => {
    const user = await User.findById(req.user?._id);
    const { name } = req.body;

    if (!user) {
        return res.status(404).json({
            message: "Please login to update profile",
        });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            message: "Name is required and must be a non-empty string",
        });
    }

    user.name = name.trim();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
        message: "Name updated successfully",
        user,
        token,
    });
});

// return the user with the given id
export const getUserById = TryCatch(async (req: AuthRequest, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.status(200).json({
        user,
    });
});

// return a list of all users
export const getAllUsers = TryCatch(async (req: AuthRequest, res) => {
    const users = await User.find();
    res.status(200).json({
        users,
    });
});