import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("Barber Service: MongoDB connected");
  } catch (error) {
    console.error("Barber Service: MongoDB connection failed");
    console.error(error);

    process.exit(1);
  }
};