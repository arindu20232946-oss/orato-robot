import express from "express";
import passport from 'passport';
import { 
  signup, 
  signin, 
  forgotPasswordOtp,      
  resetPasswordOtp,
  googleAuthSuccess,  
  googleAuthFailure   
} from "../controllers/auth-controller.js";

const router = express.Router();

// ===== EXISTING ROUTES =====
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password-otp", forgotPasswordOtp);  
router.post("/reset-password-otp", resetPasswordOtp);    

// ===== NEW: GOOGLE OAUTH ROUTES =====

/**
 * Start Google OAuth flow
 * Frontend redirects user here to begin Google login
 */
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * Google OAuth callback
 * Google redirects here after user authorizes
 */
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: false, // We use JWT, not sessions
  }),
  googleAuthSuccess
);

/**
 * Google OAuth failure handler
 */
router.get('/google/failure', googleAuthFailure);

export default router;