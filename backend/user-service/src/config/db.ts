import mongoose from "mongoose";

const connectDb = async() => {
    console.log("Connecting to MongoDB...");
    const url = process.env.MONGO_URI;

    if(!url){
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try{
        await mongoose.connect(url, {
            dbName: "user-service",
        });
        console.log("Connected to MongoDB successfully");
        
    } catch(error){
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

export { connectDb };