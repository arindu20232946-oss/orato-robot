import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Clock, ChevronRight, PlayCircle, BookOpen, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: number;
  title: string;
  timeLeft: string;
  progress: number;
  icon: string;
  iconBg: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'English Grammar: Present Tense',
    timeLeft: '15 min left',
    progress: 75,
    icon: '📚',
    iconBg: 'bg-green-200',
  },
  {
    id: 2,
    title: 'English Pronunciation Basics',
    timeLeft: '25 min left',
    progress: 40,
    icon: '🗣️',
    iconBg: 'bg-purple-100',
  },
  {
    id: 3,
    title: 'English Vocabulary: Daily Life',
    timeLeft: '5 min left',
    progress: 90,
    icon: '📖',
    iconBg: 'bg-blue-100',
  },
  {
    id: 4,
    title: 'Visual Vocabulary Cards',
    timeLeft: '10 min left',
    progress: 30,
    icon: '🃏',
    iconBg: 'bg-yellow-100',
  },
];

interface ContinueLearningProps {
  onLessonClick?: (lessonId: number, lessonTitle: string) => void;
}

export default function ContinueLearning({ onLessonClick }: ContinueLearningProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quizBtnRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
      );

      gsap.fromTo(
        quizBtnRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
      );
    });

    return () => ctx.revert();
  }, []);

  const handleQuizClick = () => {
    gsap.to(quizBtnRef.current, {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        navigate("/quiz");
      },
    });
  };

  const handleReadingClick = () => {
    navigate("/reading");
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 font-heading">
          Continue Learning
        </h3>
        <button className="text-sm text-orato-green font-medium hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const isHovered = hoveredId === lesson.id;

          return (
            <div
              key={lesson.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                isHovered ? 'bg-orato-green-light' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredId(lesson.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${lesson.iconBg} flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                  {lesson.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {lesson.title}
                  </h4>

                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.timeLeft}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        ref={(el) => { progressRefs.current[index] = el; }}
                        className="h-full bg-green-300 rounded-full relative overflow-hidden"
                        style={{ width: '0%' }}
                      >
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.3) 50%, rgba(255,255,255,.3) 75%, transparent 75%, transparent)',
                            backgroundSize: '1rem 1rem',
                            animation: 'move-stripes 1s linear infinite',
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {lesson.progress}% complete
                    </p>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLessonClick?.(lesson.id, lesson.title);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isHovered
                        ? 'bg-green-500 text-white shadow-md scale-105'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continue
                  </button>
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

      {/* Reading Tasks Button */}
      <button
        onClick={handleReadingClick}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 group border border-green-100 mt-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-400 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 text-sm">Reading Tasks</p>
            <p className="text-xs text-gray-500">
              Read passages & poems, answer questions
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-purple-500 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Quiz Button */}
      <button
        ref={quizBtnRef}
        onClick={handleQuizClick}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 group border border-green-100 mt-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900 text-sm">Take a Quiz</p>
            <p className="text-xs text-gray-500">
              Test your knowledge & earn points
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-green-500 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}