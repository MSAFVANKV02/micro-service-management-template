import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("Auth Service: MongoDB connected");
  } catch (error) {
    console.error("Auth Service: MongoDB connection failed");
    console.error(error);

    process.exit(1);
  }
};