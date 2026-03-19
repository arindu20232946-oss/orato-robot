import ListeningContent from '../models/listeningContent.js';
import ListeningProgress from '../models/listeningProgress.js';
import User from '../models/user.js';
import { checkAndUpgradeLevel } from '../services/progressService.js';
import { updateUserStats } from '../services/statsService.js';

const levelRanks = {
  beginner: 0,
  intermediate: 1,
  advanced: 2
};

/**
 * Get all listening items for a level with lock status
 * GET /api/listening?level=beginner
 */
export const getAllListeningContent = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRoleLevel = req.user.skillLevel || 'beginner';
    const requestedLevel = userRoleLevel; // Strictly use user's current level

    // Get all items for the user's current level, sorted by order
    const items = await ListeningContent.find({ level: requestedLevel })
      .select('-questions.correctAnswer')
      .sort({ order: 1 });

    // Get user's progress for these items
    const progress = await ListeningProgress.find({
      userId,
      contentId: { $in: items.map(i => i._id) }
    });

    const progressMap = {};
    progress.forEach(p => {
      progressMap[p.contentId.toString()] = p;
    });

    // Build response with lock status
    const itemsWithStatus = items.map((item, index) => {
      const prog = progressMap[item._id.toString()];
      let isLocked = false;

      if (index === 0) {
        // First item is always unlocked
        isLocked = false;
      } else {
        // Check if previous item is completed
        const prevItem = items[index - 1];
        const prevProg = progressMap[prevItem._id.toString()];
        isLocked = !prevProg || !prevProg.completed;
      }

      return {
        id: item._id,
        level: item.level,
        order: item.order,
        type: item.type,
        title: item.title,
        contentPreview: item.content.substring(0, 80) + '...',
        totalQuestions: 3,
        isLocked,
        isCompleted: prog?.completed || false,
        attempts: prog?.attempts || 0
      };
    });

    // Count completed items
    const completedCount = itemsWithStatus.filter(i => i.isCompleted).length;

    res.status(200).json({
      status: 'success',
      data: {
        level: requestedLevel,
        userLevel: userRoleLevel,
        items: itemsWithStatus,
        totalItems: items.length,
        completedItems: completedCount
      }
    });
  } catch (error) {
    console.error('Get listening content error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get listening content' });
  }
};

/**
 * Get single listening item with questions (no correct answers sent)
 * GET /api/listening/:id
 */
export const getListeningById = async (req, res) => {
  try {
    const userId = req.user._id;
    const item = await ListeningContent.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Content not found' });
    }

    // Check level rank
    if (levelRanks[item.level] > levelRanks[req.user.skillLevel]) {
      return res.status(403).json({
        status: 'error',
        message: 'This level is higher than your current skill level.'
      });
    }

    // Check if this item is locked
    if (item.order > 1) {
      const prevItem = await ListeningContent.findOne({
        level: item.level,
        order: item.order - 1
      });

      if (prevItem) {
        const prevProgress = await ListeningProgress.findOne({
          userId,
          contentId: prevItem._id,
          completed: true
        });

        if (!prevProgress) {
          return res.status(403).json({
            status: 'error',
            message: 'This item is locked. Complete the previous item first.'
          });
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        item: {
          id: item._id,
          level: item.level,
          order: item.order,
          type: item.type,
          title: item.title,
          content: item.content,
          questions: item.questions.map((q, index) => ({
            id: index,
            text: q.text,
            options: q.options
            // correctAnswer NOT sent
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get listening item error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get listening item' });
  }
};

/**
 * Submit answers for a listening item
 * POST /api/listening/:id/submit
 */
export const submitListeningAnswers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answers } = req.body; // [0, 2, 1] — selected option indices

    const item = await ListeningContent.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Content not found' });
    }

    if (!answers || answers.length !== 3) {
      return res.status(400).json({ status: 'error', message: 'Exactly 3 answers required' });
    }

    // Calculate results
    let correctCount = 0;
    const questionResults = item.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: answers[i],
        isCorrect
      };
    });

    const allCorrect = correctCount === 3;

    // Check if was previously completed
    const existingProgress = await ListeningProgress.findOne({ userId, contentId: item._id });
    const wasCompleted = existingProgress ? existingProgress.completed : false;

    // Update or create progress
    const progress = await ListeningProgress.findOneAndUpdate(
      { userId, contentId: item._id },
      {
        $set: {
          completed: allCorrect,
          correctAnswers: correctCount,
          level: item.level, // Ensure level is saved
          order: item.order, // Ensure order is saved
          ...(allCorrect ? { completedAt: new Date() } : {})
        },
        $inc: { attempts: 1 }
      },
      { upsert: true, returnDocument: 'after' }
    );

    // Increment global stats if newly completed
    if (allCorrect && !wasCompleted) {
      try {
        await updateUserStats(userId, 50); // 50 points for listening
      } catch (err) {
        console.error('Failed to update user stats:', err);
      }
    }

    // Check if next item exists and is now unlocked
    let nextItemUnlocked = false;
    let levelUpgraded = false;

    if (allCorrect) {
      const nextItem = await ListeningContent.findOne({
        level: item.level,
        order: item.order + 1
      });

      if (nextItem) {
        nextItemUnlocked = true;
      }
      
      // Call unified level upgrade check
      const upgradeResult = await checkAndUpgradeLevel(userId);
      if (upgradeResult.upgraded) {
        levelUpgraded = true;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        result: {
          correctAnswers: correctCount,
          totalQuestions: 3,
          allCorrect,
          questions: questionResults,
          attempts: progress.attempts,
          nextItemUnlocked,
          levelUpgraded
        }
      }
    });
  } catch (error) {
    console.error('Submit listening error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit answers' });
  }
};

/**
 * Get user's listening progress summary
 * GET /api/listening/progress
 */
export const getListeningProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await ListeningProgress.find({ userId, completed: true })
      .populate('contentId', 'level order title');

    const summary = {
      beginner: { completed: 0, total: 10 },
      intermediate: { completed: 0, total: 10 },
      advanced: { completed: 0, total: 10 }
    };

    progress.forEach(p => {
      if (p.contentId && summary[p.contentId.level]) {
        summary[p.contentId.level].completed++;
      }
    });

    res.status(200).json({
      status: 'success',
      data: { summary }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get progress' });
  }
};
