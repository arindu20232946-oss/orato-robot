import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Clock, ChevronRight } from 'lucide-react';

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
];

export default function ContinueLearning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container entrance
      gsap.fromTo(
        containerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' }
      );

      // Items slide in
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { x: -50, opacity: 0 },
            { 
              x: 0, 
              opacity: 1, 
              duration: 0.5, 
              delay: 0.1 + index * 0.1,
              ease: 'power2.out',
            }
          );
        }
      });

      // Progress bars animation
      progressRefs.current.forEach((progress, index) => {
        if (progress) {
          const targetWidth = lessons[index].progress;
          gsap.fromTo(
            progress,
            { width: '0%' },
            { 
              width: `${targetWidth}%`, 
              duration: 1, 
              delay: 0.5 + index * 0.1,
              ease: 'expo.out',
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-2xl p-6 card-shadow"
    >
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
                        {/* Animated stripe pattern */}
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

                {/* Arrow on hover */}
                <div className={`flex-shrink-0 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                  <ChevronRight className="w-5 h-5 text-orato-green" />
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
