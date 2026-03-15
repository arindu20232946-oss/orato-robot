import dotenv from "dotenv";
dotenv.config();

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME); // profile picture 
console.log("API key:", process.env.CLOUDINARY_API_KEY);

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import { configurePassport } from "./config/passport.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth-routes.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/user-routes.js";
import assessmentRoutes from "./routes/assessment-routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import progressRoutes from "./routes/progress-routes.js";
import cardRoutes from "./routes/card-routes.js";
import chatRoutes from "./routes/chat-routes.js";
import { verifyEmailConfig } from "./services/emailService.js";
import protect from "./middleware/authMiddleware.js";
import dashboardRoutes from "./routes/dashboard-routes.js";
import quizRoutes from "./routes/quiz-routes.js"
import listeningRoutes from "./routes/listening-routes.js"
import readingRoutes from "./routes/reading-routes.js"
import grammarRoutes from "./routes/grammar-routes.js"
import speakingCoachRoutes from "./routes/speakingCoachRoutes.js"

console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);

// Initialize app
const app = express();

// MIDDLEWARE 

// CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NEW: SESSION MIDDLEWARE (Required by Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || 'orato-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// NEW: INITIALIZE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// NEW: CONFIGURE PASSPORT STRATEGIES
configurePassport();

// Connect DB
connectDB();

// Verify Email Config
verifyEmailConfig();

// Initialize Cron Jobs
import { initCronJobs } from "./services/cronJobs.js";
initCronJobs();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/speaking-coach", speakingCoachRoutes);

// Protected route test
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route working!",
    user: req.user,
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Orato Backend Running with Google OAuth");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`✅ Google OAuth configured (Existing users only)`);
});