import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, CheckCircle, BookOpenCheck, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import API from "../services/api";

interface Task {
  _id: string;
  title: string;
  theme: string;
  level: string;
  order: number;
  estimatedMinutes: number;
  description: string;
  completed: boolean;
  unlocked: boolean;
  score: number;
}

export default function VocabularyTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [level, setLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/vocabulary");
        setTasks(res.data.tasks);
        setLevel(res.data.level);
      } catch (err) {
        console.error("Failed to fetch vocabulary tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const levelColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  const themeColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-orange-100 text-orange-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading vocabulary tasks...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vocabulary Practice</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Complete tasks in order to unlock the next one.
          </p>
          <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${levelColors[level]}`}>
            {level} Level
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={task._id}
              onClick={() => task.unlocked && navigate(`/vocabulary/${task._id}`)}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                task.completed
                  ? "bg-blue-50 border-blue-200 cursor-pointer hover:shadow-md"
                  : task.unlocked
                  ? "bg-white border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300"
                  : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                task.completed ? "bg-blue-500" : task.unlocked ? "bg-blue-100" : "bg-gray-200"
              }`}>
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : !task.unlocked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : (
                  <BookOpenCheck className="w-6 h-6 text-blue-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${themeColors[index % themeColors.length]}`}>
                    {task.theme}
                  </span>
                  <span className="text-xs text-gray-400">Task {task.order}</span>
                </div>
                <h3 className={`font-semibold text-sm truncate ${task.unlocked ? "text-gray-900" : "text-gray-400"}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  10 questions • {task.estimatedMinutes} min
                  {task.completed && ` • Score: ${task.score}%`}
                </p>
              </div>

              {/* Arrow or Lock */}
              <div className="flex-shrink-0">
                {task.unlocked && !task.completed && (
                  <ChevronRight className="w-5 h-5 text-blue-500" />
                )}
                {task.completed && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Done ✓
                  </span>
                )}
                {!task.unlocked && (
                  <Lock className="w-4 h-4 text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}