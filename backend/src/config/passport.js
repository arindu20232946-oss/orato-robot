import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

/**
 * ===== PASSPORT GOOGLE OAUTH CONFIGURATION =====
 * 
 * Google Sign-In for EXISTING USERS ONLY
 * New users must go through email signup → personal info → assessment flow
 */

export const configurePassport = () => {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      
      /**
       * Verify callback - Only allow existing users
       */
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('\n========================================');
          console.log('=== GOOGLE OAUTH CALLBACK ===');
          console.log('========================================');
          console.log('📧 Google Email:', profile.emails[0].value);
          console.log('👤 Google Name:', profile.displayName);
          console.log('🔑 Google ID:', profile.id);

          const email = profile.emails[0].value;
          const googleId = profile.id;
          const profilePicture = profile.photos[0]?.value || '';

          // ===== CHECK 1: User with Google ID (Already linked) =====
          let user = await User.findOne({ googleId: googleId });

          if (user) {
            console.log('✅ Existing Google user found:', user.email);
            
            // Update profile picture if changed
            if (profilePicture && user.profilePicture !== profilePicture) {
              user.profilePicture = profilePicture;
              await user.save();
            }
            
            console.log('========================================\n');
            return done(null, user);
          }

          // ===== CHECK 2: User exists with email (Allow account linking) =====
          user = await User.findOne({ email: email.toLowerCase() });

          if (user) {
            console.log('🔗 Existing email user found - linking Google account');
            
            // Link Google account to existing email account
            user.googleId = googleId;
            user.profilePicture = profilePicture || user.profilePicture;
            user.authProvider = 'google'; // Now uses Google
            
            await user.save();
            
            console.log('✅ Google account linked successfully');
            console.log('========================================\n');
            return done(null, user);
          }

          // ===== CHECK 3: New user - REJECT =====
          console.log('❌ New user detected - Google Sign-In not allowed for new users');
          console.log('========================================\n');
          
          // Return error to indicate new user
          return done(null, false, { 
            message: 'new_user_not_allowed' 
          });

        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          console.log('========================================\n');
          return done(error, null);
        }
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('✅ Passport Google OAuth configured (Existing users only)');
};