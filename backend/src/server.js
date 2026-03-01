console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth-routes.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/user-routes.js";
import assessmentRoutes from "./routes/assessment-routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import progressRoutes from "./routes/progress-routes.js";
import { verifyEmailConfig } from "./services/emailService.js";
import protect from "./middleware/authMiddleware.js";

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

app.use(express.json());

// Connect DB
connectDB();

// SendEmail
verifyEmailConfig();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route working!",
    user: req.user,
  });
});
app.use("/api/settings", settingsRoutes);
app.use("/api/progress", progressRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Orato Backend Running");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});