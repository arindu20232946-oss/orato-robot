import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpEmail } from "../services/emailService.js";

/**
 * SIGNUP - Register new user
 * Returns token for auto-login
 */
export const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      //  Accept additional fields
      age,
      nativeLanguage,
      targetLanguage,
      learningGoal,
      dailyGoalMinutes,
      skillLevel,
      assessmentScore,
      assessmentCompleted,
    } = req.body;

    console.log("Signup request:", { fullName, email, skillLevel });

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required!"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with ALL data
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      // Save all collected data
      age,
      nativeLanguage,
      targetLanguage,
      learningGoal,
      dailyGoalMinutes,
      skillLevel,
      assessmentScore,
      assessmentCompleted,
    });

    await newUser.save();

    console.log("✅ User created:", newUser.email, "| Level:", skillLevel);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email
      },
      process.env.JWT_SECRET || "your-default-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Return token and user info
    res.status(200).json({
      success: true,
      message: "Account created successfully!",
      token: token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        skillLevel: newUser.skillLevel,
        dailyGoalMinutes: newUser.dailyGoalMinutes,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};

/**
 * SIGNIN - Login existing user
 */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Signin request:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!"
      });
    }

    // Find user by email
    // Find user by email (include password explicitly)
    const user = await User
      .findOne({ email: email.toLowerCase() })
      .select("+password"); if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password!"
        });
      }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!"
      });
    }

    console.log("User logged in successfully:", user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || "your-default-secret-key-change-this",
      { expiresIn: "7d" }
    );

    const { password: removedPassword, ...safeUser } = user.toObject();

    // Return token and user info
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};

/**
 * FORGOT PASSWORD WITH OTP - Send OTP to email
 */
export const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("\n========================================");
    console.log("=== SEND OTP REQUEST ===");
    console.log("========================================");
    console.log("📧 Email:", email);

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.log("❌ User not found with email:", email);
      return res.status(404).json({
        success: false,
        message: "No account found with this email address!",
      });
    }

    console.log("✅ User found:", user.email);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔑 Generated OTP:", otp);

    // Hash OTP before saving to database
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    console.log("🔐 Hashed OTP:", otpHash);

    // Save hashed OTP and expiry to user (10 minutes)
    user.resetPasswordToken = otpHash;
    user.resetPasswordExpire = Date.now() + 600000; // 10 minutes
    await user.save();

    console.log("💾 OTP saved to database");
    console.log("⏰ Expiry time:", new Date(user.resetPasswordExpire).toLocaleString());

    // Send OTP email
    try {
      await sendOtpEmail(user.email, otp);

      console.log("✅ OTP EMAIL SENT SUCCESSFULLY");
      console.log("========================================\n");

      res.status(200).json({
        success: true,
        message: "OTP has been sent to your email! Valid for 10 minutes.",
      });

    } catch (emailError) {
      // If email fails, remove the OTP
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      console.error("❌ Failed to send OTP email:", emailError);

      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again later.",
      });
    }

  } catch (error) {
    console.error("❌ Forgot password OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

/**
 * RESET PASSWORD WITH OTP - Verify OTP and reset password
 * ✅ FIXED VERSION - Separated query and validation
 */
export const resetPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log("\n========================================");
    console.log("=== RESET PASSWORD OTP REQUEST ===");
    console.log("========================================");
    console.log("📧 Email received:", email);
    console.log("🔑 OTP received:", otp);
    console.log("🔑 OTP type:", typeof otp);
    console.log("🔑 OTP length:", otp.length);
    console.log("⏰ Current time:", new Date().toLocaleString());

    // Validate input
    if (!email || !otp || !newPassword) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required!",
      });
    }

    // Validate OTP length
    if (otp.length !== 6) {
      console.log("❌ Invalid OTP length:", otp.length);
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits!",
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!",
      });
    }

    // ✅ FIX: Find user by email FIRST (don't check OTP in query)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Stored OTP hash in DB:", user.resetPasswordToken);
    console.log("⏰ Stored expiry time:", user.resetPasswordExpire ? new Date(user.resetPasswordExpire).toLocaleString() : "Not set");

    // ✅ FIX: Hash the OTP and compare AFTER finding user
    const otpHash = crypto.createHash("sha256").update(otp.toString().trim()).digest("hex");
    console.log("🔐 Hashed OTP from user input:", otpHash);

    console.log("\n--- OTP COMPARISON ---");
    console.log("Expected (DB)  :", user.resetPasswordToken);
    console.log("Received (User):", otpHash);
    console.log("Match?", user.resetPasswordToken === otpHash ? "YES ✅" : "NO ❌");

    // ✅ FIX: Check if OTP matches
    if (user.resetPasswordToken !== otpHash) {
      console.log("❌ OTP DOES NOT MATCH!");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    // ✅ FIX: Check if OTP expired
    if (!user.resetPasswordExpire || Date.now() > user.resetPasswordExpire) {
      console.log("❌ OTP HAS EXPIRED!");
      const timeLeft = user.resetPasswordExpire - Date.now();
      console.log("Time left:", Math.floor(timeLeft / 1000), "seconds");
      return res.status(400).json({
        success: false,
        message: "OTP has expired! Please request a new one.",
      });
    }

    const timeLeft = user.resetPasswordExpire - Date.now();
    console.log("⏰ Time remaining:", Math.floor(timeLeft / 1000), "seconds");
    console.log("✅ OTP IS VALID!");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("✅ PASSWORD RESET SUCCESSFUL!");
    console.log("========================================\n");

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now sign in with your new password.",
    });

  } catch (error) {
    console.error("❌ Reset password OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

/**
 * ===== GOOGLE OAUTH SUCCESS =====
 * Only for existing users
 */
export const googleAuthSuccess = async (req, res) => {
  try {
    console.log('\n========================================');
    console.log('=== GOOGLE AUTH SUCCESS ===');
    console.log('========================================');
    
    const user = req.user;

    if (!user) {
      console.log('❌ No user found in request');
      return res.redirect(`${process.env.FRONTEND_URL}/signin?error=authentication_failed`);
    }

    console.log('✅ User authenticated:', user.email);

    // Generate JWT token (7 days)
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-default-secret-key-change-this",
      { expiresIn: "7d" }
    );

    console.log('🔑 JWT token generated');

    // Prepare user data
    const userResponse = user.toJSON();

    // ALWAYS redirect to dashboard (existing users only)
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(userResponse))}`;

    console.log('🔄 Redirecting to dashboard');
    console.log('========================================\n');

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Google auth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=server_error`);
  }
};

/**
 * ===== GOOGLE OAUTH FAILURE =====
 * Handles both errors and new user attempts
 */
export const googleAuthFailure = (req, res) => {
  console.log('\n========================================');
  console.log('❌ GOOGLE AUTH FAILED');
  console.log('========================================\n');
  
  // Check if it's a new user trying to sign in
  const message = req.session?.messages?.[0] || 'google_auth_failed';
  
  if (message === 'new_user_not_allowed') {
    console.log('🚫 New user attempted Google Sign-In');
    return res.redirect(`${process.env.FRONTEND_URL}/signin?error=new_user_use_signup`);
  }
  
  res.redirect(`${process.env.FRONTEND_URL}/signin?error=google_auth_failed`);
};