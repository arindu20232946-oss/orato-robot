import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronRight, PlayCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";

interface Lesson {
  id: number | string;
  title: string;
  timeLeft: string;
  progress: number;
  icon: string;
  iconBg: string;
  isGrammar?: boolean;
  isReading?: boolean;
  isListening?: boolean;
  isVocabulary?: boolean;
  completedLevels?: number;
  totalLevels?: number;
  points?: number;
}

const defaultLessons: Lesson[] = [
  {
    id: 2,
    title: "Listening Lab",
    timeLeft: "25 min left",
    progress: 0,
    icon: "🎧",
    iconBg: "bg-orange-100",
    isListening: true,
  },
  {
    id: 5,
    title: "Reading Tasks",
    timeLeft: "15 min left",
    progress: 0,
    icon: "📚",
    iconBg: "bg-green-100",
    isReading: true,
  },
  {
    id: 6,
    title: "Vocabulary Practice",
    timeLeft: "10 min left",
    progress: 0,
    icon: "🔤",
    iconBg: "bg-blue-100",
    isVocabulary: true,
  },
  {
    id: 1,
    title: "Grammar Practice",
    timeLeft: "20 min left",
    progress: 0,
    icon: "✍️",
    iconBg: "bg-purple-100",
    isGrammar: true,
  },
];

interface ContinueLearningProps {
  onLessonClick?: (lessonId: number | string, lessonTitle: string) => void;
}

export default function ContinueLearning({
  onLessonClick,
}: ContinueLearningProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const displayedLessons = lessons.length > 0 ? lessons : defaultLessons;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("ContinueLearning - Token:", token ? "exists" : "null");

        const skillsRes = await dashboardService.getSkills();
        console.log("ContinueLearning - Skills response:", skillsRes);

        const skills = skillsRes.data?.skills || [];
        const grammarSkill = skills.find((s: any) => s.name === 'Grammar');
        const readingSkill = skills.find((s: any) => s.name === 'Reading');
        const listeningSkill = skills.find((s: any) => s.name === 'Listening');
        const vocabularySkill = skills.find((s: any) => s.name === 'Vocabulary');

        const updatedLessons = defaultLessons.map((lesson) => {
          if (lesson.isGrammar && grammarSkill) {
            return {
              ...lesson,
              completedLevels: grammarSkill.details?.completedLevels || 0,
              totalLevels: grammarSkill.details?.totalLevels || 10,
              progress: grammarSkill.percentage || 0,
            };
          }
          if (lesson.isReading && readingSkill) {
            return {
              ...lesson,
              completedLevels: readingSkill.details?.completedReading || 0,
              totalLevels: readingSkill.details?.totalReading || 10,
              progress: readingSkill.percentage || 0,
            };
          }
          if (lesson.isListening && listeningSkill) {
            return {
              ...lesson,
              completedLevels: listeningSkill.details?.completedListening || 0,
              totalLevels: listeningSkill.details?.totalListening || 10,
              progress: listeningSkill.percentage || 0,
            };
          }
          if (lesson.isVocabulary && vocabularySkill) {
            return {
              ...lesson,
              completedLevels: vocabularySkill.details?.completedVocabulary || 0,
              totalLevels: vocabularySkill.details?.totalVocabulary || 10,
              progress: vocabularySkill.percentage || 0,
            };
          }
          return lesson;
        });

        setLessons(updatedLessons);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        setLessons(defaultLessons);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
      );

      if (!loading) {
        progressRefs.current.forEach((progressBar, index) => {
          if (progressBar) {
            const lesson = displayedLessons[index];
            gsap.to(progressBar, {
              width: `${lesson.progress}%`,
              duration: 0.8,
              delay: 0.1 * index,
              ease: "power2.out",
            });
          }
        });
      }
    });

    return () => ctx.revert();
  }, [loading, displayedLessons]);

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.title === "Listening Lab") {
      navigate("/listening");
    } else if (lesson.title === "Reading Tasks") {
      navigate("/reading");
    } else if (lesson.title === "Vocabulary Practice") {
      navigate("/vocabulary");
    } else if (lesson.title === "Grammar Practice") {
      navigate("/grammar");
    } else {
      onLessonClick?.(lesson.id, lesson.title);
    }
  };

  if (loading) {
    return (
      <div ref={containerRef} className="bg-white rounded-2xl p-6 card-shadow">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white rounded-[2rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-800 font-heading tracking-tight">
            Continue Learning
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Pick up right where you left off
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedLessons.map((lesson, index) => {
          const isHovered = hoveredId === lesson.id;

          return (
            <div
              key={lesson.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`group relative p-4 sm:p-6 rounded-[1.5rem] transition-all duration-500 cursor-pointer border ${
                isHovered
                  ? "bg-white border-emerald-200 shadow-[0_20px_40px_rgba(16,185,129,0.1)] transform -translate-y-2"
                  : "bg-slate-50/50 border-transparent hover:bg-white hover:border-emerald-100"
              }`}
              onMouseEnter={() => setHoveredId(lesson.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleLessonClick(lesson)}
            >
              {/* Decorative background element on hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-opacity duration-500 blur-3xl opacity-0 ${isHovered ? 'opacity-100' : ''}`} />

              <div className="relative flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${lesson.iconBg} flex items-center justify-center text-3xl flex-shrink-0 transition-all duration-500 shadow-sm ${isHovered ? "rotate-[10deg] scale-110 shadow-lg shadow-emerald-200" : ""}`}
                    >
                      {lesson.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-lg mb-0.5 truncate tracking-tight">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Active Task
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLessonClick(lesson);
                    }}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-500 w-full sm:w-auto ${
                      isHovered
                        ? "bg-emerald-600 text-white shadow-xl scale-105"
                        : "bg-white text-slate-700 shadow-sm border border-slate-100 hover:border-emerald-200"
                    }`}
                  >
                    <PlayCircle className={`w-4 h-4 transition-transform duration-500 ${isHovered ? 'rotate-[360deg]' : ''}`} />
                    START
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Course Completion
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-emerald-600">
                        {lesson.progress}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">%</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                      <div
                        ref={(el) => {
                          progressRefs.current[index] = el;
                        }}
                        className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-full relative overflow-hidden transition-all duration-1000"
                        style={{ width: "0%" }}
                      >
                        {/* Shimmer effect for progress bar */}
                        <div
                          className="absolute inset-0 opacity-40 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
                          style={{
                            backgroundSize: "200% 100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-[10px] font-bold text-slate-400">
                      {lesson.isGrammar || lesson.isReading || lesson.isListening || lesson.isVocabulary
                        ? `MILESTONE: LEVEL ${lesson.completedLevels || 0} OF ${lesson.totalLevels || 10}`
                        : `CONTINUE WHERE YOU LEFT OFF`}
                    </p>
                    <ChevronRight className={`w-4 h-4 text-emerald-500 transition-transform duration-500 ${isHovered ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes move-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 1rem 0; }
        }
      `}</style>
    </div>
  );
}