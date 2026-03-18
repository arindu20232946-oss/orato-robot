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

// ✅ Add learning goal
export const addGoal = async (req, res) => {
  try {
    const { title, targetDate } = req.body;

    if (!title || !targetDate) {
      return res.status(400).json({ message: "Title and target date required" });
    }

    const user = await User.findById(req.user.userId);

    user.goals.push({
      title,
      targetDate
    });

    await user.save();

    res.status(201).json({ message: "Goal added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add goal" });
  }
};

// ✅ Get learning goals
export const getGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json(user.goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals" });
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