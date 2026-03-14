import ReadingContent from "../models/readingContent.js";
import ReadingProgress from "../models/readingProgress.js";

// GET /api/reading — get all tasks for user's level
export const getAllReadingContent = async (req, res) => {
  try {
    const user = req.user;
    const level = user.skillLevel || "beginner";

    const tasks = await ReadingContent.find({ level }).sort({ order: 1 });

    // Get user's progress for all tasks
    const progressList = await ReadingProgress.find({
      userId: user._id,
      level,
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.readingContentId.toString()] = p;
    });

    // Attach unlock status to each task
    const tasksWithStatus = tasks.map((task, index) => {
      const progress = progressMap[task._id.toString()];
      const completed = progress?.completed || false;

      // First task always unlocked, rest unlock after previous completed
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
        type: task.type,
        level: task.level,
        order: task.order,
        estimatedMinutes: task.estimatedMinutes,
        completed,
        unlocked,
        score: progress?.score || 0,
      };
    });

    res.json({ success: true, level, tasks: tasksWithStatus });
  } catch (error) {
    console.error("getAllReadingContent error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/reading/:id — get single task with questions
export const getReadingById = async (req, res) => {
  try {
    const task = await ReadingContent.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    console.error("getReadingById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/reading/:id/submit — submit answers
export const submitReadingAnswers = async (req, res) => {
  try {
    const user = req.user;
    const { answers } = req.body; // [{ questionId, type, selectedAnswer, writtenAnswer }]

    const task = await ReadingContent.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if already submitted
    const existing = await ReadingProgress.findOne({
      userId: user._id,
      readingContentId: task._id,
    });
    if (existing?.completed) {
      return res.status(400).json({ success: false, message: "Already completed" });
    }

    // Grade MCQ answers
    let correctMcq = 0;
    let totalMcq = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = task.questions.id(answer.questionId);
      if (!question) return answer;

      if (question.type === "mcq") {
        totalMcq++;
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) correctMcq++;
        return { ...answer, isCorrect };
      }
      return { ...answer }; // writing — just save it
    });

    const score = totalMcq > 0 ? Math.round((correctMcq / totalMcq) * 100) : 100;

    // Save progress
    const progress = await ReadingProgress.create({
      userId: user._id,
      readingContentId: task._id,
      level: task.level,
      order: task.order,
      completed: true,
      score,
      totalMcq,
      correctMcq,
      answers: gradedAnswers,
    });

    // Build feedback per question
    const feedback = task.questions.map((q) => {
      const userAnswer = gradedAnswers.find(
        (a) => a.questionId?.toString() === q._id.toString()
      );
      if (q.type === "mcq") {
        return {
          questionId: q._id,
          questionText: q.questionText,
          type: "mcq",
          correctAnswer: q.correctAnswer,
          selectedAnswer: userAnswer?.selectedAnswer,
          isCorrect: userAnswer?.isCorrect,
        };
      }
      return {
        questionId: q._id,
        questionText: q.questionText,
        type: "writing",
        writtenAnswer: userAnswer?.writtenAnswer,
        note: "Writing submitted successfully!",
      };
    });

    res.json({
      success: true,
      score,
      correctMcq,
      totalMcq,
      feedback,
      message:
        score >= 60
          ? "Great job! Next task unlocked! 🎉"
          : "Task completed! Keep practicing! 💪",
    });
  } catch (error) {
    console.error("submitReadingAnswers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/reading/progress — get all progress for user
export const getReadingProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.find({
      userId: req.user._id,
    }).populate("readingContentId", "title type order level");

    res.json({ success: true, progress });
  } catch (error) {
    console.error("getReadingProgress error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};