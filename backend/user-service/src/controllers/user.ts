import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../config/tryCatch.js";
import User from "../model/User.js";

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