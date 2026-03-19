import User from '../models/user.js';
import ListeningContent from '../models/listeningContent.js';
import ListeningProgress from '../models/listeningProgress.js';
import ReadingContent from '../models/readingContent.js';
import ReadingProgress from '../models/readingProgress.js';
import GrammarProgress from '../models/grammarProgress.js';
import Settings from '../models/settings.model.js';
import { sendLevelUpEmail } from './emailService.js';

/**
 * Checks if a user has completed all requirements for their current level
 * and upgrades them if they have.
 * @param {string} userId - The ID of the user to check
 */
export const checkAndUpgradeLevel = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { upgraded: false };

    const currentLevel = user.skillLevel || 'beginner';
    if (currentLevel === 'advanced') return { upgraded: false };

    // 1. Check Listening Lab (Need 10 completed)
    const listeningItems = await ListeningContent.find({ level: currentLevel }).distinct('_id');
    const completedListeningCount = await ListeningProgress.countDocuments({
      userId,
      contentId: { $in: listeningItems },
      completed: true
    });

    if (completedListeningCount < 10 && completedListeningCount < listeningItems.length) {
      return { upgraded: false, reason: 'Listening incomplete' };
    }

    // 2. Check Reading Tasks (Need 10 completed)
    const readingItems = await ReadingContent.find({ level: currentLevel }).distinct('_id');
    const completedReadingCount = await ReadingProgress.countDocuments({
      userId,
      readingContentId: { $in: readingItems },
      completed: true
    });

    if (completedReadingCount < 10 && completedReadingCount < readingItems.length) {
      return { upgraded: false, reason: 'Reading incomplete' };
    }

    // 3. Check Grammar Levels (Need 10 completed)
    const grammarProg = await GrammarProgress.findOne({ userId, skillLevel: currentLevel });
    if (!grammarProg || grammarProg.completedLevels.length < 10) {
      return { upgraded: false, reason: 'Grammar incomplete' };
    }

    // If we reached here, user has completed all 3 categories!
    const levelOrder = ['beginner', 'intermediate', 'advanced'];
    const nextLevelIndex = levelOrder.indexOf(currentLevel) + 1;
    const nextLevel = levelOrder[nextLevelIndex];

    if (!nextLevel) return { upgraded: false };

    // Update User Level
    await User.findByIdAndUpdate(userId, { skillLevel: nextLevel });
    
    // Update Settings Level (synchronized)
    await Settings.findOneAndUpdate({ userId }, { skillLevel: nextLevel });

    console.log(`🚀 User ${userId} upgraded to ${nextLevel}!`);

    // Check notification settings
    const settings = await Settings.findOne({ userId });
    if (settings?.notifications?.pushNotifications) {
      await sendLevelUpEmail(user.email, user.fullName, nextLevel);
      console.log(`📧 Level up email sent to ${user.email}`);
    }

    return { upgraded: true, newLevel: nextLevel };

  } catch (error) {
    console.error('Error in checkAndUpgradeLevel:', error);
    return { upgraded: false, error: error.message };
  }
};
