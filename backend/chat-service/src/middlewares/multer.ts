import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ping-chat-attachments", // Folder in Cloudinary to store attachments
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "pdf", "docx"], // Allowed file formats
        transformation: [
            { width: 500, height: 500, crop: "limit" }, // Optional transformation
            { quality: "auto", fetch_format: "auto" }, // Optional optimization for delivery
        ], 
    } as any,
});

// Create a Multer instance with the Cloudinary storage configuration
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type. Allowed types: jpg, jpeg, png, gif, webp, pdf, docx"));
        }
    },
});

export default upload;