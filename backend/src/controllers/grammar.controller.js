import GrammarQuestion from '../models/grammarQuestion.js';
import GrammarProgress from '../models/grammarProgress.js';
import User from '../models/user.js';
import { checkAndUpgradeLevel } from '../services/progressService.js';

export const getLevels = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';

    let progress = await GrammarProgress.findOne({ userId, skillLevel });

    if (!progress) {
      progress = await GrammarProgress.create({
        userId,
        skillLevel,
        completedLevels: [],
        currentLevel: 1,
        totalScore: 0,
        isCompleted: false
      });
    }

    const levels = [];
    for (let i = 1; i <= 10; i++) {
      let status = 'locked';

      if (i === 1) {
        status = 'unlocked';
      } else if (progress.completedLevels.includes(i - 1)) {
        status = 'unlocked';
      }

      if (progress.completedLevels.includes(i)) {
        status = 'completed';
      } else if (progress.currentLevel === i) {
        status = 'current';
      }

      levels.push({
        level: i,
        status
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        levels,
        currentLevel: progress.currentLevel,
        totalScore: progress.totalScore,
        completedLevels: progress.completedLevels,
        isCompleted: progress.isCompleted
      }
    });
  } catch (error) {
    console.error('Get grammar levels error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get grammar levels' });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';
    const level = parseInt(req.params.level);

    if (!level || level < 1 || level > 10) {
      return res.status(400).json({ status: 'error', message: 'Invalid level' });
    }

    const progress = await GrammarProgress.findOne({ userId, skillLevel });

    if (!progress) {
      return res.status(403).json({ status: 'error', message: 'Progress not found. Complete previous levels first.' });
    }

    if (level > 1 && !progress.completedLevels.includes(level - 1)) {
      return res.status(403).json({ status: 'error', message: 'This level is locked. Complete the previous level first.' });
    }

    const questions = await GrammarQuestion.aggregate([
      { $match: { skillLevel, level } },
      { $sample: { size: 5 } }
    ]);

    const questionsWithoutAnswer = questions.map((q, index) => ({
      id: index,
      questionId: q._id.toString(),
      text: q.text,
      options: q.options,
      explanation: q.explanation
    }));

    res.status(200).json({
      status: 'success',
      data: {
        level,
        questions: questionsWithoutAnswer
      }
    });
  } catch (error) {
    console.error('Get grammar questions error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get grammar questions' });
  }
};

export const submitAnswers = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';
    const level = parseInt(req.params.level);
    const { answers } = req.body;

    if (!level || level < 1 || level > 10) {
      return res.status(400).json({ status: 'error', message: 'Invalid level' });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ status: 'error', message: 'Exactly 5 answers required' });
    }

    const validFormat = answers.every(a => a && a.questionId && typeof a.selected === 'number');
    if (!validFormat) {
      return res.status(400).json({ status: 'error', message: 'Invalid answer format' });
    }

    const progress = await GrammarProgress.findOne({ userId, skillLevel });

    if (!progress) {
      return res.status(403).json({ status: 'error', message: 'Progress not found' });
    }

    if (level > 1 && !progress.completedLevels.includes(level - 1)) {
      return res.status(403).json({ status: 'error', message: 'This level is locked' });
    }

    const allQuestions = await GrammarQuestion.find({ skillLevel, level })
      .select('text options correctAnswer explanation');

    const questionMap = {};
    allQuestions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });

    let correctCount = 0;
    const questionResults = answers.map((answer, i) => {
      const q = questionMap[answer.questionId];
      if (!q) return null;
      const isCorrect = answer.selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: answer.selected,
        explanation: q.explanation,
        isCorrect
      };
    }).filter(Boolean);

    const score = Math.round((correctCount / 5) * 100);
    const passed = score >= 60;
    const perfectScore = score === 100;
    
    const isNewLevel = !progress.completedLevels.includes(level);
    let pointsEarned = 0;
    
    if (passed && isNewLevel) {
      pointsEarned = Math.round((score / 100) * 50);
    }

    const updateData = {};

    if (passed && isNewLevel) {
      updateData.$addToSet = { completedLevels: level };
      updateData.$inc = { currentLevel: 1 };
      updateData.$set = {};
      
      if (level === 10) {
        updateData.$set = { isCompleted: true };
      }
      
      if (pointsEarned > 0) {
        updateData.$inc = { totalScore: pointsEarned };
      }
    }

    const updatedProgress = await GrammarProgress.findOneAndUpdate(
      { userId, skillLevel },
      updateData,
      { returnDocument: 'after' }
    );

    let badgeEarned = null;

    if (passed && updatedProgress.completedLevels.length === 5 && !updatedProgress.badgeAwarded) {
      await User.findByIdAndUpdate(userId, { $inc: { 'stats.badgesEarned': 1 } });
      await GrammarProgress.findOneAndUpdate(
        { userId, skillLevel },
        { $set: { badgeAwarded: true } }
      );
      badgeEarned = 'Grammar Intermediate';
    }

    if (passed && updatedProgress.completedLevels.length === 10 && !updatedProgress.masterBadgeAwarded) {
      await User.findByIdAndUpdate(userId, { $inc: { 'stats.badgesEarned': 1 } });
      await GrammarProgress.findOneAndUpdate(
        { userId, skillLevel },
        { $set: { masterBadgeAwarded: true } }
      );
      badgeEarned = 'Grammar Master';
    }

    if (passed && isNewLevel) {
      try {
        await User.findByIdAndUpdate(userId, { 
          $inc: { 
            'stats.lessonsDone': 1,
            'stats.totalPoints': pointsEarned 
          } 
        });
      } catch (err) {
        console.error('Failed to update user stats:', err);
      }
    }

    // Check for level upgrade
    const upgradeResult = await checkAndUpgradeLevel(userId);
    let levelUpgraded = upgradeResult.upgraded;
    let newLevel = upgradeResult.newLevel;

    res.status(200).json({
      status: 'success',
      data: {
        result: {
          correctAnswers: correctCount,
          totalQuestions: 5,
          score,
          passed,
          pointsEarned,
          questions: questionResults,
          completedLevels: updatedProgress.completedLevels,
          currentLevel: updatedProgress.currentLevel,
          totalScore: updatedProgress.totalScore,
          isCompleted: updatedProgress.isCompleted,
          badgeEarned,
          levelUpgraded,
          newLevel
        }
      }
    });
  } catch (error) {
    console.error('Submit grammar answers error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit answers' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';

    const progress = await GrammarProgress.findOne({ userId, skillLevel });

    if (!progress) {
      return res.status(200).json({
        status: 'success',
        data: {
          completedLevels: [],
          currentLevel: 1,
          totalScore: 0,
          isCompleted: false
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        completedLevels: progress.completedLevels,
        currentLevel: progress.currentLevel,
        totalScore: progress.totalScore,
        isCompleted: progress.isCompleted
      }
    });
  } catch (error) {
    console.error('Get grammar progress error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get progress' });
  }
};
