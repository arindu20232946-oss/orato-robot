import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

/* =======================================================
   PUBLIC / ADMIN CRUD (Optional - keep if needed)
======================================================= */

// READ - Get all users (Admin use)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ - Get single user by ID (Admin use)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE - Update user by ID (Admin use)
export const updateUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE - Delete user by ID (Admin use)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =======================================================
   LOGGED-IN USER FEATURES (Secure)
======================================================= */

// ✅ Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ✅ Update logged-in user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, targetLanguage, bio } = req.body;

    const user = req.user; // already loaded by protect middleware

    if (fullName) user.fullName = fullName;
    if (targetLanguage) user.targetLanguage = targetLanguage;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// ✅ Get user's learning goals with live progress
export const getGoals = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    // Fetch skill progress data to compute live goal progress
    let grammarPct = 0, vocabPct = 0, listeningPct = 0, readingPct = 0;

    try {
      const GrammarProgress = (await import("../models/grammarProgress.js")).default;
      const gp = await GrammarProgress.findOne({ userId });
      grammarPct = Math.min(Math.round(((gp?.completedLevels?.length || 0) / 10) * 100), 100);
    } catch (_) {}

    try {
      const VocabularyProgress = (await import("../models/vocabularyProgress.js")).default;
      const VocabularyContent = (await import("../models/vocabularyContent.js")).default;
      const vp = await VocabularyProgress.find({ userId, completed: true });
      const total = await VocabularyContent.countDocuments({ level: user.skillLevel || "beginner" });
      vocabPct = total > 0 ? Math.min(Math.round((vp.length / total) * 100), 100) : 0;
    } catch (_) {}

    try {
      const ListeningProgress = (await import("../models/listeningProgress.js")).default;
      const ListeningContent = (await import("../models/listeningContent.js")).default;
      const lp = await ListeningProgress.find({ userId, completed: true });
      const total = await ListeningContent.countDocuments({ level: user.skillLevel || "beginner" });
      listeningPct = total > 0 ? Math.min(Math.round((lp.length / total) * 100), 100) : 0;
    } catch (_) {}

    try {
      const ReadingProgress = (await import("../models/readingProgress.js")).default;
      const ReadingContent = (await import("../models/readingContent.js")).default;
      const rp = await ReadingProgress.find({ userId, completed: true });
      const total = await ReadingContent.countDocuments({ level: user.skillLevel || "beginner" });
      readingPct = total > 0 ? Math.min(Math.round((rp.length / total) * 100), 100) : 0;
    } catch (_) {}

    const progressMap = {
      grammar: grammarPct,
      vocabulary: vocabPct,
      listening: listeningPct,
      reading: readingPct,
      streak: Math.min(user.stats?.dayStreak || 0, 7),
    };

    const targetMap = {
      grammar: 80,
      vocabulary: 80,
      listening: 80,
      reading: 80,
      streak: 7,
    };

    const goalsWithProgress = user.goals.map((g) => ({
      _id: g._id,
      type: g.type,
      title: g.title,
      target: targetMap[g.type] ?? 80,
      current: progressMap[g.type] ?? 0,
      deadline: g.deadline,
      createdAt: g.createdAt,
    }));

    res.json({ success: true, goals: goalsWithProgress });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch goals" });
  }
};

// ✅ Add a learning goal (max 5, no duplicate types)
export const addGoal = async (req, res) => {
  try {
    const { type, title, deadline } = req.body;

    const validTypes = ["grammar", "vocabulary", "listening", "reading", "streak"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid goal type" });
    }
    if (!deadline) {
      return res.status(400).json({ success: false, message: "Deadline is required" });
    }

    const user = req.user;

    if (user.goals.length >= 5) {
      return res.status(400).json({ success: false, message: "You can have at most 5 goals" });
    }

    const duplicate = user.goals.some((g) => g.type === type);
    if (duplicate) {
      return res.status(400).json({ success: false, message: "You already have a goal of this type" });
    }

    user.goals.push({ type, title, deadline: new Date(deadline) });
    await user.save();

    res.status(201).json({ success: true, message: "Goal added successfully", goals: user.goals });
  } catch (error) {
    console.error("Add goal error:", error);
    res.status(500).json({ success: false, message: "Failed to add goal" });
  }
};

// ✅ Delete a learning goal by ID
export const deleteGoal = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const goalIndex = user.goals.findIndex((g) => g._id.toString() === id);
    if (goalIndex === -1) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    user.goals.splice(goalIndex, 1);
    await user.save();

    res.json({ success: true, message: "Goal removed successfully" });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ success: false, message: "Failed to delete goal" });
  }
};


// ✅ Remove profile picture
export const removeProfilePicture = async (req, res) => {
  try {
    const user = req.user;

    if (user.profilePicture) {
      // Extract Cloudinary public_id and delete the image
      const urlParts = user.profilePicture.split("/");
      const filenameWithExt = urlParts[urlParts.length - 1];
      const filename = filenameWithExt.split(".")[0];
      const publicId = `profile_pictures/${filename}`;

      await cloudinary.uploader.destroy(publicId);
    }

    user.profilePicture = "";
    await user.save();

    const { password, ...safeUser } = user.toObject();

    res.json({
      success: true,
      message: "Profile picture removed",
      user: safeUser,
    });
  } catch (error) {
    console.error("Remove profile picture error:", error);
    res.status(500).json({ success: false, message: "Failed to remove profile picture" });
  }
};