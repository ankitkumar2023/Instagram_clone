import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("Error while connecting MongoDB:", error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

export default connectDB;
