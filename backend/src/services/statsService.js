import User from '../models/user.js';

/**
 * Update user statistics when a lesson or task is completed
 * @param {string} userId - The ID of the user
 * @param {number} pointsEarned - Points to add to totalPoints
 * @returns {Promise<Object>} - The updated stats
 */
export const updateUserStats = async (userId, pointsEarned) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        dayStreak: 0,
        streakChange: 0,
        totalPoints: 0,
        rankPercentile: 0,
        badgesEarned: 0,
        badgesToNextLevel: 5,
        lessonsDone: 0,
        lessonsThisWeek: 0,
        lastStreakUpdate: new Date(Date.now() - 86400000) // Default to yesterday
      };
    }

    const now = new Date();
    const lastUpdate = new Date(user.stats.lastStreakUpdate || 0);
    
    // Reset hours to compare dates only
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
    
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Streak continues
      user.stats.dayStreak += 1;
    } else if (diffDays > 1) {
      // Streak reset
      user.stats.dayStreak = 1;
    } else if (diffDays === 0 && user.stats.dayStreak === 0) {
        // First lesson ever or after a long break but on the same day? 
        // Actually if diffDays is 0, it means they already did something today or last activity was today.
        // If streak was 0, and we are doing something today, it should be 1.
        user.stats.dayStreak = 1;
    }
    // If diffDays === 0 and streak > 0, we just keep the current streak

    user.stats.lastStreakUpdate = now;
    user.stats.totalPoints += (pointsEarned || 0);
    user.stats.lessonsDone += 1;
    
    // Update lessons this week (simple implementation - could be more robust)
    user.stats.lessonsThisWeek += 1;

    await user.save();
    
    return user.stats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};
