import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  try {
    if (!config.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    const connection = await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Reconnecting...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB Error: ${err}`);
});
