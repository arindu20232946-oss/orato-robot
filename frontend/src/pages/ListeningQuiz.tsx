import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Headphones,
  Lock,
  CheckCircle,
  Loader2,
  Music,
  FileText,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { listeningService } from "../services/listeningService";

interface ListeningItem {
  id: string;
  level: string;
  order: number;
  type: string;
  title: string;
  contentPreview: string;
  totalQuestions: number;
  isLocked: boolean;
  isCompleted: boolean;
  attempts: number;
}

const levels = ["beginner", "intermediate", "advanced"];
const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
const levelColors: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  beginner: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  intermediate: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  advanced: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    badge: "bg-rose-100 text-rose-700",
  },
};

const levelRanks: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const ListeningQuiz: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<ListeningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [userLevel, setUserLevel] = useState("beginner");
  const [completedCount, setCompletedCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");

  // Auto-detect user level
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.skillLevel && levels.includes(user.skillLevel)) {
          setUserLevel(user.skillLevel);
          setActiveLevel(user.skillLevel);
        }
      } catch {}
    }
  }, []);

  // Fetch items when level changes
  useEffect(() => {
    fetchItems(activeLevel);
  }, [activeLevel]);

  const fetchItems = async (level: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await listeningService.getAll(level);
      setItems(res.data.items);
      setCompletedCount(res.data.completedItems);
      setTotalItems(res.data.totalItems);
      // Sync user level if backend returns it (it might have upgraded)
      if (res.data.userLevel) {
        setUserLevel(res.data.userLevel);
        // Update local storage if needed
        const stored = localStorage.getItem("user");
        if (stored) {
          const user = JSON.parse(stored);
          if (user.skillLevel !== res.data.userLevel) {
            user.skillLevel = res.data.userLevel;
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch listening content:", err);
      if (err.response?.status === 403) {
        setError(err.response.data.message || "This level is locked.");
      } else {
        setError("Failed to load content. Please try again later.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Animate cards on load
  useEffect(() => {
    if (!loading && cardsRef.current?.children) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
        );
        gsap.fromTo(
          cardsRef.current!.children,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.07,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      });
      return () => ctx.revert();
    }
  }, [loading, activeLevel]);

  const handleCardClick = (item: ListeningItem) => {
    if (item.isLocked) return;
    navigate(`/listening/${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Loading listening content...
        </h2>
      </div>
    );
  }

  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-green-500/20">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Listening Practice
              </h1>
              <p className="text-gray-500 text-sm">
                Enhance your comprehension with immersive audio exercises.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {levelLabels[activeLevel]} Progress
              </span>
              <span className="text-sm font-bold text-green-600">
                {completedCount}/{totalItems} completed
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Level Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {levels.map((level) => {
              const isTabLocked = levelRanks[level] > levelRanks[userLevel];
              return (
                <button
                  key={level}
                  onClick={() => !isTabLocked && setActiveLevel(level)}
                  disabled={isTabLocked}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeLevel === level
                      ? "gradient-primary text-white shadow-lg shadow-green-500/25 scale-105"
                      : isTabLocked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border border-gray-200"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200"
                  }`}
                >
                  {isTabLocked && <Lock className="w-3 h-3" />}
                  {levelLabels[level]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center mb-8">
            <Lock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-900 mb-1">Level Restricted</h3>
            <p className="text-amber-700 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No listening content available for this level yet.
            </p>
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {items.map((item) => {
              const colors = levelColors[item.level] || levelColors.beginner;

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className={`relative group rounded-2xl p-5 transition-all duration-300 border-2 ${
                    item.isLocked
                      ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-70"
                      : item.isCompleted
                        ? "bg-white border-green-200 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-green-300"
                        : "bg-white border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-green-200"
                  }`}
                >
                  {/* Order badge */}
                  <div
                    className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      item.isCompleted
                        ? "bg-green-500 text-white"
                        : item.isLocked
                          ? "bg-gray-300 text-gray-600"
                          : "gradient-primary text-white"
                    }`}
                  >
                    {item.order}
                  </div>

                  {/* Lock / Complete overlay */}
                  {item.isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-gray-100/50 backdrop-blur-[1px]">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {/* Completed check */}
                  {item.isCompleted && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 ${
                      item.isLocked ? "grayscale" : ""
                    }`}
                  >
                    {item.type === "song" ? (
                      <Music className={`w-6 h-6 ${colors.text}`} />
                    ) : (
                      <FileText className={`w-6 h-6 ${colors.text}`} />
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-semibold text-sm mb-1 ${
                      item.isLocked ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Preview */}
                  <p
                    className={`text-xs mb-3 line-clamp-2 ${
                      item.isLocked ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {item.contentPreview}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        item.isLocked ? "bg-gray-100 text-gray-400" : colors.badge
                      }`}
                    >
                      {item.type === "song" ? "🎵 Song" : "📝 Paragraph"}
                    </span>
                    <span className={item.isLocked ? "text-gray-300" : "text-gray-500"}>
                      {item.totalQuestions} questions
                    </span>
                  </div>

                  {/* Attempts */}
                  {item.attempts > 0 && !item.isLocked && (
                    <div className="mt-2 text-xs text-gray-400">
                      {item.attempts} attempt{item.attempts > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ListeningQuiz;
