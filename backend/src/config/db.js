import mongoose from "mongoose";

import dns from "dns";

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      // FIX: Override DNS to prevent ECONNREFUSED on MongoDB Atlas SRV records
      dns.setServers(['8.8.8.8']);
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // fail fast if db is unreachable
      });
      console.log("MongoDB Connected");
    } else {
      console.warn("⚠️  MONGO_URI not set. Using mock data for now.");
    }
  } catch (error) {
    console.error("⚠️  DB connection failed:", error.message);
    // Do not crash server, but log it clearly
  }
};

export default connectDB;
