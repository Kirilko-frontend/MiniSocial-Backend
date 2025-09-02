import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

const connectDB = async () => {
  const uri = `mongodb+srv://${getEnvVar("MONGO_USER")}:${getEnvVar(
    "MONGO_PASSWORD"
  )}@${getEnvVar("MONGO_HOST")}/${getEnvVar("MONGO_DB_NAME")}${getEnvVar(
    "MONGO_OPTIONS"
  )}`;
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
