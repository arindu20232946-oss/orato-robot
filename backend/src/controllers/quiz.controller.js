import Quiz from '../models/quiz.js';
import QuizResult from '../models/quizResult.js';
import User from '../models/user.js';
import { checkAndUpgradeLevel } from '../services/progressService.js';

/**
 * Get all quizzes
 * GET /api/quiz
 */
export const getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter);

    res.status(200).json({
      status: 'success',
      data: {
        quizzes: quizzes.map(q => ({
          id: q._id,
          title: q.title,
          category: q.category,
          difficulty: q.difficulty,
          description: q.description,
          icon: q.icon,
          iconBg: q.iconBg,
          timeLimit: q.timeLimit,
          points: q.points,
          totalQuestions: q.questions ? q.questions.length : 0
        }))
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get quizzes' });
  }
};

/**
 * Get single quiz with questions (no correct answers sent)
 * GET /api/quiz/:id
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ status: 'error', message: 'Quiz not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          category: quiz.category,
          difficulty: quiz.difficulty,
          description: quiz.description,
          icon: quiz.icon,
          iconBg: quiz.iconBg,
          timeLimit: quiz.timeLimit,
          points: quiz.points,
          questions: quiz.questions.map((q, index) => ({
            id: index,
            text: q.text,
            options: q.options,
            explanation: q.explanation
            // correctAnswer NOT sent to frontend
          }))
        }
      }
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get quiz' });
  }
};

/**
 * Submit quiz answers and calculate score
 * POST /api/quiz/:id/submit
 */
export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const userId = req.user._id;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ status: 'error', message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = answers.map((selectedAnswer, index) => {
      const question = quiz.questions[index];
      const isCorrect = question && selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return { questionIndex: index, selectedAnswer, isCorrect };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const pointsEarned = Math.round((score / 100) * quiz.points);

    // Save result to DB
    const result = await QuizResult.create({
      userId,
      quizId: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      answers: detailedAnswers,
      timeTaken: timeTaken || 0,
      pointsEarned
    });

    // Update user's total points and badges in stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'stats.totalPoints': pointsEarned,
        'stats.badgesEarned': score === 100 ? 1 : 0,
        'stats.lessonsDone': 1
      }
    });

    // Check for level upgrade if it was a Vocabulary quiz
    let levelUpgraded = false;
    let newLevel = null;
    if (quiz.category === 'Vocabulary') {
      const upgradeResult = await checkAndUpgradeLevel(userId);
      levelUpgraded = upgradeResult.upgraded;
      newLevel = upgradeResult.newLevel;
    }

    // Return full result with correct answers and explanations
    const questionsWithAnswers = quiz.questions.map((q, index) => ({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedAnswer: answers[index],
      isCorrect: detailedAnswers[index]?.isCorrect,
      explanation: q.explanation
    }));

    res.status(200).json({
      status: 'success',
      data: {
        result: {
          id: result._id,
          score,
          totalQuestions: quiz.questions.length,
          correctAnswers,
          pointsEarned,
          timeTaken: timeTaken || 0,
          questions: questionsWithAnswers,
          levelUpgraded,
          newLevel
        }
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit quiz' });
  }
};

/**
 * Get user quiz results history
 * GET /api/quiz/results
 */
export const getResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await QuizResult.find({ userId })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 })
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        results: results.map(r => ({
          id: r._id,
          quiz: r.quizId,
          score: r.score,
          correctAnswers: r.correctAnswers,
          totalQuestions: r.totalQuestions,
          pointsEarned: r.pointsEarned,
          completedAt: r.completedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get results' });
  }
};

/**
 * Get recommended quizzes based on user level
 * GET /api/quiz/recommended
 */
export const getRecommended = async (req, res) => {
  try {
    const userId = req.user._id;
    const level = req.user?.level || 'Beginner';

    // Exclude quizzes already completed with 100%
    const completedQuizIds = await QuizResult.find({ userId, score: 100 })
      .distinct('quizId');

    const quizzes = await Quiz.find({
      difficulty: level,
      _id: { $nin: completedQuizIds }
    })
      .select('-questions')
      .limit(3);

    res.status(200).json({
      status: 'success',
      data: {
        quizzes: quizzes.map(q => ({
          id: q._id,
          title: q.title,
          category: q.category,
          difficulty: q.difficulty,
          icon: q.icon,
          iconBg: q.iconBg,
          timeLimit: q.timeLimit,
          points: q.points,
          totalQuestions: q.questions.length
        }))
      }
    });
  } catch (error) {
    console.error('Get recommended error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to get recommended quizzes' });
  }
};