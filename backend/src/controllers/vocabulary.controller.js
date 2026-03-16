import VocabularyContent from "../models/vocabularyContent.js";
import VocabularyProgress from "../models/vocabularyProgress.js";

// GET /api/vocabulary
export const getAllVocabularyContent = async (req, res) => {
  try {
    const user = req.user;
    const level = user.skillLevel || "beginner";

    const tasks = await VocabularyContent.find({ level }).sort({ order: 1 });

    const progressList = await VocabularyProgress.find({
      userId: user._id,
      level,
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.vocabularyContentId.toString()] = p;
    });

    const tasksWithStatus = tasks.map((task, index) => {
      const progress = progressMap[task._id.toString()];
      const completed = progress?.completed || false;

      let unlocked = false;
      if (index === 0) {
        unlocked = true;
      } else {
        const prevTask = tasks[index - 1];
        const prevProgress = progressMap[prevTask._id.toString()];
        unlocked = prevProgress?.completed || false;
      }

      return {
        _id: task._id,
        title: task.title,
        theme: task.theme,
        level: task.level,
        order: task.order,
        estimatedMinutes: task.estimatedMinutes,
        description: task.description,
        completed,
        unlocked,
        score: progress?.score || 0,
      };
    });

    res.json({ success: true, level, tasks: tasksWithStatus });
  } catch (error) {
    console.error("getAllVocabularyContent error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/vocabulary/:id
export const getVocabularyById = async (req, res) => {
  try {
    const task = await VocabularyContent.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    console.error("getVocabularyById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/vocabulary/:id/submit
export const submitVocabularyAnswers = async (req, res) => {
  try {
    const user = req.user;
    const { answers } = req.body;

    const task = await VocabularyContent.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const existing = await VocabularyProgress.findOne({
      userId: user._id,
      vocabularyContentId: task._id,
    });
    if (existing?.completed) {
      return res.status(400).json({ success: false, message: "Already completed" });
    }

    let correctAnswers = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = task.questions.id(answer.questionId);
      if (!question) return answer;
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        ...answer,
        correctAnswer: question.correctAnswer,
        word: question.word,
        isCorrect,
      };
    });

    const totalQuestions = answers.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    await VocabularyProgress.create({
      userId: user._id,
      vocabularyContentId: task._id,
      level: task.level,
      order: task.order,
      completed: true,
      score,
      totalQuestions,
      correctAnswers,
      answers: gradedAnswers,
    });

    const feedback = task.questions.map((q) => {
      const userAnswer = gradedAnswers.find(
        (a) => a.questionId?.toString() === q._id.toString()
      );
      return {
        questionId: q._id,
        word: q.word,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        selectedAnswer: userAnswer?.selectedAnswer,
        isCorrect: userAnswer?.isCorrect,
      };
    });

    res.json({
      success: true,
      score,
      correctAnswers,
      totalQuestions,
      feedback,
      message:
        score >= 60
          ? "Great job! Next task unlocked! 🎉"
          : "Task completed! Keep practicing! 💪",
    });
  } catch (error) {
    console.error("submitVocabularyAnswers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/vocabulary/progress
export const getVocabularyProgress = async (req, res) => {
  try {
    const progress = await VocabularyProgress.find({
      userId: req.user._id,
    }).populate("vocabularyContentId", "title theme order level");

    res.json({ success: true, progress });
  } catch (error) {
    console.error("getVocabularyProgress error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};