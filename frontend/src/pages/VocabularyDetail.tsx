import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import API from "../services/api";

interface Question {
  _id: string;
  word: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Task {
  _id: string;
  title: string;
  theme: string;
  level: string;
  order: number;
  description: string;
  questions: Question[];
  estimatedMinutes: number;
}

interface FeedbackItem {
  questionId: string;
  word: string;
  questionText: string;
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface Result {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  feedback: FeedbackItem[];
  message: string;
}

export default function VocabularyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/vocabulary/${id}`);
        setTask(res.data.task);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (task && currentQuestion < task.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!task) return;
    const unanswered = task.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = task.questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id],
      }));

      const res = await API.post(`/vocabulary/${id}/submit`, { answers: payload });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      if (err.response?.data?.message === "Already completed") {
        alert("You have already completed this task!");
      } else {
        alert("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading task...</h2>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Task not found.</p>
      </div>
    );
  }

  // ── RESULT SCREEN ──────────────────────────────────────────
  if (result) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">

          {/* Score Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.score >= 60 ? "bg-green-100" : "bg-orange-100"
            }`}>
              <span className={`text-3xl font-bold ${
                result.score >= 60 ? "text-green-600" : "text-orange-600"
              }`}>
                {result.score}%
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Task Complete!</h2>
            <p className="text-gray-500 text-sm mb-2">{result.message}</p>
            <p className="text-sm text-gray-600">
              You got <span className="font-semibold text-green-600">{result.correctAnswers}/{result.totalQuestions}</span> correct
            </p>
          </div>

          {/* Feedback */}
          <div className="space-y-3 mb-8">
            <h3 className="font-bold text-gray-900 text-lg">Answer Review</h3>
            {result.feedback.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                item.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {item.isCorrect
                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                    : <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="font-bold text-sm text-gray-800">{item.word}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.questionText}</p>
                <p className="text-sm">
                  Your answer:{" "}
                  <span className={`font-semibold ${item.isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {item.selectedAnswer}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p className="text-sm text-green-700 mt-1">
                    Correct: <span className="font-semibold">{item.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/vocabulary")}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
          >
            Back to Vocabulary Tasks
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ── TASK SCREEN ────────────────────────────────────────────
  const q = task.questions[currentQuestion];
  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / task.questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/vocabulary")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
              {task.theme}
            </span>
            <span className="text-xs text-gray-400 capitalize">{task.level} • Task {task.order}</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-3">{task.title}</h1>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {totalAnswered}/{task.questions.length} answered
            </span>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {task.questions.map((question, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                i === currentQuestion
                  ? "bg-green-500 text-white scale-110"
                  : answers[question._id]
                  ? "bg-green-200 text-green-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
          <div className="mb-1">
            <span className="text-xs text-gray-400">Question {currentQuestion + 1} of {task.questions.length}</span>
          </div>
          <div className="inline-block bg-green-50 px-3 py-1 rounded-lg mb-3">
            <span className="text-green-700 font-bold text-lg">{q.word}</span>
          </div>
          <p className="font-semibold text-gray-900 mb-4">{q.questionText}</p>

          <div className="space-y-2">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(q._id, option)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all duration-200 ${
                  answers[q._id] === option
                    ? "bg-green-500 text-white border-green-500 font-semibold"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          {currentQuestion < task.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || totalAnswered < task.questions.length}
              className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                `Submit (${totalAnswered}/${task.questions.length})`
              )}
            </button>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}