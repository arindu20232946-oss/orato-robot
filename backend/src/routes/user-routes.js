console.log("User routes file loaded");

import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  removeProfilePicture
} from "../controllers/user-controller.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.put("/test-profile", (req, res) => {
  res.json({ message: "Test route works" });
});

/* ================= AUTHENTICATED USER ================= */

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.post(
  "/upload-profile-picture",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Only JPG, PNG, and WEBP files are allowed",
        });
      }

      // Delete old profile picture if exists
      if (req.user.profilePicture) {
        const oldPublicId = req.user.profilePicture
          .split("/")
          .slice(-1)[0]
          .split(".")[0];

        await cloudinary.uploader.destroy(`profile_pictures/${oldPublicId}`);
      }

      // Upload new image (with resizing)
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pictures",
          transformation: [{ width: 300, height: 300, crop: "fill" }],
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            return res.status(500).json({ message: error.message });
          }

          req.user.profilePicture = result.secure_url;
          await req.user.save();

          const { password, ...safeUser } = req.user.toObject();

          res.json({
            success: true,
            message: "Profile picture updated",
            user: safeUser,
          });
        }
      );

      stream.end(req.file.buffer);

    } catch (error) {
      console.error("Upload route error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/upload-profile-picture", protect, removeProfilePicture);

/* ================= ADMIN CRUD ================= */
/* Keep parameter routes ALWAYS at bottom */

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;