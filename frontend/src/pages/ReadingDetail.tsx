import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import API from "../services/api";

interface Question {
  _id: string;
  questionText: string;
  type: "mcq" | "writing";
  options?: string[];
  correctAnswer?: string;
}

interface Task {
  _id: string;
  title: string;
  type: "paragraph" | "poem";
  level: string;
  order: number;
  content: string;
  questions: Question[];
  estimatedMinutes: number;
}

interface FeedbackItem {
  questionId: string;
  questionText: string;
  type: "mcq" | "writing";
  correctAnswer?: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
  writtenAnswer?: string;
  note?: string;
}

interface Result {
  score: number;
  correctMcq: number;
  totalMcq: number;
  feedback: FeedbackItem[];
  message: string;
}

export default function ReadingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/reading/${id}`);
        setTask(res.data.task);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleMCQ = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleWriting = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    if (!task) return;

    // Check all questions answered
    const unanswered = task.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = task.questions.map((q) => ({
        questionId: q._id,
        type: q.type,
        selectedAnswer: q.type === "mcq" ? answers[q._id] : undefined,
        writtenAnswer: q.type === "writing" ? answers[q._id] : undefined,
      }));

      const res = await API.post(`/reading/${id}/submit`, { answers: payload });
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
              MCQ Score: <span className="font-semibold text-green-600">{result.correctMcq}/{result.totalMcq}</span> correct
            </p>
          </div>

          {/* Feedback */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-gray-900 text-lg">Answer Review</h3>
            {result.feedback.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                item.type === "mcq"
                  ? item.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}>
                <p className="font-semibold text-sm text-gray-800 mb-2">
                  Q{i + 1}. {item.questionText}
                </p>
                {item.type === "mcq" ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {item.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        Your answer:{" "}
                        <span className={`font-semibold ${item.isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {item.selectedAnswer}
                        </span>
                      </span>
                    </div>
                    {!item.isCorrect && (
                      <p className="text-sm text-green-700 ml-6">
                        Correct answer: <span className="font-semibold">{item.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-blue-700 italic">"{item.writtenAnswer}"</p>
                    <p className="text-xs text-blue-500 mt-1">✅ {item.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/reading")}
              className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
            >
              Back to Tasks
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── TASK SCREEN ────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/reading")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </button>

        {/* Task Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              task.type === "poem"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {task.type === "poem" ? "🎭 Poem" : "📄 Paragraph"}
            </span>
            <span className="text-xs text-gray-400 capitalize">{task.level} • Task {task.order}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-4">{task.title}</h1>

          {/* Content */}
          <div className={`text-gray-700 leading-relaxed text-sm bg-gray-50 rounded-xl p-4 ${
            task.type === "poem" ? "whitespace-pre-line font-serif text-base italic" : ""
          }`}>
            {task.content}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5 mb-8">
          <h2 className="font-bold text-gray-900 text-lg">Answer the Questions</h2>
          {task.questions.map((q, i) => (
            <div key={q._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="font-semibold text-sm text-gray-900 mb-3">
                Q{i + 1}. {q.questionText}
              </p>

              {q.type === "mcq" ? (
                <div className="space-y-2">
                  {q.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleMCQ(q._id, option)}
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
              ) : (
                <textarea
                  value={answers[q._id] || ""}
                  onChange={(e) => handleWriting(q._id, e.target.value)}
                  placeholder="Write your answer here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 resize-none focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 bg-gray-50"
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Answers"
          )}
        </button>
      </main>
      <Footer />
    </div>
  );
}