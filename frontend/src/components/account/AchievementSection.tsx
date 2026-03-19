import React from "react";
import { UserCheck, Star, Target, Zap, Lock, CheckCircle2 } from "lucide-react";

interface Props {
  user: any;
  goals: any[];
}

const BADGE_DATA = [
  {
    key: "profileComplete",
    icon: UserCheck,
    label: "Profile Complete",
    desc: "All personal fields filled",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "rgba(251,146,60,0.3)",
    iconColor: "text-amber-500"
  },
  {
    key: "firstGoal",
    icon: Star,
    label: "First Step",
    desc: "Add your first learning goal",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    glow: "rgba(250,204,21,0.3)",
    iconColor: "text-yellow-500"
  },
  {
    key: "threeGoals",
    icon: Target,
    label: "Goal Setter",
    desc: "Active tracking of 3 goals",
    gradient: "from-emerald-400 via-teal-500 to-blue-500",
    glow: "rgba(52,211,153,0.3)",
    iconColor: "text-emerald-500"
  },
  {
    key: "goalCompleted",
    icon: Zap,
    label: "Goal Crusher",
    desc: "Successfully finished a goal",
    gradient: "from-rose-400 via-pink-600 to-purple-600",
    glow: "rgba(251,113,133,0.3)",
    iconColor: "text-rose-500"
  },
];

const AchievementSection: React.FC<Props> = ({ user, goals }) => {
  const profileComplete = !!(user?.fullName && user?.email && user?.bio && user?.profilePicture);
  const firstGoal = goals.length >= 1;
  const threeGoals = goals.length >= 3;
  const goalCompleted = goals.some((g) => g.current >= g.target);

  const unlockMap: Record<string, boolean> = {
    profileComplete,
    firstGoal,
    threeGoals,
    goalCompleted,
  };

  return (
    <section className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/50 p-8 transition-all duration-500 hover:shadow-2xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1.5">Milestones</p>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Achievement Badges</h2>
        <p className="text-sm font-medium text-gray-400 mt-1">Unlock certificates of progress as you master your goals</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {BADGE_DATA.map((badge) => {
          const unlocked = unlockMap[badge.key];
          const Icon = badge.icon;
          
          return (
            <div
              key={badge.key}
              className={`relative rounded-[2rem] p-6 flex flex-col items-center text-center transition-all duration-500 group overflow-hidden ${
                unlocked
                  ? "bg-white border border-gray-100 shadow-xl hover:-translate-y-2 hover:shadow-2xl"
                  : "bg-gray-50/50 border border-dashed border-gray-200 opacity-60"
              }`}
              style={
                unlocked
                  ? { boxShadow: `0 20px 40px -10px ${badge.glow}` }
                  : undefined
              }
            >
              {/* Animated background for unlocked */}
              {unlocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              )}

              {/* Icon Container */}
              <div
                className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                  unlocked
                    ? `bg-gradient-to-br ${badge.gradient} shadow-lg ring-4 ring-white`
                    : "bg-gray-200 grayscale"
                }`}
              >
                <Icon className={`w-8 h-8 ${unlocked ? "text-white" : "text-gray-400"}`} />
              </div>

              {/* Label */}
              <p className={`font-black text-sm uppercase tracking-tight ${unlocked ? "text-gray-900" : "text-gray-400"}`}>
                {badge.label}
              </p>
              <p className="text-[10px] font-bold text-gray-400 mt-2 leading-snug px-2">{badge.desc}</p>

              {/* Status Indicator */}
              <div className="mt-5">
                {unlocked ? (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AchievementSection;