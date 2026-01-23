import mongoose from "mongoose";
import { config } from "./env.config.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("[Database] Connected to MongoDB successfully");
  } catch (error) {
    console.error("[Database] Connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("[Database] MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("[Database] MongoDB error:", error);
});
