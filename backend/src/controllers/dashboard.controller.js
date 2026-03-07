import User from '../models/user.js';
import Lesson from '../models/lesson.js';
import Challenge from '../models/challenge.js';
import Skill from '../models/skill.js';
import Achievement from '../models/achievement.js';

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
    const stats = req.user.stats;

    if (!stats) {
      return res.status(404).json({ status: 'error', message: 'Stats not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { stats }
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
    const challenges = await Challenge.find({
      userId,
      expiresAt: { $gt: new Date() }
    });

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
 * Get skill progress
 * GET /api/dashboard/skills
 */
export const getSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const skills = await Skill.find({ userId });

    res.status(200).json({
      status: 'success',
      data: {
        skills: skills.map(s => ({
          id: s._id, name: s.name,
          percentage: s.percentage, color: s.color,
          details: s.details
        }))
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