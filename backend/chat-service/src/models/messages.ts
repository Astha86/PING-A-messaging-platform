import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: string;
    text?: string;
    image?:{
        url: string;
        publicId: string;
    };
    messageType: "text" | "image";
    seen: boolean;
    seenAt?: Date;
    createdAt: Date;
    updatedAt: Date;    
    deletedBy: string[];
}

const MessageSchema: Schema<IMessage> = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    text: String,
    image: {
        url: String,
        publicId: String,
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text",
    },
    seen: {
        type: Boolean,
        default: false,
    },
    seenAt: {
        type: Date,
        default: null, // Set to null when not seen, and updated to the timestamp when seen
    },
    deletedBy: [{
        type: String,
    }],
}, { timestamps: true });

export const Messages = mongoose.model<IMessage>("Messages", MessageSchema);