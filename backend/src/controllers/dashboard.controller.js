import User from '../models/user.js';
import Lesson from '../models/lesson.js';
import Challenge from '../models/challenge.js';
import Skill from '../models/skill.js';
import Achievement from '../models/achievement.js';
import GrammarProgress from '../models/grammarProgress.js';
import ReadingProgress from '../models/readingProgress.js';
import VocabularyProgress from '../models/vocabularyProgress.js';
import ListeningProgress from '../models/listeningProgress.js';

/**
 * Get full dashboard data
 * GET /api/dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [lessons, challenges, skills, achievements] = await Promise.all([
      Lesson.find({ userId }).sort({ order: 1 }).limit(5),
      Challenge.find({ userId, expiresAt: { $gt: new Date() } }),
      Skill.find({ userId }),
      Achievement.find({ userId }).sort({ earnedAt: -1 }).limit(3)
    ]);

    const stats = req.user.stats || {
      dayStreak: 0, streakChange: 0, totalPoints: 0,
      rankPercentile: 0, badgesEarned: 0, badgesToNextLevel: 5,
      lessonsDone: 0, lessonsThisWeek: 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats,
        continueLearning: lessons.map(l => ({
          id: l._id, title: l.title, category: l.category,
          timeLeft: l.timeLeft, progress: l.progress,
          icon: l.icon, iconBg: l.iconBg
        })),
        dailyChallenges: challenges.map(c => ({
          id: c._id, title: c.title, current: c.current,
          target: c.target, points: c.points, completed: c.completed
        })),
        skillProgress: skills.map(s => ({
          name: s.name, percentage: s.percentage, color: s.color
        })),
        recentAchievements: achievements.map(a => ({
          id: a._id, title: a.title, description: a.description,
          icon: a.icon, iconColor: a.iconColor, iconBg: a.iconBg,
          earnedAt: a.earnedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get dashboard data' });
  }
};

/**
 * Get dashboard stats only
 * GET /api/dashboard/stats
 */
export const getStats = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const skillLevel = user.skillLevel || 'beginner';
    
    const stats = user.stats || {
      dayStreak: 0,
      streakChange: 0,
      totalPoints: 0,
      rankPercentile: 0,
      badgesEarned: 0,
      badgesToNextLevel: 5,
      lessonsDone: 0,
      lessonsThisWeek: 0,
      lastStreakUpdate: new Date()
    };

    let grammarAttempts = 0;
    let readingAttempts = 0;
    let listeningAttempts = 0;
    let vocabularyAttempts = 0;

    try {
      const grammarProgressData = await GrammarProgress.findOne({ userId });
      grammarAttempts = grammarProgressData?.completedLevels?.length || 0;
    } catch (e) {
      console.error('Error fetching grammar progress:', e);
    }

    try {
      const readingProgressData = await ReadingProgress.find({ userId });
      readingAttempts = readingProgressData.filter(r => r.completed).length;
    } catch (e) {
      console.error('Error fetching reading progress:', e);
    }

    try {
      const listeningProgressData = await ListeningProgress.find({ userId });
      listeningAttempts = listeningProgressData.filter(l => l.completed).length;
    } catch (e) {
      console.error('Error fetching listening progress:', e);
    }

    try {
      const vocabularyProgressData = await VocabularyProgress.find({ userId });
      vocabularyAttempts = vocabularyProgressData.filter(v => v.completed).length;
    } catch (e) {
      console.error('Error fetching vocabulary progress:', e);
    }

    const totalLessonsDone = grammarAttempts + readingAttempts + listeningAttempts + vocabularyAttempts;

    res.status(200).json({
      status: 'success',
      data: { 
        stats: {
          ...stats,
          lessonsDone: totalLessonsDone
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get stats' });
  }
};

/**
 * Get continue learning section
 * GET /api/dashboard/continue-learning
 */
export const getContinueLearning = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const lessons = await Lesson.find({ userId }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        lessons: lessons.map(l => ({
          id: l._id, title: l.title, category: l.category,
          timeLeft: l.timeLeft, totalTime: l.totalTime,
          progress: l.progress, icon: l.icon, iconBg: l.iconBg,
          lastAccessed: l.lastAccessed
        }))
      }
    });
  } catch (error) {
    console.error('Get continue learning error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get lessons' });
  }
};

/**
 * Get daily challenges
 * GET /api/dashboard/challenges
 */
export const getChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let challenges = await Challenge.find({
      userId,
      date: today
    });

    // Filter out any old/unsupported challenge types
    const validTypes = ['lessons', 'reading', 'listening'];
    const invalidChallenges = challenges.filter(c => !validTypes.includes(c.type));
    if (invalidChallenges.length > 0) {
      await Challenge.deleteMany({
        _id: { $in: invalidChallenges.map(c => c._id) }
      });
      challenges = challenges.filter(c => validTypes.includes(c.type));
    }

    if (challenges.length === 0) {
      const challengeTemplates = [
        { title: 'Complete 2 Grammar Quizzes', type: 'lessons', target: 2, points: 20 },
        { title: 'Complete 1 Reading Task', type: 'reading', target: 1, points: 15 },
        { title: 'Complete 1 Listening Task', type: 'listening', target: 1, points: 15 },
      ];

      const newChallenges = challengeTemplates.map(template => ({
        userId,
        title: template.title,
        type: template.type,
        target: template.target,
        points: template.points,
        current: 0,
        completed: false,
        expiresAt: tomorrow,
        date: today
      }));

      await Challenge.insertMany(newChallenges);
      
      challenges = await Challenge.find({
        userId,
        date: today
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        challenges: challenges.map(c => ({
          id: c._id, title: c.title, current: c.current,
          target: c.target, points: c.points, type: c.type,
          completed: c.completed, expiresAt: c.expiresAt
        }))
      }
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get challenges' });
  }
};

/**
 * Update challenge progress
 * POST /api/dashboard/challenges/update
 */
export const updateChallengeProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, amount = 1 } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await Challenge.findOne({
      userId,
      type,
      date: today
    });

    if (challenge && !challenge.completed) {
      challenge.current += amount;
      if (challenge.current >= challenge.target) {
        challenge.completed = true;
      }
      await challenge.save();
    }

    res.status(200).json({
      status: 'success',
      data: { challenge }
    });
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update challenge' });
  }
};

/**
 * Get skill progress
 * GET /api/dashboard/skills
 */
export const getSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const skillLevel = req.user.skillLevel || 'beginner';
    
    const skills = await Skill.find({ userId });
    
    const grammarProgress = await GrammarProgress.findOne({ userId, skillLevel });
    
    const completedLevels = grammarProgress?.completedLevels?.length || 0;
    const totalLevels = 10;
    const grammarPercentage = Math.round((completedLevels / totalLevels) * 100);
    const grammarPoints = grammarProgress?.totalScore || 0;
    
    let readingPercentage = 0;
    let completedReading = 0;
    let totalReading = 0;
    let readingPoints = 0;
    
    try {
      const ReadingContent = (await import('../models/readingContent.js')).default;
      const readingProgressData = await ReadingProgress.find({ userId, level: skillLevel });
      completedReading = readingProgressData.filter(r => r.completed).length;
      totalReading = await ReadingContent.countDocuments({ level: skillLevel });
      readingPercentage = totalReading > 0 ? Math.round((completedReading / totalReading) * 100) : 0;
      readingPoints = readingProgressData.reduce((sum, r) => sum + (r.score || 0), 0);
    } catch (readingError) {
      console.error('Error fetching reading progress:', readingError);
    }
    
    const skillsWithGrammar = skills.map(s => ({
      id: s._id,
      name: s.name,
      percentage: s.percentage,
      color: s.color,
      details: s.details
    }));
    
    const grammarSkillIndex = skillsWithGrammar.findIndex(s => s.name === 'Grammar');
    if (grammarSkillIndex >= 0) {
      skillsWithGrammar[grammarSkillIndex].percentage = grammarPercentage;
      skillsWithGrammar[grammarSkillIndex].details = {
        ...skillsWithGrammar[grammarSkillIndex].details,
        totalLevels,
        completedLevels,
        points: grammarPoints
      };
    } else {
      skillsWithGrammar.push({
        id: 'grammar',
        name: 'Grammar',
        percentage: grammarPercentage,
        color: '#8B5CF6',
        details: {
          totalLevels,
          completedLevels,
          points: grammarPoints
        }
      });
    }

    const readingSkillIndex = skillsWithGrammar.findIndex(s => s.name === 'Reading');
    if (readingSkillIndex >= 0) {
      skillsWithGrammar[readingSkillIndex].percentage = readingPercentage;
      skillsWithGrammar[readingSkillIndex].details = {
        ...skillsWithGrammar[readingSkillIndex].details,
        totalReading,
        completedReading,
        points: readingPoints
      };
    } else {
      skillsWithGrammar.push({
        id: 'reading',
        name: 'Reading',
        percentage: readingPercentage,
        color: '#3B82F6',
        details: {
          totalReading,
          completedReading,
          points: readingPoints
        }
      });
    }

    // Get Listening Progress
    let listeningPercentage = 0;
    let completedListening = 0;
    let totalListening = 0;
    let listeningPoints = 0;

    try {
      const ListeningContent = (await import('../models/listeningContent.js')).default;
      const listeningProgressData = await ListeningProgress.find({ userId, level: skillLevel });
      completedListening = listeningProgressData.filter(l => l.completed).length;
      totalListening = await ListeningContent.countDocuments({ level: skillLevel });
      listeningPercentage = totalListening > 0 ? Math.round((completedListening / totalListening) * 100) : 0;
      listeningPoints = listeningProgressData.reduce((sum, l) => sum + (l.correctAnswers || 0), 0);
    } catch (listeningError) {
      console.error('Error fetching listening progress:', listeningError);
    }

    const listeningSkillIndex = skillsWithGrammar.findIndex(s => s.name === 'Listening');
    if (listeningSkillIndex >= 0) {
      skillsWithGrammar[listeningSkillIndex].percentage = listeningPercentage;
      skillsWithGrammar[listeningSkillIndex].details = {
        ...skillsWithGrammar[listeningSkillIndex].details,
        totalListening,
        completedListening,
        points: listeningPoints
      };
    } else {
      skillsWithGrammar.push({
        id: 'listening',
        name: 'Listening',
        percentage: listeningPercentage,
        color: '#F97316',
        details: {
          totalListening,
          completedListening,
          points: listeningPoints
        }
      });
    }

    // Get Vocabulary Progress
    let vocabularyPercentage = 0;
    let completedVocabulary = 0;
    let totalVocabulary = 0;
    let vocabularyPoints = 0;

    try {
      const VocabularyContent = (await import('../models/vocabularyContent.js')).default;
      const vocabularyProgressData = await VocabularyProgress.find({ userId, level: skillLevel });
      completedVocabulary = vocabularyProgressData.filter(v => v.completed).length;
      totalVocabulary = await VocabularyContent.countDocuments({ level: skillLevel });
      vocabularyPercentage = totalVocabulary > 0 ? Math.round((completedVocabulary / totalVocabulary) * 100) : 0;
      vocabularyPoints = vocabularyProgressData.reduce((sum, v) => sum + (v.score || 0), 0);
    } catch (vocabError) {
      console.error('Error fetching vocabulary progress:', vocabError);
    }

    const vocabularySkillIndex = skillsWithGrammar.findIndex(s => s.name === 'Vocabulary');
    if (vocabularySkillIndex >= 0) {
      skillsWithGrammar[vocabularySkillIndex].percentage = vocabularyPercentage;
      skillsWithGrammar[vocabularySkillIndex].details = {
        ...skillsWithGrammar[vocabularySkillIndex].details,
        totalVocabulary,
        completedVocabulary,
        points: vocabularyPoints
      };
    } else {
      skillsWithGrammar.push({
        id: 'vocabulary',
        name: 'Vocabulary',
        percentage: vocabularyPercentage,
        color: '#10B981',
        details: {
          totalVocabulary,
          completedVocabulary,
          points: vocabularyPoints
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        skills: skillsWithGrammar
      }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get skills' });
  }
};

/**
 * Get recent achievements
 * GET /api/dashboard/achievements
 */
export const getRecentAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const achievements = await Achievement.find({ userId })
      .sort({ earnedAt: -1 })
      .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        achievements: achievements.map(a => ({
          id: a._id, title: a.title, description: a.description,
          icon: a.icon, iconColor: a.iconColor, iconBg: a.iconBg,
          earnedAt: a.earnedAt, rarity: a.rarity
        }))
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get achievements' });
  }
};

/**
 * Get activity history
 * GET /api/dashboard/activity
 */
export const getActivityHistory = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        activity: [],
        pagination: { limit: 10, offset: 0, total: 0 }
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get activity history' });
  }
};