import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Target, Plus } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  current: number;
  target: number;
  points: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: 'Complete 3 lessons',
    current: 2,
    target: 3,
    points: 50,
  },
  {
    id: 2,
    title: 'Practice speaking for 10 min',
    current: 7,
    target: 10,
    points: 30,
  },
  {
    id: 3,
    title: 'Master 20 new words',
    current: 15,
    target: 20,
    points: 40,
  },
];

export default function DailyChallenges() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showPoints] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade in
      const header = containerRef.current?.querySelector('.header');
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      }

      // Challenges stagger up
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { y: 20, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.4, 
              delay: 0.1 + index * 0.1,
              ease: 'power2.out',
            }
          );
        }
      });

      // Progress bars liquid animation
      progressRefs.current.forEach((progress, index) => {
        if (progress) {
          const challenge = challenges[index];
          const percentage = (challenge.current / challenge.target) * 100;
          gsap.fromTo(
            progress,
            { width: '0%' },
            { 
              width: `${percentage}%`, 
              duration: 1.2, 
              delay: 0.3 + index * 0.15,
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
      <div className="header flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-green-light flex items-center justify-center">
          <Target className="w-4 h-4 text-emerald-green" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 font-heading">
          Daily Challenges
        </h3>
      </div>

      {/* Challenges List */}
      <div className="space-y-5">
        {challenges.map((challenge, index) => {
          const percentage = (challenge.current / challenge.target) * 100;
          const isComplete = challenge.current >= challenge.target;
          
          return (
            <div
              key={challenge.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {challenge.title}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isComplete 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  +{challenge.points} pts
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    ref={(el) => { progressRefs.current[index] = el; }}
                    className={`h-full rounded-full transition-all duration-500 relative ${
                      isComplete ? 'bg-emerald-300' : 'bg-emerald-300'
                    }`}
                    style={{ width: '0%' }}
                  >
                    {/* Liquid effect */}
                    <div className="absolute inset-0 opacity-20">
                      <div 
                        className="w-full h-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          animation: 'liquid-flow 2s linear infinite',
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Progress text */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-500">
                    {challenge.current} / {challenge.target}
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>

              {/* Points popup animation */}
              {showPoints === challenge.id && (
                <div className="absolute top-0 right-0 pointer-events-none">
                  <div className="flex items-center gap-1 text-orato-green font-bold animate-float-up">
                    <Plus className="w-4 h-4" />
                    {challenge.points}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes liquid-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float-up {
          0% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-30px) scale(1.2); 
          }
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
