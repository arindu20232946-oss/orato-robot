import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Lock,
  CheckCircle,
  Play,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { grammarService } from "../services/grammarService";

interface Level {
  level: number;
  status: "locked" | "unlocked" | "current" | "completed";
}

interface Progress {
  skillLevel: string;
  completedLevels: number[];
  currentLevel: number;
  totalScore: number;
  isCompleted: boolean;
}

const GrammarLevels: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [levelsRes, progressRes] = await Promise.all([
        grammarService.getLevels(),
        grammarService.getProgress(),
      ]);
      setLevels(levelsRes.data.levels);
      setProgress(progressRes.data);
    } catch (err) {
      console.error("Failed to fetch grammar data:", err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [loading]);

  const handleLevelClick = (level: Level) => {
    if (level.status === "locked") return;
    navigate(`/grammar/${level.level}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Loading grammar content...
        </h2>
      </div>
    );
  }

  const completedCount = progress?.completedLevels.length || 0;
  const totalLevels = 10;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Grammar Practice
              </h1>
              <p className="text-gray-500 text-sm">
                Master grammar rules with interactive exercises.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Your Progress
              </span>
              <span className="text-sm font-bold text-green-600">
                {completedCount}/{totalLevels} completed
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {levels.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No grammar levels available yet.
            </p>
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {levels.map((level) => (
              <div
                key={level.level}
                onClick={() => handleLevelClick(level)}
                className={`relative group rounded-2xl p-5 transition-all duration-300 border-2 cursor-pointer ${
                  level.status === "locked"
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-70"
                    : level.status === "completed"
                      ? "bg-white border-green-200 hover:shadow-xl hover:-translate-y-1 hover:border-green-300"
                      : "bg-white border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-green-200"
                }`}
              >
                <div
                  className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                    level.status === "completed"
                      ? "bg-green-500 text-white"
                      : level.status === "locked"
                        ? "bg-gray-300 text-gray-600"
                        : "gradient-primary text-white"
                  }`}
                >
                  {level.level}
                </div>

                {level.status === "locked" && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-gray-100/50 backdrop-blur-[1px]">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                )}

                {level.status === "completed" && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mt-2 ${
                    level.status === "locked"
                      ? "bg-gray-100 grayscale"
                      : level.status === "completed"
                        ? "bg-emerald-50"
                        : "bg-amber-50"
                  }`}
                >
                  {level.status === "locked" ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : level.status === "completed" ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Play className="w-6 h-6 text-amber-600" />
                  )}
                </div>

                <h3
                  className={`font-semibold text-sm mb-1 ${
                    level.status === "locked" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  Level {level.level}
                </h3>

                <span
                  className={`text-xs ${
                    level.status === "locked" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  5 questions
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GrammarLevels;
