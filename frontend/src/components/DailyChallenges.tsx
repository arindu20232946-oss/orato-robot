import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Target, BookOpen, Headphones, Trophy, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';

interface Challenge {
  id: string;
  title: string;
  current: number;
  target: number;
  points: number;
  type: string;
  completed: boolean;
  expiresAt: string;
}

const getChallengeIcon = (type: string) => {
  switch (type) {
    case 'lessons':
      return <BookOpen className="w-5 h-5" />;
    case 'reading':
      return <BookOpen className="w-5 h-5" />;
    case 'listening':
      return <Headphones className="w-5 h-5" />;
    default:
      return <Trophy className="w-5 h-5" />;
  }
};

const getChallengeColor = (type: string) => {
  switch (type) {
    case 'lessons':
      return { bg: 'bg-emerald-500', text: 'text-white', gradient: 'from-emerald-400 to-teal-500' };
    case 'reading':
      return { bg: 'bg-teal-500', text: 'text-white', gradient: 'from-teal-400 to-emerald-500' };
    case 'listening':
      return { bg: 'bg-lime-500', text: 'text-white', gradient: 'from-lime-400 to-emerald-500' };
    default:
      return { bg: 'bg-amber-500', text: 'text-white', gradient: 'from-amber-400 to-orange-500' };
  }
};

export default function DailyChallenges() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await dashboardService.getChallenges();
        if (res.data?.challenges) {
          setChallenges(res.data.challenges);
        }
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      const ctx = gsap.context(() => {
        const header = containerRef.current?.querySelector('.header');
        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        }

        itemsRef.current.forEach((item, index) => {
          if (item) {
            gsap.fromTo(
              item,
              { y: 20, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                delay: 0.1 + index * 0.1,
                ease: 'back.out(1.7)',
              }
            );
          }
        });

        progressRefs.current.forEach((progress, index) => {
          if (progress && challenges[index]) {
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
    }
  }, [loading, challenges]);

  const handleChallengeClick = (challenge: Challenge) => {
    navigate(`/progress?focus=challenges&type=${encodeURIComponent(challenge.type)}&task=${encodeURIComponent(challenge.title)}`);
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);

  if (loading) {
    return (
      <div ref={containerRef} className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <div className="header flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Daily Challenges
            </h3>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-100 rounded-xl p-4">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-2 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
    >
      {/* Header */}
      <div className="header flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Daily Challenges
            </h3>
            <p className="text-xs text-slate-500">
              Complete challenges to earn points
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 rounded-full">
          <CheckCircle className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">
            {completedCount}/{challenges.length}
          </span>
        </div>
      </div>

      {/* Summary Card */}
      {completedCount > 0 && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-5 flex items-center justify-between border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <p className="text-xs text-emerald-800">Completed!</p>
              <p className="text-sm font-semibold text-emerald-950">+{totalPoints} points earned</p>
            </div>
          </div>
          {completedCount === challenges.length && (
            <div className="text-2xl"></div>
          )}
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((challenge, index) => {
          const percentage = (challenge.current / challenge.target) * 100;
          const isComplete = challenge.completed;
          const colors = getChallengeColor(challenge.type);

          return (
            <div
              key={challenge.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 border ${isComplete
                  ? 'bg-slate-50/70 border-slate-100'
                  : 'bg-white hover:bg-emerald-50 cursor-pointer border-slate-100 hover:border-emerald-200 shadow-sm'
                }`}
              onClick={() => !isComplete && handleChallengeClick(challenge)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shadow-md`}>
                    <span className={colors.text}>
                      {getChallengeIcon(challenge.type)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {challenge.current}/{challenge.target} completed
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-sm ${isComplete
                    ? 'bg-amber-400 text-amber-900'
                    : 'bg-emerald-500 text-white'
                  }`}>
                  <Trophy className="w-3 h-3" />
                  <span className="text-xs font-bold">
                    {isComplete ? '+' : ''}{challenge.points}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    ref={(el) => { progressRefs.current[index] = el; }}
                    className={`h-full rounded-full transition-all duration-500 relative ${isComplete ? 'bg-emerald-400' : `bg-gradient-to-r ${colors.gradient}`
                      }`}
                    style={{ width: '0%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                </div>

                <div className="flex justify-between mt-1.5">
                  <span className={`text-xs font-medium ${isComplete ? 'text-emerald-900' : 'text-slate-500'
                    }`}>
                    {Math.round(percentage)}%
                  </span>
                  {isComplete && (
                    <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Complete!
                    </span>
                  )}
                </div>
              </div>

              {isComplete && (
                <div className="absolute top-2 right-2">
                  <div className="bg-emerald-500 rounded-full p-1 shadow-md">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completedCount < challenges.length && (
        <p className="text-center text-xs text-slate-500 mt-4 italic">
          Tap on a challenge to start
        </p>
      )}
    </div>
  );
}
